import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { intakeSubmissions } from "@/lib/schema";
import { intakeSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid submission." },
      { status: 400 }
    );
  }

  const { company, contactName, email, responses, source } = parsed.data;
  const idempotencyKey =
    parsed.data.idempotencyKey?.trim() ||
    `web_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;

  try {
    const inserted = await db
      .insert(intakeSubmissions)
      .values({
        idempotencyKey,
        company,
        contactName,
        email,
        responses,
        source,
        status: "received",
      })
      .onConflictDoNothing({ target: intakeSubmissions.idempotencyKey })
      .returning({ id: intakeSubmissions.id });

    const duplicate = inserted.length === 0;

    // Optionally forward to the existing n8n automation (W2 intake processor)
    // so its Google Sheet and email orchestration stay in sync. Fire-and-forget.
    const webhook = process.env.N8N_INTAKE_WEBHOOK_URL;
    if (webhook && !duplicate) {
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotency_key: idempotencyKey,
          email,
          responses,
        }),
      }).catch((err) =>
        console.warn("[intake] n8n forward failed:", (err as Error).message)
      );
    }

    return NextResponse.json({
      success: true,
      duplicate,
      idempotency_key: idempotencyKey,
    });
  } catch (err) {
    console.error("[intake] insert failed:", err);
    return NextResponse.json(
      { error: "Could not save the submission. Please try again later." },
      { status: 500 }
    );
  }
}
