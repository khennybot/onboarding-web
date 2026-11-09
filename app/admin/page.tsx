import { cookies } from "next/headers";
import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { intakeSubmissions, subscribers } from "@/lib/schema";
import { ADMIN_COOKIE, isValidSession } from "@/lib/admin";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminLogout } from "@/components/AdminLogout";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  received: "bg-brand-50 text-brand-700 ring-brand-100",
  welcomed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  briefed: "bg-violet-50 text-violet-700 ring-violet-100",
  complete: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  failed: "bg-rose-50 text-rose-700 ring-rose-100",
};

function fmt(d: Date | string | null): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminPage() {
  const authed = isValidSession(cookies().get(ADMIN_COOKIE)?.value);

  if (!authed) {
    return (
      <section className="container-page">
        <AdminLogin />
      </section>
    );
  }

  let submissions: typeof intakeSubmissions.$inferSelect[] = [];
  let subs: typeof subscribers.$inferSelect[] = [];
  let counts = { total: 0, received: 0, other: 0, subs: 0 };
  let dbError: string | null = null;

  try {
    const [rows, subRows, agg] = await Promise.all([
      db
        .select()
        .from(intakeSubmissions)
        .orderBy(desc(intakeSubmissions.createdAt))
        .limit(200),
      db
        .select()
        .from(subscribers)
        .orderBy(desc(subscribers.createdAt))
        .limit(200),
      db
        .select({
          total: sql<number>`count(*)`,
          received: sql<number>`count(*) filter (where ${intakeSubmissions.status} = 'received')`,
        })
        .from(intakeSubmissions),
    ]);
    submissions = rows;
    subs = subRows;
    counts = {
      total: Number(agg[0]?.total ?? 0),
      received: Number(agg[0]?.received ?? 0),
      other: Number(agg[0]?.total ?? 0) - Number(agg[0]?.received ?? 0),
      subs: subs.length,
    };
  } catch (err) {
    dbError = (err as Error).message || "Database query failed.";
  }

  return (
    <section className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Admin dashboard</h1>
          <p className="text-sm text-ink-500">
            Onboarding submissions and signups captured from the site.
          </p>
        </div>
        <AdminLogout />
      </div>

      {dbError && (
        <div className="card mt-6 border-rose-200 bg-rose-50 text-rose-700">
          <p className="font-medium">Database error</p>
          <p className="mt-1 text-sm">{dbError}</p>
          <p className="mt-2 text-sm">
            Check that <code>DATABASE_URL</code> is set and migrations have been
            pushed (<code>npm run db:push</code>).
          </p>
        </div>
      )}

      {!dbError && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="card">
              <div className="text-2xl font-bold text-ink-900">
                {counts.total}
              </div>
              <div className="text-sm text-ink-500">Submissions</div>
            </div>
            <div className="card">
              <div className="text-2xl font-bold text-ink-900">
                {counts.received}
              </div>
              <div className="text-sm text-ink-500">Awaiting automation</div>
            </div>
            <div className="card">
              <div className="text-2xl font-bold text-ink-900">
                {counts.other}
              </div>
              <div className="text-sm text-ink-500">In progress / done</div>
            </div>
            <div className="card">
              <div className="text-2xl font-bold text-ink-900">
                {counts.subs}
              </div>
              <div className="text-sm text-ink-500">Email signups</div>
            </div>
          </div>

          <h2 className="mt-10 text-lg font-semibold text-ink-900">
            Intake submissions
          </h2>
          <div className="card mt-4 overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink-300/15 text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Received</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-ink-300">
                      No submissions yet.
                    </td>
                  </tr>
                )}
                {submissions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-ink-300/10 align-top last:border-0"
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-ink-500">
                      {fmt(s.createdAt)}
                    </td>
                    <td className="px-5 py-3 font-medium text-ink-900">
                      {s.company}
                      <div className="mt-1 max-w-xs text-xs text-ink-500">
                        {s.responses?.goals?.slice(0, 80) || ""}
                        {s.responses?.goals && s.responses.goals.length > 80
                          ? "…"
                          : ""}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-700">{s.contactName}</td>
                    <td className="px-5 py-3 text-ink-700">{s.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                          statusColors[s.status] ||
                          "bg-ink-300/20 text-ink-700 ring-ink-300/30"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-lg font-semibold text-ink-900">
            Email signups
          </h2>
          <div className="card mt-4 overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink-300/15 text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {subs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-ink-300">
                      No signups yet.
                    </td>
                  </tr>
                )}
                {subs.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-ink-300/10 last:border-0"
                  >
                    <td className="px-5 py-3 text-ink-700">{sub.email}</td>
                    <td className="px-5 py-3 text-ink-500">{sub.source}</td>
                    <td className="px-5 py-3 text-ink-500">
                      {fmt(sub.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
