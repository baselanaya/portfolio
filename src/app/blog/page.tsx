import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import BlogList from "@/components/blog-list";
import { getAllPosts, getAllTags } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Basel Anaya",
  description: "Writing on AI infrastructure, LLM inference, systems programming, and more.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return (
    <main className="px-[5vw] pt-28 pb-24">
      <SectionHeading
        as="h1"
        index="01"
        title="WRITING"
        subtitle="Notes on AI infrastructure, systems, and inference"
      />
      <BlogList posts={posts} allTags={allTags} />
    </main>
  );
}
