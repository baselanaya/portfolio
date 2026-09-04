"use client";

import { useEffect } from "react";

// Tracks the cursor and publishes it as CSS variables (--mx / --my, px)
// on :root. The page-grid spotlight and the hero orbs read these vars,
// so the whole background gently follows the mouse.
export default function MouseSpotlight() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    let tx = 0, ty = 0;

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          // px units are load-bearing: unitless values invalidate the
          // page-grid's radial-gradient and erase the whole background
          root.style.setProperty("--mx", `${tx}px`);
          root.style.setProperty("--my", `${ty}px`);
          raf = 0;
        });
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
