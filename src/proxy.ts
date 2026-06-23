import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect client-side dashboard page
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value;
    const verified = token ? await verifyJWT(token) : null;

    if (!verified) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect saved-college APIs
  if (pathname.startsWith('/api/saved')) {
    const token = request.cookies.get('token')?.value;
    const verified = token ? await verifyJWT(token) : null;

    if (!verified) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to manage your shortlisted colleges.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/saved/:path*',
  ],
};
