import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journeys, getJourney, getPublishedDay } from "@/lib/journeys";
import Day01 from "@/components/journeys/day-01";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const journey = getJourney("gpu-programming")!;
  return journey.days
    .filter((d) => d.status === "published")
    .map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const journey = getJourney("gpu-programming");
  const day = journey && getPublishedDay(journey, slug);
  if (!journey || !day) return {};
  return {
    title: `Day ${String(day.day).padStart(2, "0")}: ${day.title}`,
    description: day.summary,
    alternates: { canonical: `/lab/${journey.slug}/${day.slug}` },
  };
}

const CHAPTERS: Record<string, () => React.JSX.Element> = {
  "day-01-why-gpus-are-shaped-this-way": Day01,
};

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const journey = getJourney("gpu-programming");
  const day = journey && getPublishedDay(journey, slug);
  if (!journey || !day) notFound();

  const Chapter = CHAPTERS[slug];
  if (!Chapter) notFound();

  const idx = journey.days.findIndex((d) => d.slug === slug);
  const prev = idx > 0 ? journey.days[idx - 1] : null;
  const next = idx < journey.days.length - 1 ? journey.days[idx + 1] : null;

  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-3xl mx-auto">
        {/* chapter header */}
        <header className="mb-14">
          <p className="font-mono" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "var(--color-signal)" }}>
            <Link href="/lab" className="hover:text-signal transition-colors">LAB</Link>
            {" / "}
            <span style={{ color: "var(--color-muted)" }}>{journey.title.toUpperCase()}</span>
          </p>
          <p
            className="font-mono mt-6"
            style={{ fontSize: "10px", letterSpacing: "0.2em", color: "var(--color-muted)" }}
          >
            DAY {String(day.day).padStart(2, "0")} / {journey.days.length}
            {" · "}
            {journey.phases.find((ph) => day.day >= ph.days[0] && day.day <= ph.days[1])?.name.toUpperCase()}
            {" · ~12 MIN READ"}
          </p>
          <h1 className="font-display font-semibold tracking-tight mt-3" style={{ fontSize: "44px", lineHeight: 1.1 }}>
            {day.title}
          </h1>
          <p className="mt-5" style={{ fontSize: "17px", lineHeight: 1.7, color: "var(--color-muted)" }}>
            {day.summary}
          </p>
        </header>

        <article>
          <Chapter />
        </article>

        {/* chapter footer nav */}
        <nav className="mt-20 pt-8 border-t border-border grid grid-cols-2 gap-4" aria-label="Chapter navigation">
          {prev ? (
            <Link
              href={`/lab/${journey.slug}/${prev.slug}`}
              className="glow-border rounded-xl p-4 transition-colors duration-150"
            >
              <span className="font-mono block" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "var(--color-muted)" }}>
                ← PREVIOUS
              </span>
              <span className="font-display mt-1 block" style={{ fontSize: "15px" }}>
                Day {String(prev.day).padStart(2, "0")} · {prev.title}
              </span>
            </Link>
          ) : (
            <Link href="/lab" className="glow-border rounded-xl p-4 transition-colors duration-150">
              <span className="font-mono block" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "var(--color-muted)" }}>
                ← BACK
              </span>
              <span className="font-display mt-1 block" style={{ fontSize: "15px" }}>
                The Lab
              </span>
            </Link>
          )}
          {next ? (
            next.status === "published" ? (
              <Link
                href={`/lab/${journey.slug}/${next.slug}`}
                className="glow-border rounded-xl p-4 text-right transition-colors duration-150"
              >
                <span className="font-mono block" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "var(--color-muted)" }}>
                  NEXT →
                </span>
                <span className="font-display mt-1 block" style={{ fontSize: "15px" }}>
                  Day {String(next.day).padStart(2, "0")} · {next.title}
                </span>
              </Link>
            ) : (
              <div
                className="rounded-xl p-4 text-right border border-border"
                style={{ borderStyle: "dashed" }}
                aria-label={`${next.title} (publishing soon)`}
              >
                <span className="font-mono block" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "var(--color-muted)" }}>
                  NEXT · PUBLISHING SOON
                </span>
                <span className="font-display mt-1 block" style={{ fontSize: "15px", opacity: 0.6 }}>
                  Day {String(next.day).padStart(2, "0")} · {next.title}
                </span>
              </div>
            )
          ) : (
            <span />
          )}
        </nav>
      </div>
    </main>
  );
}
