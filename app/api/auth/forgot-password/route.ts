import { NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/server/users";
import { sendEmail } from "@/lib/server/ses";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const token = await createPasswordResetToken(email);

        if (token) {
            // Send email even if user not found to prevent enumeration? 
            // Logic in createPasswordResetToken returns null if user not found, so we know here.
            // But for security, maybe we should always say "If an account exists..."
            // For now, let's just send if token exists.

            const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

            await sendEmail({
                to: email,
                subject: "Reset your Rush.Photos password",
                html: `
                <div style="font-family: sans-serif; color: #1a1a1a;">
                    <h1>Reset your password</h1>
                    <p>You requested a password reset for your Rush.Photos account.</p>
                    <p>Click the link below to set a new password:</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #ed1c24; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>This link will expire in 1 hour.</p>
                </div>
            `
            });
        }

        // Always return success to prevent email enumeration
        return NextResponse.json({ message: "If an account exists with that email, we have sent a reset link." });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
