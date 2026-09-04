"use server";

import { headers } from "next/headers";

export type ContactError = "invalid" | "rate_limited" | "send_failed";

export interface ContactResult {
  success: boolean;
  fallback?: boolean;
  error?: ContactError;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_NAME = 100;
const MAX_MESSAGE = 5000;

// Best-effort in-memory rate limit — per server instance, resets on deploy.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const rateBucket = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  if (rateBucket.size > 1000) {
    for (const [k, v] of rateBucket) {
      if (now > v.resetAt) rateBucket.delete(k);
    }
  }
  const entry = rateBucket.get(key);
  if (!entry || now > entry.resetAt) {
    rateBucket.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

export async function sendMessage(formData: FormData): Promise<ContactResult> {
  // Honeypot — bots fill every field; humans never see this one.
  if ((formData.get("website") as string | null)?.trim()) {
    return { success: true };
  }

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (
    !name ||
    !message ||
    !EMAIL_RE.test(email) ||
    name.length > MAX_NAME ||
    message.length > MAX_MESSAGE
  ) {
    return { success: false, error: "invalid" };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return { success: false, error: "rate_limited" };
  }

  if (!process.env.RESEND_API_KEY) {
    // No API key configured — caller shows mailto fallback
    return { success: false, fallback: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    // send() resolves with { error } on API failures instead of throwing —
    // the result must be checked, not just caught.
    const { error } = await resend.emails.send({
      from: "portfolio@maximlabs.io",
      to: "baselanaya@gmail.com",
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) return { success: false, error: "send_failed" };
    return { success: true };
  } catch {
    return { success: false, error: "send_failed" };
  }
}
