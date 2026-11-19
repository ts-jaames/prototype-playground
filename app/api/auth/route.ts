import { NextResponse } from "next/server";

import { AUTH_COOKIE, AUTH_MAX_AGE, authToken, safeEqual } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const expected = process.env.PLAYGROUND_PASSWORD;
    if (!expected) {
      return NextResponse.json(
        { error: "PLAYGROUND_PASSWORD is not set on the server." },
        { status: 500 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as { password?: unknown };
    const password = typeof body.password === "string" ? body.password : "";
    const ok = safeEqual(await authToken(password), await authToken(expected));
    if (!ok) return NextResponse.json({ error: "Wrong password." }, { status: 401 });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE, await authToken(expected), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_MAX_AGE,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
