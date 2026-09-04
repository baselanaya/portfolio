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
  inProgress?: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export const experience: Role[] = [
  {
    company: "Barzan Technology Solutions",
    title: "Generative AI Engineer",
    type: "full-time",
    start: "Jul 2026",
    end: "Present",
    location: "Amman, Jordan",
    description: [
      "Leading the rebuild of CoreReports (CoreReportsV2), an AI-powered insurance reporting and Text-to-SQL platform for Doha Insurance Group",
      "Architected the model stack around Qwen3.8 (27B via NVIDIA NIM in production, 12B via Ollama for prototyping) with Qwen3Guard-4B for input screening",
      "Validated generation against nine governed Oracle views on the live production schema",
      "Stood up a dedicated orchestration cluster (LangGraph, Supabase/pgvector, Redis, LangFuse, FastAPI) across a shared compute pool for production and evaluation pipelines",
    ],
    tags: ["Text-to-SQL", "NVIDIA NIM", "LangGraph", "RAG", "Oracle"],
  },
  {
    company: "Alef Education",
    title: "AI R&D Apprentice",
    type: "internship",
    start: "Apr 2026",
    end: "Jul 2026",
    location: "Abu Dhabi, UAE · Remote",
    description: [
      "Worked with AI scientists on EdTech solutions, including an MVP autograding system spanning multiple grades and subjects",
      "Benchmarked Mistral Document AI against Gemini for Arabic-language exam PDF extraction and handwritten-text recognition across student age groups",
      "Recommended Gemini as the primary pipeline with Mistral as a cost-efficient complement",
    ],
    tags: ["Document AI", "Arabic NLP", "OCR", "Gemini", "Mistral"],
  },
  {
    company: "Deriv",
    title: "AI Engineer",
    type: "full-time",
    start: "May 2025",
    end: "Aug 2025",
    location: "Amman, Jordan",
    description: [
      "Designed and optimised agentic AI workflows to streamline and accelerate automated task processing using Python and PyTorch",
      "Collaborated with international engineering teams to integrate state-of-the-art AI functionalities into Deriv's product environments",
    ],
    tags: ["Agentic Pipelines", "Python", "PyTorch"],
  },
  {
    company: "Barzan Technology Solutions (Doha Insurance Group)",
    title: "AI Engineer",
    type: "full-time",
    start: "Nov 2024",
    end: "May 2025",
    location: "Amman, Jordan",
    description: [
      "Founding member of Barzan's AI & Data Analytics department; helped build it from the ground up",
      "Built a Text-to-SQL engine translating natural language into optimised SQL for business analytics automation",
      "Engineered an automated document classification pipeline using NLP and deep learning, increasing throughput by 300% and reducing manual intervention by 85% on high-volume insurance data",
      "Implemented an unsupervised anomaly detection framework achieving 92% fraud detection accuracy across 2M insurance transactions, reducing investigative workload by 65%",
    ],
    tags: ["Text-to-SQL", "NLP", "Anomaly Detection", "Insurance"],
  },
  {
    company: "University of Jordan",
    title: "Research Assistant",
    type: "internship",
    start: "Nov 2023",
    end: "Sep 2024",
    location: "Amman, Jordan",
    description: [
      "Researched applications of machine learning in the medical field under Dr. Mousa Al-Akhras; prepared documentation, conducted literature reviews, and presented findings using Matplotlib and Pandas",
      "Analysed over 50,000 records of experimental data using SQL and advanced Excel formulas, improving data retrieval efficiency by 20% for faculty-led research initiatives",
      "Streamlined data collection workflows by automating data entry with Python scripts, increasing processing throughput by 35% across three research projects",
    ],
    tags: ["Research", "Medical AI", "SQL", "Python"],
  },
  {
    company: "Mashro'ona IT & Consulting",
    title: "Machine Learning Engineer Intern",
    type: "internship",
    start: "Mar 2024",
    end: "Jul 2024",
    location: "Amman, Jordan",
    description: [
      "Engineered end-to-end machine learning pipelines integrating data preprocessing, model training, and automated evaluation for client-facing applications",
      "Collaborated with a team of 5 engineers to maintain continuous model performance monitoring, minimising analytics downtime to under 1% across web and mobile platforms",
    ],
    tags: ["ML Pipelines", "Monitoring", "Deployment"],
  },
];

export const education: Education[] = [
  {
    degree: "Game Development & Design",
    institution: "SAE Institute Amman, at Luminus Technical University College (LTUC)",
    period: "2026",
    location: "Amman, Jordan",
    inProgress: true,
  },
  {
    degree: "BSc in Artificial Intelligence",
    institution: "University of Jordan",
    period: "Oct 2020 – Jun 2024",
    location: "Amman, Jordan",
  },
];

export const certifications: Certification[] = [
  { name: "Introduction to Game Development with Unreal Engine 5", issuer: "SAE Institute", year: "2026" },
  { name: "IELTS", issuer: "British Council", year: "2025" },
  { name: "Machine Learning Engineering in Production", issuer: "Coursera", year: "2024" },
  { name: "AI for Medicine Specialization", issuer: "Coursera", year: "2023" },
  { name: "TensorFlow: Advanced Techniques Specialization", issuer: "DeepLearning.AI", year: "2022" },
  { name: "Deep Learning Specialization", issuer: "DeepLearning.AI", year: "2022" },
  { name: "Data Scientist with Python", issuer: "DataCamp", year: "2022" },
  { name: "Graphic Design Specialization", issuer: "California Institute of the Arts", year: "2022" },
];
