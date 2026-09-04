"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

// CursorGlow — the background "bends" toward the cursor: two large, heavily
// lagged light blobs (cobalt + cyan) drift after the pointer with spring
// physics. This runs entirely on motion values, never React state.
export default function CursorGlow() {
  const reduce = useReducedMotion() ?? false;
  // SSR always renders the orb tree; the static reduced-motion variant only
  // swaps in after mount so hydration output matches the server.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);

  // different stiffness per blob = depth; heavy damping = liquid lag
  const cobaltX = useSpring(mx, { stiffness: 26, damping: 18, mass: 1.4 });
  const cobaltY = useSpring(my, { stiffness: 26, damping: 18, mass: 1.4 });
  const cyanX = useSpring(mx, { stiffness: 14, damping: 22, mass: 2.2 });
  const cyanY = useSpring(my, { stiffness: 14, damping: 22, mass: 2.2 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  if (mounted && reduce) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[-1]"
        style={{
          background:
            "radial-gradient(560px circle at 50% 30%, rgba(43,92,255,0.05), transparent 70%)",
        }}
      />
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <motion.div
        className="absolute rounded-full"
        style={{
          x: cobaltX,
          y: cobaltY,
          width: 620,
          height: 620,
          marginLeft: -310,
          marginTop: -310,
          background: "radial-gradient(circle, rgba(43,92,255,0.11) 0%, transparent 68%)",
          filter: "blur(30px)",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          x: cyanX,
          y: cyanY,
          width: 460,
          height: 460,
          marginLeft: -180,
          marginTop: -140,
          background: "radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 66%)",
          filter: "blur(34px)",
        }}
      />
    </div>
  );
}
