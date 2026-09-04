import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Message received",
  description: "Your message is in my inbox — I'll reply within 24 hours.",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <main className="px-[5vw] pt-40 pb-32 min-h-[70vh]">
      <div className="max-w-xl mx-auto text-center">
        <div
          className="font-mono inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8"
          style={{ fontSize: "11px", color: "var(--color-live)", borderColor: "var(--color-live)", letterSpacing: "0.12em" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--color-live)" }}
            aria-hidden="true"
          />
          MESSAGE DELIVERED
        </div>
        <h1
          className="font-display font-semibold tracking-tight mb-5"
          style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
        >
          Got it.
        </h1>
        <p className="mb-10" style={{ fontSize: "17px", lineHeight: 1.7, color: "var(--color-muted)" }}>
          Your message is in my inbox. I read everything myself and reply
          within 24 hours — usually sooner.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/work" className="btn-solid">
            browse the work <span aria-hidden="true">→</span>
          </Link>
          <Link href="/" className="btn-ghost">
            back home
          </Link>
        </div>
      </div>
    </main>
  );
}
