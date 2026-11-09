import { z } from "zod";

/** Client onboarding intake form. */
export const intakeSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(160),
  contactName: z.string().trim().min(1, "Your name is required").max(160),
  email: z.string().trim().email("A valid email is required").max(254),
  responses: z
    .object({
      goals: z.string().trim().min(1, "Goals are required").max(4000),
      audience: z.string().trim().min(1, "Audience is required").max(4000),
      scope: z.string().trim().min(1, "Scope is required").max(4000),
      timeline: z.string().trim().min(1, "Timeline is required").max(4000),
      budget: z.string().trim().max(4000).optional().default(""),
      notes: z.string().trim().max(4000).optional().default(""),
    })
    .strict(),
  idempotencyKey: z.string().trim().max(120).optional(),
  source: z.string().trim().max(40).optional().default("web"),
});

export type IntakeInput = z.infer<typeof intakeSchema>;

/** Landing-page email signup. */
export const subscribeSchema = z.object({
  email: z.string().trim().email("A valid email is required").max(254),
  source: z.string().trim().max(40).optional().default("web"),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
