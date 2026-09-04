import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import {
  experience,
  education,
  certifications,
  type Role,
} from "@/lib/experience";

export const metadata: Metadata = {
  title: "Experience",
  alternates: { canonical: "/experience" },
  description:
    "Work history, education, and certifications — Basel Anaya, AI Engineer specialized in LLM systems, agentic pipelines, and document AI.",
};

const TYPE_LABELS: Record<Role["type"], string> = {
  "full-time": "full-time",
  internship: "internship",
  freelance: "freelance",
  founder: "founder",
};

export default function ExperiencePage() {
  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="// ROLES, EDUCATION & CERTS"
          title="Experience"
          subline="AI engineer with 2+ years across insurance, EdTech, and fintech — from founding an AI department to leading a production Text-to-SQL rebuild."
        />

        <div className="flex flex-col">
          {experience.map((role) => {
            const isActive = role.end === "Present";
            return (
              <div key={`${role.company}-${role.start}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-border first:pt-0">
                {/* Date column */}
                <div className="md:col-span-3 flex flex-col gap-1.5">
                  <span
                    className="font-mono"
                    style={{ fontSize: "12px", color: isActive ? "var(--color-amber-dim)" : "var(--color-muted)", letterSpacing: "0.05em" }}
                  >
                    {role.start} — {role.end}
                  </span>
                  <span className="font-mono" style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.04em" }}>
                    {role.location}
                  </span>
                </div>

                {/* Role column */}
                <div className="md:col-span-9 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                        style={{ backgroundColor: "var(--color-signal)" }}
                        aria-label="current role"
                      />
                    )}
                    <h2 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(20px, 2.6vw, 28px)" }}>
                      {role.company}
                    </h2>
                    <span
                      className="font-mono rounded-full border border-border px-2 py-0.5"
                      style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.08em" }}
                    >
                      {TYPE_LABELS[role.type]}
                    </span>
                  </div>

                  <p style={{ fontSize: "15px", color: "var(--color-text)" }}>{role.title}</p>

                  <ul className="flex flex-col gap-1.5">
                    {role.description.map((item) => (
                      <li key={item} className="flex gap-2.5" style={{ fontSize: "14.5px", lineHeight: 1.65, color: "var(--color-muted)" }}>
                        <span style={{ color: "var(--color-amber-dim)" }} aria-hidden="true">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mt-1">
                    {role.tags.map((tag) => (
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
              </div>
            );
          })}

          {/* Education */}
          {education.map((edu) => (
            <div
              key={edu.degree}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-border"
            >
              <div className="md:col-span-3">
                <span
                  className="font-mono"
                  style={{ fontSize: "12px", color: "var(--color-muted)", letterSpacing: "0.05em" }}
                >
                  {edu.period}
                  {edu.inProgress && " · in progress"}
                </span>
              </div>
              <div className="md:col-span-9 flex flex-col gap-1.5">
                <h2
                  className="font-display font-medium tracking-tight"
                  style={{ fontSize: "20px", color: "var(--color-muted)" }}
                >
                  {edu.degree}
                </h2>
                <p className="font-mono" style={{ fontSize: "12px", color: "var(--color-muted)" }}>
                  {edu.institution} · {edu.location}
                </p>
              </div>
            </div>
          ))}

          {/* Certifications */}
          <div className="py-10">
            <p
              className="font-mono mb-6"
              style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.18em" }}
            >
              CERTIFICATIONS
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1"
                >
                  <span style={{ fontSize: "13.5px", lineHeight: 1.5 }}>{cert.name}</span>
                  <span
                    className="font-mono"
                    style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.08em" }}
                  >
                    {cert.issuer} · {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
