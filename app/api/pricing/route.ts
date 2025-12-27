import { NextResponse } from "next/server";
import { getPricing, setPricing } from "@/lib/server/pricing";
import type { PricingSettings } from "@/lib/shared/pricing";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET() {
  const pricing = await getPricing();
  return NextResponse.json({ pricing });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session?.user?.role !== "admin") {
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


