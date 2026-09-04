import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";

// Visual breadcrumbs + BreadcrumbList JSON-LD for nested pages.
export default function Breadcrumbs({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono mb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(trail)) }}
      />
      <ol className="flex flex-wrap items-center gap-2" style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.1em" }}>
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" style={{ color: "var(--color-text)" }}>
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-signal transition-colors duration-150">
                  {item.name}
                </Link>
              )}
              {!last && <span aria-hidden="true" style={{ color: "var(--color-border)" }}>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
