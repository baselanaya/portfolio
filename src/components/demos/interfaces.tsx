"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// HTML interface previews — each one plays a looping, choreographed scene
// that mimics how the real system behaves, derived from its README.
// A tiny ticker drives every phase; reduced-motion shows the final state.

function useTicker(stepMs: number, paused = false): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTick((t) => t + 1), stepMs);
    return () => clearInterval(id);
  }, [stepMs, paused]);
  return tick;
}

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

const line = (t: number, showAt: number, text: string, typeMs = 0) => {
  if (t < showAt) return null;
  const chars = typeMs > 0 ? Math.min(text.length, Math.floor(((t - showAt) / typeMs) * text.length)) : text.length;
  return text.slice(0, chars);
};

/* ── KERNEX — CLI loop: run → allow → JIT pause → grant ──────────────────── */
export function KernexInterface() {
  const reduce = useReducedMotion();
  const t = useTicker(90, false) * 90;
  const T = t % 14000;

  const cmd = reduce ? "kernex run -- python agent.py" : line(T, 200, "kernex run -- python agent.py", 900) ?? "";
  const show = (at: number) => T >= at || !!reduce;
  const jitActive = !reduce && T >= 5200 && T < 9200;
  const grant = T > 8200;

  return (
    <Chrome title="kernex — single static binary · 15MB RAM · <2ms boot" dark>
      <div className="font-mono p-4 sm:p-5 min-h-[248px]" style={{ fontSize: "11.5px", lineHeight: 1.9 }}>
        <div style={{ color: "var(--color-terminal-muted)" }}>
          <span style={{ color: "var(--color-signal)" }}>$</span> {cmd}
          {T < 1200 && !reduce && <span style={{ color: "var(--color-signal)" }}>▌</span>}
        </div>
        {show(1100) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "var(--color-live)" }}>
            ✓ landlock v3 ruleset installed · seccomp BPF attached
          </motion.div>
        )}
        {show(1500) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "var(--color-live)" }}>
            ✓ policy kernex.yaml · 3 fs paths · 1 net endpoint
          </motion.div>
        )}
        {show(2100) && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} style={{ color: "var(--color-terminal-muted)", marginTop: 6 }}>
            ─ agent output ─────────────────────────
          </motion.div>
        )}
        {show(2400) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "var(--color-terminal-fg)" }}>
            agent: reading ./data/q3.csv…
          </motion.div>
        )}
        {show(3000) && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
            <span style={{ color: "var(--color-live)" }}>ALLOWED</span>
            <span style={{ color: "var(--color-terminal-fg)" }}> read ./data/q3.csv</span>
          </motion.div>
        )}
        {show(3800) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "var(--color-terminal-fg)" }}>
            agent: POST https://telemetry.vendor.io/v1 …
          </motion.div>
        )}
        {show(4600) && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
            <span style={{ color: "#DC2626" }}>BLOCKED</span>
            <span style={{ color: "var(--color-terminal-fg)" }}> connect(2) telemetry.vendor.io:443</span>
          </motion.div>
        )}

        <AnimatePresence>
          {jitActive && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="mt-3 rounded-xl border p-3.5"
              style={{ borderColor: "#EAB308", backgroundColor: "rgba(234,179,8,0.07)" }}
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
                    className="rounded-lg px-2.5 py-1 border transition-all duration-200"
                    style={{
                      borderColor: i === 0 ? "var(--color-live)" : i === 1 ? "#DC2626" : "var(--color-terminal-muted)",
                      color: i === 0 ? "var(--color-live)" : i === 1 ? "#DC2626" : "var(--color-terminal-muted)",
                      transform: i === 0 && grant ? "scale(1.06)" : undefined,
                      backgroundColor: i === 0 && grant ? "rgba(22,163,74,0.12)" : undefined,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {show(9600) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span style={{ color: "var(--color-live)" }}>ALLOWED</span>
            <span style={{ color: "var(--color-terminal-fg)" }}> connect(2) telemetry.vendor.io:443</span>
            <span style={{ color: "var(--color-terminal-muted)" }}> reason=jit_grant_once</span>
          </motion.div>
        )}
      </div>
    </Chrome>
  );
}

