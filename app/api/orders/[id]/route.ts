import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/server/auth";
import { findOrderById, updateOrder } from "@/lib/server/orders";
import { sendEmail } from "@/lib/resend";
import { deliveryNotificationEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session?.user?.role !== "admin") {
    // Allow users to see their own order?
    // For now, restrict to admin as per this specific route usage.
    // If user needs to see order, valid check needed.

    const order = await findOrderById(id);
    // @ts-ignore
    if (order && order.userId === session?.user?.id) {
      return NextResponse.json({ order });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await findOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const currentOrder = await findOrderById(id);

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await updateOrder(id, {
      status: body.status,
      deliveryUrl: body.deliveryUrl,
      payment: body.payment
    });

    // Check if we should send delivery email
    // Trigger if status changed to 'completed' AND we have a delivery URL AND it wasn't already completed/sent (simplistic check)
    if (body.status === 'completed' && currentOrder.status !== 'completed' && (body.deliveryUrl || currentOrder.deliveryUrl)) {
      if (updatedOrder && updatedOrder.email) {
        const emailData = deliveryNotificationEmail({
          customerName: updatedOrder.name || 'Valued Customer',
          orderNumber: updatedOrder.trackingNumber,
          productName: updatedOrder.productName,
          deliveryUrl: updatedOrder.deliveryUrl || body.deliveryUrl,
          photoCount: updatedOrder.cart.reduce((acc, item) => acc + (item.angles?.length || item.selectedAngles?.length || 0), 0)
        });

        await sendEmail({
          to: updatedOrder.email,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text
        });
      }
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
