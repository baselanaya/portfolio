"use client";

// Hero refraction orbs — soft color fields the glass panel sits over.
// Two motion layers per orb: a slow autonomous drift (CSS keyframes) and
// a cursor parallax (translate via --mx/--my set by MouseSpotlight),
// so the glass refraction is alive even when the mouse is still.

const ORBS = [
  {
    drift: "orb-drift-a",
    style: {
      width: "46vw", height: "46vw", maxWidth: 640, maxHeight: 640,
      left: "-10vw", top: "-8vh",
      background: "radial-gradient(circle, rgba(43,92,255,0.32) 0%, rgba(43,92,255,0.08) 45%, transparent 70%)",
      transform: "translate(calc(var(--mx, 0px) * -0.035), calc(var(--my, 0px) * -0.035))",
    },
  },
  {
    drift: "orb-drift-b",
    style: {
      width: "40vw", height: "40vw", maxWidth: 560, maxHeight: 560,
      right: "-8vw", bottom: "-10vh",
      background: "radial-gradient(circle, rgba(0,180,216,0.26) 0%, rgba(0,180,216,0.07) 45%, transparent 70%)",
      transform: "translate(calc(var(--mx, 0px) * 0.028), calc(var(--my, 0px) * 0.035))",
    },
  },
  {
    drift: "orb-drift-c",
    style: {
      width: "24vw", height: "24vw", maxWidth: 340, maxHeight: 340,
      left: "38%", top: "48%",
      background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 68%)",
      transform: "translate(calc(var(--mx, 0px) * -0.05), calc(var(--my, 0px) * -0.02))",
    },
  },
];

export default function HeroOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            ...orb.style,
            filter: "blur(36px)",
            transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {/* inner layer carries the autonomous drift */}
          <div
            className="w-full h-full rounded-full"
            style={{ animation: `${orb.drift} ${18 + i * 7}s ease-in-out infinite alternate` }}
          />
        </div>
      ))}
    </div>
  );
}
