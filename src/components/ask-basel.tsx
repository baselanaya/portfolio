"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// ──────────────────────────────────────────────────────────────────────────────
// Rotating thinking words
// ──────────────────────────────────────────────────────────────────────────────
const THINKING_WORDS = ["thinking", "researching", "processing", "analyzing", "reasoning"];

function ThinkingIndicator() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Cycle through words every 1.8s with a brief fade
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % THINKING_WORDS.length);
        setVisible(true);
      }, 200);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex justify-start">
      <div
        className="font-mono px-3 py-2"
        style={{ fontSize: "13px", color: "var(--color-muted)", backgroundColor: "var(--color-surface-2)" }}
      >
        <span
          style={{
            display: "inline-block",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.2s ease",
            letterSpacing: "0.03em",
          }}
        >
          {THINKING_WORDS[idx]}
          <span className="animate-pulse" style={{ marginLeft: "2px" }}>…</span>
        </span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// System context seeded with Basel's portfolio content
// ──────────────────────────────────────────────────────────────────────────────
const SYSTEM_CONTEXT = `You are an AI assistant embedded in Basel Anaya's personal portfolio website. Answer questions about Basel concisely and accurately using only the information below. If asked something you don't know, say so briefly. Don't make things up.

ABOUT BASEL:
Basel Anaya is an AI Engineer and Founder based in Amman, Jordan. He builds AI infrastructure and LLM tooling. He founded Maximlabs, focused on AI infrastructure security for autonomous agent workloads. He is currently an AI R&D Intern at Alef Education (Abu Dhabi, UAE) and is open to freelance/contract work.

PROJECTS:
- Kernex: Zero-trust kernel-level execution hypervisor for AI agents, written in Rust. Built under Maximlabs. Active.
- Mercer: Open-source Text-to-SQL system for messy real-world schemas, powered by SGLang + Qwen2.5-Coder-7B-Instruct FP8. Active.
- Cynosure: Fully local autonomous perpetual swap trading system for OKX. Uses Qwen3.5-4B via SGLang, Chronos-2 120M, DuckDB, Textual TUI. Active.
- Encleare: Mobile-first AI personal finance PWA using Plaid, Claude Haiku, Supabase, Stripe. $9.99/month. Active.
- Valerie: 500M parameter visual speech recognition model (VALLR architecture). Archived.

EXPERIENCE:
- Alef Education — AI R&D Intern (Apr 2026–Present, Abu Dhabi): Document AI pipelines for Arabic exam PDFs.
- Maximlabs — Founder & AI Engineer (Feb 2026–Present, Amman): Built Kernex, AI infrastructure security.
- Deriv — AI Engineer (May–Aug 2025, Amman): Agentic AI systems.
- Barzan T.S DIG — AI Engineer (Nov 2024–May 2025, Amman): Founded AI department, led GenAI deployments.
- Mashro'ona Company — ML Engineer Intern (Mar–Jul 2024).
- University of Jordan — Research Assistant, Medical ML (Nov 2023–Sep 2024).

EDUCATION: BSc in Artificial Intelligence, University of Jordan (Oct 2020 – Jun 2024).

SKILLS: Rust, Python, TypeScript, PyTorch, SGLang, LLM inference & fine-tuning, AI Agents, Arabic NLP, Hypervisors, kernel-level security, Next.js, React, DuckDB, SQL.

CONTACT: Email: hello@baselanaya.com · GitHub: github.com/baselanaya · Location: Amman, Jordan`;

// ──────────────────────────────────────────────────────────────────────────────
// Model
// ──────────────────────────────────────────────────────────────────────────────
const MODEL_ID    = "HuggingFaceTB/SmolLM2-135M-Instruct";
const MODEL_DTYPE = "q4f16"; // 4-bit weights, fp16 activations — ~118MB, WebGPU/WebNN/WASM compatible

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
}

