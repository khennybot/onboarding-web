"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMsg(data.error || "Login failed.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-sm">
      <div className="card">
        <h1 className="text-xl font-semibold text-ink-900">Admin sign-in</h1>
        <p className="mt-1 text-sm text-ink-500">
          Enter the admin password to view submissions.
        </p>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="pw">Password</label>
            <input
              id="pw"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {msg && <p className="text-sm text-rose-600">{msg}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-full disabled:opacity-60"
          >
            {status === "loading" ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
