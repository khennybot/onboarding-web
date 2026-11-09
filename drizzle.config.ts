import { defineConfig } from "drizzle-kit";

// Reads DATABASE_URL (or POSTGRES_URL) from the environment.
// Mirrors what Vercel Postgres / Neon / Supabase all expose.
export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "",
  },
  verbose: true,
  strict: true,
});
