import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoutes) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin));
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoutes) {
    let callBackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callBackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callBackUrl);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl.origin));
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
