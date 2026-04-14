export default function Footer() {
  return (
    <footer
      className="border-t border-border mt-auto px-[5vw] py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <span className="font-mono text-muted" style={{ fontSize: "12px" }}>
        © {new Date().getFullYear()} Basel Anaya — Maximlabs
      </span>
      <div className="flex gap-6">
        <a
          href="https://github.com/baselanaya"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-muted hover:text-amber transition-colors duration-150"
          style={{ fontSize: "12px" }}
        >
          github
        </a>
        <a
          href="https://linkedin.com/in/basel-anaya"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-muted hover:text-amber transition-colors duration-150"
          style={{ fontSize: "12px" }}
        >
          linkedin
        </a>
        <a
          href="mailto:baselanaya@gmail.com"
          className="font-mono text-muted hover:text-amber transition-colors duration-150"
          style={{ fontSize: "12px" }}
        >
          email
        </a>
      </div>
    </footer>
  );
}
