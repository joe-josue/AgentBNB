import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // /api/admin/auth is the login endpoint — never block it
  if (pathname === '/api/admin/auth') {
    return NextResponse.next()
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  const adminApiKey = process.env.ADMIN_API_KEY
  const cookieToken = req.cookies.get('admin_token')?.value

  // Normalize the Authorization header — accept raw key or "Bearer <key>"
  const authHeader = req.headers.get('authorization') ?? ''
  const sentKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

  const validCookie = adminPassword && cookieToken === adminPassword
  const validBearer = adminApiKey && sentKey === adminApiKey

  // Protect all other API admin routes — Bearer token (agent) OR valid cookie (browser UI)
  if (pathname.startsWith('/api/admin')) {
    if (!validBearer && !validCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  // Protect admin UI — require admin_token cookie
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!validCookie) {
      const loginUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
