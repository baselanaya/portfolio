"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// ── Character set ─────────────────────────────────────────────────────────────
const CHARS = "01/\\|+*.:;[]{}=_~^!<>-#%&";
const FONT_SIZE = 11; // front layer font px

// ── Brand color helpers ───────────────────────────────────────────────────────
const FILL = {
  amber: (a: number) => `rgba(245,158,11,${a.toFixed(3)})`,
  terra: (a: number) => `rgba(194,65,12,${a.toFixed(3)})`,
  base:  (a: number) => `rgba(245,240,232,${a.toFixed(3)})`,
};

// ── Back layer (coarser, dimmer — depth) ──────────────────────────────────────
const BACK_CELL       = 36;
const BACK_BASE_ALPHA = 0.03;
const BACK_PEAK_ALPHA = 0.22;
const BACK_FONT_SIZE  = Math.round(BACK_CELL * 0.55);

// ── Front layer defaults (overridden per-device in initGrid) ──────────────────
const FRONT_BASE_ALPHA = 0.07;
const FRONT_PEAK_ALPHA = 0.55;

// ── Feature constants ─────────────────────────────────────────────────────────
const TERRA_CHANCE    = 0.22;  // fraction of pulses that use terracotta
const RIPPLE_RADIUS   = 130;   // px mouse halo radius
const RIPPLE_PEAK     = 0.50;
const STREAM_EVERY    = 90;    // frames between stream spawns
const STREAM_DELAY    = 3;     // frames between cells in a stream
const EDGE_ZONE       = 220;   // px from viewport edge where vignette kicks in
const EDGE_BOOST      = 0.07;  // extra alpha added at the very edge
const BOOT_COL_DELAY  = 2;     // frames per column during boot sweep
const BOOT_PEAK       = 0.42;  // initial brightness of boot sweep chars

// ── Scroll reactivity ─────────────────────────────────────────────────────────
const SCROLL_BOOST_MAX = 4;    // max multiplier on pulse rate when scrolling

// ── Types ─────────────────────────────────────────────────────────────────────
type AccentColor = "amber" | "terra";

interface Cell {
  char:   string;
  alpha:  number;
  peak:   number;    // 0 = dim; >0 = pulse target
  rising: boolean;
  ripple: number;    // mouse-proximity alpha (front layer only)
  color:  AccentColor;
}

