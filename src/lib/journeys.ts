// The Lab is a library of "journeys" — one topic a day, read in order.
// A journey defines its chapter list; each chapter is either published
// (has a real page) or queued (shown as locked in the library).

export type DayStatus = "published" | "queued";

export interface JourneyDay {
  day: number;
  slug: string;
  title: string;
  summary: string;
  status: DayStatus;
  interactive?: boolean;
}

export interface JourneyPhase {
  name: string;
  days: [number, number]; // inclusive day range
}

export interface Journey {
  slug: string;
  title: string;
  /** Short name for breadcrumbs and tight chrome */
  shortTitle: string;
  kicker: string;
  description: string;
  phases: JourneyPhase[];
  days: JourneyDay[];
}

const d = (
  day: number,
  slug: string,
  title: string,
  summary: string,
  status: DayStatus = "queued",
  interactive?: boolean
): JourneyDay => ({ day, slug, title, summary, status, interactive });

export const gpuProgramming: Journey = {
  slug: "gpu-programming",
  title: "GPU Programming: Zero to Reading Production Kernels",
  shortTitle: "GPU Programming",
  kicker: "30 days",
  description:
    "A daily journey from “what is a warp” to reading production kernel code. One topic a day, fifteen to twenty minutes each, in plain language with real numbers from an RTX 4070. It ends at being able to open a production kernel and reason about it. Tensor cores, multi-GPU collectives, and PTX-level tuning are a deliberate Part 2.",
  phases: [
    { name: "Foundations & mental model", days: [1, 6] },
    { name: "Memory", days: [7, 12] },
    { name: "Writing CUDA", days: [13, 18] },
    { name: "Triton & modern kernel authoring", days: [19, 23] },
    { name: "Reading real-world kernels", days: [24, 27] },
    { name: "Capstone", days: [28, 30] },
  ],
  days: [
    d(1, "day-01-why-gpus-are-shaped-this-way", "Why GPUs are shaped this way", "CPU optimizes latency for one thread; GPU assumes latency and hides it with massive parallelism.", "published"),
    d(2, "day-02-anatomy-of-a-gpu", "Anatomy of a GPU", "Streaming multiprocessors, cores, warp schedulers, the memory hierarchy at a glance.", "published"),
    d(3, "day-03-thread-hierarchy", "The thread hierarchy", "Grid → block → warp. What each level actually is, and who schedules what."),
    d(4, "day-04-warps-and-simt", "Warps and SIMT", "32 threads, one instruction, lockstep execution. Why this number matters everywhere downstream."),
    d(5, "day-05-warp-divergence", "Warp divergence", "What happens when threads in a warp disagree on a branch, and what that costs.", "queued", true),
    d(6, "day-06-occupancy", "Occupancy", "Registers and shared memory per block decide how many warps actually fit on an SM at once.", "queued", true),
    d(7, "day-07-global-memory-coalescing", "Global memory & coalescing", "Why access pattern matters more than access count.", "queued", true),
    d(8, "day-08-shared-memory-bank-conflicts", "Shared memory & bank conflicts", "Fast, programmer-managed memory, and the 32-bank layout that can silently serialize it."),
    d(9, "day-09-registers-and-spilling", "Registers & spilling", "The fastest memory you have, and what happens when a kernel asks for too much of it."),
    d(10, "day-10-caches-and-bandwidth", "Caches & bandwidth limits", "L1/L2 behavior on GPUs vs CPUs, and why bandwidth, not compute, is the usual ceiling."),
    d(11, "day-11-roofline-model", "The roofline model", "Plotting arithmetic intensity against achieved FLOPs to find out what's actually limiting you.", "queued", true),
    d(12, "day-12-naive-matmul-case-study", "Case study: why naive matmul is slow", "Walking a textbook matmul through everything from days 7–11 to see where the time goes."),
    d(13, "day-13-your-first-kernel", "Your first kernel", "Vector add: __global__, launch syntax, thread indexing."),
    d(14, "day-14-launch-configuration", "Launch configuration in practice", "Choosing grid and block dimensions for real problem sizes, not just powers of two."),
    d(15, "day-15-tiling-shared-memory", "Tiling with shared memory", "Speeding up matmul by staging tiles in shared memory instead of hitting global memory per element."),
    d(16, "day-16-parallel-reductions", "Parallel reductions", "Sum and max look trivial sequentially and become a real puzzle in parallel. Why, and how to fix it."),
    d(17, "day-17-streams-and-concurrency", "Streams & concurrency", "Overlapping compute with memory transfer instead of doing them back to back."),
    d(18, "day-18-reading-a-profiler-trace", "Reading an Nsight trace", "What a real profiler trace tells you, and which numbers actually matter first."),
    d(19, "day-19-why-triton-exists", "Why Triton exists", "The abstraction gap between hand-indexed CUDA and block-level programming.", "queued", true),
    d(20, "day-20-triton-programming-model", "Triton's programming model", "Thinking in blocks instead of threads; what the compiler now does for you."),
    d(21, "day-21-fused-softmax-in-triton", "Writing a fused softmax in Triton", "A real, small, complete kernel, start to finish."),
    d(22, "day-22-autotuning", "Autotuning", "Letting Triton search block sizes and configs instead of guessing."),
    d(23, "day-23-kernel-fusion", "Kernel fusion", "Why frameworks fuse elementwise ops, and what it saves in memory traffic.", "queued", true),
    d(24, "day-24-anatomy-of-flashattention", "Anatomy of FlashAttention", "What problem it actually solves, and why the naive attention kernel couldn't."),
    d(25, "day-25-quantized-kernels", "Quantized kernels", "How INT8/FP8 kernels differ from FP32 ones beyond “smaller numbers.”"),
    d(26, "day-26-kv-cache-kernels", "KV-cache kernels", "The real memory bottleneck behind serving LLMs, and how kernels are shaped around it."),
    d(27, "day-27-reading-production-kernels", "Reading production kernel code", "Taking everything so far into an actual vLLM/SGLang codebase."),
    d(28, "day-28-profile-and-optimize", "Profile and optimize", "Take the reduction or matmul kernel from days 15–16 and improve it using what you now know."),
    d(29, "day-29-capstone-fused-kernel", "Capstone: a fused kernel from scratch", "A small, complete Triton kernel, designed and built end to end."),
    d(30, "day-30-where-to-go-next", "Where to go next", "Contributing to open-source kernel libraries, and why mastery here is an ongoing practice tied to hardware that changes every generation."),
  ],
};

export const journeys: Journey[] = [gpuProgramming];

export function getJourney(slug: string): Journey | undefined {
  return journeys.find((j) => j.slug === slug);
}

export function getPublishedDay(journey: Journey, slug: string): JourneyDay | undefined {
  return journey.days.find((day) => day.slug === slug && day.status === "published");
}
