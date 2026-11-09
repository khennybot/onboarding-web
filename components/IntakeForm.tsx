"use client";

import { useState } from "react";

type Step = 1 | 2;

const empty = {
  company: "",
  contactName: "",
  email: "",
  goals: "",
  audience: "",
  scope: "",
  timeline: "",
  budget: "",
  notes: "",
};

export function IntakeForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({ ...empty });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState("");

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function next(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company || !form.contactName || !form.email) {
      setMsg("Please fill in company, your name and email.");
      setStatus("error");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setMsg("Please enter a valid email.");
      setStatus("error");
      return;
    }
    setMsg("");
    setStatus("idle");
    setStep(2);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.goals || !form.audience || !form.scope || !form.timeline) {
      setMsg("Please answer all four required questions.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company,
          contactName: form.contactName,
          email: form.email,
          responses: {
            goals: form.goals,
            audience: form.audience,
            scope: form.scope,
            timeline: form.timeline,
            budget: form.budget,
            notes: form.notes,
          },
          source: "web",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
      } else {
        setStatus("error");
        setMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  if (status === "ok") {
    return (
      <div className="card text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-2xl">
          ✓
        </div>
        <h2 className="mt-4 text-xl font-semibold text-ink-900">
          Brief received
        </h2>
        <p className="mt-2 text-ink-500">
          Thanks, {form.contactName || "there"}. Your onboarding brief for{" "}
          <span className="font-medium">{form.company}</span> is in. The
          automation will send the welcome and kickoff link shortly.
        </p>
        <button
          className="btn-ghost mt-6"
          onClick={() => {
            setForm({ ...empty });
            setStep(1);
            setStatus("idle");
            setMsg("");
          }}
        >
          Submit another brief
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-6 flex items-center gap-2 text-sm text-ink-500">
        <span
          className={`grid h-7 w-7 place-items-center rounded-full ${
            step >= 1 ? "bg-brand-600 text-white" : "bg-ink-300/30"
          }`}
        >
          1
        </span>
        <span className={step >= 1 ? "text-ink-900" : ""}>About you</span>
        <span className="text-ink-300">→</span>
        <span
          className={`grid h-7 w-7 place-items-center rounded-full ${
            step >= 2 ? "bg-brand-600 text-white" : "bg-ink-300/30"
          }`}
        >
          2
        </span>
        <span className={step >= 2 ? "text-ink-900" : ""}>The brief</span>
      </div>

      {step === 1 && (
        <form onSubmit={next} className="space-y-5">
          <div>
            <label className="label" htmlFor="company">Company</label>
            <input
              id="company"
              className="input"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              placeholder="Acme Inc."
            />
          </div>
          <div>
            <label className="label" htmlFor="contactName">Your name</label>
            <input
              id="contactName"
              className="input"
              value={form.contactName}
              onChange={(e) => set("contactName", e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="label" htmlFor="email">Work email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="jane@acme.com"
            />
          </div>
          {msg && <p className="text-sm text-rose-600">{msg}</p>}
          <button type="submit" className="btn-primary w-full">
            Continue
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="label" htmlFor="goals">What are the goals? *</label>
            <textarea
              id="goals"
              className="input min-h-[90px]"
              value={form.goals}
              onChange={(e) => set("goals", e.target.value)}
              placeholder="What does success look like for this engagement?"
            />
          </div>
          <div>
            <label className="label" htmlFor="audience">Who is the audience? *</label>
            <textarea
              id="audience"
              className="input min-h-[90px]"
              value={form.audience}
              onChange={(e) => set("audience", e.target.value)}
              placeholder="End users, internal teams, customers…"
            />
          </div>
          <div>
            <label className="label" htmlFor="scope">What&apos;s in scope? *</label>
            <textarea
              id="scope"
              className="input min-h-[90px]"
              value={form.scope}
              onChange={(e) => set("scope", e.target.value)}
              placeholder="Deliverables, boundaries, must-haves."
            />
          </div>
          <div>
            <label className="label" htmlFor="timeline">What&apos;s the timeline? *</label>
            <textarea
              id="timeline"
              className="input min-h-[70px]"
              value={form.timeline}
              onChange={(e) => set("timeline", e.target.value)}
              placeholder="Target start, key dates, hard deadlines."
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="budget">Budget range</label>
              <input
                id="budget"
                className="input"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
                placeholder="e.g. £5k–£10k"
              />
            </div>
            <div>
              <label className="label" htmlFor="notes">Anything else?</label>
              <input
                id="notes"
                className="input"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Links, context, preferences"
              />
            </div>
          </div>
          {msg && <p className="text-sm text-rose-600">{msg}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setStep(1);
                setMsg("");
                setStatus("idle");
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary flex-1 disabled:opacity-60"
            >
              {status === "loading" ? "Submitting…" : "Submit brief"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
