import { describe, expect, it } from "vitest";
import { validateContactField } from "./validateContactField";

describe("validateContactField", () => {
  it("requires a value for required fields", () => {
    expect(validateContactField("name", "")).toBe("This field is required.");
  });

  it("accepts a valid name", () => {
    expect(validateContactField("name", "Daniel")).toBe("");
  });

  it("rejects an invalid email", () => {
    expect(validateContactField("email", "not-an-email")).toBe("Enter a valid email address.");
  });

  it("accepts a valid email", () => {
    expect(validateContactField("email", "person@example.com")).toBe("");
  });

  it("enforces minimum length", () => {
    expect(validateContactField("subject", "hi")).toBe("Use at least 4 characters.");
  });

  it("accepts a message meeting the minimum length", () => {
    expect(validateContactField("message", "This message is long enough.")).toBe("");
  });
});
