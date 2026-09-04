"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Interface previews — miniature, animated versions of each tool's real UI.
// Shared grammar: a ToolHeader (tool name + status), the working surface,
// and a footer strip. Terminal tools render as dark screens; web tools as
// light app windows. All motion collapses under prefers-reduced-motion.

const DARK_BG = "#0A0906";
const DARK_PANEL = "#12110D";
const DARK_LINE = "#2A2820";

function useTicker(stepMs: number, paused = false): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTick((t) => t + 1), stepMs);
    return () => clearInterval(id);
  }, [stepMs, paused]);
  return tick;
}

function StatusPill({ children, tone = "ok", dark = false }: { children: React.ReactNode; tone?: "ok" | "warn" | "muted"; dark?: boolean }) {
  const palette = dark
    ? { ok: "var(--color-live)", warn: "#EAB308", muted: "var(--color-terminal-muted)" }
    : { ok: "var(--color-live)", warn: "#B45309", muted: "var(--color-muted)" };
  const color = palette[tone];
  return (
    <span
      className="font-mono inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
      style={{ fontSize: "8.5px", letterSpacing: "0.08em", color, border: `1px solid ${color}` }}
    >
      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}

function ToolHeader({
  name, pill, pillTone = "ok", dark = false,
}: {
  name: string;
  pill: string;
  pillTone?: "ok" | "warn" | "muted";
  dark?: boolean;
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
      <StatusPill dark={dark} tone={pillTone}>{pill}</StatusPill>
    </div>
  );
}

const line = (t: number, showAt: number, text: string, typeMs = 0) => {
  if (t < showAt) return null;
  const chars = typeMs > 0 ? Math.min(text.length, Math.floor(((t - showAt) / typeMs) * text.length)) : text.length;
  return text.slice(0, chars);
};

/* ── KERNEX — sandboxed CLI session (dark terminal) ──────────────────────── */
export function KernexInterface() {
  const reduce = useReducedMotion();
  const t = useTicker(90, false) * 90;
  const T = t % 14000;

  const cmd = reduce ? "kernex run -- python agent.py" : line(T, 200, "kernex run -- python agent.py", 900) ?? "";
  const show = (at: number) => T >= at || !!reduce;
  const jitActive = !reduce && T >= 5200 && T < 9200;
  const grant = T > 8200;

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: DARK_BG, color: "var(--color-terminal-fg)" }}>
      <ToolHeader name="kernex · sandboxed session" pill="landlock + seccomp" dark />
      <div className="font-mono p-4 sm:p-5" style={{ fontSize: "11.5px", lineHeight: 1.9 }}>
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
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            style={{ color: "var(--color-terminal-muted)", marginTop: 6 }}>
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
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: [0, 1, 0.35, 1], x: 0 }}
            transition={{ duration: 0.4, times: [0, 0.5, 0.7, 1] }}
          >
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
                <span style={{ color: "#EAB308", fontWeight: 600 }}>⏸ JIT INTERCEPTION · connect(2) blocked</span>
                <StatusPill dark tone="warn">agent paused</StatusPill>
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
    </div>
  );
}

