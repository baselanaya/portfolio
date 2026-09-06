"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DARK_BG, DARK_LINE, DARK_PANEL } from "@/components/demos/interfaces";

// ── helpers ────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono mb-5"
      style={{ fontSize: "10px", letterSpacing: "0.2em", color: "var(--color-signal)" }}
    >
      {children}
    </p>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-medium tracking-tight mb-5" style={{ fontSize: "26px" }}>
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 max-w-[65ch]" style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--color-muted)" }}>
      {children}
    </p>
  );
}

// ── SM explorer ────────────────────────────────────────────────────────────

type Part = "cores" | "scheduler" | "regs" | "smem";

const PART_INFO: Record<Part, { name: string; job: string }> = {
  cores: {
    name: "128 CUDA cores",
    job: "The muscle. Each core executes one floating-point instruction per clock, more or less. Deliberately dumb: no branch predictor, no out-of-order tricks. All the cleverness lives in the scheduler and the memory system.",
  },
  scheduler: {
    name: "4 warp schedulers",
    job: "The switchboard. Every clock, each scheduler picks one warp (a bundle of 32 threads) from its 32-core partition and fires an instruction. If that warp stalls on memory, it flips to another ready warp the same cycle. Day 01's supply trick, implemented in silicon.",
  },
  regs: {
    name: "Register file",
    job: "Roughly 256KB of registers per SM, carved up among whichever threads currently live here. Threads don't request registers at runtime; the compiler budgets them at launch. This is the fastest storage your kernel can touch, and the first thing to run out of.",
  },
  smem: {
    name: "Shared memory",
    job: "Up to ~100KB of on-chip scratchpad that your kernel manages explicitly. Roughly an order of magnitude faster than global memory. It's the difference between a kernel that screams and one that crawls, and it gets its own day (08).",
  },
};

const SM_COUNT = 46;

