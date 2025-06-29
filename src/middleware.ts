import { NextRequest, NextResponse } from 'next/server'
import { PRIMARY_DOMAIN, SECONDARY_DOMAIN } from '@/utils/domains'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host')

  // Only run in production to avoid issues in development
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next()
  }

  // Extract domain from the constants (remove protocol)
  const primaryHost = PRIMARY_DOMAIN.replace(/^https?:\/\//, '')
  const secondaryHost = SECONDARY_DOMAIN.replace(/^https?:\/\//, '')

  // If request is coming from secondary domain, redirect to primary
  if (hostname === secondaryHost && hostname !== primaryHost) {
    url.host = primaryHost
    url.protocol = 'https:'

    return NextResponse.redirect(url, {
      status: 301, // Permanent redirect for SEO
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  // Match all paths except API routes, static files, and Next.js internals
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - manifest.json (PWA manifest)
     * - sw.js (service worker)
     * - images/ (static images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|images/).*)',
  ],
}
