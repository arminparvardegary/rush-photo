import { NextResponse } from "next/server";
import { findOrderByStripeSessionId, findOrderById, updateOrder } from "@/lib/server/orders";
import { sendEmail } from "@/lib/resend";
import { orderConfirmationEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

function getStripeSecretKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key && key.trim() ? key.trim() : null;
}

export async function GET(req: Request) {
  const stripeKey = getStripeSecretKey();
  if (!stripeKey) {
    return NextResponse.json({ error: "Payments are not configured" }, { status: 501 });
  }

  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id") || "";
  if (!sessionId) return NextResponse.json({ error: "Missing session_id" }, { status: 400 });

  const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: {
      Authorization: `Bearer ${stripeKey}`,
    },
  });

  const stripeJson = await stripeRes.json().catch(() => null);
  if (!stripeRes.ok) {
    return NextResponse.json({ error: stripeJson?.error?.message || "Stripe error" }, { status: 502 });
  }

  const paymentStatus = stripeJson?.payment_status as string | undefined;
  if (paymentStatus !== "paid") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
  }

  let order = await findOrderByStripeSessionId(sessionId);
  if (!order) {
    const orderId = stripeJson?.metadata?.orderId as string | undefined;
    if (orderId) order = await findOrderById(orderId);
  }

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const updated = await updateOrder(order.id, {
    status: order.status === "completed" ? "completed" : "processing",
    payment: { provider: "stripe", sessionId, status: "paid" },
  });

  // Send order confirmation email
  if (updated && order.email) {
    try {
      const cartItems = order.cart.map(item => ({
        style: (item.style || item.photoStyle || 'product').charAt(0).toUpperCase() + (item.style || item.photoStyle || 'product').slice(1),
        angles: item.angles || item.selectedAngles || [],
        price: item.price || (item.angles?.length || item.selectedAngles?.length || 1) * 25,
      }));

      const emailData = orderConfirmationEmail({
        customerName: order.name || '',
        orderNumber: order.trackingNumber,
        productName: order.productName,
        packageType: order.package,
        total: order.totals.total,
        cartItems,
      });

      await sendEmail({
        to: order.email,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't fail the request if email sending fails
    }
  }

  return NextResponse.json({ order: updated || order });
}


