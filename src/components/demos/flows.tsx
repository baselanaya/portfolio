"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { DARK_BG, DARK_LINE, DARK_PANEL, ToolHeader } from "./interfaces";

// Mechanism diagrams — animated "how it works" schematics, one per project.
// Each flow gets its own form language instead of a shared node-graph stamp:
//   kernex    — security checkpoint: agent terminal, barred gate, lanes + slots
//   mercer    — rail with station notches ridden by a glowing read-head
//   medformer — two ribbons braiding into one at a fusion diamond
//   cirax     — route graph over file tiles, packet as a file ghost
// Shared grammar: dark instrument screen, ToolHeader chrome, 560×264 canvas,
// cobalt = mechanism at work, live-green = allowed, red = blocked, amber =
// pause. Motion identity: Premium — cubic-bezier(0.4,0,0.2,1), no overshoot,
// 200/420/700ms palette. The clock only runs in view; everything collapses
// to the settled end state under prefers-reduced-motion.

const STROKE_IDLE = "rgba(245, 240, 232, 0.14)";
const TEXT_MUTED = "var(--color-terminal-muted)";
const TEXT_FG = "var(--color-terminal-fg)";
const SIGNAL = "var(--color-signal)";
const LIVE = "var(--color-live)";
const BAD = "#DC2626";
const WARN = "#EAB308";

/* Brand motion identity — Premium */
const FX_CSS = `
.fx-pop { transform-box: fill-box; transform-origin: center; animation: fx-pop 420ms cubic-bezier(0.34, 1.2, 0.64, 1) both; }
@keyframes fx-pop { from { transform: scale(0.72); opacity: 0.4; } to { transform: scale(1); opacity: 1; } }
.fx-rise { transform-box: fill-box; animation: fx-rise 420ms cubic-bezier(0.4, 0, 0.2, 1) both; }
@keyframes fx-rise { from { transform: translateY(5px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.fx-halo { transform-box: fill-box; transform-origin: center; animation: fx-halo 1.9s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
@keyframes fx-halo { 0% { transform: scale(0.85); opacity: 0.5; } 75% { transform: scale(1.7); opacity: 0; } 100% { transform: scale(1.7); opacity: 0; } }
.fx-current { animation: fx-flow 1.5s linear infinite; }
@keyframes fx-flow { to { stroke-dashoffset: -48; } }
.fx-breathe { transform-box: fill-box; transform-origin: center; animation: fx-breathe 9s ease-in-out infinite; }
@keyframes fx-breathe { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.18); } }
.fx-deny { transform-box: fill-box; transform-origin: center; animation: fx-deny 520ms cubic-bezier(0.3, 0, 0.7, 1) both; }
@keyframes fx-deny { from { transform: scale(0.4); opacity: 0.9; } to { transform: scale(1.9); opacity: 0; } }
.fx-draw { stroke-dasharray: 10; stroke-dashoffset: 10; animation: fx-draw 380ms cubic-bezier(0.4, 0, 0.2, 1) 120ms both; }
@keyframes fx-draw { to { stroke-dashoffset: 0; } }
.fx-blink { animation: fx-blink 1.1s ease-in-out infinite; }
@keyframes fx-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.fx-dot { animation: fx-dot 2.2s ease-in-out infinite; }
@keyframes fx-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.fx-spin { transform-box: fill-box; transform-origin: center; animation: fx-spin 1.2s linear infinite; }
@keyframes fx-spin { to { transform: rotate(360deg); } }
.fx-land { transform-box: fill-box; transform-origin: center; animation: fx-land 300ms cubic-bezier(0.4, 0, 0.2, 1) both; }
@keyframes fx-land { 0% { transform: scale(1); } 35% { transform: scale(1.12, 0.86); } 100% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .fx-pop, .fx-rise, .fx-halo, .fx-current, .fx-breathe, .fx-deny, .fx-draw, .fx-blink, .fx-dot, .fx-spin, .fx-land { animation: none !important; }
}
`;

function useTicker(stepMs: number, paused = false): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTick((t) => t + 1), stepMs);
    return () => clearInterval(id);
  }, [stepMs, paused]);
  return tick;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Pt = [number, number];

/** Position along a polyline at progress t (by arc length). */
function pathPoint(pts: Pt[], t: number): { x: number; y: number } {
  let total = 0;
  const segs: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    segs.push(l);
    total += l;
  }
  let d = clamp01(t) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const p = segs[i] === 0 ? 0 : d / segs[i];
      return { x: lerp(pts[i][0], pts[i + 1][0], p), y: lerp(pts[i][1], pts[i + 1][1], p) };
    }
    d -= segs[i];
  }
  const last = pts[pts.length - 1];
  return { x: last[0], y: last[1] };
}

function polyLen(pts: Pt[]): number {
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    total += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
  }
  return total;
}

/** Quadratic bezier sampled to a polyline (for ribbons and arcs). */
function quadPts(p0: Pt, c: Pt, p1: Pt, steps = 24): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    out.push([u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]);
  }
  return out;
}

/**
 * Loop clock in ms. SSR and the first client render agree on T=0 (hydration
 * safety). The clock only advances while the screen is in view; after mount,
 * prefers-reduced-motion freezes it at a sentinel past every gate so the
 * diagram renders its settled end state.
 */
function useLoopT(duration: number, ref: React.RefObject<HTMLDivElement | null>): number {
  const reduce = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const inView = useInView(ref, { amount: 0.25 });
  const tick = useTicker(100, !mounted || reduce || !inView);
  return mounted && reduce ? 99999 : (tick * 100) % duration;
}

/* ── SVG primitives ─────────────────────────────────────────────────────── */

