import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirect = searchParams.get("redirect") || "/admin";

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
  }

  // Determine base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // Generate state for CSRF protection
  const state = crypto.randomBytes(32).toString("hex");

  // Store state and redirect URL in cookie
  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });
  cookieStore.set("google_oauth_redirect", redirect, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  // Build Google OAuth URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}

