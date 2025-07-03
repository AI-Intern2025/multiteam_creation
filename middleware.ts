import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication
const protectedPaths = ['/admin', '/teams', '/strategy', '/select']

// Add paths that are only accessible to admin
const adminPaths = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // Check if the path requires admin access
  const isAdminPath = adminPaths.some(path => 
    pathname.startsWith(path)
  )
  
  if (isProtectedPath) {
    // Get user data from localStorage won't work in middleware
    // This is a simplified version - in production, use proper JWT or session handling
    const response = NextResponse.next()
    
    // For now, let client-side handle authentication
    // In production, you would verify JWT tokens here
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
