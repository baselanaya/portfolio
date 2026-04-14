import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Basel Anaya`,
    description: post.summary,
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypePlugins: [[rehypePrettyCode as any, { theme: "github-dark-dimmed" }]],
      },
    },
  });

  return (
    <main className="px-[5vw] pt-28 pb-24">
      {/* Back link */}
      <Link
        href="/blog"
        className="font-mono text-muted hover:text-amber transition-colors duration-150 inline-block mb-12"
        style={{ fontSize: "12px", letterSpacing: "0.1em" }}
      >
        ← back to writing
      </Link>

      <article className="max-w-[680px]">
        {/* Meta */}
        <div
          className="font-mono flex items-center gap-3 mb-6"
          style={{ fontSize: "11px", color: "var(--color-muted)" }}
        >
          <span>{formatDate(post.date)}</span>
          <span style={{ color: "var(--color-border)" }}>/</span>
          <span>{post.readingTime} min read</span>
        </div>

        {/* Title */}
        <h1
          className="font-pixel tracking-tight leading-tight mb-10"
          style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--color-text)" }}
        >
          {post.title}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10 pb-10 border-b border-border">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono border border-border px-2 py-0.5"
              style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.1em" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Body */}
        <div
          className="prose prose-invert max-w-none"
          style={
            {
              "--tw-prose-body": "var(--color-muted)",
              "--tw-prose-headings": "var(--color-text)",
              "--tw-prose-links": "var(--color-amber)",
              "--tw-prose-bold": "var(--color-text)",
              "--tw-prose-code": "var(--color-amber)",
              "--tw-prose-hr": "var(--color-border)",
              "--tw-prose-quotes": "var(--color-muted)",
              "--tw-prose-quote-borders": "var(--color-amber-dim)",
              fontSize: "18px",
              lineHeight: "1.75",
              fontFamily: "var(--font-sans)",
            } as React.CSSProperties
          }
        >
          {content}
        </div>
      </article>
    </main>
  );
}
