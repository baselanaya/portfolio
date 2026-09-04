"use client";

import Link from "next/link";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

// Sticky mobile CTA: appears after the visitor scrolls past the hero,
// floats above the mobile tab dock, hidden on desktop.
export default function StickyCta() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 480));

  return (
    <div
      className={`md:hidden fixed left-1/2 -translate-x-1/2 z-[90] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ bottom: "76px" }}
    >
      <Link
        href="/contact"
        className="font-mono inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] tracking-[0.1em] whitespace-nowrap"
        style={{
          background: "var(--gradient-brand)",
          color: "#fff",
          boxShadow: "0 10px 30px -10px rgba(43,92,255,0.65)",
        }}
      >
        get in touch <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
