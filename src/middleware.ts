import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { firebaseAdminConfig } from '@/firebase/firebase-admin-config';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp(firebaseAdminConfig);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect the /admin route
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('__session')?.value || '';

    try {
      // Verify the session cookie
      const decodedToken = await getAuth().verifySessionCookie(sessionCookie, true);
      
      // Check if the user is the admin
      if (decodedToken.email !== 'ranamilon41@gmail.com') {
        // If not the admin, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // If admin, allow access
      return NextResponse.next();
    } catch (error) {
      // If cookie is invalid or expired, redirect to login
      console.error('Middleware auth error:', error);
      return NextResponse.redirect(new URL('/ourshop7862', request.url));
    }
  }

  // Allow all other routes
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
