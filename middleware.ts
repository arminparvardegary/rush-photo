import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed domain for this site
const ALLOWED_DOMAIN = "rush.photos";

// Check if host is an IP address
function isIPAddress(host: string): boolean {
    const hostWithoutPort = host.split(":")[0];
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^(\[.*\]|[a-fA-F0-9:]+)$/;
    return ipv4Regex.test(hostWithoutPort) || ipv6Regex.test(hostWithoutPort);
}

export function middleware(request: NextRequest) {
    const host = request.headers.get("host") || "";

    // Block direct IP access - redirect to domain
    if (isIPAddress(host)) {
        const url = new URL(request.url);
        url.host = ALLOWED_DOMAIN;
        url.protocol = "https:";
        return NextResponse.redirect(url.toString(), 301);
    }

    // Continue with request
    const response = NextResponse.next();

    // Add security headers including HSTS
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - static assets
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|woff|woff2|ttf|eot|css|js)).*)',
    ],
};
