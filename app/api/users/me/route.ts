import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { findUserByEmail, findUserById, updateUser } from "@/lib/server/users";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // @ts-ignore
  return NextResponse.json({ user: session.user });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || !session.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // @ts-ignore
  const currentId = session.user.id;
  const current = await findUserById(currentId);
  if (!current) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const name = body?.name !== undefined ? String(body.name).trim() : undefined;
  const phone = body?.phone !== undefined ? String(body.phone).trim() : undefined;
  const company = body?.company !== undefined ? String(body.company).trim() : undefined;
  // Notes: changing email might break auth linkage if using OAauth only, but let's allow it if logic supports
  // For simplicty with Google Auth, maybe don't allow email change or handle carefully. 
  // For now let's skip email update to avoid conflicts with Google ID

  const next = await updateUser(current.id, {
    name: name === undefined ? undefined : name,
    phone: phone === undefined ? undefined : phone || undefined,
    company: company === undefined ? undefined : company || undefined,
  });

  if (!next) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  return NextResponse.json({
    user: { id: next.id, email: next.email, name: next.name, phone: next.phone, company: next.company, role: next.role },
  });
}


