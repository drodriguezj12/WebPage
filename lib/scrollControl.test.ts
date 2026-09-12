import { afterEach, describe, expect, it, vi } from "vitest";
import { registerScroller, scrollToY } from "./scrollControl";

describe("scrollControl", () => {
  afterEach(() => registerScroller(null));

  it("delegates to the registered scroller", () => {
    const scroller = vi.fn();
    registerScroller(scroller);
    scrollToY(480);
    expect(scroller).toHaveBeenCalledWith(480);
  });

  it("stops delegating once the scroller is cleared", () => {
    const scroller = vi.fn();
    registerScroller(scroller);
    registerScroller(null);
    scrollToY(480);
    expect(scroller).not.toHaveBeenCalled();
  });

  it("does not throw without a registered scroller or a window", () => {
    expect(() => scrollToY(120)).not.toThrow();
  });
});
