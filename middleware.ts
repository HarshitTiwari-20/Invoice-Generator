import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Add the paths that require authentication
const protectedPaths = ['/', '/create'];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isProtectedPath = protectedPaths.some((p) =>
        path === p || path.startsWith(`${p}/`)
    );

    if (isProtectedPath) {
        const token = req.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch {
            // Invalid token
            const response = NextResponse.redirect(new URL('/login', req.url));
            response.cookies.delete('auth_token'); // Clean up invalid token
            return response;
        }
    }

    // Allow auth routes if already logged in? Optional, but good practice
    if (path === '/login' || path === '/signup') {
        const token = req.cookies.get('auth_token')?.value;
        if (token) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
                await jwtVerify(token, secret);
                return NextResponse.redirect(new URL('/', req.url));
            } catch {
                // Just let them go to login if token is invalid
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes - handled separately)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
