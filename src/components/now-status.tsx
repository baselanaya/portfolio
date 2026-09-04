"use client";

import { useEffect, useState } from "react";

interface SiteStatus {
  status: string;
  label: string;
  available: boolean;
}

// The live status feed — reads /status.json, the same source the nav badge uses.
export default function NowStatus() {
  const [status, setStatus] = useState<SiteStatus | null>(null);

  useEffect(() => {
    fetch("/status.json")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => null);
  }, []);

  return (
    <div className="theme-dark scanlines relative overflow-hidden rounded-2xl border border-[#2A2820] p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: status?.available ? "var(--color-live)" : "var(--color-terminal-muted)" }}
          aria-hidden="true"
        />
        <span
          className="font-mono"
          style={{ fontSize: "10px", color: "var(--color-terminal-muted)", letterSpacing: "0.18em" }}
        >
          {status ? "STATUS · LIVE" : "STATUS · OFFLINE"}
        </span>
      </div>
      <p className="font-display font-medium tracking-tight" style={{ fontSize: "20px" }}>
        {status?.label ?? "Reconnecting…"}
      </p>
      {status && (
        <p
          className="font-mono mt-2"
          style={{ fontSize: "11px", color: "var(--color-terminal-muted)", letterSpacing: "0.08em" }}
        >
          availability: {status.available ? "open to contracts" : "booked"}
        </p>
      )}
    </div>
  );
}
