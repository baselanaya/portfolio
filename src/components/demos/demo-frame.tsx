"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

// Frame for project interface previews — an HTML mockup of the tool's
// actual UI, presented on a glass card.
export default function DemoFrame({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <div className="glass-soft rounded-2xl overflow-hidden my-10">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-white/70 bg-white/40">
        <span
          className="font-mono truncate"
          style={{ fontSize: "10px", color: "var(--color-text)", letterSpacing: "0.15em" }}
        >
          {title}
        </span>
        <span
          className="font-mono"
          style={{ fontSize: "9px", color: "var(--color-muted)", letterSpacing: "0.12em" }}
        >
          {note}
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="p-3 sm:p-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
