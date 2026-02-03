import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { updateOrder, findOrderById } from "@/lib/server/orders";
import { createTransaction } from "@/lib/server/payments";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: StripeEvent;

  try {
    // Verify webhook signature using crypto
    const crypto = require("crypto");
    const timestamp = signature.split(",")[0].split("=")[1];
    const sig = signature.split(",")[1].split("=")[1];

    const signedPayload = `${timestamp}.${body}`;
    const expectedSig = crypto
      .createHmac("sha256", STRIPE_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest("hex");

    if (sig !== expectedSig) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    event = JSON.parse(body);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log("Received Stripe webhook event:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        const orderNumber = session.metadata?.orderNumber;
        const sessionId = session.id;
        const amountTotal = session.amount_total; // in cents
        const currency = session.currency;
        const customerEmail = session.customer_email;
        const paymentIntentId = session.payment_intent;

        console.log("Checkout session completed:", { orderId, orderNumber, sessionId, amountTotal });

        if (!orderId || !orderNumber) {
          console.error("No orderId or orderNumber in session metadata");
          break;
        }

        // Get charge ID from payment intent
        let chargeId = null;
        if (paymentIntentId) {
          const piResponse = await fetch(
            `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
              },
            }
          );
          const piData = await piResponse.json();
          chargeId = piData.charges?.data?.[0]?.id;
        }

        // Update order status to paid
        await updateOrder(orderId, {
          status: "paid",
          payment: {
            provider: "stripe",
            status: "paid",
            sessionId,
          },
        });

        // Update additional payment fields
        await supabase
          .from("rush_orders")
          .update({
            payment_amount_cents: amountTotal,
            payment_currency: currency,
            payment_charge_id: chargeId,
            payment_paid_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        // Create transaction record
        await createTransaction({
          orderId,
          orderNumber,
          transactionType: "charge",
          provider: "stripe",
          providerTransactionId: chargeId || sessionId,
          amountCents: amountTotal,
          currency,
          status: "succeeded",
          metadata: {
            session_id: sessionId,
            payment_intent_id: paymentIntentId,
            customer_email: customerEmail,
          },
        });

        console.log(`Order ${orderId} marked as paid with charge ${chargeId}`);
        break;
      }

      case "charge.succeeded": {
        const charge = event.data.object;
        const paymentIntent = charge.payment_intent;

        console.log("Charge succeeded:", { chargeId: charge.id, amount: charge.amount });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const refundAmount = charge.amount_refunded; // in cents
        const chargeId = charge.id;

        console.log("Charge refunded:", { chargeId, refundAmount });

        // Find order by charge ID and update
        // We'll need to store charge ID in payment metadata
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("PaymentIntent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        console.log("PaymentIntent failed:", { orderId, error: paymentIntent.last_payment_error });

        if (orderId) {
          await updateOrder(orderId, {
            status: "payment_failed",
            payment: {
              provider: "stripe",
              status: "failed",
              error: paymentIntent.last_payment_error?.message,
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: `Webhook handler failed: ${err.message}` },
      { status: 500 }
    );
  }
}
