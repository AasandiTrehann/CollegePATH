import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT, signJWT } from '@/lib/auth';
import { jwtVerify } from 'jose';
import { env } from '@/lib/env';

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // 1. Verify token
    let payload;
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, SECRET_KEY);
      payload = verifiedPayload as { userId: string; email: string; iat?: number };
    } catch (err) {
      // Clear invalid token cookie
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.set('token', '', { maxAge: 0, path: '/' });
      return response;
    }

    if (!payload || !payload.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // 2. Verify user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.set('token', '', { maxAge: 0, path: '/' });
      return response;
    }

    // 3. Sliding Session Token Rotation
    // Check token age. If it is older than 3.5 days, issue a new one
    const now = Math.floor(Date.now() / 1000);
    const iat = payload.iat || now;
    const tokenAgeInSeconds = now - iat;
    const rotationThresholdSeconds = 3.5 * 24 * 60 * 60; // 3.5 days

    const response = NextResponse.json({ user }, { status: 200 });

    if (tokenAgeInSeconds > rotationThresholdSeconds) {
      const newToken = await signJWT({ userId: user.id, email: user.email });
      response.cookies.set('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return response;
  } catch (error) {
    console.error('Check Session API error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
