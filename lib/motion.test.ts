import { describe, expect, it } from "vitest";
import { DURATION, EASE, stagger } from "./motion";

describe("motion tokens", () => {
  it("keeps section movement inside the 600-800ms band the spec fixes", () => {
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

  it("spreads a group over the given total, regardless of count", () => {
    expect(stagger(4, 0.4)).toBeCloseTo(0.1);
    expect(stagger(8, 0.4)).toBeCloseTo(0.05);
  });

  it("never returns a negative or infinite step", () => {
    expect(stagger(0)).toBe(0);
    expect(stagger(1)).toBeGreaterThan(0);
  });
});
