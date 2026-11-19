import { NextResponse, type NextRequest } from "next/server";

import { AUTH_COOKIE, isGateEnabled, isValidToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  if (!isGateEnabled()) return NextResponse.next();
  if (await isValidToken(request.cookies.get(AUTH_COOKIE)?.value)) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = new URL("/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}

// Everything is private except: framework assets, the login flow, public prototypes
// (/p/*), their share images (/og/*), and API routes under /api/public/*.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login|api/auth|api/public/|p/|og/).*)",
  ],
};
