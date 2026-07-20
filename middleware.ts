import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES: string[] = ['/dashboard']
const ADMIN_ROUTES: string[] = ['/admin']
const AUTH_ROUTES: string[] = ['/login', '/verify', '/signup']

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('firebase-token')?.value

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r))
  const isAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  // Not logged in → redirect to login, remembering where they came from
  if ((isProtected || isAdmin) && !token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Already logged in → skip auth pages, return to the page they came from if known
  if (isAuth && token) {
    const from = req.nextUrl.searchParams.get('from')
    const url = req.nextUrl.clone()
    url.pathname = from && from.startsWith('/') ? from : '/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/verify',
    '/signup',
  ],
}
