import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { projects } from "@/lib/projects";
import { experience } from "@/lib/experience";
import { journeys } from "@/lib/journeys";

const BASE_URL = "https://baselanaya.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  // The listing pages change when their content changes, not every day —
  // derive real last-modified dates instead of stamping "now" on everything.
  const latestPost = posts[0]?.date ? new Date(posts[0].date) : new Date();
  const latestRole = experience[0]?.start ? new Date(experience[0].start) : new Date();

  const journeyEntries: MetadataRoute.Sitemap = journeys.flatMap((journey) =>
    journey.days
      .filter((d) => d.status === "published")
      .map((d) => ({
        url: `${BASE_URL}/lab/${journey.slug}/${d.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
  );

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const workEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/work/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...workEntries,
    {
      url: `${BASE_URL}/experience`,
      lastModified: latestRole,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/lab`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...journeyEntries,
    {
      url: `${BASE_URL}/now`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...blogEntries,
  ];
}
