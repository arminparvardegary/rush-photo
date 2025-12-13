import { NextResponse } from "next/server";
import { createPasswordResetToken, findUserByEmail } from "@/lib/server/users";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = (body?.email ?? "").toString().trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    // Don't reveal if email exists or not
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, you will receive a password reset link.",
    });
  }

  const user = await findUserByEmail(email);
  
  if (user) {
    const token = await createPasswordResetToken(email);
    
    if (token) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const resetLink = `${baseUrl}/reset-password?token=${token}`;
      
      // TODO: Send email with reset link
      // For now, log it (in production, integrate with email service)
      console.log(`[Password Reset] Link for ${email}: ${resetLink}`);
      
      // In production, you would send an email here:
      // await sendEmail({
      //   to: email,
      //   subject: "Reset your Rush Photo password",
      //   html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
      // });
    }
  }

  // Always return success to prevent email enumeration
  return NextResponse.json({
    success: true,
    message: "If an account with that email exists, you will receive a password reset link.",
  });
}

