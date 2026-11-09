import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Onboardly";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-300/15 bg-white">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-semibold text-ink-900">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white">
              ◆
            </span>
            {siteName}
          </div>
          <p className="mt-2 max-w-sm text-sm text-ink-500">
            Client onboarding, automated end to end — so every new project starts
            on time and on the same page.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-500">
          <a href="/#how" className="hover:text-brand-700">How it works</a>
          <Link href="/onboard" className="hover:text-brand-700">Start onboarding</Link>
          <Link href="/demo" className="hover:text-brand-700">Book a demo</Link>
          <Link href="/admin" className="hover:text-brand-700">Admin</Link>
        </div>
      </div>
      <div className="border-t border-ink-300/10 py-5 text-center text-xs text-ink-300">
        © {new Date().getFullYear()} {siteName}. Built with Next.js + Vercel Postgres.
      </div>
    </footer>
  );
}
