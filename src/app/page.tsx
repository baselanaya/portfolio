import Link from "next/link";
import PixelName from "@/components/pixel-name";
import SectionHeading from "@/components/section-heading";
import ProjectGrid from "@/components/project-grid";
import GitHubHeatmap from "@/components/github-heatmap";
import SkillsConstellation from "@/components/skills-constellation";
import { projects } from "@/lib/projects";

const MARQUEE_TAGS = [
  "Rust", "Python", "LLM Inference", "AI Agents", "Zero-Trust",
  "SGLang", "PyTorch", "DuckDB", "Hypervisor", "Text-to-SQL",
  "Document AI", "Systems", "Trading", "Arabic NLP", "Security",
];

const BIO_LINES = [
  "AI engineer focused on building, fine-tuning, and deploying LLMs for real-world impact — from kernel-level security hypervisors to document AI pipelines. Founder of Maximlabs, currently an AI R&D Intern at Alef Education.",
  "Passionate about AI in medicine and robotics. Active open-source contributor across GitHub, Hugging Face, and Kaggle. Based in Amman, Jordan.",
];

const STATS = [
  { value: "05", label: "PROJECTS SHIPPED" },
  { value: "01", label: "STARTUP FOUNDED" },
  { value: "03+", label: "YEARS BUILDING" },
];

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative scanlines flex flex-col justify-center px-[5vw] min-h-screen"
        style={{ paddingTop: "7rem", paddingBottom: "5rem" }}
      >
        {/* Top label */}
        <p
          className="font-mono mb-6"
          style={{
            fontSize: "11px",
            color: "var(--color-amber-dim)",
            letterSpacing: "0.2em",
          }}
        >
          // MAXIMLABS — AI INFRASTRUCTURE
        </p>

        {/* Name reveal */}
        <PixelName />

        {/* Tagline */}
        <p
          className="font-sans mt-6 max-w-xl"
          style={{ fontSize: "20px", color: "var(--color-muted)", lineHeight: 1.6 }}
        >
          Building infrastructure for the age of autonomous AI
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mt-10">
          {[
            { href: "/projects", label: "> view projects" },
            { href: "/blog", label: "> read blog" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-mono border border-amber text-amber px-6 py-3 transition-colors duration-150 hover:bg-amber hover:text-bg"
              style={{ fontSize: "13px", letterSpacing: "0.15em" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Marquee strip */}
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="h-px w-full"
            style={{ backgroundColor: "var(--color-amber)", opacity: 0.4 }}
          />
          <div className="overflow-hidden py-3">
            <div className="animate-marquee">
              {[...MARQUEE_TAGS, ...MARQUEE_TAGS].map((tag, i) => (
                <span
                  key={i}
                  className="font-mono mx-6"
                  style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.12em", whiteSpace: "nowrap" }}
                >
                  {tag}
                  <span
                    className="ml-6"
                    style={{ color: "var(--color-amber-dim)", opacity: 0.6 }}
                  >
                    /
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────── */}
      <section className="px-[5vw] py-24">
        <SectionHeading index="01" title="SELECTED WORK" subtitle="Featured projects" />
        <ProjectGrid projects={featured} />
        <div className="mt-10">
          <Link
            href="/projects"
            className="font-mono text-muted hover:text-amber transition-colors duration-150"
            style={{ fontSize: "12px", letterSpacing: "0.1em" }}
          >
            [ view all projects → ]
          </Link>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────── */}
      <section className="px-[5vw] py-24 border-t border-border">
        <SectionHeading index="02" title="ABOUT" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Bio */}
          <div className="flex flex-col gap-5 max-w-lg">
            {BIO_LINES.map((line, i) => (
              <p
                key={i}
                className="font-sans"
                style={{ fontSize: "16px", color: "var(--color-muted)", lineHeight: 1.8 }}
              >
                {line}
              </p>
            ))}
            {/* Languages */}
            <div className="flex gap-6 mt-2">
              {[
                { lang: "Arabic", level: "Native" },
                { lang: "English", level: "Professional" },
                { lang: "German", level: "Elementary" },
              ].map(({ lang, level }) => (
                <div key={lang} className="flex flex-col gap-0.5">
                  <span
                    className="font-mono"
                    style={{ fontSize: "11px", color: "var(--color-amber-dim)", letterSpacing: "0.08em" }}
                  >
                    {lang}
                  </span>
                  <span
                    className="font-mono"
                    style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.06em" }}
                  >
                    {level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stat block + heatmap */}
          <div className="flex flex-col gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex items-baseline gap-4">
                <span
                  className="font-pixel leading-none"
                  style={{ fontSize: "56px", color: "var(--color-amber)" }}
                >
                  {value}
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.15em" }}
                >
                  {label}
                </span>
              </div>
            ))}
            {/* GitHub heatmap */}
            <div className="mt-4 pt-6 border-t border-border">
              <GitHubHeatmap username="baselanaya" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills Constellation ─────────────────────────────── */}
      <section className="px-[5vw] py-24 border-t border-border">
        <SectionHeading index="03" title="SKILLS" subtitle="Hover nodes · watch clusters form" />
        <SkillsConstellation />
      </section>

      {/* ── CTA Strip ─────────────────────────────────────────── */}
      <section
        className="px-[5vw] py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
        style={{ background: "var(--gradient-brand)" }}
      >
        <p
          className="font-pixel tracking-tight leading-tight"
          style={{ fontSize: "clamp(24px, 3vw, 40px)", color: "#0A0806" }}
        >
          Have something to build?
          <br />
          Let&apos;s talk.
        </p>
        <Link
          href="/contact"
          className="font-mono text-bg border border-bg px-8 py-3 transition-all duration-150 hover:bg-bg hover:text-amber"
          style={{ fontSize: "13px", letterSpacing: "0.15em", whiteSpace: "nowrap" }}
        >
          {"> get in touch"}
        </Link>
      </section>
    </>
  );
}
