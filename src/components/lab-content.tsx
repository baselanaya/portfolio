"use client";

import { useState } from "react";
import MiniGame from "@/components/mini-game";

// ASCII bar chart — what actually fits in an 8GB VRAM budget.
// Data from the "Real Limits of Local LLMs on an RTX 4070" post.
const BARS: { label: string; gb: number }[] = [
  { label: "Qwen2.5-Coder-7B FP8", gb: 7.2 },
  { label: "Mistral-7B Q5_K_M", gb: 5.9 },
  { label: "Llama-3.1-8B Q4_K_M", gb: 5.1 },
  { label: "Qwen3.5-4B FP16", gb: 4.8 },
  { label: "Chronos-2 120M FP32", gb: 0.6 },
];

const WIDTH = 40; // bar length in chars for 8GB

function bar(gb: number): string {
  const filled = Math.round((gb / 8) * WIDTH);
  return "█".repeat(filled) + "░".repeat(WIDTH - filled);
}

export default function LabContent() {
  const [gameOpen, setGameOpen] = useState(false);

  return (
    <div className="flex flex-col gap-14">
      {/* Snake */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display font-semibold tracking-tight" style={{ fontSize: "22px" }}>
              SNAKE.EXE
            </h2>
            <p style={{ fontSize: "14px", color: "var(--color-muted)", marginTop: "4px" }}>
              The cheat code is dead. Click the button like a civilian.
            </p>
          </div>
          <button onClick={() => setGameOpen((o) => !o)} className="btn-solid">
            {gameOpen ? "eject ⏏" : "insert coin ▸"}
          </button>
        </div>
        {gameOpen && (
          <div className="rounded-2xl border border-border bg-surface-2 py-10 flex justify-center">
            <MiniGame open onClose={() => setGameOpen(false)} />
          </div>
        )}
      </section>

      {/* VRAM benchmark */}
      <section>
        <h2 className="font-display font-semibold tracking-tight mb-1" style={{ fontSize: "22px" }}>
          The 8GB wall
        </h2>
        <p style={{ fontSize: "14px", color: "var(--color-muted)", marginBottom: "18px" }}>
          What actually fits on an RTX 4070: inference numbers, measured the hard way.
        </p>
        <div className="rounded-2xl border border-border bg-surface overflow-x-auto">
          <pre
            className="font-mono select-none"
            style={{
              fontSize: "12px",
              lineHeight: 2,
              color: "var(--color-text)",
              padding: "22px 20px",
              margin: 0,
            }}
          >
{BARS.map(({ label, gb }) =>
  `${label.padEnd(26)}│${bar(gb)} ${gb.toFixed(1)}GB`
).join("\n")}
          </pre>
        </div>
        <p
          className="font-mono mt-3"
          style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.1em" }}
        >
          1 cell = 1 GB · fine-tuning needs 3–4× more
        </p>
      </section>

      {/* Experiments */}
      <section>
        <h2 className="font-display font-semibold tracking-tight mb-1" style={{ fontSize: "22px" }}>
          Elsewhere in the lab
        </h2>
        <p style={{ fontSize: "14px", color: "var(--color-muted)", marginBottom: "18px" }}>
          Longer-form experiments live in the case studies.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: "Kernex", note: "zero-trust agent sandbox", href: "/work/kernex" },
            { name: "Mercer", note: "text-to-SQL vs hostile schemas", href: "/work/mercer" },
            { name: "MedFormer", note: "biomedical vision-language RAG", href: "/work/medformer" },
          ].map(({ name, note, href }) => (
            <a
              key={name}
              href={href}
              className="rounded-xl border border-border bg-surface p-4 transition-colors duration-150 hover:border-[rgba(22,21,15,0.35)]"
            >
              <p className="font-display font-medium" style={{ fontSize: "15px" }}>{name}</p>
              <p className="font-mono" style={{ fontSize: "10px", color: "var(--color-muted)", marginTop: "4px", letterSpacing: "0.06em" }}>
                {note} ↗
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
