import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import ContactForm from "@/components/contact-form";
import { faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Basel Anaya — reply within 24 hours. Freelance, contract, and full-time AI engineering work.",
  alternates: { canonical: "/contact" },
};

const FAQS = [
  {
    q: "How fast do you reply?",
    a: "Within 24 hours, usually the same day. Every message lands directly in my inbox — no gatekeepers, no ticket queues.",
  },
  {
    q: "What kind of work do you take on?",
    a: "LLM and agentic systems, Text-to-SQL and document AI pipelines, AI infrastructure and security engineering. Recent examples: an insurance reporting platform (CoreReportsV2), a zero-trust agent sandbox (Kernex), and local inference tooling (Mercer).",
  },
  {
    q: "Do you work with cloud LLM APIs or only local models?",
    a: "Both. I'm local-first when privacy or cost demands it — Cynosure runs entirely on one GPU — and equally at home with NVIDIA NIM, Claude, or Gemini when the cloud is the right call. The architecture decides, not the hype.",
  },
  {
    q: "What does an engagement look like?",
    a: "A short scoping call, a written plan with milestones, then weekly shipped increments. Contract and freelance engagements start from two weeks; I'm also open to select full-time conversations.",
  },
  {
    q: "Where are you based, and do you work remotely?",
    a: "Amman, Jordan (UTC+3). I work remotely with international teams — recent collaborations span the UAE, and Deriv's offices across multiple countries.",
  },
];

export default function ContactPage() {
  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="// OPEN CHANNEL"
          title="Contact"
          subline="Building something interesting? I usually reply within a day."
        />

        {/* Response-time promise */}
        <div
          className="glass-soft rounded-2xl px-5 py-4 mb-12 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <span
            className="font-mono inline-flex items-center gap-2"
            style={{ fontSize: "11px", color: "var(--color-live)", letterSpacing: "0.08em" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--color-live)" }}
              aria-hidden="true"
            />
            RESPONSE TIME: WITHIN 24 HOURS
          </span>
          <span className="font-mono" style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.06em" }}>
            messages go straight to my inbox — no forms disappearing into a void
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-4">
          {/* Left — form */}
          <ContactForm />

          {/* Right — links */}
          <div className="flex flex-col gap-6">
            {[
              { label: "EMAIL", href: "mailto:baselanaya@gmail.com", text: "baselanaya@gmail.com", external: false },
              { label: "GITHUB", href: "https://github.com/baselanaya", text: "github.com/baselanaya", external: true },
              { label: "LINKEDIN", href: "https://linkedin.com/in/basel-anaya", text: "linkedin.com/in/basel-anaya", external: true },
            ].map(({ label, href, text, external }) => (
              <div key={label} className="flex flex-col gap-2">
                <span
                  className="font-mono"
                  style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.15em" }}
                >
                  {label}
                </span>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="font-mono text-text hover:text-amber transition-colors duration-150"
                  style={{ fontSize: "14px" }}
                >
                  {text}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-24 max-w-3xl">
          <h2
            className="font-display font-semibold tracking-tight mb-8"
            style={{ fontSize: "clamp(24px, 3vw, 34px)" }}
          >
            Frequently asked
          </h2>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
          />
          <div className="flex flex-col">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5 border-b border-border">
                <summary
                  className="font-display font-medium cursor-pointer list-none flex items-center justify-between gap-4"
                  style={{ fontSize: "16px" }}
                >
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-open:rotate-45 shrink-0"
                    style={{ color: "var(--color-signal)" }}
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3" style={{ fontSize: "14.5px", lineHeight: 1.7, color: "var(--color-muted)" }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
