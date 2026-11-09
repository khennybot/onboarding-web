import Link from "next/link";
import { SubscribeForm } from "@/components/SubscribeForm";

const features = [
  {
    title: "Capture the brief",
    body: "A guided intake form collects goals, audience, scope and timeline — validated and de-duplicated so you never process the same lead twice.",
    icon: "📝",
  },
  {
    title: "Auto welcome + kickoff",
    body: "The moment a brief lands, the client gets a personalised welcome and a calendar link — no manual hand-off, no delay.",
    icon: "👋",
  },
  {
    title: "Documents, collected",
    body: "A dedicated folder and a Google Doc brief are created per client, with reminders until everything is in.",
    icon: "📁",
  },
  {
    title: "Progress you can see",
    body: "Every project moves through a clear status trail. The watchdog spots anything stuck and alerts the owner.",
    icon: "📊",
  },
  {
    title: "Stuck-detection watchdog",
    body: "A scheduler checks for stalled onboardings and surfaces exactly what needs a human — with a cooldown so you're not spammed.",
    icon: "🐕",
  },
  {
    title: "One-click repair console",
    body: "Replay a flow, reset a welcome email, rebuild a folder or mark a project failed — all from a single webhook console.",
    icon: "🛠️",
  },
];

const steps = [
  {
    n: "1",
    title: "Client submits intake",
    body: "The web form posts to the intake API, which stores the brief and forwards it to the n8n automation.",
    tag: "Web → API → Postgres",
  },
  {
    n: "2",
    title: "Welcome + kickoff (W1)",
    body: "n8n sends a branded welcome email with a Calendly link and the agreed kickoff window.",
    tag: "Workflow W1",
  },
  {
    n: "3",
    title: "Brief + folder (W2)",
    body: "A Google Doc brief and Drive folder are created, matched to the project, and the owner is notified.",
    tag: "Workflow W2",
  },
  {
    n: "4",
    title: "Watchdog + repair (W4/W5)",
    body: "The scheduler watches for stalled projects; the repair console fixes them without re-running everything.",
    tag: "Workflows W4/W5",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50 to-transparent" />
        <div className="container-page relative py-20 sm:py-28">
          <span className="chip">Client onboarding, automated</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink-900 sm:text-6xl">
            Every new client starts{" "}
            <span className="text-brand-600">on time</span> and{" "}
            <span className="text-brand-600">on the same page</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-500">
            A done-for-you onboarding automation that captures the brief, sends
            the welcome, schedules the kickoff, collects documents and tracks
            progress — wired end to end so nothing slips through.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/onboard" className="btn-primary">
              Start onboarding
            </Link>
            <Link href="/demo" className="btn-ghost">
              Book a demo
            </Link>
          </div>
          <p className="mt-4 text-sm text-ink-300">
            6 automated workflows · idempotent by design · built on n8n + this site
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-6">
        <div className="card grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            ["6", "automated workflows"],
            ["100%", "briefs captured"],
            ["0", "missed kickoffs"],
            ["< 2 min", "to submit a brief"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {v}
              </div>
              <div className="text-sm text-ink-500">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container-page py-20">
        <h2 className="text-3xl font-bold tracking-tight text-ink-900">
          Everything the hand-off used to miss
        </h2>
        <p className="mt-3 max-w-2xl text-ink-500">
          The automation handles the repetitive, easy-to-drop steps so your team
          only steps in for the work that needs them.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white py-20">
        <div className="container-page">
          <h2 className="text-3xl font-bold tracking-tight text-ink-900">
            How it works
          </h2>
          <p className="mt-3 max-w-2xl text-ink-500">
            This site is the front door; the n8n workflows are the engine.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {steps.map((s) => (
              <div key={s.n} className="card flex gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white font-semibold">
                  {s.n}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink-900">{s.title}</h3>
                    <span className="chip">{s.tag}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink-500">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="container-page py-16">
        <div className="card bg-brand-600 text-white">
          <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Get onboarding tips in your inbox
              </h2>
              <p className="mt-2 text-brand-100">
                Occasional notes on running smoother client onboarding. No spam.
              </p>
            </div>
            <div className="text-ink-900">
              <SubscribeForm />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page pb-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink-900">
            Ready to onboard on autopilot?
          </h2>
          <p className="mt-3 text-ink-500">
            Submit a client brief in under two minutes.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link href="/onboard" className="btn-primary">
              Start onboarding
            </Link>
            <Link href="/demo" className="btn-ghost">
              Book a demo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
