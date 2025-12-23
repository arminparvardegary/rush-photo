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

      import("@/lib/aws-ses").then(({ sendEmail }) => {
        sendEmail({
          to: email,
          subject: "Reset your Rush Photo password",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Reset Your Password</h2>
              <p>You requested a password reset for your Rush Photo account.</p>
              <div style="margin: 30px 0;">
                <a href="${resetLink}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
              </div>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p>This link will expire in 1 hour.</p>
            </div>
          `,
          text: `Reset your Rush Photo password: ${resetLink}`
        }).catch(err => console.error("Failed to send reset email:", err));
      });
    }
  }

  // Always return success to prevent email enumeration
  return NextResponse.json({
    success: true,
    message: "If an account with that email exists, you will receive a password reset link.",
  });
}

