"use client";

import { useState, type FormEvent } from "react";
import {
  CONTACT_FIELD_RULES,
  validateContactField,
  type ContactFieldName,
} from "@/lib/validateContactField";

const TEXT_FIELDS: { name: ContactFieldName; label: string; type: string; placeholder: string }[] = [
  { name: "name", label: "Name", type: "text", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "subject", label: "Subject", type: "text", placeholder: "Project or role inquiry" },
];

const CONTACT_EMAIL = "drodriguezj1267@gmail.com";

const EMPTY_VALUES: Record<ContactFieldName, string> = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState<Record<ContactFieldName, string>>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Record<ContactFieldName, string>>(EMPTY_VALUES);
  const [honeypot, setHoneypot] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ tone: "info" | "error"; text: string } | null>(null);

  function handleChange(field: ContactFieldName, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateContactField(field, value) }));
    }
  }

  function handleBlur(field: ContactFieldName) {
    setErrors((prev) => ({ ...prev, [field]: validateContactField(field, values[field]) }));
  }

  function openMailClient() {
    const body = [
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      "",
      values.message.trim(),
    ].join("\n");

    setStatus({
      tone: "info",
      text: "Opening your email client with the message prepared.",
    });
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      values.subject.trim()
    )}&body=${encodeURIComponent(body)}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const fieldNames = Object.keys(CONTACT_FIELD_RULES) as ContactFieldName[];
    const nextErrors = Object.fromEntries(
      fieldNames.map((field) => [field, validateContactField(field, values[field])])
    ) as Record<ContactFieldName, string>;
    setErrors(nextErrors);

    if (Object.values(nextErrors).some((message) => message !== "")) {
      setStatus({ tone: "error", text: "Please review the highlighted fields." });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot }),
      });

      if (response.ok) {
        setStatus({ tone: "info", text: "Message sent. You will get a reply by email." });
        setValues(EMPTY_VALUES);
        setErrors(EMPTY_VALUES);
        return;
      }

      // No mail service configured yet: hand the message to the visitor's own
      // client rather than dropping it.
      if (response.status === 503) {
        openMailClient();
        return;
      }

      if (response.status === 400) {
        const data: { errors?: Partial<Record<ContactFieldName, string>> } = await response
          .json()
          .catch(() => ({}));
        if (data.errors) {
          setErrors({ ...EMPTY_VALUES, ...data.errors });
        }
        setStatus({ tone: "error", text: "Please review the highlighted fields." });
        return;
      }

      setStatus({
        tone: "error",
        text: `The message could not be sent. Write to ${CONTACT_EMAIL} instead.`,
      });
    } catch {
      // Offline or the request never landed -- the mail client still works.
      openMailClient();
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative border border-border bg-surface p-7"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TEXT_FIELDS.map((field) => (
          <div key={field.name} className="grid gap-1.5">
            <label htmlFor={field.name} className="text-sm font-bold text-text">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(event) => handleChange(field.name, event.target.value)}
              onBlur={() => handleBlur(field.name)}
              aria-invalid={Boolean(errors[field.name])}
              className="h-11 border border-border bg-bg px-3 text-text focus:border-steel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            />
            <span className="min-h-[18px] text-sm font-semibold text-red-400">
              {errors[field.name]}
            </span>
          </div>
        ))}

        <div className="grid gap-1.5 sm:col-span-2">
          <label htmlFor="message" className="text-sm font-bold text-text">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Tell Daniel what you need built, optimized, or discussed."
            value={values.message}
            onChange={(event) => handleChange("message", event.target.value)}
            onBlur={() => handleBlur("message")}
            aria-invalid={Boolean(errors.message)}
            className="min-h-[132px] resize-y border border-border bg-bg px-3 py-2.5 text-text focus:border-steel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          />
          <span className="min-h-[18px] text-sm font-semibold text-red-400">{errors.message}</span>
        </div>
      </div>

      {/* Left for bots to fill in. Off-screen, unfocusable and hidden from
          assistive technology, so nobody using the form ever meets it. */}
      <div className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex h-12 items-center justify-center gap-2 bg-steel px-5 font-bold text-bg motion-safe:transition-transform motion-safe:enabled:hover:-translate-y-0.5 motion-safe:enabled:active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? "Sending..." : "Send message"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`font-bold ${status?.tone === "error" ? "text-red-400" : "text-steel"}`}
        >
          {status?.text ?? ""}
        </p>
      </div>
    </form>
  );
}
