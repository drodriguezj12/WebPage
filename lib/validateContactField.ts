export type ContactFieldName = "name" | "email" | "subject" | "message";

export type ContactFieldRules = {
  required: boolean;
  minLength?: number;
  isEmail?: boolean;
};

export const CONTACT_FIELD_RULES: Record<ContactFieldName, ContactFieldRules> = {
  name: { required: true, minLength: 2 },
  email: { required: true, isEmail: true },
  subject: { required: true, minLength: 4 },
  message: { required: true, minLength: 12 },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactField(field: ContactFieldName, rawValue: string): string {
  const rules = CONTACT_FIELD_RULES[field];
  const value = rawValue.trim();

  if (rules.required && !value) {
    return "This field is required.";
  }

  if (rules.isEmail && !EMAIL_PATTERN.test(value)) {
    return "Enter a valid email address.";
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `Use at least ${rules.minLength} characters.`;
  }

  return "";
}
