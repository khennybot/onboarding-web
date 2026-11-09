import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/schema";
import { subscribeSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid email." },
      { status: 400 }
    );
  }

  const { email, source } = parsed.data;

  try {
    await db
      .insert(subscribers)
      .values({ email, source })
      .onConflictDoNothing({ target: subscribers.email });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe] insert failed:", err);
    return NextResponse.json(
      { error: "Could not save your email. Please try again later." },
      { status: 500 }
    );
  }
}
