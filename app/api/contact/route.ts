import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import { contactConfirmationEmail, contactNotificationEmail } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send confirmation email to customer
    const customerEmail = contactConfirmationEmail({
      customerName: name,
      email,
      subject: subject || "General Inquiry",
      message,
    });

    await sendEmail({
      to: email,
      subject: customerEmail.subject,
      html: customerEmail.html,
      text: customerEmail.text,
    });

    // Send notification to admin
    const adminEmail = contactNotificationEmail({
      customerName: name,
      email,
      phone,
      subject: subject || "General Inquiry",
      message,
    });

    await sendEmail({
      to: "hello@rush.photos",
      subject: adminEmail.subject,
      html: adminEmail.html,
      text: adminEmail.text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
