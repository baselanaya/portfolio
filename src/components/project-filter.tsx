"use client";

import { useState, useMemo } from "react";
import type { Project } from "@/lib/projects";
import ProjectGrid from "@/components/project-grid";
import TagChip from "@/components/tag-chip";

interface ProjectFilterProps {
  projects: Project[];
  allTags: string[];
}

const ALL_STATUSES = ["active", "archived", "stealth"] as const;
type Status = (typeof ALL_STATUSES)[number];

export default function ProjectFilter({ projects, allTags }: ProjectFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<Status | null>(null);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const tagMatch = activeTag ? p.tags.includes(activeTag) : true;
      const statusMatch = activeStatus ? p.status === activeStatus : true;
      return tagMatch && statusMatch;
    });
  }, [projects, activeTag, activeStatus]);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-12 pb-6 border-b border-border">
        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span
            className="font-mono mr-1"
            style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}
          >
            TAG
          </span>
          <TagChip
            tag="all"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {allTags.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </div>

        {/* Divider */}
        <div
          className="hidden sm:block w-px self-stretch"
          style={{ backgroundColor: "var(--color-border)" }}
          aria-hidden="true"
        />

        {/* Status filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span
            className="font-mono mr-1"
            style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}
          >
            STATUS
          </span>
          <TagChip
            tag="all"
            active={activeStatus === null}
            onClick={() => setActiveStatus(null)}
          />
          {ALL_STATUSES.map((status) => (
            <TagChip
              key={status}
              tag={status}
              active={activeStatus === status}
              onClick={() =>
                setActiveStatus(activeStatus === status ? null : status)
              }
            />
          ))}
        </div>
      </div>

      {/* Results count */}
      <p
        className="font-mono mb-8"
        style={{ fontSize: "11px", color: "var(--color-muted)" }}
      >
        {filtered.length} / {projects.length} projects
      </p>

      {filtered.length > 0 ? (
        <ProjectGrid projects={filtered} />
      ) : (
        <p
          className="font-mono py-12"
          style={{ fontSize: "13px", color: "var(--color-muted)" }}
        >
          No projects match the selected filters.
        </p>
      )}
    </div>
  );
}
