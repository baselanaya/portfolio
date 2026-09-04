"use client";

import { motion } from "motion/react";
import { KernexInterface, MercerInterface, CynosureInterface, MedFormerInterface, CiraxInterface } from "./interfaces";

// One unified demo window per project: same height, same chrome, same
// caption slot — so every case study explains its mechanics the same way.

const DEMOS: Record<
  string,
  {
    caption: string;
    Component: () => React.JSX.Element;
  }
> = {
  kernex: {
    caption:
      "What you're watching: an agent runs inside the sandbox and tries to act. Actions it declared in the policy pass; everything else is blocked by the kernel, paused, and shown to the operator for a decision.",
    Component: KernexInterface,
  },
  mercer: {
    caption:
      "What you're watching: Mercer's six-stage pipeline. A plain question goes in, the schema is mapped stage by stage, and validated SQL comes out — it can only reference tables that actually exist.",
    Component: MercerInterface,
  },
  cynosure: {
    caption:
      "What you're watching: the local trading loop. Prices tick, the forecaster projects direction, the LLM synthesizes a thesis, and deterministic risk gates decide what actually happens.",
    Component: CynosureInterface,
  },
  medformer: {
    caption:
      "What you're watching: how MedFormer answers. A medical image is encoded, relevant literature is retrieved, and the answer is grounded in what was retrieved instead of guessed.",
    Component: MedFormerInterface,
  },
  cirax: {
    caption:
      "What you're watching: Cirax's router at work. Pick two formats and it searches the format graph for the best chain of converters, ranked by fidelity, then runs it in a sandbox.",
    Component: CiraxInterface,
  },
};

export default function ProjectDemo({ slug }: { slug: string }) {
  const demo = DEMOS[slug];
  if (!demo) return null;
  const { caption, Component } = demo;
  return (
    <div className="glass-soft rounded-2xl overflow-hidden my-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="p-3 sm:p-4"
      >
        <div className="h-[400px] overflow-y-auto rounded-xl" style={{ backgroundColor: "var(--color-surface)" }}>
          <Component />
        </div>
        <p
          className="font-mono mt-3 px-1"
          style={{ fontSize: "10.5px", lineHeight: 1.7, color: "var(--color-muted)" }}
        >
          {caption}
        </p>
      </motion.div>
    </div>
  );
}
