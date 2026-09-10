import { describe, expect, it } from "vitest";
import { formatFigure, parseFigure } from "./countUp";

describe("parseFigure", () => {
  it("reads a bare number", () => {
    expect(parseFigure("95")).toEqual({ value: 95, prefix: "", suffix: "" });
  });

  it("keeps a trailing plus as a suffix", () => {
    expect(parseFigure("3+")).toEqual({ value: 3, prefix: "", suffix: "+" });
  });

  it("keeps a percent sign as a suffix", () => {
    expect(parseFigure("30%")).toEqual({ value: 30, prefix: "", suffix: "%" });
  });

  it("keeps a leading symbol as a prefix", () => {
    expect(parseFigure("~40")).toEqual({ value: 40, prefix: "~", suffix: "" });
  });

  it("treats a leading letter as a prefix so B2 still animates its digit", () => {
    expect(parseFigure("B2")).toEqual({ value: 2, prefix: "B", suffix: "" });
  });
});

describe("formatFigure", () => {
  it("rounds and reattaches the affixes", () => {
    const parsed = parseFigure("30%");
    expect(formatFigure(12.6, parsed)).toBe("13%");
  });

  it("never renders a negative intermediate value", () => {
    const parsed = parseFigure("95");
    expect(formatFigure(-4, parsed)).toBe("0");
  });
});
