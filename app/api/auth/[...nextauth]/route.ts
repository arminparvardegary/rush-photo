import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.sub;
                // Check if user is admin
                const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
                // @ts-ignore
                session.user.role = adminEmails.includes(session.user.email) ? "admin" : "user";
            }
            return session;
        },
        async jwt({ token }) {
            return token;
        },
    },
});

export { handler as GET, handler as POST };
