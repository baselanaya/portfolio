"use server";

export interface ContactResult {
  success: boolean;
  fallback?: boolean;
  error?: boolean;
}

export async function sendMessage(formData: FormData): Promise<ContactResult> {
  const name = (formData.get("name") as string | null)?.trim();
  const message = (formData.get("message") as string | null)?.trim();

  if (!name || !message) {
    return { success: false, error: true };
  }

  if (!process.env.RESEND_API_KEY) {
    // No API key configured — caller shows mailto fallback
    return { success: false, fallback: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "portfolio@maximlabs.io",
      to: "baselanaya@gmail.com",
      subject: `Portfolio message from ${name}`,
      text: `From: ${name}\n\n${message}`,
    });

    return { success: true };
  } catch {
    return { success: false, error: true };
  }
}
