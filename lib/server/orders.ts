import { supabase } from "@/lib/supabase";
import crypto from "node:crypto";
import type { PricingSettings } from "@/lib/shared/pricing";
import type { DiscountCode } from "@/lib/shared/discounts";

export type PackageType = "ecommerce" | "lifestyle" | "fullpackage";
export type EcommerceStyle = string;
export type Angle = string;

export type OrderStatus = "pending" | "pending_payment" | "paid" | "processing" | "completed" | "shipped" | "payment_failed";

export interface OrderCartItem {
  style: EcommerceStyle;
  angles: Angle[];
}

export interface OrderTotals {
  currency: "USD";
  itemsSubtotal: number;
  bundleDiscount: number;
  promoDiscount: number;
  total: number;
}

export interface OrderRecord {
  id: string;
  trackingNumber: string; // used as an order number in UI e.g. RUSH-XYZ
  userId: string | null;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  productName: string;
  notes?: string;
  package: PackageType;
  styles: string[]; // style ids
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  totals: OrderTotals;
  discountCode?: string;
  lifestyleIncluded: boolean;
  cart: OrderCartItem[];
  deliveryUrl?: string;
  payment?: {
    provider: "stripe";
    sessionId?: string;
    status?: "created" | "paid" | "failed";
    error?: string;
  };
}

// Map DB row to OrderRecord
function mapOrder(row: any): OrderRecord {
  return {
    id: row.id,
    trackingNumber: row.order_number,
    userId: row.user_id,
    email: row.customer_email,
    name: row.customer_name,
    phone: row.customer_phone,
    company: row.company,
    productName: row.product_name,
    notes: row.notes,
    package: row.package_type as PackageType,
    styles: (Array.isArray(row.cart_data) ? row.cart_data.map((i: any) => i.style) : []),
    status: row.status as OrderStatus,
    createdAt: row.created_at,
    estimatedDelivery: "3–5 business days", // could be DB field
    totals: row.totals_data as OrderTotals,
    discountCode: row.discount_code,
    lifestyleIncluded: row.lifestyle_included,
    cart: (row.cart_data || []) as OrderCartItem[],
    deliveryUrl: row.delivery_url,
    payment: row.payment_provider === "stripe" ? {
      provider: "stripe",
      sessionId: row.payment_session_id,
      status: row.payment_status as any
    } : undefined
  };
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  const { data, error } = await supabase
    .from("rush_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error (getAllOrders):", error);
    return [];
  }
  return (data || []).map(mapOrder);
}

export async function findOrderById(orderId: string): Promise<OrderRecord | null> {
  const { data } = await supabase.from("rush_orders").select("*").eq("id", orderId).single();
  return data ? mapOrder(data) : null;
}

export async function getOrdersByEmail(email: string): Promise<OrderRecord[]> {
  const { data, error } = await supabase
    .from("rush_orders")
    .select("*")
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error (getOrdersByEmail):", error);
    return [];
  }
  return (data || []).map(mapOrder);
}

export async function findOrderByStripeSessionId(sessionId: string): Promise<OrderRecord | null> {
  const { data } = await supabase.from("rush_orders").select("*").eq("payment_session_id", sessionId).single();
  return data ? mapOrder(data) : null;
}

export function computeOrderTotals(input: {
  pricing: PricingSettings;
  packageType: PackageType;
  cart: OrderCartItem[];
  lifestyleIncluded: boolean;
  promo?: DiscountCode | null;
}): OrderTotals {
  const { pricing, packageType, cart, lifestyleIncluded, promo } = input;

  let itemsSubtotal = 0;
  for (const item of cart) {
    const style = pricing.ecommerce.styles.find((s) => s.id === item.style);
    const pricePerAngle = style?.pricePerAngle || pricing.ecommerce.perAngle;
    itemsSubtotal += item.angles.length * pricePerAngle;
  }
  if (lifestyleIncluded) {
    itemsSubtotal += pricing.lifestyle.flatRate;
  }

  const bundleDiscount =
    packageType === "fullpackage" && cart.length > 0
      ? Math.round(itemsSubtotal * (pricing.fullPackageDiscount / 100))
      : 0;

  const subtotalAfterBundle = Math.max(0, itemsSubtotal - bundleDiscount);

  let promoDiscount = 0;
  if (promo?.active) {
    if (promo.minSubtotal && subtotalAfterBundle < promo.minSubtotal) {
      promoDiscount = 0;
    } else if (promo.type === "percent") {
      promoDiscount = Math.round(subtotalAfterBundle * (promo.value / 100));
    } else {
      promoDiscount = Math.round(promo.value);
    }
  }

  const total = Math.max(0, Math.round(subtotalAfterBundle - promoDiscount));
  return {
    currency: "USD",
    itemsSubtotal: Math.round(itemsSubtotal),
    bundleDiscount: Math.round(bundleDiscount),
    promoDiscount: Math.round(promoDiscount),
    total,
  };
}

function generateOrderNumber(): string {
  const short = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `RUSH-${short}`;
}

export async function createOrder(input: {
  userId: string | null;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  productName: string;
  notes?: string;
  packageType: PackageType;
  cart: OrderCartItem[];
  lifestyleIncluded: boolean;
  totals: OrderTotals;
  status: OrderStatus;
  discountCode?: string;
  deliveryUrl?: string;
  payment?: OrderRecord["payment"];
}): Promise<OrderRecord> {
  const trackingNumber = generateOrderNumber();

  const row = {
    user_id: input.userId,
    customer_email: input.email,
    customer_name: input.name,
    customer_phone: input.phone,
    company: input.company,
    product_name: input.productName,
    notes: input.notes,
    package_type: input.packageType,
    order_number: trackingNumber,
    status: input.status,
    cart_data: input.cart,
    totals_data: input.totals,
    discount_code: input.discountCode,
    lifestyle_included: input.lifestyleIncluded,
    delivery_url: input.deliveryUrl,
    payment_provider: input.payment?.provider,
    payment_session_id: input.payment?.sessionId,
    payment_status: input.payment?.status,
    // created_at defaults
  };

  const { data, error } = await supabase
    .from("rush_orders")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("Create Order Error:", error);
    throw new Error(error.message);
  }

  return mapOrder(data);
}

export async function updateOrder(
  orderId: string,
  patch: Partial<Pick<OrderRecord, "status" | "deliveryUrl" | "payment">>
): Promise<OrderRecord | null> {
  const updateData: any = {};
  if (patch.status) updateData.status = patch.status;
  if (patch.deliveryUrl) updateData.delivery_url = patch.deliveryUrl;
  if (patch.payment) {
    if (patch.payment.provider) updateData.payment_provider = patch.payment.provider;
    if (patch.payment.sessionId) updateData.payment_session_id = patch.payment.sessionId;
    if (patch.payment.status) updateData.payment_status = patch.payment.status;
  }

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("rush_orders")
    .update(updateData)
    .eq("id", orderId)
    .select()
    .single();

  if (error || !data) return null;
  return mapOrder(data);
}
