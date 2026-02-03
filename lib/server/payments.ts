import { supabase } from "@/lib/supabase";

export type TransactionType = "charge" | "refund" | "partial_refund";
export type TransactionStatus = "pending" | "succeeded" | "failed" | "canceled";

export interface PaymentTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  transactionType: TransactionType;
  provider: string;
  providerTransactionId?: string;
  amountCents: number;
  currency: string;
  status: TransactionStatus;
  metadata?: any;
  errorCode?: string;
  errorMessage?: string;
  processedByUserId?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

function mapTransaction(row: any): PaymentTransaction {
  return {
    id: row.id,
    orderId: row.order_id,
    orderNumber: row.order_number,
    transactionType: row.transaction_type,
    provider: row.provider,
    providerTransactionId: row.provider_transaction_id,
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    metadata: row.metadata,
    errorCode: row.error_code,
    errorMessage: row.error_message,
    processedByUserId: row.processed_by_user_id,
    refundReason: row.refund_reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createTransaction(input: {
  orderId: string;
  orderNumber: string;
  transactionType: TransactionType;
  provider: string;
  providerTransactionId?: string;
  amountCents: number;
  currency?: string;
  status: TransactionStatus;
  metadata?: any;
  errorCode?: string;
  errorMessage?: string;
  processedByUserId?: string;
  refundReason?: string;
}): Promise<PaymentTransaction> {
  const { data, error } = await supabase
    .from("payment_transactions")
    .insert({
      order_id: input.orderId,
      order_number: input.orderNumber,
      transaction_type: input.transactionType,
      provider: input.provider,
      provider_transaction_id: input.providerTransactionId,
      amount_cents: input.amountCents,
      currency: input.currency || "usd",
      status: input.status,
      metadata: input.metadata,
      error_code: input.errorCode,
      error_message: input.errorMessage,
      processed_by_user_id: input.processedByUserId,
      refund_reason: input.refundReason,
    })
    .select()
    .single();

  if (error) {
    console.error("Create transaction error:", error);
    throw new Error(error.message);
  }

  return mapTransaction(data);
}

export async function getTransactionsByOrderId(orderId: string): Promise<PaymentTransaction[]> {
  const { data, error } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get transactions error:", error);
    return [];
  }

  return (data || []).map(mapTransaction);
}

export async function getTransactionById(transactionId: string): Promise<PaymentTransaction | null> {
  const { data, error } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapTransaction(data);
}

export async function updateTransactionStatus(
  transactionId: string,
  status: TransactionStatus,
  errorCode?: string,
  errorMessage?: string
): Promise<void> {
  const { error } = await supabase
    .from("payment_transactions")
    .update({
      status,
      error_code: errorCode,
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", transactionId);

  if (error) {
    console.error("Update transaction status error:", error);
    throw new Error(error.message);
  }
}

// Stripe refund function
export async function createStripeRefund(input: {
  orderId: string;
  orderNumber: string;
  chargeId: string;
  amountCents: number; // amount to refund in cents
  reason?: string;
  userId?: string;
}): Promise<{ success: boolean; refundId?: string; error?: string }> {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return { success: false, error: "Stripe not configured" };
  }

  try {
    // Create refund via Stripe API
    const params = new URLSearchParams({
      charge: input.chargeId,
      amount: String(input.amountCents),
    });

    if (input.reason) {
      params.append("metadata[reason]", input.reason);
      params.append("metadata[order_number]", input.orderNumber);
    }

    const response = await fetch("https://api.stripe.com/v1/refunds", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const refundData = await response.json();

    if (!response.ok) {
      console.error("Stripe refund error:", refundData);

      // Create failed transaction record
      await createTransaction({
        orderId: input.orderId,
        orderNumber: input.orderNumber,
        transactionType: "refund",
        provider: "stripe",
        amountCents: input.amountCents,
        status: "failed",
        errorCode: refundData.error?.code,
        errorMessage: refundData.error?.message,
        processedByUserId: input.userId,
        refundReason: input.reason,
      });

      return { success: false, error: refundData.error?.message || "Refund failed" };
    }

    // Create successful transaction record
    await createTransaction({
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      transactionType: "refund",
      provider: "stripe",
      providerTransactionId: refundData.id,
      amountCents: input.amountCents,
      status: "succeeded",
      metadata: { stripe_refund: refundData },
      processedByUserId: input.userId,
      refundReason: input.reason,
    });

    // Update order refund status
    const { data: orderData } = await supabase
      .from("rush_orders")
      .select("payment_amount_cents, refund_amount_cents")
      .eq("id", input.orderId)
      .single();

    if (orderData) {
      const totalRefunded = (orderData.refund_amount_cents || 0) + input.amountCents;
      const refundStatus =
        totalRefunded >= orderData.payment_amount_cents ? "full" : "partial";

      await supabase
        .from("rush_orders")
        .update({
          refund_amount_cents: totalRefunded,
          refund_status: refundStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.orderId);
    }

    return { success: true, refundId: refundData.id };
  } catch (error: any) {
    console.error("Refund exception:", error);
    return { success: false, error: error.message };
  }
}
