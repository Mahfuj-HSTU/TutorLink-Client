import { NextRequest, NextResponse } from 'next/server'

const protectedPrefixes = [
	'/dashboard',
	'/bookings',
	'/profile',
	'/tutor/',
	'/admin/'
]

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Skip middleware for verify-email route
  if (pathname.startsWith("/verify-email")) {
    return NextResponse.next();
  }

	const sessionToken = request.cookies.get('better-auth.session_token')
  const isAuthenticated = Boolean(sessionToken?.value)
   //* User is not authenticated at all
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
