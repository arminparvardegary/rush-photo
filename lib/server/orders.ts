import crypto from "node:crypto";
import { readDataFile, writeDataFile } from "@/lib/server/storage";
import type { PricingSettings } from "@/lib/shared/pricing";
import type { DiscountCode } from "@/lib/shared/discounts";

export type PackageType = "ecommerce" | "lifestyle" | "fullpackage";
export type EcommerceStyle = string;
export type Angle = string;

export type OrderStatus = "pending" | "pending_payment" | "processing" | "completed" | "shipped";

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
  trackingNumber: string; // used as an order number in UI
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
  };
}

interface OrdersFileShape {
  orders: OrderRecord[];
}

const ORDERS_FILE = "orders.json";
const DEFAULT_ORDERS_FILE: OrdersFileShape = { orders: [] };

export async function getAllOrders(): Promise<OrderRecord[]> {
  const file = await readDataFile<OrdersFileShape>(ORDERS_FILE, DEFAULT_ORDERS_FILE);
  return Array.isArray(file.orders) ? file.orders : [];
}

async function saveAllOrders(orders: OrderRecord[]): Promise<void> {
  await writeDataFile(ORDERS_FILE, { orders } satisfies OrdersFileShape);
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

function formatEstimatedDelivery(): string {
  // For a digital service, keep it human-friendly.
  return "3–5 business days";
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
  const orders = await getAllOrders();
  const now = new Date().toISOString();
  const order: OrderRecord = {
    id: `ord_${crypto.randomUUID()}`,
    trackingNumber: generateOrderNumber(),
    userId: input.userId,
    email: input.email.trim(),
    name: input.name?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    company: input.company?.trim() || undefined,
    productName: input.productName.trim(),
    notes: input.notes?.trim() || undefined,
    package: input.packageType,
    styles: input.cart.map((c) => c.style),
    status: input.status,
    createdAt: now,
    estimatedDelivery: formatEstimatedDelivery(),
    totals: input.totals,
    discountCode: input.discountCode?.trim() || undefined,
    lifestyleIncluded: input.lifestyleIncluded,
    cart: input.cart,
    deliveryUrl: input.deliveryUrl,
    payment: input.payment,
  };

  orders.unshift(order);
  await saveAllOrders(orders);
  return order;
}

export async function updateOrder(
  orderId: string,
  patch: Partial<Pick<OrderRecord, "status" | "deliveryUrl" | "payment">>
): Promise<OrderRecord | null> {
  const orders = await getAllOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;
  const next: OrderRecord = {
    ...orders[idx],
    ...patch,
  };
  orders[idx] = next;
  await saveAllOrders(orders);
  return next;
}

export async function findOrderById(orderId: string): Promise<OrderRecord | null> {
  const orders = await getAllOrders();
  return orders.find((o) => o.id === orderId) ?? null;
}

export async function findOrderByStripeSessionId(sessionId: string): Promise<OrderRecord | null> {
  const orders = await getAllOrders();
  return orders.find((o) => o.payment?.provider === "stripe" && o.payment.sessionId === sessionId) ?? null;
}


