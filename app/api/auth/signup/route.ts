import { NextResponse } from "next/server";
import { createSessionToken, hashPassword, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/server/auth";
import { createUser, findUserByEmail, isAdminEmail } from "@/lib/server/users";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = (body?.name ?? "").toString().trim();
  const email = (body?.email ?? "").toString().trim();
  const phone = (body?.phone ?? "").toString().trim();
  const company = (body?.company ?? "").toString().trim();
  const password = (body?.password ?? "").toString();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const { salt, hash } = await hashPassword(password);
  const role = isAdminEmail(email) ? "admin" : "customer";
  const user = await createUser({
    email,
    name,
    phone: phone || undefined,
    company: company || undefined,
    role,
    passwordHash: hash,
    passwordSalt: salt,
    authProvider: "email",
  });

  const token = createSessionToken(user);
  const res = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone, company: user.company, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
}