interface Stream {
  col:   number;
  row:   number;
  delay: number;
  color: AccentColor;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const randChar  = () => CHARS[Math.floor(Math.random() * CHARS.length)];
const randPeak  = (max: number) => max * (0.4 + Math.random() * 0.6);
const randColor = (): AccentColor => Math.random() < TERRA_CHANCE ? "terra" : "amber";

function makeGrid(n: number, base: number): Cell[] {
  return Array.from({ length: n }, () => ({
    char:   randChar(),
    alpha:  base * (0.2 + Math.random() * 0.8),
    peak:   0,
    rising: false,
    ripple: 0,
    color:  "amber" as AccentColor,
  }));
}

/** Extra alpha to add near viewport edges (quadratic falloff). */
function edgeAlpha(cx: number, cy: number, W: number, H: number): number {
  const dist = Math.min(cx, cy, W - cx, H - cy);
  const t    = Math.max(0, 1 - dist / EDGE_ZONE);
  return EDGE_BOOST * t * t;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AsciiBackground() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx2d = canvasEl.getContext("2d");
    if (!ctx2d) return;

    // Explicit typed aliases — TypeScript loses narrowing across closures
    const cvs: HTMLCanvasElement        = canvasEl;
    const ctx: CanvasRenderingContext2D = ctx2d;

    // Grid dimensions (set in initGrid)
    let fCols = 0, fRows = 0, frontCell = 20, frontPulseRate = 0.0008;
    let bCols = 0, bRows = 0;
    let frontCells: Cell[] = [];
    let backCells:  Cell[] = [];
    let streams:    Stream[] = [];

    // Animation state
    let frameCount     = 0;
    let mouseX         = -9999, mouseY = -9999;
    let bootCol        = 0;
    let booting        = true;
    let scrollVelocity = 0;
    let lastScrollY    = 0;
    let rafId          = 0;

    // ── Grid init ───────────────────────────────────────────────────────
    function initGrid() {
      const mobile  = window.innerWidth < 768;
      frontCell     = mobile ? 28 : 20;
      frontPulseRate = mobile ? 0.0004 : 0.0008;

      cvs.width  = window.innerWidth;
      cvs.height = window.innerHeight;

      fCols = Math.ceil(cvs.width  / frontCell);
      fRows = Math.ceil(cvs.height / frontCell);
      frontCells = makeGrid(fCols * fRows, FRONT_BASE_ALPHA);

      bCols = Math.ceil(cvs.width  / BACK_CELL);
      bRows = Math.ceil(cvs.height / BACK_CELL);
      backCells = makeGrid(bCols * bRows, BACK_BASE_ALPHA);

      streams  = [];
      bootCol  = 0;
      booting  = true;
    }

    // ── Back layer tick (no ripple, no streams) ─────────────────────────
    function tickBackLayer() {
      const W = cvs.width, H = cvs.height;
      for (let i = 0; i < backCells.length; i++) {
        const cell = backCells[i];
        const col  = i % bCols;
        const row  = Math.floor(i / bCols);
        const cx   = col * BACK_CELL + BACK_CELL / 2;
        const cy   = row * BACK_CELL + BACK_CELL / 2;
        const dim  = BACK_BASE_ALPHA + edgeAlpha(cx, cy, W, H);

        if (cell.peak === 0) {
          cell.alpha += (dim - cell.alpha) * 0.04;
          if (Math.random() < 0.0003) {
            cell.peak   = randPeak(BACK_PEAK_ALPHA);
            cell.rising = true;
            cell.char   = randChar();
            cell.color  = randColor();
          }
        } else if (cell.rising) {
          cell.alpha += (cell.peak - cell.alpha) * 0.08;
          if (cell.alpha >= cell.peak * 0.96) { cell.alpha = cell.peak; cell.rising = false; }
        } else {
          cell.alpha += (dim - cell.alpha) * 0.025;
          if (cell.alpha <= dim * 1.06) { cell.alpha = dim; cell.peak = 0; }
        }

        const a = Math.max(0, Math.min(1, cell.alpha));
        if (a < 0.002) continue;
        ctx.fillStyle = cell.peak > 0 ? FILL[cell.color](a) : FILL.base(a);
        ctx.fillText(cell.char, cx, cy);
      }
    }

    // ── Main animation loop ─────────────────────────────────────────────
    function tick() {
      frameCount++;
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      // Scroll velocity → boost pulse rate when user scrolls fast
      const sy  = window.scrollY;
      const vel = Math.abs(sy - lastScrollY);
      scrollVelocity = scrollVelocity * 0.8 + vel * 0.2;
      lastScrollY    = sy;
      const effectivePulse = frontPulseRate * (1 + Math.min(scrollVelocity * 0.15, SCROLL_BOOST_MAX));

      // Boot sweep: fill columns left-to-right on first load
      if (booting && frameCount % BOOT_COL_DELAY === 0) {
        if (bootCol < fCols) {
          for (let r = 0; r < fRows; r++) {
            const cell = frontCells[r * fCols + bootCol];
            if (cell) cell.alpha = BOOT_PEAK * (0.5 + Math.random() * 0.5);
          }
          bootCol++;
        } else {
          booting = false;
        }
      }

      // ── Back layer ─────────────────────────────────────────────────
      ctx.font         = `${BACK_FONT_SIZE}px "GeistMono", monospace`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      tickBackLayer();

      // ── Column streams (front) ──────────────────────────────────────
      if (frameCount % STREAM_EVERY === 0) {
        streams.push({
          col:   Math.floor(Math.random() * fCols),
          row:   0,
          delay: 0,
          color: randColor(),
        });
      }
      streams = streams.filter((s) => {
        s.delay--;
        if (s.delay <= 0) {
          const idx  = s.row * fCols + s.col;
          const cell = frontCells[idx];
          if (cell) {
            cell.peak   = randPeak(FRONT_PEAK_ALPHA);
            cell.rising = true;
            cell.char   = randChar();
            cell.color  = s.color;
          }
          s.row++;
          s.delay = STREAM_DELAY;
        }
        return s.row <= fRows;
      });

      // ── Front layer ─────────────────────────────────────────────────
      ctx.font = `${FONT_SIZE}px "GeistMono", monospace`;
      const W        = cvs.width, H = cvs.height;
      const ripRadSq = RIPPLE_RADIUS * RIPPLE_RADIUS;

      for (let i = 0; i < frontCells.length; i++) {
        const cell = frontCells[i];
        const col  = i % fCols;
        const row  = Math.floor(i / fCols);
        const cx   = col * frontCell + frontCell / 2;
        const cy   = row * frontCell + frontCell / 2;
        const dim  = FRONT_BASE_ALPHA + edgeAlpha(cx, cy, W, H);

        // Pulse state machine
        if (cell.peak === 0) {
          cell.alpha += (dim - cell.alpha) * 0.05;
          if (Math.random() < effectivePulse) {
            cell.peak   = randPeak(FRONT_PEAK_ALPHA);
            cell.rising = true;
            cell.char   = randChar();
            cell.color  = randColor();
          }
        } else if (cell.rising) {
          cell.alpha += (cell.peak - cell.alpha) * 0.12;
          if (cell.alpha >= cell.peak * 0.96) { cell.alpha = cell.peak; cell.rising = false; }
        } else {
          cell.alpha += (dim - cell.alpha) * 0.035;
          if (cell.alpha <= dim * 1.08) { cell.alpha = dim; cell.peak = 0; }
        }

        // Mouse ripple
        const dx = cx - mouseX, dy = cy - mouseY;
        const distSq = dx * dx + dy * dy;
        let rippleTarget = 0;
        if (distSq < ripRadSq) {
          const t  = 1 - Math.sqrt(distSq) / RIPPLE_RADIUS;
          rippleTarget = RIPPLE_PEAK * t * t;
        }
        cell.ripple += (rippleTarget - cell.ripple) * 0.15;

        // Composite render
        const pulseA  = Math.max(0, Math.min(1, cell.alpha));
        const rippleA = Math.max(0, Math.min(1, cell.ripple));
        const totalA  = Math.min(1, pulseA + rippleA);
        if (totalA < 0.003) continue;

        if (rippleA > 0.02 && rippleA >= pulseA) {
          ctx.fillStyle = FILL.amber(totalA);           // ripple halo → amber
        } else if (cell.peak > 0) {
          ctx.fillStyle = FILL[cell.color](pulseA);     // pulse → brand color
        } else {
          ctx.fillStyle = FILL.base(pulseA);            // resting → muted
        }

        ctx.fillText(cell.char, cx, cy);
      }

      rafId = requestAnimationFrame(tick);
    }

    // ── Static render (prefers-reduced-motion) ──────────────────────────
    function renderStatic() {
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      ctx.font = `${BACK_FONT_SIZE}px "GeistMono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = FILL.base(BACK_BASE_ALPHA);
      for (let i = 0; i < backCells.length; i++) {
        ctx.fillText(backCells[i].char, (i % bCols) * BACK_CELL + BACK_CELL / 2, Math.floor(i / bCols) * BACK_CELL + BACK_CELL / 2);
      }

      ctx.font = `${FONT_SIZE}px "GeistMono", monospace`;
      ctx.fillStyle = FILL.base(FRONT_BASE_ALPHA);
      for (let i = 0; i < frontCells.length; i++) {
        ctx.fillText(frontCells[i].char, (i % fCols) * frontCell + frontCell / 2, Math.floor(i / fCols) * frontCell + frontCell / 2);
      }
    }

    // ── Events ──────────────────────────────────────────────────────────
    const onMouseMove  = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onMouseLeave = ()               => { mouseX = -9999;     mouseY = -9999;     };

    initGrid();
    const ro = new ResizeObserver(initGrid);
    ro.observe(document.documentElement);
    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    if (shouldReduce) {
      renderStatic();
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [shouldReduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    />
  );
}
