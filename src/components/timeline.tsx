"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Role, Education } from "@/lib/experience";
import TagChip from "@/components/tag-chip";

interface TimelineProps {
  experience: Role[];
  education: Education;
}

const TYPE_LABELS: Record<Role["type"], string> = {
  "full-time": "full-time",
  internship: "internship",
  freelance: "freelance",
  founder: "founder",
};

function TimelineDot({ isActive, shouldReduce }: { isActive: boolean; shouldReduce: boolean | null }) {
  // Dot must be centered on the 3px amber border-l.
  // Entry content starts at: containerLeft(72) + border(3) + padding(40) = 115px from viewport.
  // Line center: 72 + 1.5 = 73.5px. Formula: left = -(115 - 73.5 + dotWidth/2) = -(41.5 + dotWidth/2)
  // 14px active dot → -48.5px, 12px past dot → -47.5px
  const dotLeft = isActive ? "-48.5px" : "-47.5px";
  return (
    <span className="absolute top-1.5" style={{ left: dotLeft }} aria-hidden="true">
      {/* Dot */}
      <span
        className="block"
        style={{
          width: isActive ? "14px" : "12px",
          height: isActive ? "14px" : "12px",
          backgroundColor: isActive ? "var(--color-amber)" : "var(--color-surface-2)",
          border: "2px solid var(--color-amber)",
          boxShadow: isActive
            ? "0 0 0 2px var(--color-bg), 0 0 10px rgba(245,158,11,0.5)"
            : "none",
          position: "relative",
          zIndex: 1,
        }}
      />
      {/* Pulsing ring for active dot */}
      {isActive && !shouldReduce && (
        <motion.span
          className="absolute inset-0 block"
          style={{
            border: "1.5px solid var(--color-amber)",
            opacity: 0,
          }}
          animate={{
            scale: [1, 1.8],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </span>
  );
}

export default function Timeline({ experience, education }: TimelineProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="flex flex-col gap-0">
      {/* Experience entries */}
      <div className="relative pl-10 border-l-[3px]" style={{ borderColor: "var(--color-amber)" }}>
        {experience.map((role, i) => {
          const isActive = role.end === "Present";
          return (
            <motion.div
              key={`${role.company}-${role.start}`}
              className="relative mb-14 last:mb-10"
              initial={shouldReduce ? undefined : { opacity: 0, y: 24 }}
              whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
            >
              <TimelineDot isActive={isActive} shouldReduce={shouldReduce} />

              {/* Company + type badge row */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-mono"
                  style={{ fontSize: "12px", color: isActive ? "var(--color-amber)" : "var(--color-muted)", letterSpacing: "0.05em" }}
                >
                  {role.company}
                </span>
                <span
                  className="font-mono px-1.5 py-0.5"
                  style={{
                    fontSize: "10px",
                    color: "var(--color-muted)",
                    border: "1px solid var(--color-border)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {TYPE_LABELS[role.type]}
                </span>
              </div>

              {/* Role title */}
              <h3
                className="font-pixel tracking-tight leading-tight mb-2"
                style={{ fontSize: "clamp(22px, 5vw, 28px)", color: "var(--color-text)" }}
              >
                {role.title}
              </h3>

              {/* Date + location row */}
              <p
                className="font-mono mb-4"
                style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.04em" }}
              >
                {role.start} – {role.end} &nbsp;·&nbsp; {role.location}
              </p>

              {/* Bullets */}
              <ul className="flex flex-col gap-1.5 mb-4">
                {role.description.map((item, j) => (
                  <li
                    key={j}
                    className="font-sans flex gap-2"
                    style={{ fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.65 }}
                  >
                    <span style={{ color: "var(--color-amber-dim)", flexShrink: 0 }} aria-hidden="true">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {role.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Education — lighter visual weight, thinner border */}
      <motion.div
        className="relative pl-10 border-l border-border pt-2"
        initial={shouldReduce ? undefined : { opacity: 0, y: 24 }}
        whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: experience.length * 0.08 }}
      >
        {/* Small muted square dot */}
        <span
          className="absolute top-3"
          style={{ left: "-7px" }}
          aria-hidden="true"
        >
          <span
            className="block"
            style={{
              width: "11px",
              height: "11px",
              backgroundColor: "var(--color-surface)",
              border: "1.5px solid var(--color-border)",
            }}
          />
        </span>

        <p
          className="font-mono mb-1"
          style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.04em" }}
        >
          {education.period} &nbsp;·&nbsp; {education.institution}
        </p>

        <h3
          className="font-pixel tracking-tight leading-tight mb-1"
          style={{ fontSize: "20px", color: "var(--color-muted)" }}
        >
          {education.degree}
        </h3>

        <p
          className="font-mono"
          style={{ fontSize: "11px", color: "var(--color-muted)" }}
        >
          {education.location}
        </p>
      </motion.div>
    </div>
  );
}