/* ── MERCER — chat + six-stage pipeline, typed SQL ───────────────────────── */
export function MercerInterface() {
  const reduce = useReducedMotion();
  const t = useTicker(80, false) * 80;
  const T = t % 13000;

  const question = "top customers by spend this quarter?";
  const typed = reduce ? question : line(T, 200, question, 1100) ?? "";
  const stage = reduce ? 6 : Math.max(0, Math.floor((T - 1600) / 520));
  const stages = [
    ["entity retrieval", "BM25 + LSH · sampled values"],
    ["schema linking", "CHESS 3-step · FK graph"],
    ["decomposition", "CoT subproblems"],
    ["candidate gen", "temps 0.0 / 0.2 / 0.3"],
    ["execute + select", "EXPLAIN pre-flight · read-only"],
    ["taxonomy correction", "schema/join/filter/logic"],
  ];
  const sql = `SELECT c.cust_nm, SUM(o.total_amt)
FROM   cust_seg_cd c
JOIN   ord_hdr o ON o.cust_id = c.cust_id
WHERE  o.ord_dt >= DATE '2026-04-01'
GROUP  BY 1 ORDER BY 2 DESC LIMIT 5;`;
  const sqlChars = reduce || T > 7000 ? sql.length : Math.floor(Math.max(0, (T - 5000) / 1800) * sql.length);
  const done = stage >= 6;

  return (
    <Chrome title="mercer — query playground · arctic-r1-7b · 100% local">
      <div className="grid grid-cols-1 sm:grid-cols-5">
        <div className="sm:col-span-3 p-4 flex flex-col gap-3 border-b sm:border-b-0 sm:border-r" style={{ borderColor: "var(--color-border)" }}>
          <div
            className="self-end rounded-2xl rounded-br-sm px-3.5 py-2"
            style={{ fontSize: "12px", background: "var(--gradient-brand)", color: "#fff", maxWidth: "88%", minHeight: 20 }}
          >
            {typed}
            {T < 1500 && !reduce && "▌"}
          </div>
          <pre
            className="self-start rounded-xl font-mono p-3.5 overflow-x-auto w-full"
            style={{ fontSize: "10.5px", lineHeight: 1.7, backgroundColor: "var(--color-terminal)", color: "var(--color-terminal-fg)" }}
          >
            {sql.slice(0, sqlChars)}
            {sqlChars < sql.length && !reduce && <span style={{ color: "var(--color-signal)" }}>▌</span>}
          </pre>
          <AnimatePresence>
            {done && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono self-start"
                style={{ fontSize: "9.5px", color: "var(--color-live)" }}
              >
                ✓ single SELECT · sqlglot-validated · 12.7s total
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="sm:col-span-2 p-4" style={{ backgroundColor: "var(--color-surface-2)" }}>
          <p className="font-mono mb-3" style={{ fontSize: "9px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>
            6-STAGE PIPELINE
          </p>
          {stages.map(([name, note], i) => {
            const isDone = reduce || stage > i;
            const isActive = stage === i && !reduce;
            return (
              <div key={name} className="flex items-start gap-2 mb-2.5">
                <span
                  className="font-mono shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: 16, height: 16, fontSize: "9px", marginTop: 2,
                    backgroundColor: isDone ? "var(--color-live)" : isActive ? "var(--color-signal)" : "var(--color-border)",
                    color: isDone || isActive ? "#fff" : "var(--color-muted)",
                  }}
                >
                  {isDone ? "✓" : isActive ? "◐" : ""}
                </span>
                <div>
                  <p className="font-mono" style={{ fontSize: "10.5px", color: isDone || isActive ? "var(--color-text)" : "var(--color-muted)" }}>
                    {i + 1}. {name}
                  </p>
                  <p className="font-mono" style={{ fontSize: "9px", color: "var(--color-muted)" }}>
                    {note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Chrome>
  );
}

/* ── CYNOSURE — TUI dashboard: live tick + sparkline + gates ─────────────── */
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
    ["XAU/USDT:PERP", "FLAT", row === 1 ? "synthesizing…" : "risk: corr ≥ 0.85", "—"],
    ["AAPL/USDT:PERP", "FLAT", row === 2 ? "synthesizing…" : "persistence: streak 1", "watchlist"],
  ];

  return (
    <Chrome title="cynosure — 15m cycle · paper mode · qwen3.5:4b synthesizer" dark>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ backgroundColor: "#2A2820" }}>
        {[
          ["SPOT", `$${spot[spot.length - 1].toLocaleString("en-US", { minimumFractionDigits: 1 })}`],
          ["TIMESFM 2.5", "dir ±0.30%"],
          ["RISK GATES", "all pass"],
          ["EQUITY", `${equity.toFixed(1)}%`],
        ].map(([k, v]) => (
          <div key={k} className="p-3" style={{ backgroundColor: "#12110D" }}>
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
      <div className="px-4 pt-3">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: 44 }}>
          <polyline
            points={pts}
            fill="none"
            stroke="var(--color-live)"
            strokeWidth="0.9"
            vectorEffect="non-scaling-stroke"
            style={{ transition: "all 1.1s linear" }}
          />
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
    </Chrome>
  );
}

/* ── MEDFORMER — gradio: scan sweep → retrieval → typed answer ───────────── */
export function MedFormerInterface() {
  const reduce = useReducedMotion();
  const t = useTicker(80, false) * 80;
  const T = t % 12000;

  const answer = "Lobar opacity in the lower lobe most commonly suggests bacterial pneumonia (consolidation). Retrieved: [1]";
  const show = (at: number) => T >= at || !!reduce;
  const chars = reduce || T > 6800 ? answer.length : Math.max(0, Math.floor(((T - 5200) / 1600) * answer.length));
  const sweep = reduce ? -1 : Math.max(0, Math.min(100, ((T - 600) / 1400) * 100));

  return (
    <Chrome title="MedFormer_UI.ipynb — gradio · idefics2-ft + llama-3-ft + rag">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4">
        <div className="sm:col-span-2 flex flex-col gap-3">
          <div
            className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-5 overflow-hidden"
            style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
          >
            <span style={{ fontSize: "22px" }}>🩻</span>
            <span className="font-mono mt-2 text-center" style={{ fontSize: "9.5px" }}>
              chest-xray-042.png · 1024×1024
            </span>
            {!reduce && sweep >= 0 && sweep <= 100 && (
              <div
                className="absolute left-0 right-0 h-6 pointer-events-none"
                style={{
                  top: `${sweep}%`,
                  background: "linear-gradient(to bottom, transparent, rgba(43,92,255,0.35), transparent)",
                }}
              />
            )}
          </div>
          {show(1800) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border px-3 py-2"
              style={{ fontSize: "12px", color: "var(--color-text)" }}
            >
              What does the opacity suggest?
            </motion.div>
          )}
        </div>
        <div className="sm:col-span-3 flex flex-col gap-2">
          <AnimatePresence>
            {show(2400) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl border border-border p-3"
              >
                <p className="font-mono mb-1" style={{ fontSize: "9px", color: "var(--color-muted)", letterSpacing: "0.12em" }}>
                  RETRIEVED
                </p>
                <p className="font-mono" style={{ fontSize: "10.5px", color: "var(--color-muted)" }}>
                  [1] lobar consolidation on radiographs is most commonly associated with bacterial pneumonia…
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {show(3600) && (
            <div className="rounded-xl border border-border p-3.5" style={{ backgroundColor: "var(--color-surface-2)", minHeight: 84 }}>
              <p style={{ fontSize: "12.5px", lineHeight: 1.65 }}>
                {answer.slice(0, chars)}
                {chars < answer.length && !reduce && <span style={{ color: "var(--color-signal)" }}>▌</span>}
              </p>
            </div>
          )}
          <AnimatePresence>
            {T > 7600 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                <StatusPill>llama-3-ft · conf 81% · research demo</StatusPill>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Chrome>
  );
}

/* ── CIRAX — web UI: format graph, route draw, sandbox ───────────────────── */
export function CiraxInterface() {
  const reduce = useReducedMotion();
  const t = useTicker(70, false) * 70;
  const T = t % 11000;

  const show = (at: number) => T >= at || !!reduce;
  const nodes: Record<string, { x: number; y: number }> = {
    docx: { x: 8, y: 50 },
    pdf: { x: 50, y: 22 },
    html: { x: 50, y: 78 },
    png: { x: 90, y: 50 },
  };
  const drawFrac = reduce ? 1 : Math.max(0, Math.min(1, (T - 2200) / 1000));
  const midX = nodes.docx.x + (nodes.pdf.x - nodes.docx.x) * drawFrac;
  const midY = nodes.docx.y + (nodes.pdf.y - nodes.docx.y) * drawFrac;

  return (
    <Chrome title="cirax serve — localhost:7331 · watch folder idle">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4">
        <div className="sm:col-span-3 flex flex-col gap-3">
          <div
            className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-5"
            style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
          >
            <span style={{ fontSize: "20px" }}>⇩</span>
            <span className="font-mono mt-1.5 text-center" style={{ fontSize: "10px" }}>
              report.docx · 2.1 MB — never leaves this machine
            </span>
          </div>

          <div className="rounded-xl border border-border p-2" style={{ backgroundColor: "var(--color-surface-2)" }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: 96 }}>
              {[
                ["docx", "pdf"], ["pdf", "png"], ["docx", "html"], ["html", "png"],
              ].map(([a, b]) => {
                const a2 = nodes[a], b2 = nodes[b];
                return (
                  <line
                    key={a + b}
                    x1={a2.x} y1={a2.y} x2={b2.x} y2={b2.y}
                    stroke="rgba(22,21,15,0.14)" strokeWidth="0.7"
                  />
                );
              })}
              {!reduce && (
                <line
                  x1={nodes.docx.x} y1={nodes.docx.y} x2={midX} y2={midY}
                  stroke="var(--color-signal)" strokeWidth="1.4"
                />
              )}
              {!reduce && drawFrac >= 1 && (
                <line
                  x1={nodes.pdf.x} y1={nodes.pdf.y} x2={nodes.png.x} y2={nodes.png.y}
                  stroke="var(--color-signal)" strokeWidth="1.4"
                />
              )}
              {Object.entries(nodes).map(([name, p]) => (
                <g key={name}>
                  <circle
                    cx={p.x} cy={p.y}
                    r={name === "docx" || name === "png" ? 3.4 : 2.6}
                    fill={drawFrac >= 1 && (name === "png" || name === "pdf") ? "var(--color-signal)" : "#FFFFFF"}
                    stroke={name === "docx" || name === "png" || drawFrac >= 1 ? "var(--color-signal)" : "rgba(22,21,15,0.4)"}
                    strokeWidth="0.8"
                  />
                  <text x={p.x} y={p.y - 5.5} textAnchor="middle" fontSize="5.2"
                    fill="var(--color-muted)" fontFamily="monospace">.{name}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="sm:col-span-2 flex flex-col gap-3">
          <div className="rounded-xl border border-border p-3.5" style={{ minHeight: 118 }}>
            <p className="font-mono mb-2" style={{ fontSize: "9px", color: "var(--color-muted)", letterSpacing: "0.12em" }}>
              ROUTE · docx → png
            </p>
            <AnimatePresence>
              {show(3400) && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono"
                  style={{ fontSize: "12px", lineHeight: 1.9, color: "var(--color-text)" }}
                >
                  libreoffice → pdftoppm
                  <br />
                  <span style={{ color: "#EAB308" }}>fidelity: lossy ⚠ tagged before it runs</span>
                  <br />
                  <span style={{ color: "var(--color-muted)" }}>hops: 2 · ranked by dijkstra</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {show(4600) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono rounded-lg px-3 py-2.5 flex flex-wrap justify-between gap-2"
                style={{ fontSize: "10px", backgroundColor: "var(--color-terminal)", color: "var(--color-terminal-muted)" }}
              >
                <span>preview.png · 1.4 MB</span>
                <span style={{ color: "var(--color-live)" }}>✓ done · bwrap sandbox</span>
              </motion.div>
            )}
          </AnimatePresence>
          {show(5600) && (
            <p className="font-mono" style={{ fontSize: "9px", color: "var(--color-muted)", letterSpacing: "0.06em" }}>
              exif/gps stripped on export · gps metadata: 0 tags
            </p>
          )}
        </div>
      </div>
    </Chrome>
  );
}
