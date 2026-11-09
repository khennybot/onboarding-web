"use client";

import { useState } from "react";

export function SubscribeForm({
  source = "landing",
  ctaLabel = "Get updates",
  loadingLabel = "Joining…",
  okMessage = "Thanks — you're on the list.",
  placeholder = "you@company.com",
}: {
  source?: string;
  ctaLabel?: string;
  loadingLabel?: string;
  okMessage?: string;
  placeholder?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
        setMsg(okMessage);
        setEmail("");
      } else {
        setStatus("error");
        setMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="input flex-1"
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary disabled:opacity-60"
      >
        {status === "loading" ? loadingLabel : ctaLabel}
      </button>
      {msg && (
        <p
          className={`text-sm ${
            status === "ok" ? "text-emerald-600" : "text-rose-600"
          }`}
          role="status"
        >
          {msg}
        </p>
      )}
    </form>
  );
}
