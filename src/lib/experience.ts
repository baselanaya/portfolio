export interface Role {
  company: string;
  title: string;
  type: "full-time" | "internship" | "freelance" | "founder";
  start: string;
  end: string;
  location: string;
  description: string[];
  tags: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
}

export const experience: Role[] = [
  {
    company: "Alef Education",
    title: "AI R&D Intern",
    type: "internship",
    start: "Apr 2026",
    end: "Present",
    location: "Abu Dhabi, UAE",
    description: [
      "Technical evaluation of document AI pipelines for Arabic-language exam PDF extraction",
      "Benchmarked Mistral Document AI vs Gemini 2.5 Flash Preview for structured data extraction",
      "Presented findings: Gemini as primary pipeline, Mistral as cost-efficient complement",
    ],
    tags: ["Gemini", "Mistral", "Arabic NLP", "Document AI"],
  },
  {
    company: "Maximlabs",
    title: "Founder & AI Engineer",
    type: "founder",
    start: "Feb 2026",
    end: "Present",
    location: "Amman, Jordan",
    description: [
      "Building AI infrastructure security tooling for autonomous agent workloads",
      "Developed Kernex: zero-trust kernel-level execution hypervisor in Rust",
      "Established open-source presence, brand system, and content strategy",
    ],
    tags: ["Rust", "AI Agents", "Security", "Systems"],
  },
  {
    company: "Deriv",
    title: "AI Engineer",
    type: "full-time",
    start: "May 2025",
    end: "Aug 2025",
    location: "Amman, Jordan",
    description: [
      "Worked on agentic AI systems to simplify and accelerate manual operations",
      "Collaborated with engineering teams across multiple global offices to integrate the latest AI solutions into Deriv's products",
    ],
    tags: ["AI Agents", "LLM", "Automation"],
  },
  {
    company: "Barzan T.S DIG",
    title: "AI Engineer",
    type: "full-time",
    start: "Nov 2024",
    end: "May 2025",
    location: "Amman, Jordan",
    description: [
      "Worked as part of the founding team of the AI department, building bleeding-edge AI-powered systems",
      "Led the department through the development, evaluation, and deployment of GenAI applications",
    ],
    tags: ["GenAI", "LLM", "AI Systems", "Leadership"],
  },
  {
    company: "Mashro'ona Company IT & Consulting",
    title: "Machine Learning Engineer Intern",
    type: "internship",
    start: "Mar 2024",
    end: "Jul 2024",
    location: "Amman, Jordan",
    description: [
      "Designed, developed, and deployed AI-powered systems delivering customized technology solutions to clients",
    ],
    tags: ["Python", "ML", "Deployment"],
  },
  {
    company: "University of Jordan",
    title: "Research Assistant",
    type: "internship",
    start: "Nov 2023",
    end: "Sep 2024",
    location: "Amman, Jordan",
    description: [
      "Conducted research into applications of machine learning techniques in the medical field under supervision of Dr. Mousa Al-Akhras",
      "Collaborated with fellow students and recent graduates on experimental ML pipelines",
    ],
    tags: ["Research", "ML", "Medical AI", "PyTorch"],
  },
];

export const education: Education = {
  degree: "BSc in Artificial Intelligence",
  institution: "University of Jordan",
  period: "Oct 2020 – Jun 2024",
  location: "Amman, Jordan",
};
