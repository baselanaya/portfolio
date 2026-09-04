import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import NowStatus from "@/components/now-status";
import { experience } from "@/lib/experience";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Now",
  alternates: { canonical: "/now" },
  description: "What Basel Anaya is focused on right now.",
};

export default function NowPage() {
  const building = projects.filter((p) => p.status === "active");
  const currentRole = experience.find((r) => r.end === "Present");

  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="// LIVE FOCUS"
          title="Now"
          subline="What I'm working on at this exact point in time — updated as things change. Inspired by the /now page tradition."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 flex flex-col gap-10">
            <section>
              <p className="font-mono mb-3" style={{ fontSize: "10px", color: "var(--color-amber-dim)", letterSpacing: "0.18em" }}>
                BUILDING
              </p>
              <div className="flex flex-col gap-2">
                {building.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/work/${p.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-3 border-b border-border"
                  >
                    <span className="font-display font-medium transition-colors duration-150 group-hover:text-signal" style={{ fontSize: "16px" }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--color-muted)" }} className="text-right">
                      {p.tagline}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {currentRole && (
              <section>
                <p className="font-mono mb-3" style={{ fontSize: "10px", color: "var(--color-amber-dim)", letterSpacing: "0.18em" }}>
                  DAY JOB
                </p>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--color-muted)" }}>
                  {currentRole.title} at {currentRole.company} —{" "}
                  {currentRole.description[0]}
                </p>
              </section>
            )}

            <section>
              <p className="font-mono mb-3" style={{ fontSize: "10px", color: "var(--color-amber-dim)", letterSpacing: "0.18em" }}>
                LEARNING
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--color-muted)" }}>
                Deeper Rust systems work — GPU fences and capability-based
                security in kernel space. Inference serving internals: how
                SGLang schedules memory when two models share one GPU.
              </p>
            </section>
          </div>

          {/* Live status card */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <NowStatus />
              <p className="font-mono mt-3" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.12em" }}>
                STATUS FEED · FETCHED LIVE FROM THE SITE
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
