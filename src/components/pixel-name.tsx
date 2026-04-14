"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const CHARS = "BASEL ANAYA".split("");

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.2 } },
};

const charVariant = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function PixelName() {
  const shouldReduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <h1
      className="relative inline-flex items-end"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        variants={shouldReduce ? undefined : container}
        initial={shouldReduce ? { opacity: 0 } : "hidden"}
        animate={shouldReduce ? { opacity: 1 } : "show"}
        className={[
          "font-pixel tracking-tight leading-none select-none",
          hovered ? "text-gradient" : "",
        ].join(" ")}
        style={{ fontSize: "clamp(44px, 10vw, 128px)" }}
      >
        {CHARS.map((char, i) =>
          char === " " ? (
            <span key={i} className="inline-block" style={{ width: "0.28em" }} />
          ) : (
            <motion.span
              key={i}
              variants={shouldReduce ? undefined : charVariant}
              className="inline-block"
            >
              {char}
            </motion.span>
          )
        )}
      </motion.div>

      {/* Blinking cursor — separate so gradient doesn't affect it */}
      <motion.span
        className="inline-block ml-2 mb-[0.08em]"
        style={{
          color: "var(--color-amber)",
          fontSize: "clamp(32px, 7vw, 96px)",
          lineHeight: 1,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          delay: shouldReduce ? 0 : CHARS.length * 0.04 + 0.8,
          duration: 1,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.5, 1],
        }}
      >
        ▌
      </motion.span>
    </h1>
  );
}
