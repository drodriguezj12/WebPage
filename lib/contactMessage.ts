import {
  CONTACT_FIELD_RULES,
  validateContactField,
  type ContactFieldName,
} from "./validateContactField";

export type ContactPayload = Record<ContactFieldName, string>;

export type ContactValidation =
  | { ok: true; values: ContactPayload }
  | { ok: false; errors: Partial<Record<ContactFieldName, string>> };

const FIELD_NAMES = Object.keys(CONTACT_FIELD_RULES) as ContactFieldName[];

/**
 * Re-runs the browser's own rules on the server. The client validates for the
 * person filling the form; this validates because anything can POST here.
 */
export function validateContactPayload(input: unknown): ContactValidation {
  const source = (typeof input === "object" && input !== null ? input : {}) as Record<
    string,
    unknown
  >;

  const values = Object.fromEntries(
    FIELD_NAMES.map((field) => [
      field,
      typeof source[field] === "string" ? (source[field] as string).trim() : "",
    ])
  ) as ContactPayload;

  const errors: Partial<Record<ContactFieldName, string>> = {};
  for (const field of FIELD_NAMES) {
    const message = validateContactField(field, values[field]);
    if (message) errors[field] = message;
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, values };
}

export function buildContactEmail(values: ContactPayload) {
  return {
    subject: `Portfolio: ${values.subject}`,
    // replyTo carries the visitor's address, so answering the notification
    // answers the person rather than the sending domain.
    replyTo: values.email,
    text: [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Subject: ${values.subject}`,
      "",
      values.message,
    ].join("\n"),
  };
}
