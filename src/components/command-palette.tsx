"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: string;
  action: () => void;
}

interface CommandPaletteProps {
  blogPosts: { slug: string; title: string; tags: string[] }[];
  projects: { slug: string; name: string; tagline: string }[];
}

export default function CommandPalette({ blogPosts, projects }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  // Build command list
  const baseCommands: Command[] = [
    {
      id: "home",
      label: "Go home",
      hint: "/",
      group: "Navigate",
      action: () => { router.push("/"); close(); },
    },
    {
      id: "projects",
      label: "View projects",
      hint: "/projects",
      group: "Navigate",
      action: () => { router.push("/projects"); close(); },
    },
    {
      id: "blog",
      label: "Read blog",
      hint: "/blog",
      group: "Navigate",
      action: () => { router.push("/blog"); close(); },
    },
    {
      id: "experience",
      label: "See experience",
      hint: "/experience",
      group: "Navigate",
      action: () => { router.push("/experience"); close(); },
    },
    {
      id: "contact",
      label: "Get in touch",
      hint: "/contact",
      group: "Navigate",
      action: () => { router.push("/contact"); close(); },
    },
    {
      id: "copy-email",
      label: "Copy email address",
      hint: "hello@baselanaya.com",
      group: "Actions",
      action: () => {
        navigator.clipboard.writeText("hello@baselanaya.com").catch(() => null);
        close();
      },
    },
    {
      id: "github",
      label: "Open GitHub",
      hint: "github.com/baselanaya",
      group: "Actions",
      action: () => { window.open("https://github.com/baselanaya", "_blank"); close(); },
    },
    ...blogPosts.map((p) => ({
      id: `blog-${p.slug}`,
      label: p.title,
      hint: p.tags.slice(0, 2).join(" · "),
      group: "Posts",
      action: () => { router.push(`/blog/${p.slug}`); close(); },
    })),
    ...projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.name,
      hint: p.tagline,
      group: "Projects",
      action: () => { router.push(`/projects`); close(); },
    })),
  ];

  const filtered = query.trim()
    ? baseCommands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.hint?.toLowerCase().includes(query.toLowerCase()) ||
          c.group.toLowerCase().includes(query.toLowerCase())
      )
    : baseCommands;

  // Group by group label
  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    acc[cmd.group] = acc[cmd.group] ?? [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  const flat = Object.values(grouped).flat();

  // Open on ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Arrow navigation + enter
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, flat.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        flat[selected]?.action();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, selected]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelectorAll("[data-cmd-item]")[selected];
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  return (
    <>
      {/* Trigger hint visible in nav area — hidden, opened via keyboard */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[200]"
              style={{ backgroundColor: "rgba(10,8,6,0.7)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={close}
            />

            {/* Palette */}
            <motion.div
              className="fixed z-[201] left-1/2 top-[15vh] w-full max-w-xl"
              style={{ transform: "translateX(-50%)" }}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div
                className="border border-border overflow-hidden"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 border-b border-border">
                  <span
                    className="font-mono shrink-0"
                    style={{ fontSize: "13px", color: "var(--color-amber)" }}
                  >
                    &gt;
                  </span>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                    placeholder="Search commands, pages, posts…"
                    className="flex-1 bg-transparent outline-none py-4 font-mono"
                    style={{
                      fontSize: "14px",
                      color: "var(--color-text)",
                      caretColor: "var(--color-amber)",
                    }}
                  />
                  <kbd
                    className="font-mono shrink-0 border border-border px-1.5 py-0.5"
                    style={{ fontSize: "10px", color: "var(--color-muted)" }}
                  >
                    esc
                  </kbd>
                </div>

                {/* Results */}
                <div
                  ref={listRef}
                  className="overflow-y-auto"
                  style={{ maxHeight: "380px" }}
                >
                  {flat.length === 0 ? (
                    <p
                      className="font-mono px-4 py-6"
                      style={{ fontSize: "13px", color: "var(--color-muted)" }}
                    >
                      No results for &ldquo;{query}&rdquo;
                    </p>
                  ) : (
                    Object.entries(grouped).map(([group, cmds]) => (
                      <div key={group}>
                        <div
                          className="font-mono px-4 py-2"
                          style={{
                            fontSize: "10px",
                            color: "var(--color-amber-dim)",
                            letterSpacing: "0.15em",
                            backgroundColor: "var(--color-bg)",
                          }}
                        >
                          {group.toUpperCase()}
                        </div>
                        {cmds.map((cmd) => {
                          const idx = flat.indexOf(cmd);
                          const active = idx === selected;
                          return (
                            <button
                              key={cmd.id}
                              data-cmd-item
                              className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-75"
                              style={{
                                backgroundColor: active ? "var(--color-surface-2)" : "transparent",
                                borderLeft: active
                                  ? "2px solid var(--color-amber)"
                                  : "2px solid transparent",
                              }}
                              onMouseEnter={() => setSelected(idx)}
                              onClick={cmd.action}
                            >
                              <span
                                className="font-mono"
                                style={{
                                  fontSize: "13px",
                                  color: active ? "var(--color-text)" : "var(--color-muted)",
                                }}
                              >
                                {cmd.label}
                              </span>
                              {cmd.hint && (
                                <span
                                  className="font-mono ml-4 truncate max-w-[220px]"
                                  style={{ fontSize: "11px", color: "var(--color-amber-dim)" }}
                                >
                                  {cmd.hint}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center gap-4 px-4 py-2 border-t border-border"
                  style={{ backgroundColor: "var(--color-bg)" }}
                >
                  {[
                    ["↑↓", "navigate"],
                    ["↩", "open"],
                    ["esc", "close"],
                  ].map(([key, hint]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <kbd
                        className="font-mono border border-border px-1.5 py-0.5"
                        style={{ fontSize: "10px", color: "var(--color-muted)" }}
                      >
                        {key}
                      </kbd>
                      <span
                        className="font-mono"
                        style={{ fontSize: "10px", color: "var(--color-muted)" }}
                      >
                        {hint}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
