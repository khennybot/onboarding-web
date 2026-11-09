import crypto from "node:crypto";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function expectedToken(): string {
  const password = process.env.ADMIN_PASSWORD || "";
  const salt = process.env.ADMIN_SESSION_SALT || "onboarding-admin-salt";
  return crypto
    .createHash("sha256")
    .update(`${password}:${salt}`)
    .digest("hex");
}

/** True if the supplied cookie value matches the expected session token. */
export function isValidSession(value: string | undefined): boolean {
  if (!value) return false;
  if (!process.env.ADMIN_PASSWORD) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expectedToken());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** The cookie value to set after a successful login. */
export function sessionToken(): string {
  return expectedToken();
}

export const ADMIN_COOKIE = COOKIE;
export const ADMIN_MAX_AGE = MAX_AGE;
