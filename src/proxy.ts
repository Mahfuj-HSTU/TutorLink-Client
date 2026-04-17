import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPrefixes = [
  '/dashboard',
  '/bookings',
  '/profile',
  '/tutor/',
  '/admin/'
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionToken = request.cookies.get('better-auth.session_token')
  const isAuthenticated = Boolean(sessionToken?.value)

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
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
