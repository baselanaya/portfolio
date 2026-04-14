interface SectionHeadingProps {
  index: string;
  title: string;
  subtitle?: string;
  /** Render the title as h1 (page main heading) or h2 (section heading). Defaults to h2. */
  as?: "h1" | "h2";
}

export default function SectionHeading({ index, title, subtitle, as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <div className="relative mb-16">
      {/* Ghost digit behind — GeistPixelGrid */}
      <span
        aria-hidden="true"
        className="font-pixel-grid absolute -top-8 -left-4 leading-none select-none pointer-events-none"
        style={{
          fontSize: "160px",
          opacity: 0.04,
          color: "var(--color-text)",
          zIndex: 0,
        }}
      >
        {index}
      </span>

      {/* Content stack */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Counter label */}
        <p
          className="font-mono mb-2"
          style={{
            fontSize: "12px",
            color: "var(--color-amber-dim)",
            letterSpacing: "0.2em",
          }}
        >
          // {index}
        </p>

        {/* Main title */}
        <Tag
          className="font-pixel tracking-tight leading-none uppercase"
          style={{ fontSize: "clamp(28px, 5vw, 56px)", color: "var(--color-text)" }}
        >
          {title}
        </Tag>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="font-sans mt-3"
            style={{ fontSize: "16px", color: "var(--color-muted)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
