import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Dev secret - same as in auth.ts
const DEV_SECRET =
  "greentera-dev-secret-change-in-production-12345678901234567890";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/waste",
  "/tree",
  "/voucher",
  "/education/quiz",
  "/profile",
  "/leaderboard",
];

// Routes that require admin role
const adminRoutes = ["/admin"];

// Auth routes (redirect if already logged in)
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get token from JWT (Edge compatible) with dev secret fallback
  let token = null;
  try {
    token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || DEV_SECRET,
    });
  } catch (error) {
    console.error("Middleware getToken error:", error);
  }

  // Check if user is logged in - token exists and has either id or email
  const isLoggedIn = !!(token && (token.id || token.email));
  const isAdmin = token?.role === "ADMIN";

  // Check if trying to access auth pages while logged in
  if (isLoggedIn && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check if trying to access protected routes without login
  if (
    !isLoggedIn &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if trying to access admin routes without admin role
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
