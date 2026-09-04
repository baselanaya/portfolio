import Link from "next/link";

export default function NotFound() {
  return (
    <main className="theme-dark min-h-screen flex items-center justify-center px-[5vw]">
      <div className="w-full max-w-2xl">
        <div
          className="rounded-2xl border border-[#2A2820] overflow-hidden"
          style={{ backgroundColor: "#060504" }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-b border-[#35322A]"
            style={{ backgroundColor: "#1B1A14" }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#0091D5" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#1D3FBF" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#2A2218" }} />
            <span
              className="font-mono ml-4"
              style={{ fontSize: "11px", color: "var(--color-terminal-muted)", letterSpacing: "0.1em" }}
            >
              basel@maximlabs ~ $
            </span>
          </div>

          {/* Output */}
          <div
            className="font-mono px-5 py-6"
            style={{ fontSize: "13px", lineHeight: 2, color: "var(--color-terminal-muted)" }}
          >
            <p>
              <span style={{ color: "var(--color-signal)" }}>$</span> cd{" "}
              <span style={{ color: "var(--color-terminal-fg)" }}>404</span>
            </p>
            <p style={{ color: "#0091D5" }}>
              command not found: this page does not exist (or was never deployed)
            </p>
            <p className="mt-4">try one of these instead:</p>
            <div className="flex flex-wrap gap-x-6 mt-2">
              {[
                { href: "/", label: "cd ~" },
                { href: "/work", label: "cd work" },
                { href: "/blog", label: "cd blog" },
                { href: "/contact", label: "cd contact" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="transition-colors duration-150 hover:text-[var(--color-signal)]"
                  style={{ color: "var(--color-terminal-fg)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
