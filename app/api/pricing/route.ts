import { NextResponse } from "next/server";
import { getPricing, setPricing } from "@/lib/server/pricing";
import type { PricingSettings } from "@/lib/shared/pricing";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET() {
  const pricing = await getPricing();
  return NextResponse.json({ pricing });
}

export async function PUT(req: Request) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const pricing = body?.pricing as PricingSettings | undefined;
  if (!pricing) {
    return NextResponse.json({ error: "Missing pricing" }, { status: 400 });
  }

  await setPricing(pricing);
  return NextResponse.json({ ok: true, pricing });
}


