import { NextResponse } from "next/server";
import { getDiscountCodes, normalizeDiscountCode } from "@/lib/server/discounts";
import { getPricing } from "@/lib/server/pricing";
import { computeOrderTotals, type OrderCartItem, type PackageType } from "@/lib/server/orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const codeRaw = (body?.code ?? "").toString();
  const code = normalizeDiscountCode(codeRaw);
  const packageType = body?.packageType as PackageType | undefined;
  const cart = (body?.cart ?? []) as OrderCartItem[];
  const lifestyleIncluded = Boolean(body?.lifestyleIncluded);

  if (!code) {
    return NextResponse.json({ ok: false, error: "Missing code" }, { status: 400 });
  }
  if (!packageType) {
    return NextResponse.json({ ok: false, error: "Missing packageType" }, { status: 400 });
  }

  const [pricing, codes] = await Promise.all([getPricing(), getDiscountCodes()]);
  const found = codes.find((c) => normalizeDiscountCode(c.code) === code && c.active);
  if (!found) {
    return NextResponse.json({ ok: false, error: "Invalid code" }, { status: 404 });
  }

  const totals = computeOrderTotals({
    pricing,
    packageType,
    cart,
    lifestyleIncluded,
    promo: found,
  });

  if (found.minSubtotal && totals.itemsSubtotal - totals.bundleDiscount < found.minSubtotal) {
    return NextResponse.json(
      { ok: false, error: `Minimum subtotal is $${found.minSubtotal}` },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    promo: {
      code: found.code,
      type: found.type,
      value: found.value,
      minSubtotal: found.minSubtotal,
    },
    totals,
  });
}


