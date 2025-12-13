import { NextResponse } from "next/server";
import { verifyPasswordResetToken, resetPassword } from "@/lib/server/users";

export const runtime = "nodejs";

// GET: Verify token is valid
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false, error: "No token provided" }, { status: 400 });
  }

  const email = await verifyPasswordResetToken(token);
  
  if (!email) {
    return NextResponse.json({ valid: false, error: "Invalid or expired token" }, { status: 400 });
  }

  return NextResponse.json({ valid: true, email });
}

// POST: Reset password
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = (body?.token ?? "").toString();
  const password = (body?.password ?? "").toString();

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const success = await resetPassword(token, password);

  if (!success) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Password has been reset successfully" });
}

