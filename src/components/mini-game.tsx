"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

const CELL = 14;
const COLS = 26;
const ROWS = 22;
const TICK_MS = 120;

type Dir = { x: number; y: number };
type Pt  = { x: number; y: number };

function randCell(): Pt {
  return { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
}

export default function MiniGame({ open, onClose }: { open: boolean; onClose: () => void }) {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const stateRef        = useRef({
    snake:   [{ x: 7, y: 11 }, { x: 6, y: 11 }, { x: 5, y: 11 }] as Pt[],
    dir:     { x: 1, y: 0 } as Dir,
    nextDir: { x: 1, y: 0 } as Dir,
    food:    randCell() as Pt,
    score:   0,
    dead:    false,
  });
  const tickRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Reset game ───────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    stateRef.current = {
      snake:   [{ x: 13, y: 11 }, { x: 12, y: 11 }, { x: 11, y: 11 }],
      dir:     { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food:    randCell(),
      score:   0,
      dead:    false,
    };
  }, []);

  // ── Draw ─────────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s   = stateRef.current;

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid dots (subtle)
    ctx.fillStyle = "#1a1a1a";
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + 6, y * CELL + 6, 2, 2);

    // Food — amber pixel
    ctx.fillStyle = "#d97706";
    ctx.fillRect(s.food.x * CELL + 2, s.food.y * CELL + 2, CELL - 4, CELL - 4);

    // Snake
    s.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#f59e0b" : "#92400e";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });

    // Score
    ctx.fillStyle = "#6b7280";
    ctx.font = "9px monospace";
    ctx.fillText(`SCORE: ${s.score}`, 4, canvas.height - 4);

    // Dead overlay
    if (s.dead) {
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 14px monospace";
      const msg = "GAME OVER";
      ctx.fillText(msg, canvas.width / 2 - ctx.measureText(msg).width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = "#6b7280";
      ctx.font = "10px monospace";
      const sub = "press R to restart";
      ctx.fillText(sub, canvas.width / 2 - ctx.measureText(sub).width / 2, canvas.height / 2 + 10);
    }
  }, []);

  // ── Tick ─────────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.dead) return;

    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      s.dead = true; draw(); return;
    }
    // Self collision
    if (s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.dead = true; draw(); return;
    }

    s.snake.unshift(head);

    // Food
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score += 10;
      // Place food away from snake
      let f: Pt;
      do { f = randCell(); } while (s.snake.some(seg => seg.x === f.x && seg.y === f.y));
      s.food = f;
    } else {
      s.snake.pop();
    }

    draw();
  }, [draw]);

  // ── Start/stop loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    reset();
    draw();
    tickRef.current = setInterval(tick, TICK_MS);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [open, reset, tick, draw]);

  // ── Keyboard controls ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      const s = stateRef.current;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "r" || e.key === "R") {
        reset();
        draw();
        if (tickRef.current) clearInterval(tickRef.current);
        tickRef.current = setInterval(tick, TICK_MS);
        return;
      }
      // Arrow / WASD
      const moves: Record<string, Dir> = {
        ArrowUp:    { x: 0, y: -1 }, w: { x: 0, y: -1 },
        ArrowDown:  { x: 0, y: 1  }, s: { x: 0, y: 1  },
        ArrowLeft:  { x: -1, y: 0 }, a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0  }, d: { x: 1,  y: 0 },
      };
      const d = moves[e.key];
      if (d) {
        // Prevent 180° reversal
        const cur = stateRef.current.dir;
        if (d.x !== -cur.x || d.y !== -cur.y) {
          stateRef.current.nextDir = d;
        }
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, reset, tick, draw]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              border: "1px solid var(--color-amber-dim)",
              backgroundColor: "var(--color-surface)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "12px",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono" style={{ fontSize: "11px", color: "var(--color-amber)", letterSpacing: "0.15em" }}>
                ✦ SNAKE.EXE
              </span>
              <span className="font-mono" style={{ fontSize: "9px", color: "var(--color-muted)" }}>
                ARROWS / WASD · R restart · ESC quit
              </span>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={COLS * CELL}
              height={ROWS * CELL}
              style={{ display: "block", imageRendering: "pixelated" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
