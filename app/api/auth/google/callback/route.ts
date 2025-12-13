import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findOrCreateGoogleUser } from "@/lib/server/users";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/server/auth";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  id_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;
  const redirectPath = cookieStore.get("google_oauth_redirect")?.value || "/admin";

  // Clear OAuth cookies
  cookieStore.delete("google_oauth_state");
  cookieStore.delete("google_oauth_redirect");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Handle errors from Google
  if (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`);
  }

  // Validate state
  if (!state || state !== storedState) {
    console.error("OAuth state mismatch");
    return NextResponse.redirect(`${baseUrl}/login?error=invalid_state`);
  }

  // Validate code
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_not_configured`);
  }

  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange failed:", errorData);
      return NextResponse.redirect(`${baseUrl}/login?error=token_exchange_failed`);
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error("Failed to get user info");
      return NextResponse.redirect(`${baseUrl}/login?error=userinfo_failed`);
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json();

    if (!userInfo.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_email`);
    }

    // Find or create user
    const user = await findOrCreateGoogleUser({
      googleId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name || userInfo.email.split("@")[0],
      avatarUrl: userInfo.picture,
    });

    // Create session
    const sessionToken = createSessionToken(user);

    // Set session cookie
    const response = NextResponse.redirect(`${baseUrl}${redirectPath}`);
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=callback_failed`);
  }
}

