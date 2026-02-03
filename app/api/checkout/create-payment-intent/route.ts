import { NextResponse } from "next/server";
import { getPricing } from "@/lib/server/pricing";
import { computeOrderTotals, createOrder, type OrderCartItem, type PackageType } from "@/lib/server/orders";

export const runtime = "nodejs";

function getStripeSecretKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key && key.trim() ? key.trim() : null;
}

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const stripeKey = getStripeSecretKey();
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Payments are not configured" },
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

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total from items
    const total = items.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
    const amountCents = Math.max(50, Math.round(total * 100)); // Stripe minimum is $0.50

    // Convert items to cart format for order creation
    const cart: OrderCartItem[] = items.map((item: any) => ({
      packageType: item.packageType || "ecommerce",
      photoStyle: item.photoStyle,
      selectedAngles: item.selectedAngles || [],
      price: item.price || 0
    }));

    const packageType = items[0]?.packageType || "ecommerce";
    const lifestyleIncluded = items.some((item: any) => item.packageType === "lifestyle");

    // Create order
    const pricing = await getPricing();
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

    // Create Payment Intent
    const params = new URLSearchParams({
      amount: String(amountCents),
      currency: "usd",
      "automatic_payment_methods[enabled]": "true",
      "metadata[orderId]": order.id,
      "metadata[orderNumber]": order.trackingNumber,
      "metadata[email]": email,
      description: `Product Photography - ${productName || 'Order'} (${items.length} items)`,
      receipt_email: email,
    });

    const piResponse = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const piData = await piResponse.json();

    if (!piResponse.ok) {
      console.error("Stripe PaymentIntent error:", piData);
      return NextResponse.json(
        { error: piData.error?.message || "Failed to create payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: piData.client_secret,
      orderId: order.id,
      orderNumber: order.trackingNumber,
      amount: amountCents,
    });

  } catch (error: any) {
    console.error("Create payment intent error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
