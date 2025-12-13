import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/server/auth";
import { findUserById } from "@/lib/server/users";

export const runtime = "nodejs";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const payload = verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await findUserById(payload.sub);
  if (!user) {
    const res = NextResponse.json({ user: null }, { status: 401 });
    res.cookies.set(SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return res;
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone, company: user.company, role: user.role },
  });
}


