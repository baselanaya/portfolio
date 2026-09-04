import { ImageResponse } from "next/og";
import { getPostBySlug, getAllPosts } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post — Basel Anaya";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "Basel Anaya";
  const tags = post?.tags ?? [];
  const date = post
    ? new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0806",
          padding: "72px 80px",
          fontFamily: "monospace",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#2B5CFF",
            }}
          />
          <span style={{ color: "#1D3FBF", fontSize: "14px", letterSpacing: "0.2em" }}>
            {"BASEL ANAYA · AI ENGINEER"}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 50 ? "48px" : "58px",
            color: "#F5F0E8",
            lineHeight: 1.15,
            fontWeight: 700,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            {date && (
              <div
                style={{
                  color: "#57564F",
                  fontSize: "12px",
                  padding: "4px 0",
                  letterSpacing: "0.1em",
                }}
              >
                {date}
              </div>
            )}
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  border: "1px solid #2A2218",
                  color: "#8B7D6B",
                  fontSize: "12px",
                  padding: "4px 12px",
                  letterSpacing: "0.1em",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#2B5CFF",
              letterSpacing: "0.1em",
            }}
          >
            baselanaya.com
          </div>
        </div>

        {/* Amber bottom accent line */}
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
