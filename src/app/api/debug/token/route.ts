import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const DEV_SECRET =
  "greentera-dev-secret-change-in-production-12345678901234567890";

export async function GET(request: NextRequest) {
  try {
    // Try with __Secure- prefix first (production HTTPS)
    let token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || DEV_SECRET,
      cookieName: "__Secure-authjs.session-token",
    });

    // Fallback to non-secure cookie name (localhost)
    if (!token) {
      token = await getToken({
        req: request,
        secret:
          process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || DEV_SECRET,
        cookieName: "authjs.session-token",
      });
    }

    // Get all cookies for debugging
    const cookies = request.cookies.getAll();
    const cookieNames = cookies.map((c) => c.name);

    return NextResponse.json({
      success: true,
      token: token
        ? {
            id: token.id,
            email: token.email,
            role: token.role,
            name: token.name,
            sub: token.sub,
          }
        : null,
      hasToken: !!token,
      isLoggedIn: !!(token && (token.id || token.email)),
      cookieNames,
      env: {
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        nextAuthUrl: process.env.NEXTAUTH_URL || "not set",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
