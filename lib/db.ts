import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";

if (!connectionString) {
  // Surface a clear error at module load instead of a cryptic driver failure.
  // The app still imports; only DB calls will fail, which we handle in routes.
  console.warn(
    "[db] DATABASE_URL / POSTGRES_URL is not set — database calls will fail until it is provided."
  );
}

// Reuse a single client across hot reloads in development to avoid exhausting
// connections. In production each serverless invocation gets its own module scope.
const globalForDb = globalThis as unknown as {
  __pgClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__pgClient ??
  postgres(connectionString, {
    max: 5,
    prepare: false,
    onnotice: () => {},
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pgClient = client;
}

export const db = drizzle(client, { schema });
export { schema };
