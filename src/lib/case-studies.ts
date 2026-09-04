import fs from "fs";
import path from "path";

const WORK_DIR = path.join(process.cwd(), "src/content/work");

export function getCaseStudy(slug: string): string | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const filepath = path.join(WORK_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;
  return fs.readFileSync(filepath, "utf8");
}
