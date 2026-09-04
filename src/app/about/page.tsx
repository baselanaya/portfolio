import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import AsciiCover from "@/components/ascii-cover";
import { education, experience } from "@/lib/experience";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description: "Who Basel Anaya is — AI engineer, founder of Maximlabs, based in Amman, Jordan.",
};

const LANGUAGES = [
  { lang: "Arabic", level: "Native" },
  { lang: "English", level: "Professional" },
  { lang: "German", level: "Elementary" },
];

export default function AboutPage() {
  const currentRole = experience[0];

  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="// WHO'S BEHIND THE WORK"
          title="About"
          subline="I build the systems autonomous agents run on — and I like doing it close to the metal."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Portrait — ASCII instrument panel until the camera budget arrives */}
          <div className="lg:col-span-5">
            <AsciiCover slug="basel-anaya" kind="rings" />
            <p
              className="font-mono mt-3"
              style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.12em" }}
            >
              FIG. 01 — PORTRAIT (ASCII RENDER; OPTICAL SENSOR PENDING)
            </p>
          </div>

          {/* Story */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <p style={{ fontSize: "17px", lineHeight: 1.75, color: "var(--color-text)" }}>
              I&apos;m Basel Anaya, an AI engineer from Amman, Jordan, and the
              founder of Maximlabs — a one-person lab focused on AI
              infrastructure security for autonomous agent workloads.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--color-muted)" }}>
              My work sits where most of the industry prefers not to look:
              what happens when an AI agent has shell access. That led to
              Kernex, a zero-trust kernel-level hypervisor in Rust. It also
              led to inference and orchestration engineering on production
              insurance platforms — Text-to-SQL against governed Oracle
              views, document pipelines, and agentic systems at Deriv, and a
              500M-parameter-scale research past at the University of Jordan.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--color-muted)" }}>
              Along the way: an MVP autograding system and Arabic exam
              extraction benchmarks at Alef Education, a fully local
              autonomous trading stack, and open-source contributions across
              GitHub and Hugging Face.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--color-muted)" }}>
              Currently: {currentRole.title} at {currentRole.company}, and
              open to freelance and contract work.
            </p>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 mt-6 pt-8 border-t border-border">
              <div>
                <p className="font-mono mb-1.5" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>BASED IN</p>
                <p style={{ fontSize: "14px" }}>Amman, Jordan</p>
              </div>
              <div>
                <p className="font-mono mb-1.5" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>EDUCATION</p>
                <p style={{ fontSize: "14px" }}>
                  BSc in Artificial Intelligence, University of Jordan
                  {education[0].inProgress && (
                    <span style={{ color: "var(--color-muted)" }}>
                      {" "}· now Game Development & Design at SAE Institute
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="font-mono mb-1.5" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>LANGUAGES</p>
                <p style={{ fontSize: "14px" }}>
                  {LANGUAGES.map((l) => `${l.lang} (${l.level.toLowerCase()})`).join(" · ")}
                </p>
              </div>
              <div>
                <p className="font-mono mb-1.5" style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}>CORE STACK</p>
                <p style={{ fontSize: "14px" }}>Rust · Python · TypeScript · LangGraph · PyTorch</p>
              </div>
            </div>

            {/* Elsewhere */}
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="https://github.com/baselanaya" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                github ↗
              </a>
              <a href="https://linkedin.com/in/basel-anaya" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                linkedin ↗
              </a>
              <a href="https://huggingface.co/baselanaya" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                hugging face ↗
              </a>
              <Link href="/contact" className="btn-solid">
                get in touch →
              </Link>
            </div>
            <p className="font-mono mt-2" style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.06em" }}>
              Résumé available on request — email me.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-5 font-mono" style={{ fontSize: "11px" }}>
              <span style={{ color: "var(--color-muted)" }}>start here:</span>
              <Link href="/work" className="text-text hover:text-signal transition-colors duration-150">the work →</Link>
              <Link href="/lab" className="text-text hover:text-signal transition-colors duration-150">the lab →</Link>
              <Link href="/now" className="text-text hover:text-signal transition-colors duration-150">what I'm doing now →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
