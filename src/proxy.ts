import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require an authenticated session
const protectedPrefixes = [
  '/dashboard',
  '/bookings',
  '/profile',
  '/tutor/',
  '/admin/'
]

// Routes only for unauthenticated users
const authRoutes = ['/login', '/register']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // better-auth stores the session token in this cookie
  const sessionToken = request.cookies.get('better-auth.session_token')
  const isAuthenticated = Boolean(sessionToken?.value)

  // Redirect logged-in users away from login/register
  if (isAuthenticated && authRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (
    !isAuthenticated &&
    protectedPrefixes.some((p) => pathname.startsWith(p))
  ) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