function SMExplorer() {
  const [view, setView] = useState<"chip" | "sm">("chip");
  const [tile, setTile] = useState(18);
  const [part, setPart] = useState<Part>("cores");

  const info = PART_INFO[part];

  return (
    <div className="rounded-2xl overflow-hidden my-10" style={{ backgroundColor: DARK_BG }}>
      {/* controls */}
      <div
        className="px-5 sm:px-7 py-4 border-b flex flex-wrap items-center justify-between gap-3"
        style={{ borderColor: DARK_LINE, backgroundColor: DARK_PANEL }}
      >
        <p className="font-mono" style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#A39B8B" }}>
          {view === "chip" ? "RTX 4070 · 46 STREAMING MULTIPROCESSORS" : `SM ${String(tile + 1).padStart(2, "0")} / 46 · CLICK A PART`}
        </p>
        {view === "sm" ? (
          <button
            onClick={() => setView("chip")}
            className="font-mono rounded-full px-4 py-1.5 border transition-colors duration-150"
            style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#F5F0E8", borderColor: "#2B5CFF" }}
          >
            ← back to the chip
          </button>
        ) : (
          <p className="font-mono hidden sm:block" style={{ fontSize: "10px", color: "#57564F" }}>
            click any tile to step inside
          </p>
        )}
      </div>

      <div className="px-5 sm:px-7 py-7">
        <AnimatePresence mode="wait">
          {view === "chip" ? (
            <motion.svg
              key="chip"
              viewBox="0 0 560 260"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              style={{ width: "100%", display: "block" }}
              role="img"
              aria-label="The RTX 4070 drawn as a grid of 46 identical streaming multiprocessor tiles"
            >
              {Array.from({ length: SM_COUNT }).map((_, i) => {
                const col = i % 8, row = Math.floor(i / 8);
                const x = 42 + col * 62, y = 22 + row * 38;
                const here = i === tile;
                return (
                  <g key={i} onClick={() => { setTile(i); setView("sm"); }} style={{ cursor: "pointer" }}>
                    <rect
                      x={x} y={y} width={54} height={30} rx={5}
                      fill={here ? "rgba(43,92,255,0.22)" : DARK_PANEL}
                      stroke={here ? "#2B5CFF" : "rgba(245,240,232,0.25)"}
                      strokeWidth={here ? 1.5 : 1}
                      style={{ transition: "fill 250ms ease, stroke 250ms ease" }}
                    />
                    <text x={x + 27} y={y + 19} textAnchor="middle" fontSize="10" fill={here ? "#F5F0E8" : "#57564F"} className="font-mono">
                      SM{i + 1}
                    </text>
                  </g>
                );
              })}
              <text x={20} y={140} fontSize="9" fill="#57564F" className="font-mono" transform="rotate(-90 20 140)" textAnchor="middle">
                12GB GDDR6X
              </text>
              <text x={548} y={140} fontSize="9" fill="#57564F" className="font-mono" transform="rotate(90 548 140)" textAnchor="middle">
                12GB GDDR6X
              </text>
              <text x={280} y={248} textAnchor="middle" fontSize="9.5" fill="#57564F" className="font-mono">
                46 identical self-sufficient SMs · each one is a small computer
              </text>
            </motion.svg>
          ) : (
            <motion.svg
              key="sm"
              viewBox="0 0 560 260"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              style={{ width: "100%", display: "block" }}
              role="img"
              aria-label="Schematic of one streaming multiprocessor: four partitions of 32 cores with warp schedulers, a register file, and shared memory"
            >
              {/* 4 partitions */}
              {[0, 1, 2, 3].map((p) => {
                const px = 24 + p * 132;
                const schedOn = part === "scheduler";
                const coresOn = part === "cores";
                return (
                  <g key={p} onClick={() => setPart("scheduler")} style={{ cursor: "pointer" }}>
                    {/* scheduler bar */}
                    <rect
                      x={px} y={22} width={116} height={16} rx={4}
                      fill={schedOn ? "rgba(43,92,255,0.35)" : "rgba(43,92,255,0.10)"}
                      stroke={schedOn ? "#2B5CFF" : "rgba(245,240,232,0.2)"}
                      style={{ transition: "fill 250ms ease, stroke 250ms ease" }}
                    />
                    <text x={px + 58} y={33} textAnchor="middle" fontSize="8" fill={schedOn ? "#F5F0E8" : "#A39B8B"} className="font-mono">
                      WARP SCHED
                    </text>
                    {/* 32 cores: 4 rows x 8 */}
                    <rect
                      x={px} y={44} width={116} height={92} rx={5}
                      fill={coresOn ? "rgba(43,92,255,0.12)" : DARK_PANEL}
                      stroke={coresOn ? "#2B5CFF" : "rgba(245,240,232,0.25)"}
                      style={{ transition: "fill 250ms ease, stroke 250ms ease" }}
                    />
                    {Array.from({ length: 32 }).map((_, c) => {
                      const col = c % 8, row = Math.floor(c / 8);
                      return (
                        <circle
                          key={c}
                          cx={px + 12 + col * 13.5}
                          cy={54 + row * 21}
                          r={4.4}
                          fill={coresOn ? "#2B5CFF" : "rgba(245,240,232,0.3)"}
                          style={{ transition: "fill 250ms ease" }}
                        />
                      );
                    })}
                    <text x={px + 58} y={150} textAnchor="middle" fontSize="8" fill="#57564F" className="font-mono">
                      32 CORES
                    </text>
                  </g>
                );
              })}

              {/* register file */}
              <g onClick={() => setPart("regs")} style={{ cursor: "pointer" }}>
                <rect
                  x={24} y={166} width={264} height={40} rx={6}
                  fill={part === "regs" ? "rgba(43,92,255,0.22)" : DARK_PANEL}
                  stroke={part === "regs" ? "#2B5CFF" : "rgba(245,240,232,0.25)"}
                  style={{ transition: "fill 250ms ease, stroke 250ms ease" }}
                />
                <text x={156} y={190} textAnchor="middle" fontSize="9.5" fill={part === "regs" ? "#F5F0E8" : "#A39B8B"} className="font-mono">
                  REGISTER FILE · ~256KB
                </text>
              </g>

              {/* shared memory */}
              <g onClick={() => setPart("smem")} style={{ cursor: "pointer" }}>
                <rect
                  x={300} y={166} width={264} height={40} rx={6}
                  fill={part === "smem" ? "rgba(43,92,255,0.22)" : DARK_PANEL}
                  stroke={part === "smem" ? "#2B5CFF" : "rgba(245,240,232,0.25)"}
                  style={{ transition: "fill 250ms ease, stroke 250ms ease" }}
                />
                <text x={432} y={190} textAnchor="middle" fontSize="9.5" fill={part === "smem" ? "#F5F0E8" : "#A39B8B"} className="font-mono">
                  SHARED MEMORY · ~100KB
                </text>
              </g>

              <text x={280} y={228} textAnchor="middle" fontSize="9.5" fill="#57564F" className="font-mono">
                one SM = 128 cores + 4 schedulers + storage · the 4070 has 46 of these
              </text>
              <text x={280} y={246} textAnchor="middle" fontSize="8.5" fill="#57564F" className="font-mono">
                (tensor cores and RT cores live here too, but that is Part 2 material)
              </text>
            </motion.svg>
          )}
        </AnimatePresence>

        {/* description panel */}
        <div
          className="mt-6 rounded-xl px-5 py-4"
          style={{ backgroundColor: DARK_PANEL, border: `1px solid ${DARK_LINE}`, minHeight: 92 }}
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={view === "chip" ? "chip" : part}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {view === "chip" ? (
                <>
                  <p className="font-mono" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#2B5CFF" }}>
                    THE CHIP
                  </p>
                  <p style={{ fontSize: "13.5px", lineHeight: 1.75, color: "#F5F0E8", marginTop: 6 }}>
                    From the outside, an RTX 4070 is 5,888 cores of raw silicon. From the inside, it's
                    46 identical tiles called streaming multiprocessors (SMs), each a self-sufficient little
                    computer with its own cores, its own schedulers, and its own memory. Click a tile.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-mono" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#2B5CFF" }}>
                    {info.name.toUpperCase()}
                  </p>
                  <p style={{ fontSize: "13.5px", lineHeight: 1.75, color: "#F5F0E8", marginTop: 6 }}>
                    {info.job}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="px-5 sm:px-7 py-3 border-t" style={{ borderColor: DARK_LINE }}>
        <p className="font-mono" style={{ fontSize: "10px", color: "#57564F" }}>
          schematic, not a die shot · sizes and counts simplified to the numbers that matter for this journey
        </p>
      </div>
    </div>
  );
}

