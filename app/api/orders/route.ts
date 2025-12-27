import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getPricing } from "@/lib/server/pricing";
import { getDiscountCodes, normalizeDiscountCode } from "@/lib/server/discounts";
import {
  computeOrderTotals,
  createOrder,
  getAllOrders,
  type OrderCartItem,
  type PackageType,
  type OrderRecord,
} from "@/lib/server/orders";

export const runtime = "nodejs";

function toPublicOrder(order: OrderRecord) {
  return {
    id: order.id,
    trackingNumber: order.trackingNumber,
    package: order.package,
    styles: order.styles,
    status: order.status,
    createdAt: order.createdAt,
    estimatedDelivery: order.estimatedDelivery,
    total: order.totals.total,
    totals: order.totals,
    productName: order.productName,
    deliveryUrl: order.deliveryUrl,
    discountCode: order.discountCode,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await getAllOrders();
  // @ts-ignore
  const filtered = session.user?.role === "admin" ? orders : orders.filter((o) => o.userId === session.user?.id);

  return NextResponse.json({ orders: filtered.map(toPublicOrder) });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json().catch(() => null);

  const packageType = body?.packageType as PackageType | undefined;
  const cart = (body?.cart ?? []) as OrderCartItem[];
  const lifestyleIncluded = Boolean(body?.lifestyleIncluded);
  const discountCodeRaw = (body?.discountCode ?? "").toString();
  const discountCode = normalizeDiscountCode(discountCodeRaw);

  const emailInput = (body?.email ?? "").toString().trim();
  const nameInput = (body?.name ?? "").toString().trim();
  const phoneInput = (body?.phone ?? "").toString().trim();
  const companyInput = (body?.company ?? "").toString().trim();
  const productName = (body?.productName ?? "").toString().trim();
  const notes = (body?.notes ?? "").toString().trim();

  if (!packageType) {
    return NextResponse.json({ error: "Missing packageType" }, { status: 400 });
  }
  if (!productName) {
    return NextResponse.json({ error: "Missing productName" }, { status: 400 });
  }

  // Allow guest checkout, but require email if not authenticated
  let userEmail = emailInput;
  let userName = nameInput;
  let userPhone = phoneInput;
  let userCompany = companyInput;
  let userId: string | null = null;

  if (session && session.user) {
    // @ts-ignore
    userId = session.user.id;
    userEmail = session.user.email || userEmail;
    userName = session.user.name || userName;
  }

  if (!userEmail) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const [pricing, codes] = await Promise.all([getPricing(), getDiscountCodes()]);
  const promo = discountCode ? codes.find((c) => normalizeDiscountCode(c.code) === discountCode && c.active) : null;

  const totals = computeOrderTotals({
    pricing,
    packageType,
    cart,
    lifestyleIncluded,
    promo,
  });

  const order = await createOrder({
    userId,
    email: userEmail,
    name: userName || undefined,
    phone: userPhone || undefined,
    company: userCompany || undefined,
    productName,
    notes: notes || undefined,
    packageType,
    cart,
    lifestyleIncluded,
    totals,
    status: "pending",
    discountCode: promo?.code,
  });

  return NextResponse.json({ order: toPublicOrder(order) });
}


