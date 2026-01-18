import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/server/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                id: (session.user as any).id || session.user.email,
                name: session.user.name,
                email: session.user.email,
                avatarUrl: session.user.image,
                role: (session.user as any).role || "user",
            },
        });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
