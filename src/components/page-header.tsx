export default function PageHeader({
  eyebrow,
  title,
  subline,
}: {
  eyebrow: string;
  title: string;
  subline?: string;
}) {
  return (
    <div className="mb-14">
      <p
        className="font-mono mb-5"
        style={{ fontSize: "11px", color: "var(--color-amber-dim)", letterSpacing: "0.2em" }}
      >
        {eyebrow}
      </p>
      <h1
        className="font-display font-semibold tracking-tight"
        style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
      >
        {title}
      </h1>
      {subline && (
        <p className="mt-5 max-w-xl" style={{ fontSize: "17px", lineHeight: 1.65, color: "var(--color-muted)" }}>
          {subline}
        </p>
      )}
    </div>
  );
}
