import { NextRequest, NextResponse } from 'next/server'

const protectedPrefixes = [
	'/dashboard',
	'/bookings',
	'/profile',
	'/tutor',
	'/admin'
]

export function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Skip public routes
	if (pathname.startsWith('/verify-email')) {
		return NextResponse.next()
	}

	const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))

	if (!isProtected) {
		return NextResponse.next()
	}

	const sessionToken = request.cookies.get('better-auth.session_token')

	if (!sessionToken?.value) {
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
