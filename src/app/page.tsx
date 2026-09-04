import Link from "next/link";
import FieldMonitor from "@/components/field-monitor";
import HeroOrbs from "@/components/hero-orbs";
import AsciiCover from "@/components/ascii-cover";
import StatusBadge from "@/components/status-badge";
import { projects } from "@/lib/projects";
import { getAllPosts } from "@/lib/blog";

const CAPABILITIES = [
  {
    label: "INFERENCE SYSTEMS",
    text: "Serving quantized LLMs at the edge of VRAM limits — SGLang deployments, FP8 pipelines, throughput tuning on commodity hardware.",
    proof: "Mercer · Cynosure",
  },
  {
    label: "AGENT SECURITY",
    text: "Zero-trust execution environments that keep autonomous agents inside kernel-level fences — auditable, reproducible, Rust-fast.",
    proof: "Kernex",
  },
  {
    label: "DATA & PIPELINES",
    text: "Text-to-SQL over messy real-world schemas, Arabic document AI for education, and research-grade medical ML pipelines.",
    proof: "Alef Education · University of Jordan",
  },
];

const STATS = [
  { value: "03", label: "projects shipped" },
  { value: "01", label: "startup founded" },
  { value: "03+", label: "years building" },
  { value: "06", label: "roles held" },
];

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* ── Hero — a contained glass instrument panel ─────────── */}
      <section className="px-[5vw] pt-32 pb-16 md:pt-36 md:pb-20 relative">
        {/* Refraction sources — parallax color orbs the glass sits over */}
        <HeroOrbs />

        <div className="max-w-6xl mx-auto relative">
          <div className="glass rounded-3xl overflow-hidden">
            {/* Panel titlebar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/70 bg-white/40">
              <span
                className="font-mono"
                style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.16em" }}
              >
                FIELD MONITOR
              </span>
              <span
                className="font-mono hidden sm:block"
                style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.14em" }}
              >
                AMMAN · UTC+3
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-7 md:p-10 items-center">
              <div className="lg:col-span-7 flex flex-col items-start">
                <p
                  className="font-mono mb-6"
                  style={{ fontSize: "11px", color: "var(--color-amber-dim)", letterSpacing: "0.2em" }}
                >
                  {"// MAXIMLABS — AI INFRASTRUCTURE"}
                </p>
                <h1
                  className="font-display font-semibold tracking-tight leading-[1.02]"
                  style={{ fontSize: "clamp(44px, 5.4vw, 76px)", color: "var(--color-text)" }}
                >
                  AI Engineer<span style={{ color: "var(--color-signal)" }}>.</span>
                </h1>
                <p
                  className="mt-6 max-w-lg"
                  style={{ fontSize: "17px", lineHeight: 1.65, color: "var(--color-muted)" }}
                >
                  I&apos;m Basel Anaya — founder of Maximlabs. I design the layer
                  autonomous agents run on: kernel-level sandboxes, local LLM
                  inference, and the data pipelines between them.
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link href="/work" className="btn-solid">
                    view work <span aria-hidden="true">→</span>
                  </Link>
                  <Link href="/contact" className="btn-ghost">
                    get in touch
                  </Link>
                </div>
              </div>

              {/* The instrument — sixtytwo-style ASCII field */}
              <div className="lg:col-span-5">
                <FieldMonitor />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Selected work ──────────────────────────────────────── */}
      <section className="px-[5vw] py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-12">
            <h2
              className="font-display font-semibold tracking-tight"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              Selected work
            </h2>
            <Link
              href="/work"
              className="font-mono hover:text-signal transition-colors duration-150"
              style={{ fontSize: "12px", color: "var(--color-muted)", letterSpacing: "0.1em" }}
            >
              all projects →
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            {featured.map((project, i) => (
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
                    <span
                      className="font-mono"
                      style={{ fontSize: "11px", color: "var(--color-muted)" }}
                    >
                      {project.year}
                    </span>
                    <StatusBadge status={project.status} />
                  </div>
                  <h3
                    className="font-display font-semibold tracking-tight"
                    style={{ fontSize: "clamp(24px, 3vw, 34px)" }}
                  >
                    {project.name}
                  </h3>
                  <p style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--color-muted)" }}>
                    {project.tagline}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.metrics.map((m) => (
                      <span
                        key={m.label}
                        className="font-mono border border-border rounded-full px-2.5 py-1 bg-surface-2"
                        style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.06em" }}
                      >
                        {m.label}: {m.value}
                      </span>
                    ))}
                  </div>
                  <span
                    className="font-mono mt-2 inline-flex items-center gap-2 transition-colors duration-150 group-hover:text-signal"
                    style={{ fontSize: "12px", letterSpacing: "0.1em", color: "var(--color-text)" }}
                  >
                    read case study
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ──────────────────────────────────────── */}
      <section className="px-[5vw] py-20 border-t border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <h2
              className="font-display font-semibold tracking-tight"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              What I build
            </h2>
          </div>
          <div className="md:col-span-8 flex flex-col">
            {CAPABILITIES.map((cap) => (
              <div key={cap.label} className="py-8 border-b border-border first:pt-0">
                <p
                  className="font-mono mb-3"
                  style={{ fontSize: "11px", color: "var(--color-amber-dim)", letterSpacing: "0.18em" }}
                >
                  {cap.label}
                </p>
                <p style={{ fontSize: "17px", lineHeight: 1.65, color: "var(--color-muted)", maxWidth: "56ch" }}>
                  {cap.text}
                </p>
                <p
                  className="font-mono mt-3"
                  style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.08em" }}
                >
                  {cap.proof}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Numbers strip — dark island ───────────────────────── */}
      <section className="theme-dark px-[5vw] py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span
                className="font-display font-semibold tracking-tight leading-none"
                style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
              >
                {value}
              </span>
              <span
                className="font-mono"
                style={{ fontSize: "11px", color: "var(--color-terminal-muted)", letterSpacing: "0.15em" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Writing teaser ────────────────────────────────────── */}
      <section className="px-[5vw] py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <h2
              className="font-display font-semibold tracking-tight"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              Writing
            </h2>
            <Link
              href="/blog"
              className="font-mono hover:text-signal transition-colors duration-150"
              style={{ fontSize: "12px", color: "var(--color-muted)", letterSpacing: "0.1em" }}
            >
              all posts →
            </Link>
          </div>
          <div className="flex flex-col">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-baseline justify-between gap-6 py-5 border-b border-border"
              >
                <span
                  className="font-mono shrink-0 w-28"
                  style={{ fontSize: "11px", color: "var(--color-muted)" }}
                >
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
                <span
                  className="font-display font-medium flex-1 transition-colors duration-150 group-hover:text-signal"
                  style={{ fontSize: "18px" }}
                >
                  {post.title}
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "var(--color-muted)" }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA — dark island ─────────────────────────── */}
      <section className="theme-dark px-[5vw] py-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <p
            className="font-display font-semibold tracking-tight leading-tight"
            style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
          >
            Have something to build?
            <br />
            <span style={{ color: "var(--color-terminal-muted)" }}>Let&apos;s talk.</span>
          </p>
          <Link href="/contact" className="btn-solid shrink-0">
            get in touch <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
