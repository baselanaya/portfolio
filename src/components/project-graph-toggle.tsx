"use client";

import { useState } from "react";
import ProjectFilter from "@/components/project-filter";
import ProjectGraph from "@/components/project-graph";
import type { Project } from "@/lib/projects";

interface Props {
  projects: Project[];
  allTags: string[];
}

export default function ProjectGraphToggle({ projects, allTags }: Props) {
  const [view, setView] = useState<"grid" | "graph">("grid");

  return (
    <div>
      {/* View toggle */}
      <div className="flex items-center gap-2 mb-8">
        {(["grid", "graph"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="font-mono border border-border px-4 py-1.5 transition-colors duration-150"
            style={{
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: view === v ? "var(--color-bg)" : "var(--color-muted)",
              backgroundColor: view === v ? "var(--color-amber)" : "transparent",
              borderColor: view === v ? "var(--color-amber)" : "var(--color-border)",
            }}
          >
            [ {v} view ]
          </button>
        ))}
      </div>

      {view === "grid" ? (
        <ProjectFilter projects={projects} allTags={allTags} />
      ) : (
        <div>
          <p
            className="font-mono mb-6"
            style={{ fontSize: "12px", color: "var(--color-muted)", letterSpacing: "0.05em" }}
          >
            Shared technologies link projects. Hover any node to trace connections.
          </p>
          <ProjectGraph />
        </div>
      )}
    </div>
  );
}
