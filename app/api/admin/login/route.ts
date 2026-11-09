import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, sessionToken } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return NextResponse.json(
      { error: "Admin auth is not configured on the server." },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.password !== password) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
  return res;
}
