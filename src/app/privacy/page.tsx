import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How baselanaya.com handles your data — contact form, analytics, and what never leaves this site.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    h: "The short version",
    p: [
      "This site collects almost nothing. The only data you can give me is what you type into the contact form (name, email, message), and it's used for exactly one thing: replying to you.",
    ],
  },
  {
    h: "Contact form",
    p: [
      "The form is processed by this site's server and delivered through Resend (an email service) straight to my inbox. Your name, email, and message are stored only as long as the email conversation exists. Messages are screened by an automated filter for spam and abuse before delivery.",
      "Submitting the form means you consent to this one-time use of your details. I never add you to a mailing list, never sell or share your data, and will delete anything you ask me to delete.",
    ],
  },
  {
    h: "Analytics",
    p: [
      "If analytics are enabled, they run through Google Analytics 4 with IP anonymization, purely to count page views. No advertising trackers, no cross-site profiling, no fingerprinting scripts.",
    ],
  },
  {
    h: "What never happens",
    p: [
      "No cookies for marketing. No data brokering. No embedded third-party ad scripts. No dark patterns — the only form on this site emails me, that's it.",
    ],
  },
  {
    h: "Questions",
    p: [
      "Privacy questions get the same 24-hour treatment as everything else: email baselanaya@gmail.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="px-[5vw] pt-36 pb-24">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          eyebrow="// DATA, MINIMAL BY DESIGN"
          title="Privacy Policy"
          subline="The plain-language version: this site collects the minimum needed to reply to you, and nothing else."
        />
        <div className="flex flex-col gap-10">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2
                className="font-display font-semibold tracking-tight mb-3"
                style={{ fontSize: "20px" }}
              >
                {s.h}
              </h2>
              {s.p.map((para) => (
                <p
                  key={para.slice(0, 24)}
                  className="mb-2"
                  style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--color-muted)" }}
                >
                  {para}
                </p>
              ))}
            </section>
          ))}
          <p className="font-mono pt-4 border-t border-border" style={{ fontSize: "11px", color: "var(--color-muted)" }}>
            Last updated: September 2026
          </p>
        </div>
        <div className="mt-12">
          <Link href="/contact" className="btn-ghost">
            ← back to contact
          </Link>
        </div>
      </div>
    </main>
  );
}
