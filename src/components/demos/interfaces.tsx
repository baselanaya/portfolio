"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Interface previews — miniature, animated versions of each tool's real UI.
// Cynosure keeps its TUI dashboard preview. The other projects explain their
// mechanics through animated mechanism diagrams in flows.tsx instead.
// Shared grammar: a ToolHeader (tool name + status) over the working surface.
// All motion collapses under prefers-reduced-motion.

export const DARK_BG = "#0A0906";
export const DARK_PANEL = "#12110D";
export const DARK_LINE = "#2A2820";

export function StatusPill({ children, tone = "ok", dark = false, pulse = false }: { children: React.ReactNode; tone?: "ok" | "warn" | "muted"; dark?: boolean; pulse?: boolean }) {
  const palette = dark
    ? { ok: "var(--color-live)", warn: "#EAB308", muted: "var(--color-terminal-muted)" }
    : { ok: "var(--color-live)", warn: "#B45309", muted: "var(--color-muted)" };
  const color = palette[tone];
  return (
    <span
      className="font-mono inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 shrink-0 whitespace-nowrap"
      style={{ fontSize: "8.5px", letterSpacing: "0.08em", color, border: `1px solid ${color}` }}
    >
      <span
        className={`w-1 h-1 rounded-full shrink-0${pulse ? " fx-dot" : ""}`}
        style={{ backgroundColor: color }}
      />
      {children}
    </span>
  );
}

export function ToolHeader({
  name, pill, pillTone = "ok", dark = false, pulse = false,
}: {
  name: string;
  pill: string;
  pillTone?: "ok" | "warn" | "muted";
  dark?: boolean;
  pulse?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-2.5 border-b"
      style={{
        borderColor: dark ? DARK_LINE : "var(--color-border)",
        backgroundColor: dark ? DARK_PANEL : "var(--color-surface-2)",
      }}
    >
      <span
        className="font-mono truncate"
        style={{ fontSize: "10px", letterSpacing: "0.12em", color: dark ? "var(--color-terminal-fg)" : "var(--color-text)" }}
      >
        {name}
      </span>
      <StatusPill dark={dark} tone={pillTone} pulse={pulse}>{pill}</StatusPill>
    </div>
  );
}

/* ── CYNOSURE — TUI dashboard (dark): stats, sparkline, positions, log ───── */
export function CynosureInterface() {
  const reduce = useReducedMotion();
  const [spot, setSpot] = useState<number[]>(() =>
    Array.from({ length: 34 }, (_, i) => 6432 + Math.sin(i * 0.5) * 22)
  );
  const [equity, setEquity] = useState(100.0);
  const [row, setRow] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setSpot((s) => [...s.slice(1), Math.max(6300, Math.min(6560, s[s.length - 1] + (Math.random() - 0.47) * 26))]);
      setEquity((e) => Math.max(96, Math.min(108, e + (Math.random() - 0.45) * 0.25)));
      setRow((r) => (r + 1) % 3);
    }, 1200);
    return () => clearInterval(id);
  }, [reduce]);

  const min = Math.min(...spot);
  const max = Math.max(...spot);
  const pts = spot
    .map((p, i) => `${(i / (spot.length - 1)) * 100},${28 - ((p - min) / (max - min || 1)) * 24}`)
    .join(" ");

  const rows = [
    ["BTC/USDT:PERP", "LONG 0.12", row === 0 ? "synthesizing…" : "dev-adv: PROCEED", "trailing 2.5%"],
    ["XAU/USDT:PERP", "FLAT", row === 1 ? "synthesizing…" : "risk: corr ≥ 0.85", "watchlist"],
    ["AAPL/USDT:PERP", "FLAT", row === 2 ? "synthesizing…" : "persistence: streak 1", "watchlist"],
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: DARK_BG, color: "var(--color-terminal-fg)" }}>
      <ToolHeader name="cynosure · 15m cycle · paper mode" pill="risk gates pass" dark />
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-3" style={{ backgroundColor: DARK_LINE }}>
          {[
            ["SPOT", `$${spot[spot.length - 1].toLocaleString("en-US", { minimumFractionDigits: 1 })}`],
            ["TIMESFM 2.5", "dir ±0.30%"],
            ["RISK GATES", "all pass"],
            ["EQUITY", `${equity.toFixed(1)}%`],
          ].map(([k, v]) => (
            <div key={k} className="p-3" style={{ backgroundColor: DARK_PANEL }}>
              <p className="font-mono" style={{ fontSize: "8.5px", color: "var(--color-terminal-muted)", letterSpacing: "0.12em" }}>{k}</p>
              <p
                className="font-mono tabular-nums transition-colors duration-300"
                style={{ fontSize: "12px", color: k === "EQUITY" ? (equity >= 100 ? "var(--color-live)" : "#DC2626") : "var(--color-terminal-fg)", marginTop: 2 }}
              >
                {v}
              </p>
            </div>
          ))}
        </div>
        <div className="px-1 pb-1">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: 48 }}>
            <polyline
              points={pts}
              fill="none"
              stroke="var(--color-live)"
              strokeWidth="0.9"
              vectorEffect="non-scaling-stroke"
              style={{ transition: "all 1.1s linear" }}
            />
            {!reduce && (
              <circle
                cx="100" cy={String(28 - ((spot[spot.length - 1] - min) / (max - min || 1)) * 24)}
                r="1.2" fill="var(--color-live)"
                style={{ transition: "all 1.1s linear" }}
              />
            )}
          </svg>
        </div>
        <div className="font-mono p-4 pt-1" style={{ fontSize: "11px", lineHeight: 1.9 }}>
          <p style={{ color: "var(--color-terminal-muted)" }}>─ open positions ────────────────────────────</p>
          {rows.map(([mkt, pos, gate, stop]) => (
            <div key={mkt} className="flex flex-wrap gap-x-4">
              <span style={{ color: "var(--color-terminal-fg)", minWidth: 130 }}>{mkt}</span>
              <span style={{ color: pos.startsWith("LONG") ? "var(--color-live)" : "var(--color-terminal-muted)", minWidth: 80 }}>{pos}</span>
              <span style={{ color: gate === "synthesizing…" ? "var(--color-signal)" : "var(--color-terminal-muted)" }}>{gate}</span>
              <span style={{ color: "var(--color-terminal-muted)" }}>{stop}</span>
            </div>
          ))}
          <p className="mt-2" style={{ color: "var(--color-terminal-muted)" }}>─ cycle log ───────────────────────────────</p>
          <div style={{ color: "var(--color-terminal-fg)" }}>05-brief: ema9&gt;ema20 · rsi 54 · ofi + · funding 0.01%</div>
          <div style={{ color: "var(--color-terminal-fg)" }}>05-synth: qwen3.5:4b /nothink · temp 0.1 · 5-8s</div>
          <div style={{ color: "var(--color-live)" }}>05-risk: EV gate ✓ · half-kelly 0.12 · streak ok</div>
        </div>
      </div>
    </div>
  );
}
