"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AsciiCover from "@/components/ascii-cover";
import StatusBadge from "@/components/status-badge";
import type { Project } from "@/lib/projects";

const ALL_STATUSES = ["active", "archived"] as const;
type Status = (typeof ALL_STATUSES)[number];

export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [activeStatus, setActiveStatus] = useState<Status | null>(null);

  const filtered = projects.filter((p) =>
    activeStatus ? p.status === activeStatus : true
  );

  const chip = (active: boolean) =>
    `font-mono rounded-full px-3 py-1.5 border transition-colors duration-150 ${
      active
        ? "bg-[var(--color-text)] text-[var(--color-bg)] border-[var(--color-text)]"
        : "border-border text-muted hover:border-[rgba(22,21,15,0.35)]"
    }`;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-x-8 gap-y-4 mb-14">
        <div className="flex flex-wrap gap-2 items-center">
          <span
            className="font-mono mr-1"
            style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}
          >
            STATUS
          </span>
          <button className={chip(activeStatus === null)} onClick={() => setActiveStatus(null)}>
            all
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              className={chip(activeStatus === s)}
              onClick={() => setActiveStatus(activeStatus === s ? null : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="font-mono mb-8" style={{ fontSize: "11px", color: "var(--color-muted)" }}>
        {filtered.length} / {projects.length} projects
      </p>

      {/* Cards */}
      <div className="flex flex-col gap-6">
        {filtered.map((project, i) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className={`group grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-2xl border border-border bg-surface p-4 transition-all duration-200 hover:border-[rgba(22,21,15,0.35)] hover:shadow-[0_16px_40px_-20px_rgba(22,21,15,0.3)] ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <AsciiCover slug={project.slug} kind={project.cover} />
            <div className="flex flex-col gap-3 px-2 py-4 md:px-6">
              <div className="flex items-center gap-3">
                <span className="font-mono" style={{ fontSize: "11px", color: "var(--color-muted)" }}>
                  {project.year}
                </span>
                <StatusBadge status={project.status} />
              </div>
              <h2
                className="font-display font-semibold tracking-tight"
                style={{ fontSize: "clamp(24px, 3vw, 34px)" }}
              >
                {project.name}
              </h2>
              <p style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--color-muted)" }}>
                {project.tagline}
              </p>
              <span
                className="font-mono mt-2 inline-flex items-center gap-2 transition-colors duration-150 group-hover:text-signal"
                style={{ fontSize: "12px", letterSpacing: "0.1em", color: "var(--color-text)" }}
              >
                view project
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="font-mono py-12" style={{ fontSize: "13px", color: "var(--color-muted)" }}>
          No projects match the selected filters.
        </p>
      )}
    </div>
  );
}
