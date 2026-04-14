"use client";

import { useState, useRef } from "react";
import { sendMessage, type ContactResult } from "@/app/contact/actions";

export default function ContactForm() {
  const [result, setResult] = useState<ContactResult | null>(null);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const res = await sendMessage(formData);
    setResult(res);
    setPending(false);

    if (res.success) formRef.current?.reset();
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    padding: "0.75rem 1rem",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s ease",
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="font-mono"
          style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.12em" }}
        >
          NAME
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          style={inputStyle}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-amber)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-border)")
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="font-mono"
          style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.12em" }}
        >
          MESSAGE
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="What are you building?"
          style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-amber)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-border)")
          }
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="font-mono border px-8 py-3 transition-colors duration-150 self-start"
        style={{
          fontSize: "13px",
          letterSpacing: "0.15em",
          borderColor: "var(--color-amber)",
          color: pending ? "var(--color-muted)" : "var(--color-amber)",
          backgroundColor: "transparent",
          cursor: pending ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!pending) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--color-amber)";
            (e.currentTarget as HTMLButtonElement).style.color = "#0A0806";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = pending
            ? "var(--color-muted)"
            : "var(--color-amber)";
        }}
      >
        {pending ? "> sending..." : "> send message"}
      </button>

      {/* Result feedback */}
      {result?.success && (
        <p
          className="font-mono"
          style={{ fontSize: "12px", color: "var(--color-amber)" }}
        >
          Message sent. I&apos;ll be in touch.
        </p>
      )}
      {result?.fallback && (
        <p
          className="font-mono"
          style={{ fontSize: "12px", color: "var(--color-muted)" }}
        >
          Email me directly:{" "}
          <a
            href="mailto:basel@maximlabs.io"
            style={{ color: "var(--color-amber)" }}
          >
            basel@maximlabs.io
          </a>
        </p>
      )}
      {result?.error && (
        <p
          className="font-mono"
          style={{ fontSize: "12px", color: "var(--color-terra)" }}
        >
          Something went wrong. Try emailing{" "}
          <a
            href="mailto:basel@maximlabs.io"
            style={{ color: "var(--color-amber)" }}
          >
            basel@maximlabs.io
          </a>
        </p>
      )}
    </form>
  );
}
