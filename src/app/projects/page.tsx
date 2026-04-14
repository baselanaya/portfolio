import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import ProjectFilter from "@/components/project-filter";
import ProjectGraphToggle from "@/components/project-graph-toggle";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Basel Anaya",
  description: "All projects by Basel Anaya — AI infrastructure, systems, LLM tooling, and more.",
};

export default function ProjectsPage() {
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags))
  ).sort();

  return (
    <main className="px-[5vw] pt-28 pb-24">
      <SectionHeading
        as="h1"
        index="01"
        title="ALL WORK"
        subtitle="Every project, filterable by tag and status"
      />
      <ProjectGraphToggle projects={projects} allTags={allTags} />
    </main>
  );
}
