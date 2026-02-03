import { NextResponse } from "next/server";
import { updateOrder, findOrderById } from "@/lib/server/orders";
import { createTransaction } from "@/lib/server/payments";
import { supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/resend";
import { orderConfirmationEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

function getStripeSecretKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key && key.trim() ? key.trim() : null;
}

export async function POST(req: Request) {
  try {
    const stripeKey = getStripeSecretKey();
    if (!stripeKey) {
      return NextResponse.json({ error: "Payments not configured" }, { status: 501 });
    }

    const body = await req.json().catch(() => null);
    const paymentIntentId = body?.paymentIntentId;
    const orderId = body?.orderId;

    if (!paymentIntentId || !orderId) {
      return NextResponse.json({ error: "Missing payment or order ID" }, { status: 400 });
    }

    // Verify payment intent status with Stripe
    const piResponse = await fetch(
      `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
      {
        headers: {
          Authorization: `Bearer ${stripeKey}`,
        },
      }
    );

    const piData = await piResponse.json();

    if (!piResponse.ok) {
      console.error("Stripe verify error:", piData);
      return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
    }

    if (piData.status !== "succeeded") {
      return NextResponse.json(
        { error: `Payment not successful. Status: ${piData.status}` },
        { status: 400 }
      );
    }

    // Get charge ID
    const chargeId = piData.charges?.data?.[0]?.id || piData.latest_charge;
    const amountCents = piData.amount;
    const currency = piData.currency;

    // Update order status
    await updateOrder(orderId, {
      status: "paid",
      payment: {
        provider: "stripe",
        status: "paid",
        sessionId: paymentIntentId,
      },
    });

    // Update additional payment fields
    await supabase
      .from("rush_orders")
      .update({
        payment_amount_cents: amountCents,
        payment_currency: currency,
        payment_charge_id: chargeId,
        payment_paid_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    // Get order details
    const order = await findOrderById(orderId);

    if (order) {
      // Create transaction record
      try {
        await createTransaction({
          orderId,
          orderNumber: order.trackingNumber,
          transactionType: "charge",
          provider: "stripe",
          providerTransactionId: chargeId || paymentIntentId,
          amountCents,
          currency,
          status: "succeeded",
          metadata: {
            payment_intent_id: paymentIntentId,
            customer_email: order.email,
          },
        });
      } catch (txErr) {
        console.error("Transaction record error:", txErr);
        // Don't fail the request if transaction record fails
      }

      // Send confirmation email
      if (order.email) {
        try {
          const cartItems = order.cart.map(item => ({
            style: (item.style || item.photoStyle || 'product').charAt(0).toUpperCase() +
                   (item.style || item.photoStyle || 'product').slice(1),
            angles: item.angles || item.selectedAngles || [],
            price: item.price || 0,
          }));

          const emailData = orderConfirmationEmail({
            customerName: order.name || 'Valued Customer',
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
        } catch (emailErr) {
          console.error("Email send error:", emailErr);
          // Don't fail if email fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber: order?.trackingNumber,
    });

  } catch (error: any) {
    console.error("Confirm payment error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
