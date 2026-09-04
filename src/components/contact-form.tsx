"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { sendMessage, type ContactResult } from "@/app/contact/actions";

export default function ContactForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ContactResult | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setResult(null);

    try {
      const res = await sendMessage(new FormData(e.currentTarget));
      if (res.success) {
        // delivery confirmed — route to the thank-you page
        formRef.current?.reset();
        router.push("/thank-you");
        return;
      }
      setResult(res);
    } catch {
      setResult({ success: false, error: "send_failed" });
    } finally {
      setPending(false);
    }
  }

  const fieldClass =
    "w-full bg-surface border border-border focus:border-amber outline-none text-text font-sans text-sm px-4 py-3 transition-colors duration-150";

  const labelClass =
    "font-mono text-[11px] text-muted tracking-[0.12em] uppercase";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder="Your name"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={6}
          placeholder="What are you building?"
          className={`${fieldClass} resize-y leading-relaxed`}
        />
      </div>

      {/* Honeypot — hidden from humans, catches bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <button
        type="submit"
        disabled={pending}
        className="btn-solid self-start disabled:opacity-50"
      >
        {pending ? "> sending..." : "> send message"}
      </button>

      {/* Result feedback — success routes to /thank-you */}
      {result?.fallback && (
        <p className="font-mono text-[12px] text-muted">
          Email me directly:{" "}
          <a
            href="mailto:baselanaya@gmail.com"
            className="text-amber hover:text-amber-dim transition-colors duration-150"
          >
            baselanaya@gmail.com
          </a>
        </p>
      )}
      {result?.error === "invalid" && (
        <p className="font-mono text-[12px] text-terra">
          Please check your name, email, and message, then try again.
        </p>
      )}
      {result?.error === "rate_limited" && (
        <p className="font-mono text-[12px] text-terra">
          Too many messages from your network — try again later, or email me
          directly:{" "}
          <a
            href="mailto:baselanaya@gmail.com"
            className="text-amber hover:text-amber-dim transition-colors duration-150"
          >
            baselanaya@gmail.com
          </a>
        </p>
      )}
      {result?.error === "send_failed" && (
        <p className="font-mono text-[12px] text-terra">
          Something went wrong sending your message. Try emailing{" "}
          <a
            href="mailto:baselanaya@gmail.com"
            className="text-amber hover:text-amber-dim transition-colors duration-150"
          >
            baselanaya@gmail.com
          </a>
        </p>
      )}
    </form>
  );
}
