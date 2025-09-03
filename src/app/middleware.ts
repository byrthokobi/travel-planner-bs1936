// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  
  const isPublicPath = 
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/registration');
  
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }else {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}