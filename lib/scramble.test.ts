import { describe, expect, it } from "vitest";
import { scrambleFrame } from "./scramble";

// A fixed substitute so the output is deterministic in tests.
const fixed = () => "#";

describe("scrambleFrame", () => {
  it("returns the finished string at full progress", () => {
    expect(scrambleFrame("REAL-TIME", 1, fixed)).toBe("REAL-TIME");
  });

  it("returns no settled characters at zero progress", () => {
    expect(scrambleFrame("ABC", 0, fixed)).toBe("###");
  });

  it("settles characters left to right", () => {
    expect(scrambleFrame("ABCD", 0.5, fixed)).toBe("AB##");
  });

  it("keeps the length identical at every step, so nothing reflows", () => {
    for (const p of [0, 0.13, 0.5, 0.77, 1]) {
      expect(scrambleFrame("BOGOTA, CO", p, fixed)).toHaveLength(10);
    }
  });

  it("never scrambles spaces, which would make the label jump", () => {
    expect(scrambleFrame("A B", 0, fixed)).toBe("# #");
  });

  it("clamps progress outside 0..1", () => {
    expect(scrambleFrame("AB", -1, fixed)).toBe("##");
    expect(scrambleFrame("AB", 9, fixed)).toBe("AB");
  });
});
