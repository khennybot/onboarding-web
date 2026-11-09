"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogout() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.refresh();
  }

  return (
    <button onClick={onClick} disabled={busy} className="btn-ghost text-sm">
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
