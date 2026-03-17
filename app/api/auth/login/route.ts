import { NextRequest, NextResponse } from 'next/server';

import { SignJWT } from 'jose';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        if (email !== 'SSE7734' || password !== 'SSE7734') {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = {
            id: 1,
            email: 'SSE7734',
            name: 'SSE Admin',
            gstno: ''
        };

            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
            const token = await new SignJWT({ id: user.id, email: user.email, name: user.name, gstNo: user.gstno })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('7d')
                .sign(secret);

            const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, gstNo: user.gstno } }, { status: 200 });

            response.cookies.set('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            });

            return response;
    } catch (error) {
        console.error('Error in login:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
