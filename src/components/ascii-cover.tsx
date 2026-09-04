"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import type { Project } from "@/lib/projects";

// Procedural ASCII covers — each project gets a deterministic pattern
// derived from its slug, drawn live on canvas: the field gently undulates,
// and the cursor brightens and repels the characters it passes over.

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DENSITY = " .:-=+*#%@";
const COLS = 58;
const ROWS = 17;

// base intensity 0..1 per cell, per cover pattern
function buildField(kind: Project["cover"], seed: number): number[][] {
  const rand = mulberry32(seed);

  if (kind === "rings") {
    const cx = (COLS - 1) / 2;
    const cy = (ROWS - 1) / 2;
    const maxR = Math.min(cx, cy * 2.2);
    return Array.from({ length: ROWS }, (_, y) =>
      Array.from({ length: COLS }, (_, x) => {
        const dx = (x - cx) * 0.5;
        const dy = y - cy;
        const r = Math.sqrt(dx * dx + dy * dy);
        const ring = Math.sin(r * 2.4 + rand() * 0.5) * 0.5 + 0.5;
        return Math.max(0, Math.min(1, ring * (1 - r / maxR)));
      })
    );
  }

  if (kind === "tables") {
    const field: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let x = 1;
    while (x < COLS - 6) {
      const width = 6 + Math.floor(rand() * 10);
      for (let y = 0; y < ROWS; y++) {
        if (y % 4 === 0) field[y][x] = 0.5;
        field[y][Math.min(COLS - 1, x + width)] = 0.5;
      }
      for (let cx2 = x; cx2 < Math.min(x + width, COLS); cx2++) {
        field[0][cx2] = 0.5;
        field[Math.min(ROWS - 1, (Math.floor(rand() * ROWS / 4)) * 4)][cx2] = 0.4;
        if (rand() < 0.5) {
          const fy = 1 + Math.floor(rand() * (ROWS - 1));
          field[fy][cx2] = 0.25 + rand() * 0.5;
        }
      }
      x += width + 2;
    }
    return field;
  }

  if (kind === "candles") {
    return Array.from({ length: ROWS }, (_, y) => {
      const fromBottom = ROWS - 1 - y;
      return Array.from({ length: COLS }, (_, x) => {
        const body = x % 4 === 1;
        const wick = x % 4 === 2;
        const phase = Math.sin(x * 0.55) * 3 + (rand() - 0.5) * 2;
        const bodyH = 3 + Math.max(0, phase) + fromBottom * 0.35;
        if (body && fromBottom <= bodyH) return 0.9;
        if (wick && fromBottom <= bodyH + 2) return 0.55;
        return 0;
      });
    });
  }

  if (kind === "spark") {
    const points: number[] = [];
    let v = ROWS * 0.7;
    for (let x = 0; x < COLS; x++) {
      v += (rand() - 0.42) * 2.2;
      v = Math.max(2, Math.min(ROWS - 2, v));
      points.push(v);
    }
    return Array.from({ length: ROWS }, (_, y) =>
      Array.from({ length: COLS }, (_, x) => {
        if (Math.round(points[x]) === y) return 1;
        return rand() < 0.06 ? 0.3 : 0;
      })
    );
  }

  // wave — interference pattern (speech formants)
  return Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => {
      const w =
        Math.sin(x * 0.35 + Math.sin(y * 0.8) * 1.5) * 0.5 +
        Math.sin(y * 0.9 + x * 0.12) * 0.5;
      return (w + 1) / 2;
    })
  );
}

const FONT_SIZE = 10;
const CHAR_W = 7;
const CELL_H = 12.2;
const MOUSE_R = 110;

export default function AsciiCover({
  slug,
  kind,
  className = "",
}: {
  slug: string;
  kind: Project["cover"];
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const field = buildField(kind, hashSeed(slug));
    let cols = 0, rows = 0, cellW = CHAR_W, cellH = CELL_H;
    let raf = 0;
    let last = 0;

    function metrics() {
      // Only the backing store is sized here; CSS (absolute + w/h-full +
      // aspect-ratio on the wrap) owns the layout, so the canvas can never
      // feed back into the wrap's height.
      const dpr = window.devicePixelRatio || 1;
      const w = wrap!.offsetWidth;
      const h = wrap!.offsetHeight;
      canvas!.width = Math.max(1, w * dpr);
      canvas!.height = Math.max(1, h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(t: number) {
      const W = wrap!.offsetWidth;
      const H = wrap!.offsetHeight;
      cols = Math.min(COLS, Math.floor(W / cellW));
      rows = Math.min(ROWS, Math.floor(H / cellH));
      const offX = (W - cols * cellW) / 2;
      const offY = (H - rows * cellH) / 2;

      ctx!.clearRect(0, 0, W, H);
      ctx!.font = `${FONT_SIZE}px var(--font-geist-mono), monospace`;
      ctx!.textBaseline = "middle";

      const m = mouseRef.current;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const base = field[y][x];
          if (base <= 0.02 && !m) continue;

          // gentle undulation so the field "moves in general"
          const shimmer = shouldReduce
            ? 1
            : 0.8 + 0.2 * Math.sin(t * 1.6 + x * 0.32 + y * 0.24);
          let a = base * shimmer;

          // cursor: brighten + densify within radius
          let boost = 0;
          if (m) {
            const dx = offX + x * cellW + cellW / 2 - m.x;
            const dy = offY + y * cellH + cellH / 2 - m.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < MOUSE_R) {
              boost = (1 - d / MOUSE_R) ** 2;
              a = Math.min(1, a + boost * 0.8);
            }
          }
          if (a < 0.03) continue;

          const idx = Math.min(DENSITY.length - 1, Math.max(1, Math.round(a * (DENSITY.length - 1))));
          const ch = DENSITY[idx];
          ctx!.fillStyle =
            boost > 0.18
              ? `rgba(96,140,255,${Math.min(1, a + 0.25)})`
              : `rgba(245,240,232,${(0.35 + a * 0.6).toFixed(3)})`;
          ctx!.fillText(ch, offX + x * cellW, offY + y * cellH + cellH / 2);
        }
      }
    }

    function loop(now: number) {
      if (now - last > 66) {
        last = now;
        draw(now / 1000);
      }
      raf = requestAnimationFrame(loop);
    }

    metrics();
    if (shouldReduce) {
      draw(0);
      // still redraw statically on resize/mouse for reduced-motion users
      const ro = new ResizeObserver(() => { metrics(); draw(0); });
      ro.observe(wrap);
      const onMove = () => { metrics(); draw(0); };
      canvas.addEventListener("mousemove", onMove);
      return () => { ro.disconnect(); canvas.removeEventListener("mousemove", onMove); };
    }

    raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => metrics());
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [slug, kind, shouldReduce]);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden rounded-2xl border border-[#2A2820] theme-dark scanlines ${className}`}
      style={{ aspectRatio: "58 / 17" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        }}
        onMouseLeave={() => { mouseRef.current = null; }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(18,17,13,0.9), transparent)" }}
      />
    </div>
  );
}
