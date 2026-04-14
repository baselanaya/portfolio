"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/projects";
import TagChip from "@/components/tag-chip";
import StatusBadge from "@/components/status-badge";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.article
      className="glow-border relative overflow-hidden flex flex-col gap-3 p-6"
      style={{ backgroundColor: "var(--color-surface)" }}
      whileHover={shouldReduce ? undefined : { y: -3 }}
      transition={{ duration: 0.2 }}
    >
      {/* Ghost watermark letter — GeistPixelLine */}
      <span
        aria-hidden="true"
        className="font-pixel-ghost absolute bottom-2 right-4 leading-none select-none pointer-events-none"
        style={{
          fontSize: "120px",
          opacity: 0.06,
          color: "var(--color-text)",
          lineHeight: 1,
        }}
      >
        {project.name[0]}
      </span>

      {/* Year */}
      <div className="flex justify-end">
        <span
          className="font-mono"
          style={{ fontSize: "11px", color: "var(--color-muted)" }}
        >
          {project.year}
        </span>
      </div>

      {/* Name */}
      <h3
        className="font-pixel tracking-tight leading-tight"
        style={{ fontSize: "clamp(22px, 5vw, 28px)", color: "var(--color-text)" }}
      >
        {project.name}
      </h3>

      {/* Tagline */}
      <p
        className="font-sans"
        style={{ fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.6 }}
      >
        {project.tagline}
      </p>

      {/* Footer row */}
      <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
        {project.tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
        <StatusBadge status={project.status} />
        {project.github && (
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono ml-auto transition-colors duration-150"
            style={{ fontSize: "11px", color: "var(--color-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-amber)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-muted)")
            }
          >
            ↗ github
          </Link>
        )}
      </div>
    </motion.article>
  );
}
