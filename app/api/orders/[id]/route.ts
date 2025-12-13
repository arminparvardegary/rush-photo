import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/server/auth";
import { findOrderById, updateOrder, type OrderStatus } from "@/lib/server/orders";

export const runtime = "nodejs";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = await findOrderById(params.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.role !== "admin" && order.userId !== session.sub) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const status = (body?.status ?? undefined) as OrderStatus | undefined;
  const deliveryUrl = (body?.deliveryUrl ?? "").toString().trim();

  if (status) {
    const allowed: OrderStatus[] = ["pending", "pending_payment", "processing", "completed", "shipped"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
  }

  const next = await updateOrder(params.id, {
    status,
    deliveryUrl: deliveryUrl || undefined,
  });

  if (!next) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order: next });
}


