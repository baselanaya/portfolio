import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact — Basel Anaya",
  description: "Get in touch with Basel Anaya.",
};

export default function ContactPage() {
  return (
    <main className="px-[5vw] pt-28 pb-24">
      <SectionHeading
        as="h1"
        index="01"
        title="CONTACT"
        subtitle="Building something interesting? Let's talk."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left — form */}
        <ContactForm />

        {/* Right — links */}
        <div className="flex flex-col gap-6">
          {[
            { label: "EMAIL", href: "mailto:baselanaya@gmail.com", text: "baselanaya [at] gmail [dot] com", external: false },
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
    </main>
  );
}
