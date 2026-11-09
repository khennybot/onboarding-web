import {
  pgTable,
  serial,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

/** A client onboarding intake submission captured from the website. */
export const intakeSubmissions = pgTable(
  "intake_submissions",
  {
    id: serial("id").primaryKey(),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    company: text("company").notNull(),
    contactName: text("contact_name").notNull(),
    email: text("email").notNull(),
    responses: jsonb("responses")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    status: text("status").notNull().default("received"),
    source: text("source").notNull().default("web"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    emailIdx: index("intake_email_idx").on(t.email),
    statusIdx: index("intake_status_idx").on(t.status),
  })
);

/** Email-only signups from the landing page ("get updates" / waitlist). */
export const subscribers = pgTable(
  "subscribers",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    source: text("source").notNull().default("web"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    emailIdx: index("subscriber_email_idx").on(t.email),
  })
);

export type IntakeSubmission = typeof intakeSubmissions.$inferSelect;
export type NewIntakeSubmission = typeof intakeSubmissions.$inferInsert;
export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
