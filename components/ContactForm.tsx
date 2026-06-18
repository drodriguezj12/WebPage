"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
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

const EMPTY_VALUES: Record<ContactFieldName, string> = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState<Record<ContactFieldName, string>>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Record<ContactFieldName, string>>(EMPTY_VALUES);
  const [status, setStatus] = useState("");

  function handleChange(field: ContactFieldName, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateContactField(field, value) }));
    }
  }

  function handleBlur(field: ContactFieldName) {
    setErrors((prev) => ({ ...prev, [field]: validateContactField(field, values[field]) }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    const fieldNames = Object.keys(CONTACT_FIELD_RULES) as ContactFieldName[];
    const nextErrors = Object.fromEntries(
      fieldNames.map((field) => [field, validateContactField(field, values[field])])
    ) as Record<ContactFieldName, string>;
    setErrors(nextErrors);

    const isValid = Object.values(nextErrors).every((message) => message === "");
    if (!isValid) {
      setStatus("Please review the highlighted fields.");
      return;
    }

    const body = [
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      "",
      values.message.trim(),
    ].join("\n");
    const mailto = `mailto:drodriguezj1267@gmail.com?subject=${encodeURIComponent(
      values.subject.trim()
    )}&body=${encodeURIComponent(body)}`;

    setStatus("Opening your email client with the message prepared.");
    window.location.href = mailto;
    setValues(EMPTY_VALUES);
    setErrors(EMPTY_VALUES);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-border bg-surface p-7">
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
              className="h-11 rounded-md border border-border bg-bg px-3 text-text outline-none focus:border-accent"
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
            className="min-h-[132px] resize-y rounded-md border border-border bg-bg px-3 py-2.5 text-text outline-none focus:border-accent"
          />
          <span className="min-h-[18px] text-sm font-semibold text-red-400">{errors.message}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <motion.button
          type="submit"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 font-bold text-bg"
        >
          Send message
        </motion.button>
        <p role="status" aria-live="polite" className="font-bold text-accent">
          {status}
        </p>
      </div>
    </form>
  );
}
