import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ items: [] });
    }

    const { data, error } = await supabaseAdmin
      .from("user_carts")
      .select("cart_items")
      .eq("user_email", session.user.email)
      .single();

    if (error) {
      console.error("[API Cart GET] Error:", error);
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: data?.cart_items || [] });
  } catch (error) {
    console.error("[API Cart GET] Exception:", error);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();

    const { error } = await supabaseAdmin
      .from("user_carts")
      .upsert({
        user_email: session.user.email,
        cart_items: items,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_email"
      });

    if (error) {
      console.error("[API Cart POST] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Cart POST] Exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from("user_carts")
      .delete()
      .eq("user_email", session.user.email);

    if (error) {
      console.error("[API Cart DELETE] Error:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Cart DELETE] Exception:", error);
    return NextResponse.json({ success: true }); // Always return success for DELETE
  }
}
