# Onboardly — frontend for the client onboarding automation

A Next.js site that is the public front door for the
[`client-onboarding-automation`](../client-onboarding-automation) n8n workflows:

- **Landing page** explaining the automation and how it works.
- **Client intake form** (`/onboard`) — a guided, two-step brief that stores the
  submission in Postgres and can forward it to the n8n intake webhook.
- **Book-a-demo / email capture** (`/demo`) — stores signups.
- **Admin dashboard** (`/admin`) — password-protected view of submissions and
  signups, backed by the database.

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Vercel Postgres** (or any Postgres) via **Drizzle ORM** + `postgres-js`
- **Zod** for input validation
- Deploys to **Vercel** from a **GitHub** repo

## Local development

```bash
npm install

# 1. Provide a database connection (any Postgres). Example with a local one:
#    DATABASE_URL=postgres://postgres:postgres@localhost:5432/onboardly
cp .env.example .env        # then fill in DATABASE_URL and ADMIN_PASSWORD

# 2. Create the tables
npm run db:push

# 3. Run
npm run dev                 # http://localhost:3000
```

The app runs fine without a DB for everything except the actual writes — the
admin page shows a clear "Database error" card if `DATABASE_URL` is missing.

## Database

Two tables (see `lib/schema.ts`):

| Table | Purpose |
|---|---|
| `intake_submissions` | Client onboarding briefs (company, contact, email, `responses` jsonb, `status`, `idempotency_key` unique) |
| `subscribers` | Email signups from the landing/demo forms |

`npm run db:push` creates them. `drizzle-kit` reads `DATABASE_URL`
(or `POSTGRES_URL`). The schema is compatible with Vercel Postgres, Neon and
Supabase.

## API

| Method | Route | Body | Result |
|---|---|---|---|
| `POST` | `/api/intake` | `{ company, contactName, email, responses{goals,audience,scope,timeline,budget?,notes?}, idempotencyKey? }` | Stores the brief (idempotent by `idempotency_key`); if `N8N_INTAKE_WEBHOOK_URL` is set, forwards to the n8n automation |
| `POST` | `/api/subscribe` | `{ email, source? }` | Stores an email signup (idempotent by email) |
| `POST` | `/api/admin/login` | `{ password }` | Sets the admin session cookie |
| `POST` | `/api/admin/logout` | — | Clears the admin session cookie |

## Environment variables

| Var | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes (prod) | Postgres connection string. Vercel Postgres also exposes `POSTGRES_URL` as a fallback. |
| `ADMIN_PASSWORD` | yes | Password for `/admin`. Set a strong value in production. |
| `ADMIN_SESSION_SALT` | no | Hardens the admin session cookie. |
| `N8N_INTAKE_WEBHOOK_URL` | no | If set, intake is forwarded to the n8n W2 intake processor. |
| `NEXT_PUBLIC_SITE_NAME` | no | Brand name (default "Onboardly"). |
| `NEXT_PUBLIC_SITE_URL` | no | Public URL, for metadata. |

## Deploy to Vercel + GitHub

1. **Push to GitHub**

   ```bash
   git init            # if not already a repo
   git add web
   git commit -m "Add Onboardly frontend"
   gh repo create onboardly-web --private   # or create in the GitHub UI
   git push -u origin main
   ```

2. **Import into Vercel** — connect the GitHub repo, set the framework to
   Next.js, and set the **root directory** to `web`.

3. **Add the database** — in the Vercel project, add the **Postgres** storage
   (or create Neon/Supabase and paste the connection string). Vercel Postgres
   auto-injects `POSTGRES_URL`; the app also reads `DATABASE_URL`, so add a
   `DATABASE_URL` env var equal to the Postgres URL if you use a different
   provider.

4. **Set env vars** in Vercel: `ADMIN_PASSWORD` (and optionally
   `N8N_INTAKE_WEBHOOK_URL`, `ADMIN_SESSION_SALT`, `NEXT_PUBLIC_SITE_NAME`).

5. **Run migrations** once: either `vercel env pull` then `npm run db:push`
   locally, or run `npm run db:push` in the Vercel Shell / CI with the env
   loaded.

6. **Deploy.** Vercel builds `web` and serves it. Visit the URL, submit a brief
   at `/onboard`, then open `/admin` with your `ADMIN_PASSWORD`.

## Notes / limitations

- Admin auth is a single shared password + signed cookie — fine for a small
  team. For multi-user access, add the WorkBuddy Cloud Auth module or a proper
  auth provider.
- The site does not send emails itself; client confirmation emails are handled
  by the n8n automation (Gmail) when the webhook forward is enabled.
