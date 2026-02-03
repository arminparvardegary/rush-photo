import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findOrderById } from "@/lib/server/orders";
import { createStripeRefund, getTransactionsByOrderId } from "@/lib/server/payments";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = process.env.ADMIN_EMAILS?.split(",").includes(session.user.email);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { orderId, amountCents, reason } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Get order details
    const order = await findOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order has a payment
    if (!order.payment?.sessionId) {
      return NextResponse.json({ error: "Order has no payment to refund" }, { status: 400 });
    }

    // Get payment charge ID from database
    const { supabase } = await import("@/lib/supabase");
    const { data: orderData } = await supabase
      .from("rush_orders")
      .select("payment_charge_id, payment_amount_cents, refund_amount_cents")
      .eq("id", orderId)
      .single();

    if (!orderData?.payment_charge_id) {
      return NextResponse.json(
        { error: "Payment charge ID not found. Order may not be paid yet." },
        { status: 400 }
      );
    }

    const chargeId = orderData.payment_charge_id;
    const totalPaid = orderData.payment_amount_cents || 0;
    const alreadyRefunded = orderData.refund_amount_cents || 0;
    const availableToRefund = totalPaid - alreadyRefunded;

    // Validate refund amount
    const refundAmount = amountCents || availableToRefund;

    if (refundAmount <= 0) {
      return NextResponse.json({ error: "Refund amount must be positive" }, { status: 400 });
    }

    if (refundAmount > availableToRefund) {
      return NextResponse.json(
        {
          error: `Cannot refund $${(refundAmount / 100).toFixed(2)}. Only $${(
            availableToRefund / 100
          ).toFixed(2)} available.`,
        },
        { status: 400 }
      );
    }

    // Process refund
    const result = await createStripeRefund({
      orderId: order.id,
      orderNumber: order.trackingNumber,
      chargeId,
      amountCents: refundAmount,
      reason,
      userId: session.user.id as string,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Get updated transactions
    const transactions = await getTransactionsByOrderId(orderId);

    return NextResponse.json({
      success: true,
      refundId: result.refundId,
      refundAmount: refundAmount,
      transactions,
    });
  } catch (error: any) {
    console.error("Refund API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
