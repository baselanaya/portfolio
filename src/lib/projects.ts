export interface ProjectMetric {
  label: string;
  value: string;
}

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
  /** Procedural ASCII cover pattern rendered by <AsciiCover /> */
  cover: "rings" | "tables" | "candles" | "spark" | "wave";
  role: string;
  metrics: ProjectMetric[];
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
    cover: "rings",
    role: "Creator & maintainer, Maximlabs",
    metrics: [
      { label: "language", value: "Rust" },
      { label: "surface", value: "5-command CLI" },
      { label: "model", value: "zero-trust" },
    ],
  },
  {
    slug: "mercer",
    name: "Mercer",
    tagline: "Open-source Text-to-SQL for messy real-world schemas",
    description:
      "Text-to-SQL for messy production schemas. A six-stage agentic pipeline (entity retrieval, schema linking, decomposition, candidate generation, execution+selection, taxonomy correction) with local GPU inference. No vector DB required.",
    tags: ["Python", "LLM", "SQL", "llama.cpp"],
    status: "active",
    github: "https://github.com/baselanaya/mercer",
    featured: true,
    year: 2026,
    cover: "tables",
    role: "Creator & maintainer",
    metrics: [
      { label: "pipeline", value: "6 stages" },
      { label: "model", value: "Arctic-Text2SQL-R1-7B" },
      { label: "quant", value: "IQ4_XS · ~5.4GB" },
    ],
  },
  {
    slug: "cirax",
    name: "Cirax",
    tagline: "The universal offline file converter. Don't upload, convert",
    description:
      "Privacy-first conversion hub that routes between the best engines ever written: FFmpeg, libvips, LibreOffice, Pandoc, Calibre, 7-Zip and more. A Dijkstra search over a 109-format graph finds multi-hop engine chains ranked by fidelity, every job sandboxed in a bubblewrap jail, and local AI OCR via a ~1.3B-param model through Ollama.",
    tags: ["Python", "CLI", "Privacy", "FFmpeg"],
    status: "active",
    github: "https://github.com/baselanaya/Cirax",
    featured: true,
    year: 2026,
    cover: "spark",
    role: "Creator & maintainer, Maximlabs",
    metrics: [
      { label: "formats", value: "109" },
      { label: "engines", value: "58 via YAML" },
      { label: "sandbox", value: "bwrap jail" },
    ],
  },
  {
    slug: "cynosure",
    name: "Cynosure",
    tagline: "Fully local autonomous perpetual swap trading system",
    description:
      "Autonomous 24/7 trading system for OKX perpetual swaps: crypto majors, gold, and equity index perps. An expert pipeline computes a compact MarketBrief (technicals, TimesFM 2.5 forecasts, orderbook depth, regime); a local LLM synthesizes the thesis; every risk check stays deterministic in Python.",
    tags: ["Python", "Trading", "LLM", "Ollama"],
    status: "active",
    github: undefined,
    featured: false,
    year: 2026,
    cover: "candles",
    role: "Creator, Maximlabs",
    metrics: [
      { label: "synthesis", value: "qwen3.5:4b · ollama" },
      { label: "forecasting", value: "TimesFM 2.5 200M" },
      { label: "risk", value: "deterministic gates" },
    ],
  },
  {
    slug: "medformer",
    name: "MedFormer",
    tagline: "Biomedical vision-language model with RAG for diagnostic challenges",
    description:
      "A biomedical VLM integrated with a retrieval-augmented generation system for complex diagnostic questions. Built on Idefics2 with LLaMA-3.1 and MedLLaMA-3.1, achieving 64.4% average accuracy across medical benchmarks.",
    tags: ["PyTorch", "RAG", "LLM", "Medical AI"],
    status: "archived",
    github: "https://github.com/Basel-anaya/MedFormer",
    featured: true,
    year: 2024,
    cover: "wave",
    role: "Creator & researcher",
    metrics: [
      { label: "benchmark", value: "64.4% avg" },
      { label: "vision", value: "Idefics2" },
      { label: "language", value: "LLaMA-3.1 + MedLLaMA" },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
