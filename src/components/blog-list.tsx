"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import type { BlogPost } from "@/lib/blog";
import TagChip from "@/components/tag-chip";

interface BlogListProps {
  posts: BlogPost[];
  allTags: string[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogList({ posts, allTags }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const shouldReduce = useReducedMotion();
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

  // j/k keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't hijack when typing in an input
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "j") {
        e.preventDefault();
        setCursor((c) => (c === null ? 0 : Math.min(c + 1, filtered.length - 1)));
      } else if (e.key === "k") {
        e.preventDefault();
        setCursor((c) => (c === null ? filtered.length - 1 : Math.max(c - 1, 0)));
      } else if (e.key === "Enter" && cursor !== null) {
        router.push(`/blog/${filtered[cursor].slug}`);
      } else if (e.key === "Escape") {
        setCursor(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, cursor, router]);

  // Scroll focused item into view
  useEffect(() => {
    if (cursor === null || !listRef.current) return;
    const item = listRef.current.querySelectorAll("[data-blog-item]")[cursor];
    item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [cursor]);

  // Reset cursor when filter changes
  useEffect(() => {
    setCursor(null);
  }, [activeTag]);

  return (
    <div>
      {/* Keyboard hint */}
      <p
        className="font-mono mb-6"
        style={{ fontSize: "10px", color: "var(--color-amber-dim)", letterSpacing: "0.12em" }}
        aria-live="polite"
      >
        {cursor !== null
          ? `[${cursor + 1}/${filtered.length}] ↩ open · esc deselect`
          : "j/k to navigate · ↩ to open"}
      </p>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        <TagChip
          tag="all"
          active={activeTag === null}
          onClick={() => setActiveTag(null)}
        />
        {allTags.map((tag) => (
          <TagChip
            key={tag}
            tag={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          />
        ))}
      </div>

      {/* Post list */}
      <div className="flex flex-col" ref={listRef}>
        {filtered.map((post, i) => (
          <motion.div
            key={post.slug}
            data-blog-item
            initial={shouldReduce ? undefined : { opacity: 0, y: 16 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.06 }}
            onMouseEnter={() => setCursor(i)}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-2 py-8 border-b border-border transition-colors duration-150"
              style={
                cursor === i
                  ? { borderColor: "var(--color-amber-dim)", paddingLeft: "0.75rem" }
                  : {}
              }
            >
              {/* Meta */}
              <div className="flex items-center gap-3">
                <span
                  className="font-mono"
                  style={{ fontSize: "11px", color: "var(--color-muted)" }}
                >
                  {formatDate(post.date)}
                </span>
                <span style={{ color: "var(--color-border)" }} aria-hidden="true">
                  /
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: "11px", color: "var(--color-muted)" }}
                >
                  {post.readingTime} min read
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-pixel tracking-tight leading-tight transition-colors duration-150"
                style={{
                  fontSize: "28px",
                  color: "var(--color-text)",
                }}
              >
                <span className="group-hover:text-gradient">{post.title}</span>
              </h2>

              {/* Summary */}
              <p
                className="font-sans"
                style={{ fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.7 }}
              >
                {post.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-1">
                {post.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            </Link>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p
            className="font-mono py-8"
            style={{ fontSize: "13px", color: "var(--color-muted)" }}
          >
            No posts tagged &quot;{activeTag}&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
