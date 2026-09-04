"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Line {
  type: "input" | "output" | "error";
  text: string;
}

const HELP_TEXT = `Available commands:
  ls projects        list all projects
  ls posts           list blog posts
  cat about          show bio
  cat skills         show skills
  cat contact        show contact info
  ./contact.sh       open contact page
  whoami             who is Basel?
  clear              clear terminal
  help               show this message`;

const COMMANDS: Record<string, string | ((args: string) => string)> = {
  help: HELP_TEXT,
  whoami:
    "Basel Anaya, AI Engineer, Founder of Maximlabs.\nBuilding infrastructure for the age of autonomous AI.\nBased in Amman, Jordan.",
  "cat about":
    "AI engineer focused on building, fine-tuning, and deploying LLMs\nfor real-world impact: from kernel-level security hypervisors\nto document AI pipelines. Founder of Maximlabs.\nPassionate about AI in medicine and robotics.",
  "cat skills":
    "Languages  : Rust, Python, TypeScript\nML / AI    : PyTorch, SGLang, Transformers, LLM Fine-tuning\nSystems    : Hypervisors, Kernel-level Security, DuckDB\nWeb        : Next.js, React, Tailwind\nInfra      : Linux, Docker, Hugging Face",
  "cat contact":
    "Email   : baselanaya@gmail.com\nGitHub  : github.com/baselanaya\nHF      : huggingface.co/baselanaya\nLocation: Amman, Jordan",
  "ls projects":
    "drwxr-xr-x  kernex     Zero-trust hypervisor for AI agents (Rust)\ndrwxr-xr-x  mercer     Open-source Text-to-SQL for messy schemas\ndrwxr-xr-x  cynosure   Local autonomous perpetual swap trading\ndrwxr-xr-x  encleare   Mobile-first AI personal finance PWA\n-rw-r--r--  valerie    500M parameter visual speech recognition [archived]",
  "ls posts":
    "building-kernex-zero-trust-for-ai-agents.mdx\nlocal-llm-limits-rtx-4070-8gb.mdx\ntext-to-sql-messy-schemas.mdx",
  "./contact.sh": "__REDIRECT__/contact",
  clear: "__CLEAR__",
};

function resolveCommand(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (trimmed in COMMANDS) {
    const val = COMMANDS[trimmed];
    return typeof val === "function" ? val("") : val;
  }
  // partial ls / cat without args
  if (trimmed === "ls") return "projects  posts  skills  contact";
  if (trimmed === "cat") return "Usage: cat <about|skills|contact>";
  return `Command not found: ${raw.trim()}. Type 'help' for available commands.`;
}

export default function HiddenTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "Basel Terminal v1.0.0. Type 'help' to get started" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Open on ~ key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  // Scroll to bottom on new lines
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function submit() {
    if (!input.trim()) return;
    const cmd = input.trim();
    const result = resolveCommand(cmd);

    setHistory((h) => [cmd, ...h]);
    setHistoryIdx(-1);
    setInput("");

    if (result === "__CLEAR__") {
      setLines([{ type: "output", text: "Terminal cleared." }]);
      return;
    }

    if (result.startsWith("__REDIRECT__")) {
      const path = result.replace("__REDIRECT__", "");
      setLines((l) => [
        ...l,
        { type: "input", text: cmd },
        { type: "output", text: `Redirecting to ${path}…` },
      ]);
      setTimeout(() => { window.location.href = path; }, 600);
      return;
    }

    const isError = result.startsWith("Command not found");
    setLines((l) => [
      ...l,
      { type: "input", text: cmd },
      { type: isError ? "error" : "output", text: result },
    ]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? "" : history[next]);
    } else if (e.key === "Escape") {
      close();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200]"
            style={{ backgroundColor: "rgba(10,8,6,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
          />

          {/* Terminal window — x: "-50%" is carried by motion so animation can't wipe the centering transform */}
          <motion.div
            className="fixed z-[201] bottom-[5vh] left-1/2 w-full max-w-2xl"
            initial={{ opacity: 0, y: 24, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 16, x: "-50%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="border border-border overflow-hidden"
              style={{ backgroundColor: "#060504" }}
            >
              {/* Title bar */}
              <div
                className="flex items-center gap-2 px-4 py-2 border-b border-border"
                style={{ backgroundColor: "#1B1A14" }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--color-terra)" }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--color-amber-dim)" }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "#2A2218" }}
                />
                <span
                  className="font-mono ml-4"
                  style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.1em" }}
                >
                  basel@maximlabs ~ $
                </span>
                <span
                  className="font-mono ml-auto"
                  style={{ fontSize: "10px", color: "var(--color-amber-dim)" }}
                >
                  ~ to close
                </span>
              </div>

              {/* Output */}
              <div
                className="px-4 py-3 overflow-y-auto font-mono"
                style={{ height: "280px", fontSize: "12px", lineHeight: 1.7 }}
              >
                {lines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      color:
                        line.type === "input"
                          ? "var(--color-amber)"
                          : line.type === "error"
                          ? "var(--color-terra)"
                          : "var(--color-muted)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {line.type === "input" ? `$ ${line.text}` : line.text}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input row */}
              <div
                className="flex items-center gap-2 px-4 py-2 border-t border-border"
                style={{ backgroundColor: "#1B1A14" }}
              >
                <span
                  className="font-mono shrink-0"
                  style={{ fontSize: "12px", color: "var(--color-amber)" }}
                >
                  $
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent outline-none font-mono"
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text)",
                    caretColor: "var(--color-amber)",
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="type a command…"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
