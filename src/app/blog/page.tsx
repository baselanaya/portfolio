import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import BlogList from "@/components/blog-list";
import { getAllPosts, getAllTags } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
  description: "Writing on AI infrastructure, LLM inference, systems programming, and more.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          
          title="Writing"
          subline="Field notes on AI infrastructure, LLM inference on real hardware, systems programming, and the schemas nobody warns you about."
        />
        <BlogList posts={posts} allTags={allTags} />
      </div>
    </main>
  );
}
