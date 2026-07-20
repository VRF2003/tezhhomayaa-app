import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TokenService } from "./lib/iam/tokens/TokenService";


export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);

  // Observability: Inject Correlation & Request IDs globally
  const correlationId = requestHeaders.get("x-correlation-id") || crypto.randomUUID();
  const requestId = crypto.randomUUID();
  
  requestHeaders.set("x-correlation-id", correlationId);
  requestHeaders.set("x-request-id", requestId);

  // Protect /admin and /admin/*
  if (pathname.startsWith("/admin")) {
    // Exclude the login page itself
    if (pathname === "/admin") {
      const token = request.cookies.get("tz_access_token")?.value;
      if (token) {
        try {
          await TokenService.verifyAccessToken(token);
          // If valid token, redirect to dashboard
          const response = NextResponse.redirect(new URL("/admin/dashboard", request.url));
          return response;
        } catch {
          // Invalid token, allow access to login page
          return NextResponse.next({ request: { headers: requestHeaders } });
        }
      }
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // Require authentication for all other /admin/* routes
    const token = request.cookies.get("tz_access_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    try {
      // Validate JWT
      const payload = await TokenService.verifyAccessToken(token);

      // Inject IdentityContext (we can pass headers to the RSC layer)
      requestHeaders.set("x-iam-user-id", payload.userId);
      requestHeaders.set("x-iam-role-id", payload.roleId);
      requestHeaders.set("x-iam-session-id", payload.sessionId);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("[IAM Middleware] Unauthorized access attempt:", error);
      // Clear cookie on failure
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("tz_access_token");
      return response;
    }
  }

  // Allow all other routes through, passing the observability headers
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
