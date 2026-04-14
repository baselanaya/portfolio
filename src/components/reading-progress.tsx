"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none"
      style={{ backgroundColor: "transparent" }}
      aria-hidden="true"
    >
      <div
        className="h-full transition-none"
        style={{
          width: `${progress}%`,
          background: "var(--gradient-brand)",
        }}
      />
    </div>
  );
}