// ── memory ladder ──────────────────────────────────────────────────────────

const LADDER = [
  { name: "registers", latency: "0 cycles extra", size: "~256KB / SM", note: "private to one thread" },
  { name: "shared memory", latency: "~30 cycles", size: "~100KB / SM", note: "shared by a block, you manage it" },
  { name: "L2 cache", latency: "~200 cycles", size: "36MB", note: "shared by the whole chip" },
  { name: "global (GDDR6X)", latency: "~400+ cycles", size: "12GB", note: "everything lives here eventually" },
];

function MemoryLadder() {
  return (
    <div className="rounded-2xl overflow-hidden my-8" style={{ backgroundColor: DARK_BG }}>
      <div
        className="px-5 sm:px-7 py-3.5 border-b font-mono"
        style={{ borderColor: DARK_LINE, backgroundColor: DARK_PANEL, fontSize: "10px", letterSpacing: "0.2em", color: "#A39B8B" }}
      >
        THE MEMORY LADDER · RTX 4070, BALLPARK
      </div>
      <div className="flex flex-col">
        {LADDER.map((r, i) => (
          <div
            key={r.name}
            className="px-5 sm:px-7 py-4 flex flex-wrap items-baseline gap-x-6 gap-y-1"
            style={{ borderTop: i === 0 ? undefined : `1px solid ${DARK_LINE}` }}
          >
            <span className="font-mono" style={{ fontSize: "9px", color: "#2B5CFF", width: 18 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-mono" style={{ fontSize: "12.5px", color: "#F5F0E8", width: 150 }}>
              {r.name}
            </span>
            <span className="font-mono tabular-nums" style={{ fontSize: "12px", color: "#EAB308", width: 110 }}>
              {r.latency}
            </span>
            <span className="font-mono tabular-nums" style={{ fontSize: "12px", color: "#A39B8B", width: 110 }}>
              {r.size}
            </span>
            <span className="font-mono" style={{ fontSize: "11px", color: "#57564F" }}>
              {r.note}
            </span>
          </div>
        ))}
      </div>
      <div className="px-5 sm:px-7 py-3 border-t" style={{ borderColor: DARK_LINE }}>
        <p className="font-mono" style={{ fontSize: "10px", color: "#57564F" }}>
          each rung down: bigger and slower, roughly an order of magnitude at a time
        </p>
      </div>
    </div>
  );
}

// ── chapter ────────────────────────────────────────────────────────────────

export default function Day02() {
  return (
    <div className="flex flex-col">
      <SectionLabel>01 · OPENING THE CASE</SectionLabel>
      <H2>A stadium isn't one big room</H2>
      <P>
        Yesterday's metaphor: the GPU is a stadium of thousands of workers. Useful, but it hides the interesting part, which is the floor plan. A GPU is not one massive slab of undifferentiated compute. Lift the lid and you find the chip is built the way a mall is built: <strong style={{ color: "var(--color-text)" }}>46 identical self-contained units, tiled across the silicon.</strong> Each unit has its own workers, its own managers, and its own storage. The official name for a unit is a streaming multiprocessor, SM for short, and you'll see those two letters constantly for the rest of this journey.
      </P>
      <P>
        On an RTX 4070 there are 46 of them. On a 4090, 128. Same design philosophy at different sizes, like the same apartment layout stamped across different floors of a tower.
      </P>

      <SectionLabel>02 · THE EXPLORABLE</SectionLabel>
      <H2>Step inside</H2>
      <P>
        Here's the whole chip as a map. Click any SM to step inside it, then click the parts to find out what each one does. Take a minute with this: every term on this schematic is vocabulary you'll use every day from now on.
      </P>
      <SMExplorer />
      <P>
        The anatomy answers yesterday's story directly. The "workers" are the 128 cores. The "managers keeping supply flowing" are the four warp schedulers. And the two storage blocks at the bottom of the schematic are about to become the most important thing on this page.
      </P>

      <SectionLabel>03 · WHY TILES?</SectionLabel>
      <H2>Stamp, don't design</H2>
      <P>
        Why build a GPU as 46 copies of the same unit instead of one big bespoke machine? Three reasons, all unglamorous. First, scaling: a faster GPU is literally the same layout with more tiles stamped on, which is why the 4070 and the 4090 feel like siblings rather than different species. Second, manufacturing: smaller repeated units survive production defects better than one giant monolith. Third, and most important for you: <strong style={{ color: "var(--color-text)" }}>the programming model mirrors the hardware.</strong> Your work gets chopped into independent chunks, and the chip hands those chunks out to identical SMs. Because every SM is interchangeable, the hardware can schedule without ever asking you anything.
      </P>
      <P>
        Those chunks have a name, by the way: blocks. The grid-block-thread hierarchy is exactly day 03's subject, and it will make this tile picture click into place.
      </P>

      <SectionLabel>04 · THE SCHEDULER, PHYSICALLY</SectionLabel>
      <H2>Yesterday's story, in silicon</H2>
      <P>
        Remember the day 01 argument: the GPU doesn't hide latency for a thread, it ignores it by having thousands of other threads ready. Here is the exact piece of hardware that does this. Each SM is split into four partitions, and each partition has its own warp scheduler sitting above its 32 cores.
      </P>
      <P>
        Every single clock cycle, each scheduler looks at the warps assigned to it and fires the instruction of one that's ready. If warp A is stalled waiting on memory, the scheduler doesn't wait with it. It runs warp B this cycle, then warp C, and comes back to A once its data arrived. The switch costs nothing. That's the whole trick: <strong style={{ color: "var(--color-text)" }}>latency doesn't disappear, it gets absorbed by occupancy</strong>, by having enough warps resident that some are always ready.
      </P>
      <P>
        A warp is 32 threads that execute this way in lockstep, one instruction across all of them. That number, 32, will explain divergence, occupancy math, and half the performance advice you'll ever hear. Day 04 is all about it.
      </P>

      <SectionLabel>05 · THE MEMORY LADDER</SectionLabel>
      <H2>The rest of the journey, in one table</H2>
      <P>
        The last piece of anatomy is storage, and it deserves more than a glance, because this ladder is where GPU performance is actually won and lost. Four rungs, from fastest and smallest to slowest and biggest:
      </P>
      <MemoryLadder />
      <P>
        Registers are free to read and tiny. Global memory holds everything but makes you wait hundreds of cycles. Every performance problem you'll meet on this journey is some version of the same sentence: <strong style={{ color: "var(--color-text)" }}>the data your kernel needs is on the wrong rung of this ladder.</strong> Coalescing (day 07), shared memory (day 08), caches (day 10), and the roofline model (day 11) are all different tools for climbing the ladder less often.
      </P>
      <P>
        And that's why the anatomy matters. You don't profile "the GPU." You profile how your kernel moves data between 46 SMs and this ladder.
      </P>

      {/* cheatsheet */}
      <div className="rounded-2xl overflow-hidden mt-4" style={{ backgroundColor: DARK_BG }}>
        <div
          className="px-5 sm:px-7 py-3.5 border-b font-mono"
          style={{ borderColor: DARK_LINE, backgroundColor: DARK_PANEL, fontSize: "10px", letterSpacing: "0.2em", color: "#A39B8B" }}
        >
          CHEATSHEET · DAY 02
        </div>
        <ul className="px-5 sm:px-7 py-5 flex flex-col gap-3.5" style={{ fontSize: "14px", lineHeight: 1.7, color: "#F5F0E8" }}>
          <li className="flex gap-3">
            <span style={{ color: "#2B5CFF" }}>01</span>
            <span><strong>A GPU is tiled SMs.</strong> The 4070 has 46 identical streaming multiprocessors, each self-sufficient with cores, schedulers, and storage. More GPU = more tiles.</span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: "#2B5CFF" }}>02</span>
            <span><strong>One SM = 128 cores + 4 warp schedulers + registers + shared memory.</strong> The schedulers switch warps every cycle; that is day 01's latency-hiding, in hardware.</span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: "#2B5CFF" }}>03</span>
            <span><strong>Memory is a ladder.</strong> Registers, shared, L2, global: each rung down is bigger and roughly an order of magnitude slower. Performance work is ladder management.</span>
          </li>
        </ul>
      </div>

      <p className="mt-10 max-w-[65ch]" style={{ fontSize: "14px", lineHeight: 1.8, color: "var(--color-muted)" }}>
        Next: day 03 connects this hardware to your code. Grids, blocks, and threads: the three nouns every kernel is written with, and the ones the chip uses to hand work to those 46 tiles.
      </p>
    </div>
  );
}
