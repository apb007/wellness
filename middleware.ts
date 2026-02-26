import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get('auth-token')?.value
  const pathname = req.nextUrl.pathname

  // Public routes
  const publicRoutes = ['/', '/auth/login', '/auth/signup']
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Protected routes - require auth
  if (!authToken) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
