import type { Metadata } from "next";
import WorkIndex from "@/components/work-index";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  alternates: { canonical: "/work" },
  description:
    "Projects by Basel Anaya — AI infrastructure, kernel security, LLM inference systems, and data pipelines.",
};

export default function WorkPage() {
  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-6xl mx-auto">
        <p
          className="font-mono mb-6"
          style={{ fontSize: "11px", color: "var(--color-amber-dim)", letterSpacing: "0.2em" }}
        >
          {"// SELECTED & ARCHIVED"}
        </p>
        <h1
          className="font-display font-semibold tracking-tight mb-4"
          style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
        >
          Work
        </h1>
        <p className="mb-14 max-w-xl" style={{ fontSize: "17px", color: "var(--color-muted)", lineHeight: 1.65 }}>
          Systems I&apos;ve designed and shipped — from kernel-level hypervisors
          to local inference servers. Every project opens into its own story.
        </p>
        <WorkIndex projects={projects} />
      </div>
    </main>
  );
}
