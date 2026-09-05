"use client";

import { useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
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

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// ── the race ───────────────────────────────────────────────────────────────
// A deliberately simple throughput model, so the flip is honest:
//   CPU : 8 workers, each ~1.7x faster per task (clock + fat caches)
//   GPU : 5,888 workers, each slower, plus a fixed launch overhead
// The crossover sits near ~1k tasks — small workloads stay on the CPU,
// which is a real effect, not a fudge.

const WORK_SIZES = [8, 64, 512, 4096, 32768, 262144, 2097152, 8388608];
const CPU_WORKERS = 8;
const GPU_WORKERS = 5888;
const LAUNCH_OVERHEAD = 40;

const cpuTicks = (n: number) => Math.ceil(n / CPU_WORKERS) * 0.4;
const gpuTicks = (n: number) => LAUNCH_OVERHEAD + Math.ceil(n / GPU_WORKERS) * 0.6;

function Race() {
  const reduce = useReducedMotion();
  const [size, setSize] = useState(WORK_SIZES[3]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const t = useMotionValue(0);

  const cT = cpuTicks(size);
  const gT = gpuTicks(size);
  const maxT = Math.max(cT, gT);

  const cpuP = useTransform(t, (v) => Math.min(1, v / cT));
  const gpuP = useTransform(t, (v) => Math.min(1, v / gT));
  const cpuNow = useTransform(t, (v) => fmt(Math.min(cT, v)));
  const gpuNow = useTransform(t, (v) => fmt(Math.min(gT, v)));

  const cpuWon = cT < gT;
  // winner's margin: how many times longer the loser took
  const speedup = Math.round(((cpuWon ? gT / cT : cT / gT) * 10) / 10);

  function run() {
    if (reduce) {
      t.set(maxT);
      setDone(true);
      return;
    }
    setRunning(true);
    setDone(false);
    t.set(0);
    animate(t, maxT, {
      duration: 3.2,
      ease: "linear",
      onComplete: () => {
        setRunning(false);
        setDone(true);
      },
    });
  }

  function reset(next: number) {
    t.set(0);
    setRunning(false);
    setDone(false);
    setSize(next);
  }

  return (
    <div className="rounded-2xl overflow-hidden my-10" style={{ backgroundColor: DARK_BG }}>
      {/* controls */}
      <div
        className="px-5 sm:px-7 py-4 border-b flex flex-wrap items-center gap-x-6 gap-y-3"
        style={{ borderColor: DARK_LINE, backgroundColor: DARK_PANEL }}
      >
        <label className="font-mono flex items-center gap-4 grow" style={{ fontSize: "11px", color: "#A39B8B" }}>
          <span className="shrink-0" style={{ letterSpacing: "0.12em" }}>WORKLOAD</span>
          <input
            type="range"
            min={0}
            max={WORK_SIZES.length - 1}
            step={1}
            value={WORK_SIZES.indexOf(size)}
            onChange={(e) => reset(WORK_SIZES[Number(e.target.value)])}
            className="grow max-w-64"
            style={{ accentColor: "#2B5CFF" }}
            aria-label="Number of elements to process"
          />
          <span className="font-mono tabular-nums" style={{ fontSize: "12px", color: "#F5F0E8" }}>
            {fmt(size)} elements
          </span>
        </label>
        <button
          onClick={run}
          disabled={running}
          className="font-mono rounded-full px-4 py-1.5 border transition-colors duration-150 disabled:opacity-40"
          style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#F5F0E8", borderColor: "#2B5CFF" }}
        >
          {running ? "racing…" : done ? "run again" : "run the race"}
        </button>
      </div>

      {/* lanes */}
      <div className="px-5 sm:px-7 py-7 flex flex-col gap-8">
        {/* CPU lane */}
        <div>
          <div className="flex items-baseline justify-between mb-2.5">
            <p className="font-mono" style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#A39B8B" }}>
              CPU · {fmt(CPU_WORKERS)} workers · fast each
            </p>
            <p className="font-mono tabular-nums" style={{ fontSize: "11px", color: "#F5F0E8" }}>
              <motion.span>{cpuNow}</motion.span> ticks
            </p>
          </div>
          <div
            className="h-9 rounded-md overflow-hidden"
            style={{
              backgroundColor: DARK_PANEL,
              border: `1px solid ${DARK_LINE}`,
            }}
          >
            <motion.div
              className="h-full"
              style={{
                scaleX: cpuP,
                transformOrigin: "left",
                width: "100%",
                // 8 segment dividers — the cores are discrete and visible
                background:
                  "repeating-linear-gradient(90deg, #2B5CFF 0 calc(12.5% - 2px), transparent calc(12.5% - 2px) 12.5%), #16244d",
              }}
            />
          </div>
        </div>

        {/* GPU lane */}
        <div>
          <div className="flex items-baseline justify-between mb-2.5">
            <p className="font-mono" style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#A39B8B" }}>
              GPU · {fmt(GPU_WORKERS)} workers · slower each + launch cost
            </p>
            <p className="font-mono tabular-nums" style={{ fontSize: "11px", color: "#F5F0E8" }}>
              <motion.span>{gpuNow}</motion.span> ticks
            </p>
          </div>
          <div
            className="h-9 rounded-md overflow-hidden"
            style={{
              backgroundColor: DARK_PANEL,
              border: `1px solid ${DARK_LINE}`,
            }}
          >
            <motion.div
              className="h-full"
              style={{
                scaleX: gpuP,
                transformOrigin: "left",
                width: "100%",
                // dense hatch — thousands of anonymous small workers
                background:
                  "repeating-linear-gradient(90deg, #16A34A 0 3px, rgba(22,163,74,0.25) 3px 6px)",
              }}
            />
          </div>
        </div>

        {/* verdict */}
        <div aria-live="polite">
          {!done ? (
            <p className="font-mono" style={{ fontSize: "11.5px", color: "#A39B8B", opacity: running ? 1 : 0.55 }}>
              {running ? "racing…" : "press run, then drag the workload up and run it again."}
            </p>
          ) : cpuWon ? (
            <p className="font-mono" style={{ fontSize: "12.5px", lineHeight: 1.8, color: "#A39B8B" }}>
              <span style={{ color: "#EAB308" }}>CPU wins: {speedup}× faster.</span>{" "}
              At this size the job fits in 8 fast workers, and the GPU burned {LAUNCH_OVERHEAD} ticks just
              launching. Real effect, not a fudge: kernel launch overhead is exactly why tiny operations stay on the CPU.
            </p>
          ) : (
            <p className="font-mono" style={{ fontSize: "12.5px", lineHeight: 1.8, color: "#A39B8B" }}>
              <span style={{ color: "#16A34A" }}>GPU wins: {speedup}× faster.</span>{" "}
              Same work, same total energy story, just split across enough workers that waiting for one
              stops mattering. Drag the workload down and watch the flip back.
            </p>
          )}
        </div>
      </div>

      <div className="px-5 sm:px-7 py-3 border-t" style={{ borderColor: DARK_LINE }}>
        <p className="font-mono" style={{ fontSize: "10px", color: "#57564F" }}>
          simplified model · per-task cost and launch overhead are illustrative · memory-bound reality arrives on day 07
        </p>
      </div>
    </div>
  );
}

// ── chapter ────────────────────────────────────────────────────────────────

export default function Day01() {
  return (
    <div className="flex flex-col">
      <SectionLabel>01 · THE THESIS</SectionLabel>
      <H2>A CPU is a genius. A GPU is a stadium.</H2>
      <P>
        Every claim in this journey hangs on one sentence, so here it is early: <strong style={{ color: "var(--color-text)" }}>a CPU spends its transistors making one stream of work finish as fast as possible; a GPU spends them on having an absurd number of workers, so that waiting for one worker stops mattering.</strong> That is the entire difference. Everything else (warps, blocks, shared memory, occupancy) is engineering detail hanging off that choice.
      </P>
      <P>
        To see why the choice makes sense, give both machines the same boring job: multiply two arrays of numbers, element by element. One million multiplies. No branches, no dependencies: element 412,551 doesn't care what element 412,550 returned. Perfectly parallel work.
      </P>

      <SectionLabel>02 · THE RACE</SectionLabel>
      <H2>Same job, two philosophies</H2>
      <P>
        Below is the race, simplified on purpose. The CPU fields 8 workers, each quick. The GPU fields 5,888 workers, each slower, and pays a fixed cost just to start (the launch). Drag the workload from trivial to millions and run it at each size. Watch where the winner flips, and where it flips back.
      </P>
      <Race />
      <P>
        Two things happened there. At small sizes the GPU loses because <strong style={{ color: "var(--color-text)" }}>starting the stadium costs more than the game</strong>. That launch overhead is real, and it's why your operating system, your browser, and your database all run on CPUs. But somewhere around a few thousand elements, the GPU's army finishes before the CPU's specialists have cleared their backlog, and from there the gap only grows. At eight million elements the GPU is done while the CPU is roughly a third of the way through.
      </P>
      <P>
        Neither machine got smarter. The GPU just changed what the word <em>waiting</em> means.
      </P>

      <SectionLabel>03 · WHY THE CPU IS A GENIUS</SectionLabel>
      <H2>The CPU lies to you about latency</H2>
      <P>
        Here's an uncomfortable fact: main memory is brutally slow compared to a CPU core. A core can execute hundreds of instructions in the time it takes to fetch one number from RAM. If the core simply waited for every load, it would idle ~95% of the time, and your 5 GHz processor would feel like a 1998 machine.
      </P>
      <P>
        So the CPU spends enormous transistor budgets on making sure it never visibly waits: multi-level caches that keep likely data on-chip, branch predictors that guess which way your <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.9em" }}>if</code> goes before it evaluates, out-of-order engines that reorder your instructions to keep every pipeline stage busy, prefetchers that fetch data you haven't asked for yet. The genius of a CPU is that it hides latency for <strong style={{ color: "var(--color-text)" }}>one stream of work</strong>. It's a world-class illusionist performing for an audience of one thread.
      </P>

      <SectionLabel>04 · HOW THE GPU CHEATS BACK</SectionLabel>
      <H2>The GPU doesn't hide the wait. It ignores it.</H2>
      <P>
        A GPU core has no branch predictor worth mentioning, modest caches, and in-order execution. One GPU thread waiting on memory is genuinely, embarrassingly slow, about 2× slower than one CPU core in raw per-task terms.
      </P>
      <P>
        The GPU's answer is not to fix that. It's to make it irrelevant: run <strong style={{ color: "var(--color-text)" }}>thousands of threads per chip</strong>, and keep a hardware scheduler on every little neighborhood of cores (streaming multiprocessors, covered on day 02). The moment one thread stalls on a memory fetch, the scheduler flips to another thread that's ready to compute. Zero cost, zero ceremony. With enough threads in flight, the memory system is never left idle: the wait for thread #4,097 is hidden by the work of threads #1 through #4,096.
      </P>
      <P>
        The CPU hides latency with foresight. The GPU hides it with supply. That's why GPU code reviews care about strange things (how many threads you launched, whether memory access arrives in tidy patterns) while CPU code reviews care about entirely different strange things.
      </P>

      <SectionLabel>05 · THE NUMBERS, ROUGHLY</SectionLabel>
      <H2>Stadium seating chart</H2>
      <P>
        Ballpark specs, chosen because they're the hardware this journey's numbers come from:
      </P>
      <div className="grid sm:grid-cols-2 gap-px rounded-xl overflow-hidden my-8" style={{ backgroundColor: "var(--color-border)" }}>
        {[
          ["RTX 4070 (GPU)", "5,888 cores · 46 SMs · ~2.5 GHz"],
          ["Ryzen 9 7950X (CPU)", "16 cores / 32 threads · ~5.7 GHz"],
          ["Per-task speed", "CPU core ≈ 2× a GPU core"],
          ["Worker count", "GPU ≈ 368× the CPU"],
        ].map(([k, v]) => (
          <div key={k} className="p-5" style={{ backgroundColor: "var(--color-surface)" }}>
            <p className="font-mono" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "var(--color-muted)" }}>{k}</p>
            <p className="font-mono mt-1.5 tabular-nums" style={{ fontSize: "13px", color: "var(--color-text)" }}>{v}</p>
          </div>
        ))}
      </div>
      <P>
        Read the last two rows together: the CPU core is faster, but the GPU has hundreds of times more of them. Throughput is workers × speed, and when the work is parallel, count beats clock every time. (Real figures vary by generation and workload; the shape of the argument doesn't.)
      </P>

      <SectionLabel>06 · WHEN THE STADIUM LOSES</SectionLabel>
      <H2>One suitcase, one bridge</H2>
      <P>
        Before you conclude CPUs are obsolete, hand the stadium a job with a dependency: walk one suitcase across a bridge, then another, where each trip needs the previous trip's receipt. A thousand extra walkers don't help; the bottleneck is the order, not the labor.
      </P>
      <P>
        Serial work with dependencies is CPU country: operating systems, databases, game logic, your build tool. Parallel work without dependencies is GPU country: pixels, matrix math, embeddings, the element-wise guts of every neural network. Most real programs are a mix, which is why they ship on machines with both, and why the interesting engineering question is always <em>which part goes where</em>.
      </P>
      <P>
        That question is the whole discipline. The next thirty days are just it, asked over and over at higher resolution.
      </P>

      <SectionLabel>07 · A GLIMPSE AHEAD</SectionLabel>
      <H2>The kernel you'll write on day 13</H2>
      <P>
        Everything above becomes concrete the moment you see the code. This is vector add, the hello world of GPU programming, and by day 13 every bracket in it will be obvious. For now, read it like a stadium roster:
      </P>
      <pre
        className="rounded-xl my-8 overflow-x-auto"
        style={{ backgroundColor: "#12110D", border: "1px solid #35322A", padding: "1.25rem 1.5rem" }}
      >
        <code className="font-mono" style={{ fontSize: "12.5px", lineHeight: 1.8, color: "#F5F0E8" }}>
          <span style={{ color: "#8B7D6B" }}>// runs once per element; the GPU schedules this × N</span>{"\n"}
          <span style={{ color: "#2B5CFF" }}>__global__</span> <span style={{ color: "#F5F0E8" }}>void</span> add(<span style={{ color: "#F5F0E8" }}>float</span>* a, <span style={{ color: "#F5F0E8" }}>float</span>* b, <span style={{ color: "#F5F0E8" }}>float</span>* c, <span style={{ color: "#F5F0E8" }}>int</span> n) {"{"}{"\n"}
          {"    "}<span style={{ color: "#F5F0E8" }}>int</span> i = blockIdx.x * blockDim.x + threadIdx.x;{"\n"}
          {"    "}<span style={{ color: "#2B5CFF" }}>if</span> (i &lt; n) c[i] = a[i] + b[i];{"\n"}
          {"}"}
        </code>
      </pre>
      <P>
        That <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.9em" }}>i</code> line is the entire trick: instead of looping over a million elements, each thread asks “which element am I?” and does one. The loop didn't disappear; it turned into the hardware's job.
      </P>

      {/* cheatsheet */}
      <div className="rounded-2xl overflow-hidden mt-4" style={{ backgroundColor: DARK_BG }}>
        <div
          className="px-5 sm:px-7 py-3.5 border-b font-mono"
          style={{ borderColor: DARK_LINE, backgroundColor: DARK_PANEL, fontSize: "10px", letterSpacing: "0.2em", color: "#A39B8B" }}
        >
          CHEATSHEET · DAY 01
        </div>
        <ul className="px-5 sm:px-7 py-5 flex flex-col gap-3.5" style={{ fontSize: "14px", lineHeight: 1.7, color: "#F5F0E8" }}>
          <li className="flex gap-3">
            <span style={{ color: "#2B5CFF" }}>01</span>
            <span><strong>CPU = latency.</strong> Few fast workers plus caches, prediction, and reordering to hide every wait for one stream of work.</span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: "#2B5CFF" }}>02</span>
            <span><strong>GPU = throughput.</strong> Thousands of slow workers; the scheduler hides latency by switching to ready threads the instant one stalls.</span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: "#2B5CFF" }}>03</span>
            <span><strong>Match the machine to the shape.</strong> Independent work scales on the GPU; serial dependencies stay on the CPU. The discipline is knowing which is which.</span>
          </li>
        </ul>
      </div>

      <p className="mt-10 max-w-[65ch]" style={{ fontSize: "14px", lineHeight: 1.8, color: "var(--color-muted)" }}>
        Next: day 02 opens the case and names the parts: streaming multiprocessors, warp schedulers, and the memory hierarchy you'll be negotiating with for the rest of the journey.
      </p>
    </div>
  );
}
