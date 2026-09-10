import { describe, expect, it } from "vitest";
import { buildContactEmail, validateContactPayload } from "./contactMessage";

const VALID = {
  name: "Recruiter",
  email: "recruiter@example.com",
  subject: "Backend role",
  message: "We would like to talk about a backend position.",
};

describe("validateContactPayload", () => {
  it("accepts a complete payload", () => {
    const result = validateContactPayload(VALID);
    expect(result).toEqual({ ok: true, values: VALID });
  });

  it("trims incoming values", () => {
    const result = validateContactPayload({ ...VALID, name: "  Recruiter  " });
    expect(result.ok && result.values.name).toBe("Recruiter");
  });

  it("reports every invalid field", () => {
    const result = validateContactPayload({ ...VALID, email: "nope", message: "short" });
    expect(result.ok).toBe(false);
    expect(result.ok === false && Object.keys(result.errors).sort()).toEqual([
      "email",
      "message",
    ]);
  });

  it("treats missing and non-string fields as empty", () => {
    const result = validateContactPayload({ name: 42 });
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.name).toBe("This field is required.");
  });

  it("rejects a body that is not an object", () => {
    expect(validateContactPayload("nope").ok).toBe(false);
  });
});

describe("buildContactEmail", () => {
  it("replies to the visitor, not to the sending address", () => {
    expect(buildContactEmail(VALID).replyTo).toBe("recruiter@example.com");
  });

  it("keeps the message and its context in the body", () => {
    const { subject, text } = buildContactEmail(VALID);
    expect(subject).toBe("Portfolio: Backend role");
    expect(text).toContain("recruiter@example.com");
    expect(text).toContain("We would like to talk about a backend position.");
  });
});
