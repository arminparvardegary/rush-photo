import { NextResponse } from "next/server";
import { getPricing } from "@/lib/server/pricing";
import { getDiscountCodes, normalizeDiscountCode } from "@/lib/server/discounts";
import { computeOrderTotals, createOrder, updateOrder, type OrderCartItem, type PackageType } from "@/lib/server/orders";

export const runtime = "nodejs";

function getStripeSecretKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key && key.trim() ? key.trim() : null;
}

function getOriginFromRequest(req: Request): string {
  try {
    return new URL(req.url).origin;
  } catch {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  }
}

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

function stripeForm(params: Record<string, string>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) sp.append(k, v);
  return sp.toString();
}

export async function POST(req: Request) {
  try {
    const stripeKey = getStripeSecretKey();
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Payments are not configured. Set STRIPE_SECRET_KEY to enable card payments." },
        { status: 501 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const items = body?.items ?? [];
    const email = (body?.email ?? "").toString().trim();
    const name = (body?.name ?? "").toString().trim();
    const phone = (body?.phone ?? "").toString().trim();
    const company = (body?.company ?? "").toString().trim();
    const productName = (body?.productName ?? "").toString().trim();
    const notes = (body?.notes ?? "").toString().trim();

    console.log("Checkout request received:", { email, itemCount: items.length, productName });

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

  // Calculate total from items
  const total = items.reduce((sum: number, item: any) => sum + (item.price || 0), 0);

  // Convert items to cart format for order creation
  const cart: OrderCartItem[] = items.map((item: any) => ({
    packageType: item.packageType || "ecommerce",
    photoStyle: item.photoStyle,
    selectedAngles: item.selectedAngles || [],
    price: item.price || 0
  }));

  const packageType = items[0]?.packageType || "ecommerce";
  const lifestyleIncluded = items.some((item: any) => item.packageType === "lifestyle");

  // Create a pending_payment order before redirecting to Stripe
  const [pricing, codes] = await Promise.all([getPricing(), getDiscountCodes()]);
  const totals = computeOrderTotals({
    pricing,
    packageType: packageType as PackageType,
    cart,
    lifestyleIncluded,
    promo: null
  });

  const order = await createOrder({
    userId: null,
    email,
    name: name || undefined,
    phone: phone || undefined,
    company: company || undefined,
    productName: productName || "Product Photography",
    notes: notes || undefined,
    packageType: packageType as PackageType,
    cart,
    lifestyleIncluded,
    totals,
    status: "pending_payment",
    discountCode: undefined,
    payment: { provider: "stripe", status: "created" },
  });

  const origin = getOriginFromRequest(req);
  const successUrl = `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/cart`;

  const amountCents = Math.max(0, Math.round(total * 100));

  const params: Record<string, string> = {
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: email,
    // Enable multiple payment methods for better conversion
    "payment_method_types[0]": "card",
    "payment_method_types[1]": "link",
    "payment_method_types[2]": "cashapp",
    "payment_method_types[3]": "us_bank_account",
    // Billing address collection for fraud prevention
    billing_address_collection: "auto",
    // Phone number collection (optional)
    phone_number_collection_enabled: "true",
    "metadata[orderId]": order.id,
    "metadata[orderNumber]": order.trackingNumber,
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": `Product Photography - ${productName || 'Order'}`,
    "line_items[0][price_data][product_data][description]": `${items.length} photo style${items.length > 1 ? 's' : ''}`,
    "line_items[0][price_data][unit_amount]": String(amountCents),
    "line_items[0][quantity]": "1",
  };

  console.log("Creating Stripe checkout session with params:", {
    email,
    productName,
    itemCount: items.length,
    amountCents,
    orderId: order.id,
  });

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: stripeForm(params),
  });

  const stripeJson = await stripeRes.json().catch(() => null);

  if (!stripeRes.ok) {
    console.error("Stripe API error:", {
      status: stripeRes.status,
      error: stripeJson?.error,
    });
    await updateOrder(order.id, { payment: { provider: "stripe", status: "failed" } });
    return NextResponse.json(
      { error: stripeJson?.error?.message || "Stripe error creating session" },
      { status: 502 }
    );
  }

  const sessionId = stripeJson?.id as string | undefined;
  const url = stripeJson?.url as string | undefined;

  if (!url) {
    console.error("Stripe session created but no URL returned:", stripeJson);
    return NextResponse.json(
      { error: "Payment session created but redirect URL missing" },
      { status: 500 }
    );
  }

  if (sessionId) {
    await updateOrder(order.id, { payment: { provider: "stripe", status: "created", sessionId } });
  }

  console.log("Stripe checkout session created successfully:", { sessionId, url });
  return NextResponse.json({ url });

  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during checkout" },
      { status: 500 }
    );
  }
}


