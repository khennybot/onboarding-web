CREATE TABLE IF NOT EXISTS "intake_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"idempotency_key" text NOT NULL,
	"company" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"responses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'received' NOT NULL,
	"source" text DEFAULT 'web' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "intake_submissions_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"source" text DEFAULT 'web' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "intake_email_idx" ON "intake_submissions" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "intake_status_idx" ON "intake_submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriber_email_idx" ON "subscribers" USING btree ("email");