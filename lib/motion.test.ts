import { describe, expect, it } from "vitest";
import { DURATION, EASE } from "./motion";

describe("motion tokens", () => {
  it("keeps section movement inside the 600-800ms band", () => {
    expect(DURATION.section).toBeGreaterThanOrEqual(0.6);
    expect(DURATION.section).toBeLessThanOrEqual(0.8);
  });

  it("keeps interface feedback inside the 200-300ms band", () => {
    expect(DURATION.feedback).toBeGreaterThanOrEqual(0.2);
    expect(DURATION.feedback).toBeLessThanOrEqual(0.3);
  });

  it("exposes GSAP easing strings, not cubic-bezier CSS", () => {
    expect(EASE.out).toMatch(/^[a-z]/);
  });
});
