import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply to /peek-as-admin routes
  if (request.nextUrl.pathname.startsWith("/peek-as-admin")) {
    // Check for basic auth header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !isValidAuthHeader(authHeader)) {
      // Return 401 response with WWW-Authenticate header
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Dashboard"',
        },
      })
    }
  }

  return NextResponse.next()
}

function isValidAuthHeader(authHeader: string): boolean {
  // Basic authentication format: "Basic base64(username:password)"
  if (!authHeader.startsWith("Basic ")) {
    return false
  }

  try {
    // Extract and decode the base64 credentials
    const base64Credentials = authHeader.split(" ")[1]
    const credentials = atob(base64Credentials)
    const [username, password] = credentials.split(":")

    // Check against hardcoded credentials (in a real app, use environment variables)
    return username === "admin" && password === "password"
  } catch (error) {
    return false
  }
}

export const config = {
  matcher: "/peek-as-admin/:path*",
}

