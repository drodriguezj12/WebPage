import { Resend } from "resend";
import { buildContactEmail, validateContactPayload } from "@/lib/contactMessage";

// The Resend SDK needs Node APIs, and the key must never reach the browser.
export const runtime = "nodejs";

const TO_ADDRESS = process.env.CONTACT_TO_EMAIL ?? "drodriguezj1267@gmail.com";
// Resend's shared sender works without owning a domain, but only delivers to the
// address that registered the account -- which is exactly where this form writes.
const FROM_ADDRESS = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid-body" }, { status: 400 });
  }

  // Bots fill every field they find; a real visitor never sees this one.
  const honeypot = (body as { company?: unknown } | null)?.company;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return Response.json({ ok: true }, { status: 202 });
  }

  const result = validateContactPayload(body);
  if (!result.ok) {
    return Response.json({ error: "invalid-fields", errors: result.errors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Without a key there is nothing to send with. Saying so lets the form fall
    // back to the visitor's mail client instead of losing the message.
    return Response.json({ error: "email-not-configured" }, { status: 503 });
  }

  const email = buildContactEmail(result.values);

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text,
    });

    if (error) {
      console.error("Contact email rejected by Resend:", error);
      return Response.json({ error: "send-failed" }, { status: 502 });
    }
  } catch (cause) {
    console.error("Contact email could not be sent:", cause);
    return Response.json({ error: "send-failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