/* ── MERCER — six-node pipeline over a typed SQL result (light) ──────────── */
export function MercerInterface() {
  const reduce = useReducedMotion();
  const t = useTicker(80, false) * 80;
  const T = t % 13000;

  const question = "top customers by spend this quarter?";
  const typed = reduce ? question : line(T, 200, question, 1100) ?? "";
  const stage = reduce ? 6 : Math.max(0, Math.floor((T - 1600) / 520));
  const stageNames = ["retrieve", "link", "decompose", "candidates", "execute", "correct"];
  const done = stage >= 6;

  const sql = `SELECT c.cust_nm, SUM(o.total_amt)
FROM   cust_seg_cd c
JOIN   ord_hdr o ON o.cust_id = c.cust_id
WHERE  o.ord_dt >= DATE '2026-04-01'
GROUP  BY 1 ORDER BY 2 DESC LIMIT 5;`;
  const sqlChars = reduce || T > 7000 ? sql.length : Math.floor(Math.max(0, (T - 5000) / 1800) * sql.length);

  const candidates = [
    { n: "CoT @0.0", win: true },
    { n: "D&C @0.2", win: false },
    { n: "P&E @0.3", win: false },
  ];

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4">
      {/* pipeline chain — line fills with progress, packet rides the frontier */}
      <div className="rounded-xl border px-4 pt-5 pb-3 overflow-hidden" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-2)" }}>
        <svg viewBox="0 0 560 46" style={{ width: "100%", height: 48 }}>
          <line x1="46" y1="20" x2="514" y2="20" stroke="rgba(22,21,15,0.18)" strokeWidth="1" />
          {!reduce && stage > 0 && stage <= 6 && (
            <line
              x1="46" y1="20"
              x2={String(46 + Math.min(stage, 6) * (468 / 5))}
              y2="20"
              stroke="var(--color-signal)" strokeWidth="1.4"
            />
          )}
          {stageNames.map((name, i) => {
            const cx = 46 + i * (468 / 5);
            const isDone = reduce || stage > i;
            const isActive = stage === i && !reduce;
            return (
              <g key={name}>
                <circle cx={cx} cy={20} r={isActive ? 9 : 7}
                  fill={isDone || isActive ? "var(--color-signal)" : "#FFFFFF"}
                  stroke={isDone || isActive ? "var(--color-signal)" : "rgba(22,21,15,0.3)"}
                  strokeWidth="1.2"
                  style={isActive ? { filter: "drop-shadow(0 0 5px rgba(43,92,255,0.6))" } : undefined}
                />
                {isDone && (
                  <text x={cx} y={isActive ? 23.5 : 23} textAnchor="middle" fontSize="8" fill="#fff" fontFamily="monospace">✓</text>
                )}
                <text x={cx} y={40} textAnchor="middle" fontSize="6.5"
                  fill="var(--color-muted)" fontFamily="monospace">{name}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* chat */}
        <div className="flex flex-col gap-3">
          <div
            className="self-end rounded-2xl rounded-br-sm px-3.5 py-2 w-fit max-w-full"
            style={{ fontSize: "12px", background: "var(--gradient-brand)", color: "#fff", minHeight: 20 }}
          >
            {typed}
            {T < 1500 && !reduce && "▌"}
          </div>
          {/* candidates race at stage 4 */}
          {(stage >= 3 || reduce) && (
            <div className="flex flex-wrap gap-1.5 self-start">
              {candidates.map((c, i) => {
                const rejected = (stage >= 4 || reduce) && !c.win;
                const won = stage >= 4 || reduce;
                return (
                  <motion.span
                    key={c.n}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: rejected ? 0.35 : 1, y: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="font-mono rounded-lg border px-2 py-1"
                    style={{
                      fontSize: "9px",
                      borderColor: won && c.win ? "var(--color-live)" : "var(--color-border)",
                      color: won && c.win ? "var(--color-live)" : "var(--color-muted)",
                    }}
                  >
                    {c.n}
                    {won && c.win ? " ✓" : rejected ? " ✗" : ""}
                  </motion.span>
                );
              })}
            </div>
          )}
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono self-start"
                style={{ fontSize: "9.5px", color: "var(--color-live)" }}
              >
                ✓ single SELECT · sqlglot-validated · 12.7s total
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* SQL */}
        <pre
          className="rounded-xl font-mono p-3.5 overflow-x-auto m-0 h-full"
          style={{ fontSize: "10.5px", lineHeight: 1.7, backgroundColor: DARK_BG, color: "var(--color-terminal-fg)", border: `1px solid ${DARK_LINE}` }}
        >
          {sql.slice(0, sqlChars)}
          {sqlChars < sql.length && !reduce && <span style={{ color: "var(--color-signal)" }}>▌</span>}
        </pre>
      </div>
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
    ["XAU/USDT:PERP", "FLAT", row === 1 ? "synthesizing…" : "risk: corr ≥ 0.85", "—"],
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

/* ── MEDFORMER — gradio app (light): sweep, detection box, grounded answer ── */
export function MedFormerInterface() {
  const reduce = useReducedMotion();
  const t = useTicker(80, false) * 80;
  const T = t % 12000;

  const answer = "Lobar opacity in the lower lobe most commonly suggests bacterial pneumonia (consolidation). Retrieved: [1]";
  const show = (at: number) => T >= at || !!reduce;
  const chars = reduce || T > 6800 ? answer.length : Math.max(0, Math.floor(((T - 5200) / 1600) * answer.length));
  const sweep = reduce ? -1 : Math.max(0, Math.min(100, ((T - 600) / 1400) * 100));

  return (
    <div className="p-4 sm:p-5">
      <ToolHeader name="medformer · gradio" pill="idefics2-ft + llama-3-ft + rag" />
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4">
        <div className="sm:col-span-2 flex flex-col gap-3">
          <div
            className="relative rounded-xl border border-border flex flex-col items-center justify-center p-6 overflow-hidden"
            style={{ backgroundColor: "var(--color-surface-2)" }}
          >
            <span style={{ fontSize: "26px" }}>🩻</span>
            <span className="font-mono mt-2 text-center" style={{ fontSize: "9.5px", color: "var(--color-muted)" }}>
              chest-xray-042.png · 1024×1024
            </span>
            {!reduce && sweep >= 0 && sweep <= 100 && (
              <div
                className="absolute left-0 right-0 h-8 pointer-events-none"
                style={{
                  top: `${sweep}%`,
                  background: "linear-gradient(to bottom, transparent, rgba(43,92,255,0.4), transparent)",
                }}
              />
            )}
            {(T >= 2200 || reduce) && (
              <motion.div
                aria-hidden="true"
                className="absolute border-2 rounded"
                style={{
                  borderColor: "var(--color-signal)",
                  left: "24%", top: "30%", width: "52%", height: "44%",
                  boxShadow: "0 0 0 1px rgba(43,92,255,0.25)",
                }}
                initial={reduce ? undefined : { opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
          </div>
          {show(1800) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border px-3 py-2"
              style={{ fontSize: "12px", color: "var(--color-text)", backgroundColor: "var(--color-surface)" }}
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
                style={{ backgroundColor: "var(--color-surface)" }}
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
              <p style={{ fontSize: "12.5px", lineHeight: 1.65, color: "var(--color-text)" }}>
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
    </div>
  );
}

/* ── CIRAX — product flow: sources → cirax hub → targets, packets on wires ── */
export function CiraxInterface() {
  const reduce = useReducedMotion();

  const sources = [
    { label: ".docx", y: 26 },
    { label: ".jpg", y: 50 },
    { label: ".png", y: 74 },
  ];
  const targets = [
    { label: ".pdf", y: 30 },
    { label: ".txt", y: 58 },
    { label: ".md", y: 86 },
  ];

  return (
    <div className="p-4 sm:p-5">
      <ToolHeader name="cirax · local web ui" pill="109 formats · 58 engines" />
      <div className="mt-3 rounded-xl border px-2 py-2" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-2)" }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: 210 }}>
          {sources.map((s) => (
            <path
              key={`s-${s.label}`}
              d={`M 18 ${s.y} C 34 ${s.y}, 36 50, 50 50`}
              fill="none" stroke="rgba(22,21,15,0.2)" strokeWidth="0.6"
            />
          ))}
          {targets.map((t) => (
            <path
              key={`t-${t.label}`}
              d={`M 50 50 C 64 50, 66 ${t.y}, 82 ${t.y}`}
              fill="none" stroke="rgba(22,21,15,0.2)" strokeWidth="0.6"
            />
          ))}

          {!reduce && (
            <>
              <circle r="1.6" fill="var(--color-signal)">
                <animateMotion dur="2.2s" repeatCount="indefinite"
                  path={`M 18 ${sources[0].y} C 34 ${sources[0].y}, 36 50, 50 50`} />
              </circle>
              <circle r="1.6" fill="var(--color-signal)">
                <animateMotion dur="2.2s" begin="0.7s" repeatCount="indefinite"
                  path={`M 18 ${sources[1].y} C 34 ${sources[1].y}, 36 50, 50 50`} />
              </circle>
              <circle r="1.6" fill="var(--color-live)">
                <animateMotion dur="2.2s" begin="1.3s" repeatCount="indefinite"
                  path={`M 50 50 C 64 50, 66 ${targets[0].y}, 82 ${targets[0].y}`} />
              </circle>
            </>
          )}

          {sources.map((s) => (
            <g key={s.label}>
              <circle cx="18" cy={s.y} r="7" fill="#FFFFFF"
                stroke="rgba(22,21,15,0.22)" strokeWidth="1"
                style={{ filter: "drop-shadow(0 2px 6px rgba(22,21,15,0.18))" }} />
              <text x="18" y={s.y + 2} textAnchor="middle" fontSize="5.5"
                fill="var(--color-text)" fontFamily="monospace">{s.label}</text>
            </g>
          ))}
          <circle cx="50" cy="50" r="9.5" fill="#FFFFFF" stroke="var(--color-signal)" strokeWidth="1.2"
            style={{ filter: "drop-shadow(0 2px 8px rgba(43,92,255,0.45))" }} />
          <text x="50" y="52.5" textAnchor="middle" fontSize="9" fontWeight="700"
            fill="var(--color-text)" fontFamily="monospace">c·</text>
          {targets.map((t) => (
            <g key={t.label}>
              <circle cx="82" cy={t.y} r="7" fill="#FFFFFF"
                stroke="rgba(22,21,15,0.22)" strokeWidth="1"
                style={{ filter: "drop-shadow(0 2px 6px rgba(22,21,15,0.18))" }} />
              <text x="82" y={t.y + 2} textAnchor="middle" fontSize="5.5"
                fill="var(--color-text)" fontFamily="monospace">{t.label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-2"
        style={{ fontSize: "10px", backgroundColor: "var(--color-surface-2)", color: "var(--color-muted)" }}>
        <span className="font-mono">route · docx → pdf → png</span>
        <span className="font-mono" style={{ color: "#B45309" }}>fidelity: lossy ⚠ · bwrap · no net</span>
      </div>
    </div>
  );
}
