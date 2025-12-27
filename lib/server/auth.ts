import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/lib/server/users";
import { verifyPassword } from "@/lib/server/auth-utils";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await findUserByEmail(credentials.email);
                if (!user || user.authProvider !== "email" || !user.passwordHash) {
                    return null;
                }

                const isValid = await verifyPassword(credentials.password, user.passwordHash);
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.avatarUrl,
                    role: user.role
                };
            }
        })
    ],
    pages: {
        signIn: "/login",
        error: "/login", // Error code passed in query string as ?error=
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.sub;
                // Check if user is admin
                const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
                // @ts-ignore
                session.user.role = adminEmails.includes(session.user.email) ? "admin" : token.role || "user";
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                // @ts-ignore
                token.role = user.role;
            }
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }
            return token;
        },
    },
};
