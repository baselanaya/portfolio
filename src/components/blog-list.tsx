"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import type { BlogPost } from "@/lib/blog";

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

  const chip = (active: boolean) =>
    `font-mono rounded-full px-3 py-1.5 border transition-colors duration-150 ${
      active
        ? "bg-[var(--color-text)] text-[var(--color-bg)] border-[var(--color-text)]"
        : "border-border text-muted hover:border-[rgba(22,21,15,0.35)]"
    }`;

  return (
    <div>
      {/* Keyboard hint */}
      <p
        className="hidden md:block font-mono mb-6"
        style={{ fontSize: "10px", color: "var(--color-amber-dim)", letterSpacing: "0.12em" }}
        aria-live="polite"
      >
        {cursor !== null
          ? `[${cursor + 1}/${filtered.length}] ↩ open · esc deselect`
          : "j/k to navigate · ↩ to open"}
      </p>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button className={chip(activeTag === null)} onClick={() => setActiveTag(null)}>
          all
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={chip(activeTag === tag)}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag.toLowerCase()}
          </button>
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
            transition={{ duration: 0.4, ease: "easeOut", delay: Math.min(i, 5) * 0.05 }}
            onMouseEnter={() => setCursor(i)}
            onMouseLeave={() => setCursor((c) => (c === i ? null : c))}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-[7rem_1fr_auto] items-baseline gap-6 py-7 border-b border-border"
            >
              <span
                className="font-mono"
                style={{ fontSize: "11px", color: "var(--color-muted)" }}
              >
                {formatDate(post.date)}
              </span>

              <span className="flex flex-col gap-1.5 min-w-0">
                <span
                  className="font-display font-medium tracking-tight transition-colors duration-150 group-hover:text-signal"
                  style={{ fontSize: "20px" }}
                >
                  {post.title}
                </span>
                <span
                  className="truncate"
                  style={{ fontSize: "14px", color: "var(--color-muted)" }}
                >
                  {post.summary}
                </span>
              </span>

              <span
                aria-hidden="true"
                className="justify-self-end transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: cursor === i ? "var(--color-signal)" : "var(--color-muted)" }}
              >
                →
              </span>
            </Link>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="font-mono py-8" style={{ fontSize: "13px", color: "var(--color-muted)" }}>
            No posts tagged &quot;{activeTag}&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
