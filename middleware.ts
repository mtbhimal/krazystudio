import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

// Paths that must stay reachable WITHOUT a login (the login page itself, and the
// login API it calls to authenticate). Everything else under /admin or /api/admin
// requires a valid session cookie.
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/auth/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (!isAdminArea || isPublicAdminPath) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    // API routes get a JSON 401 (so fetch() calls can handle it); pages get redirected to login.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run this middleware for admin-related paths — keeps every other request fast.
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
