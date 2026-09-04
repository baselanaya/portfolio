"use client";

import { useEffect, useState } from "react";

// HTML interface mockups — each renders the tool's actual UI in miniature,
// built from its README. Client component: Cynosure's dashboard ticks live.

function Chrome({ title, children, dark = false }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className="rounded-xl overflow-hidden border shadow-[0_18px_40px_-24px_rgba(22,21,15,0.35)]"
      style={{
        borderColor: dark ? "#2A2820" : "var(--color-border)",
        backgroundColor: dark ? "#12110D" : "#FFFFFF",
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{
          borderColor: dark ? "#2A2820" : "var(--color-border)",
          backgroundColor: dark ? "#1B1A14" : "var(--color-surface-2)",
        }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#DC2626" }} />
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-signal)" }} />
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-live)" }} />
        <span
          className="font-mono ml-2 truncate"
          style={{ fontSize: "9px", color: dark ? "var(--color-terminal-muted)" : "var(--color-muted)", letterSpacing: "0.1em" }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function StatusPill({ children, tone = "ok" }: { children: React.ReactNode; tone?: "ok" | "warn" | "muted" }) {
  const color = tone === "ok" ? "var(--color-live)" : tone === "warn" ? "#EAB308" : "var(--color-muted)";
  return (
    <span
      className="font-mono inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5"
      style={{ fontSize: "8.5px", letterSpacing: "0.08em", color, borderColor: color }}
    >
      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}

/* ── KERNEX — CLI: kernex run / JIT interception prompt ──────────────────── */
export function KernexInterface() {
  return (
    <Chrome title="kernex — single static binary · 15MB RAM · <2ms boot" dark>
      <div className="font-mono p-4 sm:p-5" style={{ fontSize: "11.5px", lineHeight: 1.9 }}>
        <div style={{ color: "var(--color-terminal-muted)" }}>
          <span style={{ color: "var(--color-signal)" }}>$</span> kernex run -- python agent.py
        </div>
        <div style={{ color: "var(--color-live)" }}>✓ landlock v3 ruleset installed · seccomp BPF attached</div>
        <div style={{ color: "var(--color-live)" }}>✓ policy kernex.yaml · 3 fs paths · 1 net endpoint</div>
        <div style={{ color: "var(--color-terminal-muted)", marginTop: 8 }}>─ agent output ─────────────────────────</div>
        <div style={{ color: "var(--color-terminal-fg)" }}>agent: reading ./data/q3.csv…</div>
        <div style={{ color: "var(--color-terminal-fg)" }}>agent: POST https://telemetry.vendor.io/v1 …</div>
        <div
          className="mt-3 rounded-xl border p-3.5"
          style={{ borderColor: "#EAB308", backgroundColor: "rgba(234,179,8,0.07)", boxShadow: "0 8px 24px -12px rgba(234,179,8,0.35)" }}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span style={{ color: "#EAB308", fontWeight: 600 }}>⏸ JIT INTERCEPTION — connect(2) blocked</span>
            <StatusPill tone="warn">agent paused</StatusPill>
          </div>
          <div className="mt-1.5" style={{ color: "var(--color-terminal-muted)" }}>
            telemetry.vendor.io:443 is not in <span style={{ color: "var(--color-terminal-fg)" }}>network.allow_outbound</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["[a] allow once", "[d] deny", "[y] add to kernex.yaml"].map((label, i) => (
              <span
                key={label}
                className="rounded-lg px-2.5 py-1 border transition-transform duration-150 hover:-translate-y-px cursor-pointer"
                style={{
                  borderColor: i === 0 ? "var(--color-live)" : i === 1 ? "#DC2626" : "var(--color-terminal-muted)",
                  color: i === 0 ? "var(--color-live)" : i === 1 ? "#DC2626" : "var(--color-terminal-muted)",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* ── MERCER — React chat UI: stage timeline + SQL card ───────────────────── */
export function MercerInterface() {
  const stages = [
    ["entity retrieval", "BM25 + LSH · sampled values"],
    ["schema linking", "CHESS 3-step · FK graph"],
    ["decomposition", "CoT subproblems"],
    ["candidate gen", "temps 0.0 / 0.2 / 0.3"],
    ["execute + select", "EXPLAIN pre-flight · read-only"],
    ["taxonomy correction", "schema/join/filter/logic"],
  ];
  return (
    <Chrome title="mercer · app/ui — Vite + React chat :5173 → :8000">
      <div className="grid grid-cols-1 sm:grid-cols-5">
        <div className="sm:col-span-3 p-4 flex flex-col gap-3 border-b sm:border-b-0 sm:border-r" style={{ borderColor: "var(--color-border)" }}>
          <div
            className="self-end rounded-2xl rounded-br-sm px-3.5 py-2 transition-transform duration-200 hover:-translate-y-0.5"
            style={{ fontSize: "12px", background: "var(--gradient-brand)", color: "#fff", maxWidth: "85%", cursor: "default" }}
          >
            top customers by spend this quarter?
          </div>
          <div
            className="self-start rounded-2xl rounded-bl-sm px-3.5 py-2 border"
            style={{ fontSize: "11px", borderColor: "var(--color-border)", color: "var(--color-muted)", maxWidth: "92%" }}
          >
            Arctic-Text2SQL-R1-7B · llama.cpp TurboQuant (IQ4_XS + q8_0 KV · ~5.4GB)
          </div>
          <pre
            className="self-start rounded-xl font-mono p-3.5 overflow-x-auto"
            style={{ fontSize: "10.5px", lineHeight: 1.7, backgroundColor: "var(--color-terminal)", color: "var(--color-terminal-fg)", maxWidth: "100%" }}
          >
{`SELECT c.cust_nm, SUM(o.total_amt)
FROM   cust_seg_cd c
JOIN   ord_hdr o ON o.cust_id = c.cust_id
WHERE  o.ord_dt >= DATE '2026-04-01'
GROUP  BY 1 ORDER BY 2 DESC LIMIT 5;`}
          </pre>
          <span className="font-mono self-start" style={{ fontSize: "9.5px", color: "var(--color-live)" }}>
            ✓ single SELECT · sqlglot-validated · 12.7s total
          </span>
        </div>
        <div className="sm:col-span-2 p-4" style={{ backgroundColor: "var(--color-surface-2)" }}>
          <p className="font-mono mb-3" style={{ fontSize: "9px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>
            6-STAGE PIPELINE
          </p>
          {stages.map(([name, note], i) => (
            <div key={name} className="flex items-start gap-2 mb-2.5">
              <span
                className="font-mono shrink-0 rounded-full flex items-center justify-center"
                style={{ width: 16, height: 16, fontSize: "9px", backgroundColor: "var(--color-live)", color: "#fff", marginTop: 2 }}
              >
                ✓
              </span>
              <div>
                <p className="font-mono" style={{ fontSize: "10.5px", color: "var(--color-text)" }}>
                  {i + 1}. {name}
                </p>
                <p className="font-mono" style={{ fontSize: "9px", color: "var(--color-muted)" }}>
                  {note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

/* ── CYNOSURE — TUI dashboard: brief, forecast, risk gates (live) ────────── */
export function CynosureInterface() {
  const [spot, setSpot] = useState(6432.1);
  const [equity, setEquity] = useState(100.0);
  const [row, setRow] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSpot((s) => Math.max(1000, s + (Math.random() - 0.48) * 14));
      setEquity((e) => Math.max(80, Math.min(120, e + (Math.random() - 0.45) * 0.3)));
      setRow((r) => (r + 1) % 3);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const rows = [
    ["BTC/USDT:PERP", "LONG 0.12", row === 0 ? "synthesizing…" : "dev-adv: PROCEED", "trailing 2.5%"],
    ["XAU/USDT:PERP", "FLAT", row === 1 ? "synthesizing…" : "risk: corr ≥ 0.85", "—"],
    ["AAPL/USDT:PERP", "FLAT", row === 2 ? "synthesizing…" : "persistence: streak 1", "watchlist"],
  ];

  return (
    <Chrome title="cynosure — 15m cycle · paper mode · qwen3.5:4b synthesizer" dark>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ backgroundColor: "#2A2820" }}>
        {[
          ["SPOT", spot.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })],
          ["TIMESFM 2.5", "dir ±0.30%"],
          ["RISK GATES", "all pass"],
          ["EQUITY", `${equity.toFixed(1)}%`],
        ].map(([k, v]) => (
          <div key={k} className="p-3" style={{ backgroundColor: "#12110D" }}>
            <p className="font-mono" style={{ fontSize: "8.5px", color: "var(--color-terminal-muted)", letterSpacing: "0.12em" }}>{k}</p>
            <p className="font-mono tabular-nums" style={{ fontSize: "12px", color: k === "EQUITY" ? (equity >= 100 ? "var(--color-live)" : "#DC2626") : "var(--color-terminal-fg)", marginTop: 2 }}>
              {v}
            </p>
          </div>
        ))}
      </div>
      <div className="font-mono p-4" style={{ fontSize: "11px", lineHeight: 1.9 }}>
        <p style={{ color: "var(--color-terminal-muted)" }}>─ open positions ────────────────────────────</p>
        {rows.map(([mkt, pos, gate, stop]) => (
          <div key={mkt} className="flex flex-wrap gap-x-4">
            <span style={{ color: "var(--color-terminal-fg)", minWidth: 130 }}>{mkt}</span>
            <span style={{ color: pos.startsWith("LONG") ? "var(--color-live)" : "var(--color-terminal-muted)", minWidth: 80 }}>{pos}</span>
            <span style={{ color: "var(--color-terminal-muted)" }}>{gate}</span>
            <span style={{ color: "var(--color-terminal-muted)" }}>{stop}</span>
          </div>
        ))}
        <p className="mt-2" style={{ color: "var(--color-terminal-muted)" }}>─ cycle log ───────────────────────────────</p>
        <div style={{ color: "var(--color-terminal-fg)" }}>05-brief: ema9&gt;ema20 · rsi 54 · ofi + · funding 0.01%</div>
        <div style={{ color: "var(--color-terminal-fg)" }}>05-synth: qwen3.5:4b /nothink · temp 0.1 · 5-8s</div>
        <div style={{ color: "var(--color-live)" }}>05-risk: EV gate ✓ · half-kelly 0.12 · streak ok</div>
      </div>
    </Chrome>
  );
}

/* ── MEDFORMER — Gradio app: image, question, grounded answer ─────────────── */
export function MedFormerInterface() {
  return (
    <Chrome title="MedFormer_UI.ipynb — gradio · idefics2-ft + llama-3-ft + rag">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4">
        <div className="sm:col-span-2 flex flex-col gap-3">
          <div
            className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-5 transition-colors duration-200 hover:border-[var(--color-signal)]"
            style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
          >
            <span style={{ fontSize: "22px" }}>🩻</span>
            <span className="font-mono mt-2 text-center" style={{ fontSize: "9.5px" }}>
              drop image · idefics2-ft encoder
            </span>
          </div>
          <div
            className="rounded-xl border border-border px-3 py-2"
            style={{ fontSize: "12px", color: "var(--color-text)" }}
          >
            What does the opacity suggest?
          </div>
          <button
            className="font-mono rounded-lg self-start px-4 py-1.5 transition-transform duration-150 hover:-translate-y-px"
            style={{ fontSize: "11px", background: "var(--gradient-brand)", color: "#fff" }}
          >
            run ▶
          </button>
        </div>
        <div className="sm:col-span-3 flex flex-col gap-2">
          <div className="rounded-xl border border-border p-3">
            <p className="font-mono mb-1" style={{ fontSize: "9px", color: "var(--color-muted)", letterSpacing: "0.12em" }}>
              RETRIEVED
            </p>
            <p className="font-mono" style={{ fontSize: "10.5px", color: "var(--color-muted)" }}>
              [1] lobar consolidation → bacterial pneumonia…
            </p>
          </div>
          <div className="rounded-xl border border-border p-3" style={{ backgroundColor: "var(--color-surface-2)" }}>
            <p style={{ fontSize: "12.5px", lineHeight: 1.6 }}>
              Lobar opacity in the lower lobe most commonly suggests bacterial
              pneumonia (consolidation). Retrieved: [1]
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="font-mono" style={{ fontSize: "9px", color: "var(--color-muted)" }}>
                llama-3-ft
              </p>
              <StatusPill>conf 81%</StatusPill>
            </div>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* ── CIRAX — local web UI: drop zone, route card, queue ───────────────────── */
export function CiraxInterface() {
  return (
    <Chrome title="cirax serve — localhost:7331 · watch folder idle">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4">
        <div className="sm:col-span-3 flex flex-col gap-3">
          <div
            className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all duration-200 hover:border-[var(--color-signal)] hover:bg-[rgba(43,92,255,0.03)]"
            style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
          >
            <span style={{ fontSize: "20px" }}>⇩</span>
            <span className="font-mono mt-1.5 text-center" style={{ fontSize: "10px" }}>
              drop files — never leaves this machine
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono" style={{ fontSize: "11px" }}>
            <span className="rounded-lg border border-border px-2.5 py-1.5">report.docx</span>
            <span style={{ color: "var(--color-muted)" }}>→</span>
            <span className="rounded-lg border px-2.5 py-1.5" style={{ borderColor: "var(--color-signal)", color: "var(--color-signal)" }}>.png</span>
            <span className="ml-auto rounded-lg px-3 py-1.5 transition-transform duration-150 hover:-translate-y-px cursor-pointer" style={{ background: "var(--gradient-brand)", color: "#fff" }}>
              convert
            </span>
          </div>
        </div>
        <div className="sm:col-span-2 rounded-xl border border-border p-3">
          <p className="font-mono mb-2" style={{ fontSize: "9px", color: "var(--color-muted)", letterSpacing: "0.12em" }}>
            ROUTE
          </p>
          <p className="font-mono" style={{ fontSize: "11px", lineHeight: 1.8, color: "var(--color-text)" }}>
            libreoffice → pdftoppm
            <br />
            <span style={{ color: "#EAB308" }}>fidelity: lossy ⚠</span>
            <br />
            <span style={{ color: "var(--color-muted)" }}>sandbox: bwrap · no net</span>
          </p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="font-mono rounded-lg px-3 py-2 flex flex-wrap justify-between gap-2" style={{ fontSize: "10px", backgroundColor: "var(--color-surface-2)", color: "var(--color-muted)" }}>
          <span>scan.png → text.txt</span>
          <span style={{ color: "var(--color-live)" }}>ocr: glm-1.3b via ollama · done</span>
        </div>
      </div>
    </Chrome>
  );
}
