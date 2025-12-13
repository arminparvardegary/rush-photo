import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, verifyPassword } from "@/lib/server/auth";
import { findUserByEmail } from "@/lib/server/users";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = (body?.email ?? "").toString().trim();
  const password = (body?.password ?? "").toString();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Check if user signed up with Google (no password)
  if (user.authProvider === "google" && !user.passwordHash) {
    return NextResponse.json(
      { error: "Please use Google to sign in" },
      { status: 400 }
    );
  }

  if (!user.passwordHash || !user.passwordSalt) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

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


