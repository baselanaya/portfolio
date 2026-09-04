"use client";

import { motion } from "motion/react";
import { CynosureInterface } from "./interfaces";
import { CiraxFlow, KernexFlow, MedFormerFlow, MercerFlow } from "./flows";

// One unified demo per project: same glass card, same chrome, same caption
// slot. Four projects explain their mechanics through animated mechanism
// diagrams (flows.tsx); Cynosure keeps its live TUI dashboard preview.

const DEMOS: Record<
  string,
  {
    caption: string;
    Component: () => React.JSX.Element;
  }
> = {
  kernex: {
    caption:
      "What you're watching: every syscall an agent makes hits the kernel gate. What the policy allows passes straight through; everything else is blocked, the agent pauses, and the operator grants a one-shot exception.",
    Component: KernexFlow,
  },
  mercer: {
    caption:
      "What you're watching: a plain question riding the six-stage pipeline. Schema and taxonomy feed in from below, three candidates race at stage four, and only validated SQL leaves the pipeline.",
    Component: MercerFlow,
  },
  medformer: {
    caption:
      "What you're watching: two streams merging. The image is encoded while a retriever pulls the relevant literature into context, and the answer cites the passage it used instead of guessing.",
    Component: MedFormerFlow,
  },
  cirax: {
    caption:
      "What you're watching: route search over the format graph. Chains are ranked by fidelity, the best one locks in, and the job runs inside a bubblewrap jail with no network.",
    Component: CiraxFlow,
  },
  cynosure: {
    caption:
      "What you're watching: the local trading loop. Prices tick, the forecaster projects direction, the LLM synthesizes a thesis, and deterministic risk gates decide what actually happens.",
    Component: CynosureInterface,
  },
};

export default function ProjectDemo({ slug }: { slug: string }) {
  const demo = DEMOS[slug];
  if (!demo) return null;
  const { caption, Component } = demo;
  return (
    <div className="glass-soft rounded-2xl overflow-hidden my-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="p-3 sm:p-4"
      >
        <Component />
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="font-mono mt-3 px-1"
          style={{ fontSize: "10.5px", lineHeight: 1.7, color: "var(--color-muted)" }}
        >
          {caption}
        </motion.p>
      </motion.div>
    </div>
  );
}
