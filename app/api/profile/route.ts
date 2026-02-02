import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("user_email", session.user.email)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("[API Profile GET] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data || null });
  } catch (error) {
    console.error("[API Profile GET] Exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileData = await request.json();

    const { error } = await supabaseAdmin
      .from("user_profiles")
      .upsert({
        user_email: session.user.email,
        name: profileData.name,
        phone: profileData.phone,
        company: profileData.company,
        address: profileData.address,
        apartment: profileData.apartment,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zipCode,
        country: profileData.country,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_email"
      });

    if (error) {
      console.error("[API Profile POST] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Profile POST] Exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