type Status = "idle" | "checking" | "loading" | "ready" | "generating" | "error";
type DeviceMode = "webnn-gpu" | "webnn-npu" | "webnn" | "webgpu" | "wasm" | null;

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────
export default function AskBasel() {
  const [open, setOpen]               = useState(false);
  const [status, setStatus]           = useState<Status>("idle");
  const [deviceMode, setDeviceMode]   = useState<DeviceMode>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadFile, setLoadFile]       = useState("");
  const [messages, setMessages]       = useState<Message[]>([]);
  const [input, setInput]             = useState("");
  const workerRef  = useRef<Worker | null>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when ready
  useEffect(() => {
    if (status === "ready") setTimeout(() => inputRef.current?.focus(), 80);
  }, [status]);

  // Terminate worker on unmount
  useEffect(() => () => { workerRef.current?.terminate(); }, []);

  const loadModel = useCallback(async () => {
    if (workerRef.current) return; // already loading / loaded
    setStatus("checking");

    // Priority: WebNN (GPU → NPU → default) → WebGPU → WASM
    type AccelDevice = "webnn-gpu" | "webnn-npu" | "webnn" | "webgpu" | "wasm";
    let device: AccelDevice = "wasm";

    // 1. WebNN — hardware neural-network accelerator
    if (typeof navigator !== "undefined" && "ml" in navigator) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ml = (navigator as any).ml;
        const gpuCtx = await ml.createContext({ deviceType: "gpu" }).catch(() => null);
        if (gpuCtx) {
          device = "webnn-gpu";
        } else {
          const npuCtx = await ml.createContext({ deviceType: "npu" }).catch(() => null);
          if (npuCtx) {
            device = "webnn-npu";
          } else {
            const ctx = await ml.createContext().catch(() => null);
            if (ctx) device = "webnn";
          }
        }
      } catch { /* fall through to WebGPU */ }
    }

    // 2. WebGPU — if WebNN not available
    if (device === "wasm" && typeof navigator !== "undefined" && "gpu" in navigator && navigator.gpu) {
      try {
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
        if (adapter) device = "webgpu";
      } catch { /* fall through to WASM */ }
    }

    // 3. WASM — always available, slowest but universal fallback

    setStatus("loading");
    setLoadProgress(0);

    // Spin up the worker
    const worker = new Worker(
      new URL("../lib/ask-basel-worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data as {
        type: string;
        progress?: number;
        file?: string;
        device?: string;
        text?: string;
        message?: string;
        status?: string;
      };

      if (msg.type === "progress") {
        // progress is already 0–100
        if (typeof msg.progress === "number") setLoadProgress(Math.round(msg.progress));
        if (msg.file) setLoadFile(msg.file.split("/").pop() ?? "");
      }

      if (msg.type === "ready") {
        setDeviceMode((msg.device as DeviceMode) ?? null);
        setStatus("ready");
        setLoadFile("");
      }

      if (msg.type === "result") {
        const text = msg.text ?? "…";
        setMessages((m) => [...m, { role: "assistant", content: text }]);
        setStatus("ready");
      }

      if (msg.type === "error") {
        console.error("[AskBasel worker]", msg.message);
        setStatus("error");
      }
    };

    worker.onerror = (err) => {
      console.error("[AskBasel worker error]", err);
      setStatus("error");
    };

    // Tell the worker to load
    worker.postMessage({ type: "load", payload: { modelId: MODEL_ID, device, dtype: MODEL_DTYPE } });
  }, []);

  // Auto-load when chat first opens
  useEffect(() => {
    if (open && status === "idle") loadModel();
  }, [open, status, loadModel]);

  function send() {
    const text = input.trim();
    if (!text || status !== "ready" || !workerRef.current) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setStatus("generating");

    const chatMessages = [
      { role: "system", content: SYSTEM_CONTEXT },
      ...messages,
      userMsg,
    ];

    workerRef.current.postMessage({ type: "generate", payload: { messages: chatMessages } });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* FAB */}
      <motion.button
        className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-[150] border border-amber w-12 h-12 flex items-center justify-center font-mono"
        style={{
          backgroundColor: open ? "var(--color-amber)" : "var(--color-surface)",
          color: open ? "var(--color-bg)" : "var(--color-amber)",
          fontSize: "18px",
        }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Ask Basel" : "Ask Basel — SmolLM2-135M in-browser"}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? "×" : "✦"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-36 right-5 md:bottom-24 md:right-6 z-[149] w-[min(92vw,380px)] border border-border flex flex-col overflow-hidden"
            style={{ backgroundColor: "var(--color-surface)", maxHeight: "520px" }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0"
              style={{ backgroundColor: "var(--color-bg)" }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    status === "ready" || status === "generating"
                      ? "var(--color-amber)"
                      : "var(--color-amber-dim)",
                  animation: status === "loading" || status === "generating" ? "pulse 1s infinite" : "none",
                }}
              />
              <div className="flex flex-col min-w-0">
                <span
                  className="font-mono"
                  style={{ fontSize: "12px", color: "var(--color-text)", letterSpacing: "0.05em" }}
                >
                  Ask Basel
                </span>
                <span
                  className="font-mono truncate"
                  style={{ fontSize: "9px", color: "var(--color-amber-dim)", letterSpacing: "0.1em" }}
                >
                  {deviceMode === "webnn-gpu"
                    ? "SmolLM2-135M · WebNN GPU · local"
                    : deviceMode === "webnn-npu"
                    ? "SmolLM2-135M · WebNN NPU · local"
                    : deviceMode === "webnn"
                    ? "SmolLM2-135M · WebNN · local"
                    : deviceMode === "webgpu"
                    ? "SmolLM2-135M · WebGPU · local"
                    : deviceMode === "wasm"
                    ? "SmolLM2-135M · WASM · local"
                    : "SmolLM2-135M · runs in-browser"}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">

              {/* Loading state */}
              {status === "checking" && <StatusNote text="Checking GPU…" />}

              {status === "loading" && (
                <div className="flex flex-col gap-2">
                  <p
                    className="font-mono animate-pulse"
                    style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.08em", textAlign: "center" }}
                  >
                    {loadProgress > 0 ? `Loading… ${loadProgress}%` : "Initialising model…"}
                  </p>
                  {loadProgress > 0 && (
                    <div className="h-0.5 w-full" style={{ backgroundColor: "var(--color-border)" }}>
                      <div
                        className="h-full"
                        style={{
                          width: `${loadProgress}%`,
                          background: "var(--gradient-brand)",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  )}
                  {loadFile && (
                    <p
                      className="font-mono truncate"
                      style={{ fontSize: "9px", color: "var(--color-muted)", textAlign: "center" }}
                    >
                      {loadFile}
                    </p>
                  )}
                  <p
                    className="font-mono"
                    style={{ fontSize: "10px", color: "var(--color-muted)", textAlign: "center", lineHeight: 1.6 }}
                  >
                    First load downloads ~400MB and caches in the browser.
                  </p>
                </div>
              )}

              {status === "error" && (
                <ErrorNote text="Failed to load model. Check the console for details." />
              )}

              {/* Welcome */}
              {(status === "ready" || status === "generating") && messages.length === 0 && (
                <div
                  className="font-mono text-center py-4"
                  style={{ fontSize: "12px", color: "var(--color-muted)", lineHeight: 1.7 }}
                >
                  <p>Hey! I know everything about Basel.</p>
                  <p className="mt-1" style={{ color: "var(--color-amber-dim)" }}>
                    Try: &ldquo;What is Kernex?&rdquo;
                  </p>
                </div>
              )}

              {/* Messages */}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="font-sans max-w-[85%] px-3 py-2"
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.6,
                      borderRadius: "2px",
                      backgroundColor: msg.role === "user" ? "var(--color-amber-dim)" : "var(--color-surface-2)",
                      color: msg.role === "user" ? "var(--color-text)" : "var(--color-muted)",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {status === "generating" && <ThinkingIndicator />}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-3 py-2 border-t border-border shrink-0"
              style={{ backgroundColor: "var(--color-bg)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                placeholder={
                  status === "ready"       ? "Ask anything about Basel…"
                  : status === "loading"   ? "Loading model…"
                  : status === "checking"  ? "Checking hardware…"
                  : "Not available"
                }
                disabled={status !== "ready"}
                className="flex-1 bg-transparent outline-none font-mono"
                style={{
                  fontSize: "12px",
                  color: "var(--color-text)",
                  caretColor: "var(--color-amber)",
                }}
                autoComplete="off"
              />
              <button
                onClick={send}
                disabled={status !== "ready" || !input.trim()}
                className="font-mono shrink-0 px-2 py-1 border border-border transition-colors duration-150"
                style={{
                  fontSize: "11px",
                  color: status === "ready" && input.trim() ? "var(--color-amber)" : "var(--color-muted)",
                  borderColor: status === "ready" && input.trim() ? "var(--color-amber-dim)" : "var(--color-border)",
                  cursor: status === "ready" && input.trim() ? "pointer" : "default",
                }}
                aria-label="Send"
              >
                ↩
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StatusNote({ text }: { text: string }) {
  return (
    <p className="font-mono text-center py-2 animate-pulse"
      style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.08em" }}>
      {text}
    </p>
  );
}

function ErrorNote({ text }: { text: string }) {
  return (
    <p className="font-mono text-center py-2 border border-border px-3"
      style={{ fontSize: "11px", color: "var(--color-terra)", lineHeight: 1.6 }}>
      {text}
    </p>
  );
}
