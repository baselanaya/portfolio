import { getAllPosts } from "@/lib/blog";
import { projects } from "@/lib/projects";
import CommandPalette from "@/components/command-palette";

// Server component — fetches data, hands off to client palette
export default function CommandPaletteProvider() {
  const posts = getAllPosts().map(({ slug, title, tags }) => ({ slug, title, tags }));
  const projectData = projects.map(({ slug, name, tagline }) => ({ slug, name, tagline }));

  return <CommandPalette blogPosts={posts} projects={projectData} />;
}
