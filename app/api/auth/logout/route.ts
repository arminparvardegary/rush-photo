import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        // Clear NextAuth session cookies
        const cookieStore = await cookies();

        // Get all cookies and clear NextAuth related ones
        cookieStore.getAll().forEach((cookie) => {
            if (cookie.name.startsWith('next-auth') || cookie.name.startsWith('__Secure-next-auth')) {
                cookieStore.delete(cookie.name);
            }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
    }
}
