"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SiteStatus {
  status: string;
  label: string;
  available: boolean;
}

// The work index lives at /work; /projects redirects there (next.config)
const NAV_LINKS = [
  { href: "/work", label: "work" },
  { href: "/experience", label: "experience" },
  { href: "/blog", label: "blog" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [siteStatus, setSiteStatus] = useState<SiteStatus | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/status.json")
      .then((r) => r.json())
      .then(setSiteStatus)
      .catch(() => null);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Floating pill nav */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl">
        <nav
          aria-label="Main navigation"
          className={[
            "flex items-center justify-between gap-4 h-12 pl-5 pr-2 rounded-full border transition-shadow duration-300",
            scrolled
              ? "shadow-[0_10px_34px_-14px_rgba(43,92,255,0.45)]"
              : "shadow-[0_6px_24px_-16px_rgba(43,92,255,0.35)]",
          ].join(" ")}
          style={{
            backgroundColor: "rgba(255,255,255,0.62)",
            backdropFilter: "blur(24px) saturate(1.5)",
            WebkitBackdropFilter: "blur(24px) saturate(1.5)",
            borderColor: scrolled ? "rgba(43,92,255,0.55)" : "rgba(43,92,255,0.35)",
            boxShadow: scrolled
              ? "0 10px 34px -14px rgba(43,92,255,0.4), inset 0 1px 0 rgba(255,255,255,0.9)"
              : "0 6px 24px -16px rgba(43,92,255,0.35), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span
              className="font-mono font-semibold"
              style={{ fontSize: "13px", letterSpacing: "0.08em", color: "var(--color-text)" }}
            >
              BASEL ANAYA
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--color-signal)" }}
              aria-hidden="true"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="font-mono px-3 py-1.5 rounded-full transition-colors duration-150 hover:bg-surface-2"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    color: active ? "var(--color-signal)" : "var(--color-muted)",
                    backgroundColor: active ? "rgba(43,92,255,0.08)" : undefined,
                  }}
                >
                  {label}
                </Link>
              );
            })}
            {/* ⌘K trigger */}
            <button
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
                );
              }}
              className="font-mono ml-1 border px-2.5 py-1 rounded-full transition-colors duration-150 hover:border-signal hover:text-signal"
              style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.1em" }}
              aria-label="Open command palette"
            >
              ⌘K
            </button>
          </div>

          {/* Mobile ⌘K (bottom nav carries links) */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
              );
            }}
            className="md:hidden font-mono border border-border px-2.5 py-1 rounded-full"
            style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.1em" }}
            aria-label="Open command palette"
          >
            ⌘K
          </button>
        </nav>
      </header>

      {/* Mobile bottom nav — floating pill island */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 h-12 rounded-full border border-border"
        style={{
          backgroundColor: "rgba(255,255,255,0.68)",
          backdropFilter: "blur(24px) saturate(1.5)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          borderColor: "rgba(43,92,255,0.4)",
          boxShadow: "0 10px 30px -12px rgba(43,92,255,0.4), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {NAV_LINKS.map(({ href, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="font-mono px-3 py-1.5 rounded-full transition-colors duration-150"
              style={{
                fontSize: "12px",
                letterSpacing: "0.04em",
                color: active ? "var(--color-signal)" : "var(--color-muted)",
                backgroundColor: active ? "rgba(43,92,255,0.09)" : undefined,
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