function Label({
  x, y, children, size = 8, tone = "muted", anchor = "middle", opacity = 1,
}: {
  x: number; y: number; children: React.ReactNode;
  size?: number; tone?: "muted" | "fg" | "live" | "bad" | "warn" | "signal";
  anchor?: "start" | "middle" | "end"; opacity?: number;
}) {
  const fill = { muted: TEXT_MUTED, fg: TEXT_FG, live: LIVE, bad: BAD, warn: WARN, signal: SIGNAL }[tone];
  return (
    <text
      x={x} y={y} textAnchor={anchor} fontSize={size} fill={fill} className="font-mono"
      style={{
        opacity,
        transform: `translateY(${(1 - opacity) * 4}px)`,
        transition: "opacity 380ms cubic-bezier(0.4, 0, 0.2, 1), transform 380ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </text>
  );
}

/** Wraps children in a one-shot rise-and-fade reveal the moment `on` flips. */
function Reveal({ on, pop = false, children }: { on: boolean; pop?: boolean; children: React.ReactNode }) {
  return (
    <g key={on ? "in" : "out"} opacity={on ? 1 : 0} className={on ? (pop ? "fx-pop" : "fx-rise") : undefined}>
      {children}
    </g>
  );
}

/** Straight hairline; the lit layer draws itself on from litAt, then carries
    a slow flowing current so finished paths read as live. */
function Wire({
  x1, y1, x2, y2, litAt, dashed = false, drawMs = 480, T,
}: {
  x1: number; y1: number; x2: number; y2: number;
  litAt?: number; dashed?: boolean; drawMs?: number; T: number;
}) {
  return (
    <PolyWire
      pts={[ [x1, y1], [x2, y2] ]}
      litAt={litAt} dashed={dashed} drawMs={drawMs} T={T}
    />
  );
}

/** Multi-point wire (elbows, curves). Same draw-on + flow-current behavior. */
function PolyWire({
  pts, litAt, dashed = false, drawMs = 480, T, width = 1.3, litColor = SIGNAL, ghost = true,
}: {
  pts: Pt[]; litAt?: number; dashed?: boolean; drawMs?: number; T: number;
  width?: number; litColor?: string; ghost?: boolean;
}) {
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const len = polyLen(pts);
  const p = litAt === undefined ? 0 : clamp01((T - litAt) / drawMs);
  const lit = p > 0;
  const full = p >= 1;
  return (
    <g>
      {ghost && (
        <path d={d} fill="none" stroke={STROKE_IDLE} strokeWidth="1"
          strokeDasharray={dashed ? "3 4" : undefined} strokeLinejoin="round" />
      )}
      {lit && (
        <path d={d} fill="none" stroke={litColor} strokeWidth={width} strokeLinejoin="round"
          strokeDasharray={dashed ? "3 4" : String(len)}
          strokeDashoffset={dashed ? 0 : String(len * (1 - p))}
          style={{ transition: "stroke-dashoffset 120ms cubic-bezier(0.4, 0, 0.2, 1)", opacity: dashed ? p : 1 }} />
      )}
      {lit && !dashed && full && (
        <path className="fx-current" d={d} fill="none" stroke={litColor} strokeWidth={width + 0.3}
          opacity="0.5" strokeDasharray="3 9" strokeLinejoin="round" />
      )}
    </g>
  );
}

/** Ribbon — a wide soft underlay plus a bright core on the same path.
    The visual voice of medformer's streams. */
function Ribbon({ pts, litAt, drawMs = 800, T }: { pts: Pt[]; litAt?: number; drawMs?: number; T: number }) {
  const d = `M ${pts.map((p) => p.join(" ")).join(" L ")}`;
  const len = polyLen(pts);
  const p = litAt === undefined ? 0 : clamp01((T - litAt) / drawMs);
  const lit = p > 0;
  if (!lit) return null;
  return (
    <g>
      <path d={d} fill="none" stroke={SIGNAL} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
        opacity={0.14 * p}
        strokeDasharray={String(len)} strokeDashoffset={String(len * (1 - p))}
        style={{ transition: "stroke-dashoffset 120ms cubic-bezier(0.4, 0, 0.2, 1)" }} />
      <path d={d} fill="none" stroke={SIGNAL} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        opacity={0.75 * p}
        strokeDasharray={String(len)} strokeDashoffset={String(len * (1 - p))}
        style={{ transition: "stroke-dashoffset 120ms cubic-bezier(0.4, 0, 0.2, 1)" }} />
    </g>
  );
}

/** A data packet mid-journey along a polyline: eased head + trail ghosts.
    The head leads, two lagging samples dissolve behind it, and the trail
    compresses into the target on arrival. */
function FlowPacket({
  T, t0, t1, path, color = SIGNAL, r = 3.4,
}: {
  T: number; t0: number; t1: number; path: Pt[]; color?: string; r?: number;
}) {
  const at = (lag: number) => {
    const raw = clamp01((T - t0 - lag * (t1 - t0)) / (t1 - t0));
    return { ...pathPoint(path, easeInOut(raw)), raw };
  };
  const head = at(0);
  const g1 = at(0.16);
  const g2 = at(0.3);
  const trail = 1 - clamp01((head.raw - 0.88) * 10);
  return (
    <g>
      <g style={{ transform: `translate(${g2.x}px, ${g2.y}px)`, transition: "transform 110ms linear", opacity: 0.22 * trail }}>
        <circle r={r * 0.5} fill={color} />
      </g>
      <g style={{ transform: `translate(${g1.x}px, ${g1.y}px)`, transition: "transform 110ms linear", opacity: 0.45 * trail }}>
        <circle r={r * 0.72} fill={color} />
      </g>
      <g style={{ transform: `translate(${head.x}px, ${head.y}px)`, transition: "transform 110ms linear", filter: `drop-shadow(0 0 4px ${color})` }}>
        <circle r={r} fill={color} />
      </g>
    </g>
  );
}

function Chip({
  x, y, w, h = 22, text, tone = "muted", size = 7, ring = false, opacity = 1,
}: {
  x: number; y: number; w: number; h?: number; text: string;
  tone?: "muted" | "live" | "warn" | "bad" | "signal" | "fg"; size?: number;
  ring?: boolean; opacity?: number;
}) {
  const palette = {
    muted: { stroke: "rgba(245, 240, 232, 0.25)", text: TEXT_MUTED, bg: DARK_PANEL },
    live: { stroke: LIVE, text: LIVE, bg: "rgba(22, 163, 74, 0.08)" },
    warn: { stroke: WARN, text: WARN, bg: "rgba(234, 179, 8, 0.07)" },
    bad: { stroke: BAD, text: BAD, bg: "rgba(220, 38, 38, 0.07)" },
    signal: { stroke: SIGNAL, text: TEXT_FG, bg: "rgba(43, 92, 255, 0.10)" },
    fg: { stroke: "rgba(245, 240, 232, 0.35)", text: TEXT_FG, bg: DARK_PANEL },
  }[tone];
  return (
    <g style={{
      opacity,
      transform: `translateY(${(1 - opacity) * 5}px) scale(${0.96 + 0.04 * opacity})`,
      transformBox: "fill-box",
      transformOrigin: "center",
      transition: "opacity 420ms cubic-bezier(0.4, 0, 0.2, 1), transform 420ms cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      <rect x={x} y={y} width={w} height={h} rx={h / 2}
        fill={palette.bg} stroke={palette.stroke} strokeWidth={ring ? 1.4 : 1}
        style={{ transition: "stroke 250ms ease" }} />
      <text x={x + w / 2} y={y + h / 2 + size * 0.36} textAnchor="middle"
        fontSize={size} fill={palette.text} className="font-mono">{text}</text>
    </g>
  );
}

/** Verdict stamp — a boxed, double-ruled mark that thumps in when `on`. */
function Stamp({ cx, cy, text, tone, on }: { cx: number; cy: number; text: string; tone: "live" | "bad"; on: boolean }) {
  const w = text.length * 4.6 + 16;
  const color = tone === "live" ? LIVE : BAD;
  return (
    <Reveal on={on} pop>
      <g opacity="0.95">
        <rect x={cx - w / 2} y={cy - 9} width={w} height={18} rx={3} fill="rgba(10, 9, 6, 0.6)" stroke={color} strokeWidth="1.2" />
        <rect x={cx - w / 2 + 2.5} y={cy - 6.5} width={w - 5} height={13} rx={1.5} fill="none" stroke={color} strokeWidth="0.6" strokeDasharray="2 2" opacity="0.7" />
        <text x={cx} y={cy + 2.8} textAnchor="middle" fontSize="7" fill={color} className="font-mono" style={{ letterSpacing: "0.1em" }}>
          {text}
        </text>
      </g>
    </Reveal>
  );
}

/** Open-top inbox slot that a delivered packet lands in. */
function Slot({ x, y, label, lit }: { x: number; y: number; label: string; lit: boolean }) {
  const stroke = lit ? LIVE : "rgba(245, 240, 232, 0.3)";
  return (
    <g>
      <path d={`M ${x} ${y} L ${x} ${y + 16} L ${x + 30} ${y + 16} L ${x + 30} ${y}`}
        fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round"
        style={{ transition: "stroke 300ms ease", filter: lit ? "drop-shadow(0 0 4px rgba(22, 163, 74, 0.45))" : undefined }} />
      <Label x={x + 15} y={y + 30} size={7.5} tone={lit ? "live" : "muted"}>{label}</Label>
    </g>
  );
}

/** File tile — a folded-corner rectangle, cirax's answer to the circle. */
function Tile({
  cx, cy, label, tone = "idle", land = 0,
}: {
  cx: number; cy: number; label: string;
  tone?: "idle" | "active" | "pass"; land?: number;
}) {
  const w = 40, h = 28;
  const x = cx - w / 2, y = cy - h / 2;
  const stroke = tone === "pass" ? LIVE : tone === "active" ? SIGNAL : "rgba(245, 240, 232, 0.3)";
  const glow = tone === "pass" ? "drop-shadow(0 0 5px rgba(22, 163, 74, 0.5))"
    : tone === "active" ? "drop-shadow(0 0 5px rgba(43, 92, 255, 0.55))" : undefined;
  return (
    <g key={land} className={land ? "fx-land" : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={DARK_PANEL} stroke={stroke} strokeWidth="1.2"
        style={{ transition: "stroke 300ms ease", filter: glow }} />
      {/* folded corner */}
      <path d={`M ${x + w - 8} ${y} L ${x + w} ${y + 8} L ${x + w - 8} ${y + 8} Z`}
        fill={DARK_BG} stroke={stroke} strokeWidth="1" style={{ transition: "stroke 300ms ease" }} />
      <text x={cx - 2} y={cy + 2.8} textAnchor="middle" fontSize="6.8" fill={TEXT_FG} className="font-mono">{label}</text>
      {tone === "pass" && (
        <g transform={`translate(${x + w - 2} ${y - 2})`}>
          <circle r="6" fill="#0A0906" stroke={LIVE} strokeWidth="1.1" />
          <path d="M -2.6 0.2 L -0.6 2.4 L 3 -2" pathLength={10} className="fx-draw"
            fill="none" stroke={LIVE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
}

/** Ambient layer — dot grid, breathing cobalt glow, vignette, corner ticks. */
function Ambient() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const dots = `fxd-${uid}`;
  const glow = `fxg-${uid}`;
  const vig = `fxv-${uid}`;
  const tick = 7, o = 9;
  const corner = (x: number, y: number, sx: number, sy: number) =>
    `M ${x + sx * tick} ${y} L ${x} ${y} L ${x} ${y + sy * tick}`;
  return (
    <g aria-hidden="true">
      <defs>
        <pattern id={dots} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill="rgba(245, 240, 232, 0.05)" />
        </pattern>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(43, 92, 255, 0.10)" />
          <stop offset="100%" stopColor="rgba(43, 92, 255, 0)" />
        </radialGradient>
        <radialGradient id={vig} cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0)" />
          <stop offset="70%" stopColor="rgba(0, 0, 0, 0)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.30)" />
        </radialGradient>
      </defs>
      <rect width="560" height="264" fill={`url(#${dots})`} />
      <circle className="fx-breathe" cx="292" cy="128" r="155" fill={`url(#${glow})`} />
      <rect width="560" height="264" fill={`url(#${vig})`} />
      <g stroke="rgba(245, 240, 232, 0.14)" strokeWidth="1" fill="none">
        <path d={corner(o, o, 1, 1)} />
        <path d={corner(560 - o, o, -1, 1)} />
        <path d={corner(o, 264 - o, 1, -1)} />
        <path d={corner(560 - o, 264 - o, -1, -1)} />
      </g>
    </g>
  );
}

function Screen({
  name, pill, pillTone = "muted", innerRef, children,
}: {
  name: string; pill: string; pillTone?: "ok" | "warn" | "muted";
  innerRef?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={innerRef}
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: DARK_BG,
        border: "1px solid rgba(245, 240, 232, 0.06)",
        boxShadow: "inset 0 1px 0 rgba(245, 240, 232, 0.05)",
      }}
    >
      <style>{FX_CSS}</style>
      <ToolHeader name={name} pill={pill} pillTone={pillTone} dark pulse />
      <div className="overflow-x-auto flex justify-center">
        <svg viewBox="0 0 560 264" style={{ width: "100%", maxWidth: 780, minWidth: 560, display: "block" }}>
          <Ambient />
          {children}
        </svg>
      </div>
    </div>
  );
}

/* ── KERNEX — a security checkpoint for syscalls ───────────────────────────
   The agent lives in a working terminal (each attempt types itself), hits
   the barred gate, and allowed syscalls ride an elbow into one of two inbox
   slots that receive a verdict stamp. Denied syscalls die at the wall.   */

const K_AGENT: Pt = [156, 122];
const K_WALL = 273;
const K_FS: Pt = [516, 86];
const K_NET: Pt = [516, 162];
const K_ELBOW_FS: Pt[] = [[297, 116], [318, 116], [318, 86], [506, 86]];
const K_ELBOW_NET: Pt[] = [[297, 130], [318, 130], [318, 162], [506, 162]];

export function KernexFlow() {
  const screenRef = useRef<HTMLDivElement>(null);
  const T = useLoopT(12400, screenRef);
  const show = (at: number) => T >= at;
  const inWindow = (a: number, b: number) => T >= a && T < b;

  const wallPass = inWindow(1500, 2300) || inWindow(9900, 10700);
  const wallBlock = inWindow(4700, 5600);
  const wallTone = wallPass ? LIVE : wallBlock ? BAD : "rgba(245, 240, 232, 0.3)";
  const wallLit = wallPass || wallBlock;

  // terminal typing — each attempt types its syscall into the agent window
  const syscalls = ['open(./data/q3.csv)', 'connect(telemetry.vendor.io)'];
  const active = T < 3400 ? 0 : 1;
  const typeAt = T < 3400 ? 300 : T < 8600 ? 3400 : 8600;
  const line = syscalls[active];
  const chars = Math.floor(clamp01((T - typeAt) / 520) * line.length);
  const typing = chars < line.length;
  const paused = inWindow(5600, 8600);

  return (
    <Screen innerRef={screenRef} name="kernex · syscall gate" pill="deny by default" pillTone="warn">
      {/* agent terminal */}
      <g>
        <rect x={24} y={88} width={132} height={76} rx={6} fill={DARK_PANEL} stroke="rgba(245, 240, 232, 0.28)" strokeWidth="1" />
        <line x1={24} y1={104} x2={156} y2={104} stroke="rgba(245, 240, 232, 0.14)" strokeWidth="1" />
        {[[32, 96], [41, 96], [50, 96]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.8" fill={i === 0 ? BAD : i === 1 ? WARN : LIVE} opacity="0.8" />
        ))}
        <text x={148} y={99} textAnchor="end" fontSize="5.5" fill={TEXT_MUTED} className="font-mono">agent</text>
        <text x={34} y={120} fontSize="6" fill={TEXT_MUTED} className="font-mono">python agent.py</text>
        <text x={34} y={134} fontSize="6" fill={TEXT_FG} className="font-mono">
          {"$ "}
          {line.slice(0, chars)}
          <tspan className={typing ? "fx-blink" : undefined} fill={SIGNAL}>▌</tspan>
        </text>
        {/* status LED */}
        <circle cx={146} cy={152} r="2.4"
          fill={paused ? WARN : LIVE}
          className={paused ? undefined : "fx-dot"}
          style={{ transition: "fill 300ms ease" }} />
        <text x={136} y={154.5} textAnchor="end" fontSize="5" fill={TEXT_MUTED} className="font-mono">
          {paused ? "paused" : "running"}
        </text>
      </g>

      {/* main wire agent → gate */}
      <Wire x1={K_AGENT[0]} y1={K_AGENT[1]} x2={K_WALL} y2={122} T={T} litAt={300} />

      {/* kernel gate wall */}
      <Label x={285} y={82} size={8.5} tone="fg">KERNEL GATE</Label>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={273} y={96 + i * 12} width={24} height={5} rx={2}
          fill={wallTone} opacity={wallLit ? 0.92 : 0.55}
          style={{
            transition: "fill 200ms ease, opacity 200ms ease",
            filter: wallLit ? `drop-shadow(0 0 4px ${wallTone})` : undefined,
          }} />
      ))}
      <Label x={285} y={168} size={6.5}>landlock + seccomp</Label>

      {/* lanes */}
      <PolyWire pts={K_ELBOW_FS} T={T} litAt={1600} />
      <PolyWire pts={K_ELBOW_NET} T={T} litAt={10000} />
      <Slot x={506} y={78} label="filesystem" lit={show(2700)} />
      <Slot x={506} y={154} label="network" lit={show(11000)} />

      {/* packets */}
      {T >= 300 && T < 1600 && (
        <FlowPacket T={T} t0={300} t1={1600} path={[[K_AGENT[0], K_AGENT[1]], [K_WALL, 122]]} />
      )}
      {T >= 1600 && T < 2700 && (
        <FlowPacket T={T} t0={1600} t1={2700} path={[...K_ELBOW_FS, K_FS]} />
      )}
      {T >= 3400 && T < 4700 && (
        <FlowPacket T={T} t0={3400} t1={4700} path={[[K_AGENT[0], K_AGENT[1]], [K_WALL, 122]]} />
      )}
      {T >= 8600 && T < 9900 && (
        <FlowPacket T={T} t0={8600} t1={9900} path={[[K_AGENT[0], K_AGENT[1]], [K_WALL, 122]]} />
      )}
      {T >= 9900 && T < 11000 && (
        <FlowPacket T={T} t0={9900} t1={11000} path={[...K_ELBOW_NET, K_NET]} />
      )}

      {/* deny burst where the blocked syscall dies */}
      {inWindow(4700, 5400) && (
        <circle key="deny" className="fx-deny" cx={285} cy={122} r={10} fill="none" stroke={BAD} strokeWidth="1.4" />
      )}

      {/* verdict stamps */}
      <Stamp cx={430} cy={64} text="ALLOWED" tone="live" on={show(2600)} />
      <Stamp cx={205} cy={100} text="BLOCKED" tone="bad" on={inWindow(4800, 8600)} />
      <Stamp cx={430} cy={140} text="ALLOWED · once" tone="live" on={show(10800)} />

      {/* pause + operator decision */}
      <Wire x1={285} y1={152} x2={285} y2={192} T={T} litAt={5400} dashed />
      <Reveal on={inWindow(5600, 8600)}>
        <Chip x={210} y={196} w={150} h={20} size={6.8} tone="warn" text="paused · not in policy" />
      </Reveal>
      <Reveal on={show(5800)}>
        <g key={show(8000) ? "granted" : "deciding"} className={show(8000) ? "fx-pop" : undefined}>
          <Chip x={191} y={222} w={188} h={24} size={7}
            tone={show(8000) ? "live" : "fg"} ring={show(8000)}
            text={show(8000) ? "operator · [a] allow once ✓" : "operator · deciding…"} />
        </g>
      </Reveal>
    </Screen>
  );
}

/* ── MERCER — a read-head riding a rail through six stations ───────────────
   The pipeline is a rail, the stations are notches, and a glowing read-head
   glides station to station. The candidate race runs on three lanes above
   the rail while the head dwells at station four.                       */

const M_STATIONS = ["retrieve", "link", "decompose", "candidates", "execute", "correct"];
const M_X = [64, 152, 240, 328, 416, 504];
const M_RAIL_Y = 150;
const M_ARRIVE = [1500, 2100, 2700, 3300, 6100, 6700];
// head glides during the last 400ms before each arrival
const M_GLIDES: Array<[number, number, number, number]> = [
  [1700, 2100, M_X[0], M_X[1]],
  [2300, 2700, M_X[1], M_X[2]],
  [2900, 3300, M_X[2], M_X[3]],
  [5700, 6100, M_X[3], M_X[4]],
  [6300, 6700, M_X[4], M_X[5]],
];

export function MercerFlow() {
  const screenRef = useRef<HTMLDivElement>(null);
  const T = useLoopT(12400, screenRef);

  const question = "top customers by spend this quarter?";
  const qChars = Math.floor(clamp01((T - 100) / 900) * question.length);

  // read-head position
  let hx = M_X[0];
  for (const [t0, t1, x0, x1] of M_GLIDES) {
    if (T >= t1) hx = x1;
    else if (T >= t0) { hx = lerp(x0, x1, easeInOut(clamp01((T - t0) / (t1 - t0)))); break; }
  }
  const headOn = T >= 1500;

  const stationState = (i: number): "idle" | "active" | "done" => {
    const settle = i === 3 ? 5600 : M_ARRIVE[i] + 400;
    if (T >= settle) return "done";
    if (T >= M_ARRIVE[i]) return "active";
    return "idle";
  };

  const sql1 = "SELECT c.cust_nm, SUM(o.total_amt)";
  const sql2 = "FROM ord_hdr GROUP BY 1 LIMIT 5;";
  const sqlChars = Math.floor(clamp01((T - 7300) / 1600) * (sql1.length + sql2.length + 1));
  const sqlDone = sqlChars > sql1.length + sql2.length;

  // candidate race on three lanes above the rail
  const lanes = [
    { t: "CoT @0.0", y: 92, win: true, start: 3900, end: 4450 },
    { t: "D&C @0.2", y: 110, win: false, start: 4050, end: 4700 },
    { t: "P&E @0.3", y: 128, win: false, start: 4200, end: 4650 },
  ];
  const winner = T >= 4600;

  return (
    <Screen innerRef={screenRef} name="mercer · question → sql" pill="6 stages · local gpu">
      {/* question */}
      <rect x={14} y={24} width={208} height={26} rx={13} fill={DARK_PANEL} stroke="rgba(245, 240, 232, 0.25)" strokeWidth="1" />
      <text x={28} y={40} fontSize={7.2} fill={TEXT_FG} className="font-mono">
        {question.slice(0, qChars)}
        {qChars < question.length && <tspan className="fx-blink" fill={SIGNAL}>▌</tspan>}
      </text>

      {/* question elbow into the rail */}
      <PolyWire pts={[[118, 50], [118, 88], [64, 88], [64, 138]]} T={T} litAt={1200} />

      {/* rail + progress */}
      <line x1={40} y1={M_RAIL_Y} x2={520} y2={M_RAIL_Y} stroke={STROKE_IDLE} strokeWidth="1" />
      {headOn && (
        <line x1={40} y1={M_RAIL_Y} x2={hx} y2={M_RAIL_Y} stroke={SIGNAL} strokeWidth="1.6" opacity="0.7"
          style={{ transition: "all 120ms cubic-bezier(0.4, 0, 0.2, 1)" }} />
      )}

      {/* stations */}
      {M_STATIONS.map((name, i) => {
        const state = stationState(i);
        return (
          <g key={name}>
            <text x={M_X[i]} y={133} textAnchor="middle" fontSize="5" fill={TEXT_MUTED} className="font-mono">
              {String(i + 1).padStart(2, "0")}
            </text>
            <rect x={M_X[i] - 5} y={141} width={10} height={18} rx={2}
              fill={state === "done" ? "rgba(43, 92, 255, 0.15)" : DARK_PANEL}
              stroke={state === "idle" ? "rgba(245, 240, 232, 0.28)" : SIGNAL} strokeWidth="1.1"
              style={{ transition: "stroke 300ms ease, fill 300ms ease" }} />
            {state === "done" && (
              <path d={`M ${M_X[i] - 3} 150.4 L ${M_X[i] - 0.8} 152.8 L ${M_X[i] + 3.4} 147.6`}
                pathLength={10} className="fx-draw" fill="none" stroke={SIGNAL} strokeWidth="1.3"
                strokeLinecap="round" strokeLinejoin="round" />
            )}
            {state === "active" && (
              <circle className="fx-halo" cx={M_X[i]} cy={150} r={13} fill="none" stroke={SIGNAL} strokeWidth="1" />
            )}
            <Label x={M_X[i]} y={176} size={7} tone={state === "idle" ? "muted" : "fg"}>{name}</Label>
          </g>
        );
      })}

      {/* read-head */}
      {headOn && (
        <g style={{ transform: `translate(${hx - M_X[0]}px, 0px)`, transition: "transform 120ms cubic-bezier(0.4, 0, 0.2, 1)", filter: "drop-shadow(0 0 5px rgba(43, 92, 255, 0.7))" }}>
          <rect x={M_X[0] - 8} y={144} width={16} height={12} rx={3} fill={SIGNAL} />
          <rect x={M_X[0] - 3} y={147.5} width={6} height={5} rx={1} fill="#0A0906" opacity="0.55" />
        </g>
      )}

      {/* candidate race lanes */}
      {lanes.map((l) => {
        const p = clamp01((T - l.start) / (l.end - l.start));
        const cx = 256 + easeInOut(p) * 128;
        const dim = winner && !l.win;
        const on = T >= l.start;
        return (
          <g key={l.t} style={{ opacity: dim ? 0.28 : 1, transition: "opacity 350ms ease" }}>
            <line x1={252} y1={l.y} x2={404} y2={l.y} stroke={l.win && winner ? LIVE : STROKE_IDLE} strokeWidth="1"
              style={{ transition: "stroke 300ms ease" }} />
            {on && (
              <g style={{ transform: `translate(${cx - 256}px, 0px)`, transition: "transform 110ms linear" }}>
                <Chip x={230} y={l.y - 8} w={52} h={16} size={6}
                  text={winner && l.win ? "CoT @0.0 ✓" : l.t}
                  tone={winner && l.win ? "live" : "fg"} ring={winner && l.win} />
              </g>
            )}
          </g>
        );
      })}

      {/* external inputs */}
      <Wire x1={152} y1={204} x2={152} y2={163} T={T} litAt={2100} dashed />
      <Chip x={96} y={206} w={112} h={20} size={6.5} text="schema · 214 tables" tone={T >= 2100 ? "signal" : "muted"} />
      <Wire x1={504} y1={204} x2={504} y2={163} T={T} litAt={6700} dashed />
      <Chip x={448} y={206} w={112} h={20} size={6.5} text="taxonomy rules" tone={T >= 6700 ? "signal" : "muted"} />

      {/* SQL out */}
      <rect x={376} y={20} width={170} height={48} rx={8}
        fill="#0A0906" stroke={sqlDone ? LIVE : DARK_LINE} strokeWidth="1"
        style={{
          transition: "stroke 300ms ease, filter 300ms ease",
          filter: sqlDone ? "drop-shadow(0 0 6px rgba(22, 163, 74, 0.35))" : undefined,
        }} />
      <text x={388} y={38} fontSize={6.4} fill={TEXT_FG} className="font-mono">
        {sql1.slice(0, Math.max(0, Math.min(sql1.length, sqlChars))) || " "}
      </text>
      <text x={388} y={52} fontSize={6.4} fill={TEXT_FG} className="font-mono">
        {sqlChars > sql1.length ? sql2.slice(0, sqlChars - sql1.length - 1) : " "}
      </text>
      <Reveal on={sqlDone}>
        <Label x={461} y={82} size={6.8} tone="live">sqlglot ✓ · single SELECT</Label>
      </Reveal>
    </Screen>
  );
}

/* ── MEDFORMER — the grounding loop ────────────────────────────────────────
   One horizontal instrument axis: the film is scanned and its finding boxed,
   both streams pour into a spinning aperture that fuses them, the merged
   beam types the answer — and then the loop closes: the answer's [1] tethers
   down to the evidence drawer, and a second tether runs from the drawer back
   to the finding on the film. Cite → evidence → pixels.                  */

const MD_IMG_RIBBON = quadPts([134, 94], [220, 96], [286, 113], 24);
const MD_TXT_RIBBON = quadPts([192, 182], [252, 184], [287, 127], 24);
const MD_MERGED = quadPts([315, 111], [370, 108], [420, 110], 16);
const MD_TETHER_1 = quadPts([522, 138], [440, 196], [336, 228], 24);
const MD_TETHER_2 = quadPts([260, 226], [150, 196], [80, 124], 24);

export function MedFormerFlow() {
  const screenRef = useRef<HTMLDivElement>(null);
  const T = useLoopT(12400, screenRef);
  const show = (at: number) => T >= at;
  const inWindow = (a: number, b: number) => T >= a && T < b;

  const sweepY = 60 + clamp01((T - 500) / 1200) * 68;
  const sweeping = T >= 500 && T <= 1700;
  const fused = show(5600);

  const answer1 = "lobar opacity →";
  const answer2 = "bacterial pneumonia";
  const aChars = Math.floor(clamp01((T - 5800) / 1700) * (answer1.length + answer2.length + 1));
  const answerDone = aChars > answer1.length + answer2.length;

  const enc = pathPoint(MD_IMG_RIBBON, 0.48);
  const llm = pathPoint(MD_TXT_RIBBON, 0.48);

  return (
    <Screen innerRef={screenRef} name="medformer · grounded answers" pill="idefics2-ft + rag">
      {/* the film — lightbox panel with scan */}
      <rect x={24} y={52} width={110} height={84} rx={6} fill={DARK_PANEL} stroke="rgba(245, 240, 232, 0.28)" strokeWidth="1" />
      <rect x={32} y={60} width={94} height={68} rx={3} fill="rgba(0, 0, 0, 0.35)" />
      {[76, 91, 106].map((y) => (
        <line key={y} x1={34} y1={y} x2={124} y2={y} stroke="rgba(245, 240, 232, 0.05)" strokeWidth="1" />
      ))}
      {sweeping && (
        <g>
          <rect x={32} y={60} width={94} height={Math.max(0, sweepY - 60)} fill="rgba(43, 92, 255, 0.08)"
            style={{ transition: "height 110ms linear" }} />
          <line x1={32} y1={sweepY} x2={126} y2={sweepY} stroke={SIGNAL} strokeWidth="1.5" opacity="0.75"
            style={{ filter: "drop-shadow(0 0 3px rgba(43, 92, 255, 0.6))" }} />
        </g>
      )}
      {/* the finding — regrounded green once the loop closes */}
      <Reveal on={show(1900)} pop>
        <rect x={52} y={78} width={54} height={40} rx={2} fill="none"
          stroke={show(9500) ? LIVE : SIGNAL} strokeWidth="1.2"
          style={{
            transition: "stroke 300ms ease",
            filter: show(9500) ? "drop-shadow(0 0 5px rgba(22, 163, 74, 0.55))" : "drop-shadow(0 0 4px rgba(43, 92, 255, 0.5))",
          }} />
      </Reveal>
      {inWindow(9500, 10100) && (
        <circle key="ground" className="fx-deny" cx={79} cy={98} r={12} fill="none" stroke={LIVE} strokeWidth="1.2" />
      )}
      <Label x={79} y={150} size={6.5}>chest-xray-042.png</Label>

      {/* question */}
      <Chip x={24} y={170} w={168} h={24} size={6.8} tone="fg" text="what does the opacity suggest?" opacity={show(800) ? 1 : 0} />

      {/* streams into the aperture */}
      <Ribbon pts={MD_IMG_RIBBON} litAt={2100} T={T} />
      <Ribbon pts={MD_TXT_RIBBON} litAt={2900} T={T} />
      <Ribbon pts={MD_MERGED} litAt={5600} drawMs={500} T={T} />

      {/* transforms riding the ribbons */}
      <g key={show(2900) ? "enc-done" : show(2100) ? "enc-active" : "enc-idle"} className={show(2100) ? "fx-pop" : undefined}>
        <rect x={enc.x - 23} y={enc.y - 8} width={46} height={16} rx={8}
          fill={DARK_PANEL} stroke={show(2100) ? SIGNAL : "rgba(245, 240, 232, 0.3)"} strokeWidth="1.1"
          style={{ filter: show(2100) ? "drop-shadow(0 0 4px rgba(43, 92, 255, 0.5))" : undefined, transition: "stroke 300ms ease" }} />
        <text x={enc.x} y={enc.y + 2.6} textAnchor="middle" fontSize="6.5"
          fill={show(2100) ? TEXT_FG : TEXT_MUTED} className="font-mono">encoder</text>
      </g>
      <g key={show(3700) ? "llm-done" : show(2900) ? "llm-active" : "llm-idle"} className={show(2900) ? "fx-pop" : undefined}>
        <rect x={llm.x - 27} y={llm.y - 8} width={54} height={16} rx={8}
          fill={DARK_PANEL} stroke={show(2900) ? SIGNAL : "rgba(245, 240, 232, 0.3)"} strokeWidth="1.1"
          style={{ filter: show(2900) ? "drop-shadow(0 0 4px rgba(43, 92, 255, 0.5))" : undefined, transition: "stroke 300ms ease" }} />
        <text x={llm.x} y={llm.y + 2.6} textAnchor="middle" fontSize="6.2"
          fill={show(2900) ? TEXT_FG : TEXT_MUTED} className="font-mono">llama-3.1-ft</text>
      </g>

      {/* fusion aperture — spins while both streams arrive, then locks */}
      <g key={fused ? "ring-done" : show(4900) ? "ring-spin" : "ring-idle"}>
        <circle cx={300} cy={118} r={15} fill={fused ? "rgba(43, 92, 255, 0.16)" : "none"}
          stroke={SIGNAL} strokeWidth="1.4"
          strokeDasharray={fused || T < 4900 ? undefined : "16 6"}
          className={!fused && T >= 4900 ? "fx-spin" : undefined}
          style={{ filter: T >= 4900 ? "drop-shadow(0 0 5px rgba(43, 92, 255, 0.6))" : undefined, transition: "fill 300ms ease" }} />
        <circle cx={300} cy={118} r={7} fill={fused ? SIGNAL : DARK_PANEL} stroke={fused ? SIGNAL : "rgba(245, 240, 232, 0.3)"} strokeWidth="1"
          style={{ transition: "fill 300ms ease, stroke 300ms ease" }} />
      </g>
      <Label x={300} y={152} size={7} tone={fused ? "fg" : "muted"}>fusion</Label>
      {inWindow(5600, 6200) && (
        <circle key="fuse" className="fx-deny" cx={300} cy={118} r={16} fill="none" stroke={SIGNAL} strokeWidth="1.2" />
      )}

      {/* evidence drawer */}
      {[208, 222, 236].map((y, i) => {
        const cited = i === 1;
        const lit = show(4600) && cited;
        return (
          <g key={y} className={lit ? "fx-pop" : undefined}>
            <rect x={262} y={y} width={72} height={12} rx={3}
              fill={DARK_PANEL} stroke={lit ? LIVE : "rgba(245, 240, 232, 0.22)"} strokeWidth="1"
              style={{ transition: "stroke 300ms ease" }} />
            <text x={268} y={y + 8} fontSize={5.5} fill={lit ? LIVE : TEXT_MUTED} className="font-mono">
              {cited ? "[1] radiograph.md" : `doc-0${i + 1}`}
            </text>
          </g>
        );
      })}
      <Label x={298} y={260} size={6}>evidence · reranked</Label>

      {/* answer */}
      <rect x={420} y={84} width={116} height={56} rx={8}
        fill={DARK_PANEL} stroke={answerDone ? SIGNAL : "rgba(245, 240, 232, 0.25)"} strokeWidth="1"
        style={{
          transition: "stroke 300ms ease, filter 300ms ease",
          filter: answerDone ? "drop-shadow(0 0 6px rgba(43, 92, 255, 0.35))" : undefined,
        }} />
      <text x={432} y={106} fontSize={6.8} fill={TEXT_FG} className="font-mono">
        {answer1.slice(0, Math.max(0, Math.min(answer1.length, aChars))) || " "}
      </text>
      <text x={432} y={120} fontSize={6.8} fill={TEXT_FG} className="font-mono">
        {aChars > answer1.length ? answer2.slice(0, aChars - answer1.length - 1) : " "}
      </text>
      <Reveal on={show(7800)}>
        <text x={526} y={133} fontSize={6.5} fill={LIVE} className="font-mono">[1]</text>
      </Reveal>

      {/* the grounding loop — answer cites the drawer, the drawer cites the film */}
      <PolyWire pts={MD_TETHER_1} T={T} litAt={8200} dashed drawMs={600} />
      <PolyWire pts={MD_TETHER_2} T={T} litAt={9000} dashed drawMs={600} />

      {/* packets */}
      {T >= 2200 && T < 2900 && (
        <FlowPacket T={T} t0={2200} t1={2900} path={MD_IMG_RIBBON} />
      )}
      {T >= 3000 && T < 3700 && (
        <FlowPacket T={T} t0={3000} t1={3700} path={MD_TXT_RIBBON} />
      )}
      {T >= 3900 && T < 4600 && (
        <FlowPacket T={T} t0={3900} t1={4600} path={[[298, 228], [296, 180], [289, 132]]} color={LIVE} r={3} />
      )}
    </Screen>
  );
}

/* ── CIRAX — route search over a layered conversion graph ──────────────────
   A proper three-column route graph: source column, via column, target
   column. Dijkstra's sweep crawls the dotted edges, the best chain locks
   into a shallow V across the top (weight chips flip cobalt, rejected
   branches dim), and the file ghost runs it inside the bwrap jail.      */

export function CiraxFlow() {
  const screenRef = useRef<HTMLDivElement>(null);
  const T = useLoopT(11000, screenRef);
  const show = (at: number) => T >= at;

  const searching = T < 3600;
  const locked = show(3600);

  // directed edges of the conversion graph, in discovery order
  const EDGES: Array<{
    pts: Pt[]; w: string; at: number; chain?: boolean; chip: { x: number; y: number; w: number };
  }> = [
    { pts: [[110, 128], [265, 94]], w: "pandoc · 0.98", at: 400, chain: true, chip: { x: 161, y: 92, w: 54 } },
    { pts: [[110, 146], [265, 178]], w: "libreoffice · 0.92", at: 900, chip: { x: 158, y: 170, w: 62 } },
    { pts: [[285, 170], [285, 102]], w: "0.90", at: 1400, chip: { x: 293, y: 130, w: 30 } },
    { pts: [[305, 94], [455, 128]], w: "libvips · 0.94", at: 1900, chain: true, chip: { x: 352, y: 92, w: 52 } },
    { pts: [[305, 178], [455, 146]], w: "calibre · 0.58", at: 2400, chip: { x: 352, y: 170, w: 52 } },
  ];

  return (
    <Screen innerRef={screenRef} name="cirax · route search" pill="109 formats · dijkstra">
      {/* edges — base hairlines; rejected branches dim once the route locks */}
      {EDGES.map((e, i) => {
        const rejected = locked && !e.chain;
        const [x1, y1] = e.pts[0];
        const [x2, y2] = e.pts[1];
        return (
          <g key={i} style={{ opacity: rejected ? 0.35 : 1, transition: "opacity 500ms ease" }}>
            <Wire x1={x1} y1={y1} x2={x2} y2={y2} T={T} />
          </g>
        );
      })}

      {/* sequential discovery sweep */}
      {EDGES.map((e, i) => {
        const [x1, y1] = e.pts[0];
        const [x2, y2] = e.pts[1];
        return (
          <g key={i} style={{ opacity: searching ? 0.5 : 0.12, transition: "opacity 500ms ease" }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={TEXT_MUTED} strokeWidth="1"
              strokeDasharray="2 3"
              strokeDashoffset={String(Math.hypot(x2 - x1, y2 - y1) * (1 - clamp01((T - e.at) / 500)))}
              style={{ transition: "stroke-dashoffset 110ms linear" }} />
          </g>
        );
      })}

      {/* locked chain — a shallow V across the top */}
      <Wire x1={110} y1={128} x2={265} y2={94} T={T} litAt={3600} drawMs={500} />
      <Wire x1={305} y1={94} x2={455} y2={128} T={T} litAt={3900} drawMs={500} />

      {/* sandbox */}
      <rect x={44} y={56} width={478} height={156} rx={10}
        fill={show(4200) ? "rgba(43, 92, 255, 0.035)" : "none"}
        stroke={TEXT_MUTED} strokeWidth="1" strokeDasharray="4 5"
        style={{ opacity: show(4200) ? 0.55 : 0, transition: "opacity 500ms ease, fill 500ms ease" }} />
      <Reveal on={show(4200)}>
        <Label x={56} y={48} size={6.5} anchor="start">bwrap jail · no network</Label>
      </Reveal>

      {/* file tiles in their columns */}
      <Tile cx={90} cy={136} label=".docx" tone={show(3600) ? "active" : "idle"} />
      <Tile cx={285} cy={88} label="pdf" tone={show(3600) ? "active" : "idle"} land={show(5800) && !show(6400) ? 1 : 0} />
      <g style={{ opacity: locked ? 0.4 : 1, transition: "opacity 500ms ease" }}>
        <Tile cx={285} cy={184} label="odt" tone="idle" />
      </g>
      <Tile cx={475} cy={136} label=".png" tone={show(6400) ? "pass" : show(3600) ? "active" : "idle"} land={show(6400) ? 1 : 0} />

      {/* weight chips anchored to their edges */}
      {EDGES.map((e, i) => {
        const rejected = locked && !e.chain;
        const tone = e.chain && show(4100) ? "signal" : "muted";
        return (
          <g key={i} style={{ opacity: rejected ? 0.35 : 1, transition: "opacity 500ms ease" }}>
            <Chip x={e.chip.x} y={e.chip.y} w={e.chip.w} h={12} size={5.2} text={e.w} tone={tone} ring={tone === "signal"} />
          </g>
        );
      })}

      {/* direction chevrons at 65% along each edge */}
      {EDGES.map((e, i) => {
        const [x1, y1] = e.pts[0];
        const [x2, y2] = e.pts[1];
        const p = 0.65;
        const cx = lerp(x1, x2, p), cy = lerp(y1, y2, p);
        const deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
        const rejected = locked && !e.chain;
        return (
          <path key={i} d="M -2 -2.6 L 1.8 0 L -2 2.6" fill="none"
            stroke={e.chain && locked ? SIGNAL : TEXT_MUTED} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
            transform={`translate(${cx} ${cy}) rotate(${deg})`}
            style={{ opacity: rejected ? 0.3 : 0.8, transition: "opacity 500ms ease, stroke 300ms ease" }} />
        );
      })}

      {/* searching pill */}
      <text x={544} y={24} textAnchor="end" fontSize={7} fill={TEXT_MUTED}
        className="font-mono" style={{ opacity: searching ? 1 : 0, transition: "opacity 300ms ease" }}>
        <tspan className={searching ? "fx-blink" : undefined}>●</tspan> searching · dijkstra
      </text>

      {/* run status while the ghost executes the chain */}
      <text x={502} y={204} textAnchor="end" fontSize={6} fill={TEXT_MUTED}
        className="font-mono" style={{ opacity: T >= 5200 && T < 6400 ? 1 : 0, transition: "opacity 300ms ease" }}>
        <tspan className={T >= 5200 && T < 6400 ? "fx-blink" : undefined}>▸</tspan> running · 2 hops
      </text>

      {/* file ghost hopping the locked chain */}
      {T >= 5200 && T < 5800 && (
        <FlowPacket T={T} t0={5200} t1={5800} path={[[110, 128], [265, 94]]} r={3} />
      )}
      {T >= 5800 && T < 6400 && (
        <FlowPacket T={T} t0={5800} t1={6400} path={[[305, 94], [455, 128]]} r={3} />
      )}

      {/* results */}
      <Reveal on={show(4400)}>
        <Label x={280} y={240} size={7.5} tone="signal">route locked · fidelity 0.92</Label>
      </Reveal>
      <Reveal on={show(4800)}>
        <Label x={280} y={253} size={6.5}>58 engines · yaml-defined · every hop sandboxed</Label>
      </Reveal>
    </Screen>
  );
}
