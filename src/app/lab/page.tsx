import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import { journeys } from "@/lib/journeys";

export const metadata: Metadata = {
  title: "Lab",
  alternates: { canonical: "/lab" },
  description:
    "The Lab: a library of journeys. One topic a day, written as interactive chapters you read in order. Currently: GPU Programming in 30 days.",
};

export default function LabPage() {
  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Lab"
          subline="A library of journeys. Each one is a book you read a page a day, written as interactive chapters instead of video courses. One is open."
        />

        {journeys.map((journey) => {
          const published = journey.days.filter((d) => d.status === "published").length;
          const total = journey.days.length;
          const pct = Math.round((published / total) * 100);
          const first = journey.days.find((d) => d.status === "published");

          return (
            <section key={journey.slug} className="mt-14 first:mt-0">
              {/* Journey cover */}
              <div className="glow-border rounded-2xl bg-surface overflow-hidden">
                <div className="p-7 sm:p-9">
                  <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                    <span
                      className="font-mono"
                      style={{ fontSize: "10px", letterSpacing: "0.2em", color: "var(--color-signal)" }}
                    >
                      JOURNEY · {journey.kicker.toUpperCase()}
                    </span>
                    <span
                      className="font-mono"
                      style={{ fontSize: "10px", letterSpacing: "0.12em", color: "var(--color-muted)" }}
                    >
                      {published} / {total} CHAPTERS PUBLISHED
                    </span>
                  </div>

                  <h2
                    className="font-display font-semibold tracking-tight"
                    style={{ fontSize: journey.title.length > 30 ? "30px" : "40px", lineHeight: 1.2 }}
                  >
                    {journey.title}
                  </h2>
                  <p
                    className="mt-4 max-w-[65ch]"
                    style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--color-muted)" }}
                  >
                    {journey.description}
                  </p>

                  {/* progress */}
                  <div
                    className="mt-6 h-1 rounded-full overflow-hidden max-w-md"
                    style={{ backgroundColor: "var(--color-border)" }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-valuenow={published}
                    aria-label={`${published} of ${total} chapters published`}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: "linear-gradient(90deg, #2B5CFF 0%, #0091D5 100%)",
                      }}
                    />
                  </div>

                  {first && (
                    <Link
                      href={`/lab/${journey.slug}/${first.slug}`}
                      className="btn-solid mt-7"
                    >
                      {published > 0 ? "start reading" : "coming soon"} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>

                {/* Chapter grid, grouped by phase — the book's table of contents */}
                <div className="border-t border-border px-7 sm:px-9 py-8">
                  <p
                    className="font-mono mb-6"
                    style={{ fontSize: "10px", letterSpacing: "0.2em", color: "var(--color-muted)" }}
                  >
                    TABLE OF CONTENTS
                  </p>
                  <div className="flex flex-col gap-8">
                    {journey.phases.map((phase) => {
                      const phaseDays = journey.days.filter(
                        (d) => d.day >= phase.days[0] && d.day <= phase.days[1]
                      );
                      return (
                        <div key={phase.name}>
                          <div className="flex items-baseline gap-3 mb-3">
                            <h3 className="font-display font-medium" style={{ fontSize: "15px" }}>
                              {phase.name}
                            </h3>
                            <span
                              className="font-mono"
                              style={{ fontSize: "10px", color: "var(--color-muted)" }}
                            >
                              DAYS {String(phase.days[0]).padStart(2, "0")}–{String(phase.days[1]).padStart(2, "0")}
                            </span>
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {phaseDays.map((day) => {
                              const ready = day.status === "published";
                              const inner = (
                                <>
                                  <span
                                    className="font-mono shrink-0"
                                    style={{
                                      fontSize: "10px",
                                      color: ready ? "var(--color-signal)" : "var(--color-border)",
                                    }}
                                  >
                                    {String(day.day).padStart(2, "0")}
                                  </span>
                                  <span
                                    className="truncate"
                                    style={{
                                      fontSize: "13px",
                                      color: ready ? "var(--color-text)" : "var(--color-muted)",
                                      opacity: ready ? 1 : 0.55,
                                    }}
                                  >
                                    {day.title}
                                    {day.interactive && ready ? (
                                      <span
                                        className="font-mono ml-2"
                                        style={{ fontSize: "9px", color: "var(--color-signal)" }}
                                      >
                                        ◉ interactive
                                      </span>
                                    ) : null}
                                  </span>
                                </>
                              );
                              return (
                                <li key={day.slug}>
                                  {ready ? (
                                    <Link
                                      href={`/lab/${journey.slug}/${day.slug}`}
                                      className="flex items-center gap-3 border border-border rounded-lg px-3 py-2.5 transition-colors duration-150 hover:border-signal"
                                      aria-current={ready ? "page" : undefined}
                                    >
                                      {inner}
                                    </Link>
                                  ) : (
                                    <div
                                      className="flex items-center gap-3 border border-border rounded-lg px-3 py-2.5"
                                      style={{ borderStyle: "dashed", opacity: 0.7 }}
                                      aria-label={`${day.title} (publishing soon)`}
                                    >
                                      {inner}
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
