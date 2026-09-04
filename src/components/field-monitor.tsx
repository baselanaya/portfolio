"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Field Monitor: the hero's signature element, sixtytwo-style.
// an animated ASCII field with real project facts surfacing as data chips.
// The field is cursor-interactive: characters brighten and densify under
// the pointer, with a soft lens glow following the mouse.

const DENSITY = " .·:;=+*#%@";
const COLS = 46;
const ROWS = 15;

const FACTS = [
  "KERNEX · zero-trust agent sandbox",
  "QWEN3.8 · 27B served via NIM",
  "MEDFORMER · 64.4% med-bench avg",
  "CIRAX · 109 formats, 0 uploads",
  "MERCER · SQL on hostile schemas",
  "COREREPORTS · 9 governed views",
];

const CHIP_SPOTS = [
  { top: "10%", left: "8%" },
  { top: "42%", left: "34%" },
  { top: "64%", left: "12%" },
  { top: "20%", left: "30%" },
];

function fieldAt(t: number, m?: { px: number; py: number } | null): string[] {
  return Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => {
      const v =
        Math.sin(x * 0.32 + t * 0.9 + Math.sin(y * 0.52 + t * 0.55) * 1.35) * 0.5 +
        Math.sin(y * 0.26 - t * 0.42 + x * 0.08) * 0.5;
      let n = (v + 1) / 2;
      // cursor lens — characters brighten and densify under the pointer
      if (m) {
        const dx = (x / COLS) * 100 - m.px;
        const dy = (y / ROWS) * 100 - m.py;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 36) n = Math.min(1, n + (1 - d / 36) * 0.9);
      }
      return DENSITY[Math.min(DENSITY.length - 1, Math.floor(n * DENSITY.length))];
    }).join("")
  );
}

export default function FieldMonitor() {
  const shouldReduce = useReducedMotion();
  const mouseRef = useRef<{ px: number; py: number } | null>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<string[]>(() => fieldAt(0));
  const [factIdx, setFactIdx] = useState(0);

  useEffect(() => {
    if (shouldReduce) return;
    const t0 = Date.now();
    const id = setInterval(() => {
      setFrame(fieldAt((Date.now() - t0) / 1000, mouseRef.current));
    }, 110);
    return () => clearInterval(id);
  }, [shouldReduce]);

  useEffect(() => {
    if (shouldReduce) return;
    const id = setInterval(() => setFactIdx((i) => (i + 1) % FACTS.length), 2600);
    return () => clearInterval(id);
  }, [shouldReduce]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mouseRef.current = { px: (x / r.width) * 100, py: (y / r.height) * 100 };
    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
      glowRef.current.style.transform = `translate(${x - 90}px, ${y - 90}px)`;
    }
  }

  function onMouseLeave() {
    mouseRef.current = null;
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }

  const activeFact = FACTS[factIdx];
  const spot = CHIP_SPOTS[factIdx % CHIP_SPOTS.length];

  return (
    <div
      className="theme-dark scanlines relative overflow-hidden rounded-2xl border border-[#2A2820]"
      aria-label="Animated ASCII field monitor surfacing project facts"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <pre
        aria-hidden="true"
        className="font-mono select-none"
        style={{
          fontSize: "15px",
          lineHeight: 1.28,
          letterSpacing: "0.1em",
          color: "var(--color-terminal-fg)",
          opacity: 0.7,
          padding: "20px 18px 12px",
          margin: 0,
        }}
      >
        {frame.map((row) => row).join("\n")}
      </pre>

      {/* cursor lens glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute top-0 left-0 w-[180px] h-[180px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(43,92,255,0.22) 0%, transparent 70%)",
          opacity: 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Surfacing data chips — real facts only */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeFact}
            className="font-mono absolute inline-block rounded-full border px-2.5 py-1 whitespace-nowrap"
            style={{
              ...spot,
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: "var(--color-terminal-fg)",
              backgroundColor: "rgba(18,17,13,0.88)",
              borderColor: "rgba(43,92,255,0.65)",
              boxShadow: "0 0 18px rgba(43,92,255,0.25)",
            }}
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {activeFact}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-5 pb-5 pt-2 relative">
        <span
          className="font-mono"
          style={{ fontSize: "10px", color: "var(--color-terminal-muted)", letterSpacing: "0.15em" }}
        >
          FIELD MONITOR · LIVE
        </span>
        <span
          className="font-mono inline-flex items-center gap-1.5"
          style={{ fontSize: "11px", color: "var(--color-live)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
            style={{ backgroundColor: "var(--color-live)" }}
            aria-hidden="true"
          />
          {shouldReduce ? "data: real" : "streaming"}
        </span>
      </div>
    </div>
  );
}
