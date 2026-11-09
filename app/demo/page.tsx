import type { Metadata } from "next";
import { SubscribeForm } from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "See the client onboarding automation run on your own brief. Leave your email and we'll reach out to schedule.",
};

export default function DemoPage() {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <span className="chip">Demo</span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-900">
          Book a demo
        </h1>
        <p className="mt-3 text-ink-500">
          Want to watch the automation handle a real brief? Leave your email and
          we&apos;ll schedule a walkthrough — or just submit a client brief from the{" "}
          <a href="/onboard" className="text-brand-700 underline">
            onboarding page
          </a>
          .
        </p>
        <div className="card mt-8">
          <SubscribeForm
            source="demo"
            ctaLabel="Request demo"
            loadingLabel="Sending…"
            okMessage="Thanks — we'll be in touch to schedule."
            placeholder="you@company.com"
          />
        </div>
        <p className="mt-5 text-center text-xs text-ink-300">
          We&apos;ll only use this to arrange your demo. No lists, no spam.
        </p>
      </div>
    </section>
  );
}
