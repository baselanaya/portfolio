import { ImageResponse } from "next/og";
import { projects } from "@/lib/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project case study — Basel Anaya";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
  const eyebrow = `// MAXIMLABS · CASE STUDY · ${project.year} · ${project.status.toUpperCase()}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#0A0806",
          padding: "80px",
          fontFamily: "monospace",
          gap: "24px",
        }}
      >
        <div style={{ color: "#2B5CFF", fontSize: "14px", letterSpacing: "0.2em" }}>
          {eyebrow}
        </div>

        <div
          style={{
            fontSize: project.name.length > 7 ? 72 : 88,
            color: "#F5F0E8",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-2px",
          }}
        >
          {project.name}
        </div>

        <div style={{ fontSize: "24px", color: "#8B7D6B", maxWidth: "820px", lineHeight: 1.5, textAlign: "left" }}>
          {project.tagline}
        </div>

        <div style={{ display: "flex", gap: "18px", fontSize: "15px", color: "#57564F" }}>
          {project.tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "6px 16px",
                borderRadius: 999,
                border: "1px solid #35322A",
                color: "#A39B8B",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #2B5CFF 0%, #0091D5 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
