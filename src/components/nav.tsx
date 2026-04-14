"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SiteStatus {
  status: string;
  label: string;
  available: boolean;
}

const NAV_LINKS = [
  { href: "/projects", label: "projects" },
  { href: "/experience", label: "experience" },
  { href: "/blog", label: "blog" },
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

  return (
    <>
      {/* Desktop / top nav */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "backdrop-blur-sm border-b border-border"
            : "bg-transparent",
        ].join(" ")}
        style={{ backgroundColor: scrolled ? "rgba(10,8,6,0.85)" : "transparent" }}
      >
        <nav aria-label="Main navigation" className="flex items-center justify-between px-[5vw] h-14">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className="font-pixel tracking-tight leading-none"
              style={{ fontSize: "13px", color: "var(--color-text)" }}
            >
              BASEL ANAYA
            </span>
            {/* Amber pulse dot */}
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--color-amber)" }}
              aria-hidden="true"
            />
          </Link>

          {/* Status badge */}
          {siteStatus && (
            <div
              className="hidden md:flex items-center gap-2 border border-border px-3 py-1"
              title={siteStatus.label}
              style={{ fontSize: "10px" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                style={{
                  backgroundColor: siteStatus.available
                    ? "var(--color-amber)"
                    : "var(--color-muted)",
                }}
                aria-hidden="true"
              />
              <span
                className="font-mono truncate max-w-[180px]"
                style={{ color: "var(--color-muted)", letterSpacing: "0.08em" }}
              >
                {siteStatus.label}
              </span>
            </div>
          )}

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {/* ⌘K trigger hint */}
            <button
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
                );
              }}
              className="font-mono border border-border px-2 py-1 transition-colors duration-150 hover:border-amber hover:text-amber"
              style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.1em" }}
              aria-label="Open command palette"
            >
              ⌘K
            </button>
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className="font-mono transition-colors duration-150"
                  style={{
                    fontSize: "12px",
                    color: active ? "var(--color-amber)" : "var(--color-muted)",
                    letterSpacing: "0.05em",
                  }}
                >
                  [ {label} ]
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border flex items-center justify-around h-14"
        style={{ backgroundColor: "rgba(10,8,6,0.95)", backdropFilter: "blur(8px)" }}
      >
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="font-mono transition-colors duration-150 px-2 py-1"
              style={{
                fontSize: "11px",
                color: active ? "var(--color-amber)" : "var(--color-muted)",
                letterSpacing: "0.05em",
              }}
            >
              [ {label} ]
            </Link>
          );
        })}
      </nav>
    </>
  );
}
