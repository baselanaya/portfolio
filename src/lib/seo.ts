import type { Metadata } from "next";

const BASE_URL = "https://baselanaya.com";

/** Absolute canonical URL for a path. */
export function canonical(path = "/"): string {
  return `${BASE_URL}${path === "/" ? "" : path}`;
}

export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: canonical(path) },
    openGraph: {
      title,
      description,
      url: canonical(path),
      siteName: "Basel Anaya — AI Engineer",
      type: "website",
    },
  };
}

/** Person + WebSite structured data (JSON-LD), rendered in the root layout. */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Basel Anaya",
  jobTitle: "AI Engineer",
  description:
    "AI engineer and founder of Maximlabs — kernel-level agent sandboxes, LLM inference systems, and data pipelines.",
  email: "mailto:baselanaya@gmail.com",
  url: BASE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Amman",
    addressCountry: "JO",
  },
  sameAs: [
    "https://github.com/baselanaya",
    "https://www.linkedin.com/in/basel-anaya",
    "https://huggingface.co/baselanaya",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Maximlabs",
  },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Basel Anaya — AI Engineer",
  url: BASE_URL,
  author: { "@type": "Person", name: "Basel Anaya" },
};

/** BreadcrumbList JSON-LD for nested pages. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

/** FAQPage JSON-LD for the contact page. */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
