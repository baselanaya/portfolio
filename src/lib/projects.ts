export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  status: "active" | "archived" | "stealth";
  github?: string;
  demo?: string;
  featured: boolean;
  year: number;
}

export const projects: Project[] = [
  {
    slug: "kernex",
    name: "Kernex",
    tagline: "Zero-trust kernel-level execution hypervisor for AI agents",
    description:
      "Rust-based hypervisor providing isolated, auditable execution environments for autonomous AI agents. Features a 5-command CLI surface, zero-trust security model, and kernel-level sandboxing. Built under the Maximlabs brand.",
    tags: ["Rust", "Security", "AI Agents", "Systems"],
    status: "active",
    github: "https://github.com/baselanaya/kernex",
    featured: true,
    year: 2026,
  },
  {
    slug: "mercer",
    name: "Mercer",
    tagline: "Open-source Text-to-SQL for messy real-world schemas",
    description:
      "Production-grade Text-to-SQL system for schemas that don't look like textbook examples. Powered by SGLang + Qwen2.5-Coder-7B-Instruct FP8.",
    tags: ["Python", "LLM", "SQL", "SGLang"],
    status: "active",
    github: "https://github.com/baselanaya/mercer",
    featured: true,
    year: 2026,
  },
  {
    slug: "cynosure",
    name: "Cynosure",
    tagline: "Fully local autonomous perpetual swap trading system",
    description:
      "Autonomous trading system for OKX perpetual swaps. Runs entirely locally using Qwen3.5-4B via SGLang, Chronos-2 120M for forecasting, DuckDB for storage, and a Textual TUI.",
    tags: ["Python", "Trading", "LLM", "DuckDB"],
    status: "active",
    featured: true,
    year: 2026,
  },
];
