import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import AsciiCover from "@/components/ascii-cover";
import StatusBadge from "@/components/status-badge";
import ProjectDemo from "@/components/demos/project-demo";
import { projects, getProjectBySlug } from "@/lib/projects";
import { getCaseStudy } from "@/lib/case-studies";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Basel Anaya`,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const source = getCaseStudy(slug);
  const { content } = await compileMDX({
    source: source ?? "",
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypePlugins: [[rehypePrettyCode as any, { theme: "github-dark-dimmed" }]],
      },
    },
  });

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <Link
          href="/work"
          className="font-mono inline-block mb-10 hover:text-signal transition-colors duration-150"
          style={{ fontSize: "12px", color: "var(--color-muted)", letterSpacing: "0.1em" }}
        >
          ← back to work
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="font-mono" style={{ fontSize: "11px", color: "var(--color-muted)" }}>
            {project.year}
          </span>
          <StatusBadge status={project.status} />
        </div>
        <h1
          className="font-display font-semibold tracking-tight mb-4"
          style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
        >
          {project.name}
        </h1>
        <p className="max-w-2xl mb-10" style={{ fontSize: "19px", lineHeight: 1.6, color: "var(--color-muted)" }}>
          {project.tagline}
        </p>

        {/* Cover */}
        <AsciiCover slug={project.slug} kind={project.cover} className="mb-12" />

        {/* Interactive preview demo — the mechanics, simulated */}
        <div className="mb-14">
          <p
            className="font-mono mb-4"
            style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.18em" }}
          >
            PREVIEW — HOW IT WORKS
          </p>
          <ProjectDemo slug={project.slug} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Meta sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 flex flex-col gap-6 lg:pr-8">
              <div>
                <p className="font-mono mb-2" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>
                  ROLE
                </p>
                <p style={{ fontSize: "14px" }}>{project.role}</p>
              </div>
              <div>
                <p className="font-mono mb-2" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>
                  STACK
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono border border-border rounded-full px-2.5 py-1"
                      style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.06em" }}
                    >
                      {tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono mb-2" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>
                  KEY FACTS
                </p>
                <div className="flex flex-col gap-2">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
                      <span className="font-mono" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.1em" }}>
                        {m.label}
                      </span>
                      <span className="font-mono" style={{ fontSize: "12px" }}>
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-ghost self-start">
                  view repository ↗
                </a>
              )}
            </div>
          </aside>

          {/* Narrative */}
          <div className="lg:col-span-8">
            <div
              className="prose max-w-none"
              style={
                {
                  "--tw-prose-body": "var(--color-muted)",
                  "--tw-prose-headings": "var(--color-text)",
                  "--tw-prose-links": "var(--color-amber-dim)",
                  "--tw-prose-bold": "var(--color-text)",
                  "--tw-prose-code": "var(--color-amber-dim)",
                  "--tw-prose-hr": "var(--color-border)",
                  "--tw-prose-quotes": "var(--color-muted)",
                  "--tw-prose-quote-borders": "var(--color-amber-dim)",
                  fontSize: "16.5px",
                  lineHeight: 1.75,
                  fontFamily: "var(--font-sans)",
                } as React.CSSProperties
              }
            >
              {content}
            </div>
          </div>
        </div>

        {/* Prev / next */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-20 pt-10 border-t border-border">
          <Link href={`/work/${prev.slug}`} className="group rounded-2xl border border-border p-6 transition-all duration-200 hover:border-[rgba(22,21,15,0.35)]">
            <span className="font-mono" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>
              ← PREVIOUS
            </span>
            <p className="font-display font-semibold tracking-tight mt-2 group-hover:text-signal transition-colors duration-150" style={{ fontSize: "20px" }}>
              {prev.name}
            </p>
          </Link>
          <Link href={`/work/${next.slug}`} className="group rounded-2xl border border-border p-6 text-right transition-all duration-200 hover:border-[rgba(22,21,15,0.35)]">
            <span className="font-mono" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>
              NEXT →
            </span>
            <p className="font-display font-semibold tracking-tight mt-2 group-hover:text-signal transition-colors duration-150" style={{ fontSize: "20px" }}>
              {next.name}
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
