import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Onboardly";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-300/15 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            ◆
          </span>
          {siteName}
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-700 md:flex">
          <a href="/#how" className="hover:text-brand-700">How it works</a>
          <a href="/#features" className="hover:text-brand-700">Features</a>
          <Link href="/onboard" className="hover:text-brand-700">Start onboarding</Link>
          <Link href="/demo" className="hover:text-brand-700">Book a demo</Link>
          <Link href="/admin" className="hover:text-brand-700">Admin</Link>
        </nav>

        <Link href="/onboard" className="btn-primary hidden md:inline-flex">
          Get started
        </Link>
      </div>
    </header>
  );
}
