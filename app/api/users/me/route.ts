import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken, createSessionToken, SESSION_MAX_AGE_SECONDS } from "@/lib/server/auth";
import { findUserByEmail, findUserById, updateUser } from "@/lib/server/users";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

export async function PATCH(req: Request) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const current = await findUserById(session.sub);
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const name = body?.name !== undefined ? String(body.name).trim() : undefined;
  const phone = body?.phone !== undefined ? String(body.phone).trim() : undefined;
  const company = body?.company !== undefined ? String(body.company).trim() : undefined;
  const email = body?.email !== undefined ? String(body.email).trim() : undefined;

  if (email !== undefined) {
    if (!email) return NextResponse.json({ error: "Email cannot be empty" }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    const existing = await findUserByEmail(email);
    if (existing && existing.id !== current.id) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
  }

  const next = await updateUser(current.id, {
    name: name === undefined ? undefined : name,
    phone: phone === undefined ? undefined : phone || undefined,
    company: company === undefined ? undefined : company || undefined,
    email: email === undefined ? undefined : email,
  });

  if (!next) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newToken = createSessionToken(next);
  const res = NextResponse.json({
    user: { id: next.id, email: next.email, name: next.name, phone: next.phone, company: next.company, role: next.role },
  });
  res.cookies.set(SESSION_COOKIE_NAME, newToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
}


