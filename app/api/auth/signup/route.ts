import { NextResponse } from "next/server";
import { createUser, findUserByEmail, isAdminEmail } from "@/lib/server/users";
import { hashPassword } from "@/lib/server/auth-utils";
import { sendEmail } from "@/lib/resend";
import { welcomeEmail } from "@/lib/email-templates";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const passwordHash = await hashPassword(password);

        // Check if first user or admin email
        const role = isAdminEmail(email) ? "admin" : "customer";

        const user = await createUser({
            name,
            email,
            passwordHash,
            role,
            authProvider: "email",
        });

        // Send welcome email (don't await - send in background)
        setImmediate(async () => {
            try {
                const welcomeEmailContent = welcomeEmail({
                    customerName: name,
                    email: email,
                });

                console.log(`Attempting to send welcome email to: ${email}`);
                const emailId = await sendEmail({
                    to: email,
                    subject: welcomeEmailContent.subject,
                    html: welcomeEmailContent.html,
                    text: welcomeEmailContent.text,
                });

                if (emailId) {
                    console.log(`Welcome email sent successfully to ${email}, ID: ${emailId}`);
                } else {
                    console.error(`Failed to send welcome email to ${email} - no email ID returned`);
                }
            } catch (emailError) {
                console.error("Welcome email error:", emailError);
            }
        });

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
