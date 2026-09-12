/**
 * A seam between components that need to move the page and whatever is
 * currently driving scrolling. It imports nothing, so a component can depend on
 * it without pulling the smooth-scroll library into its bundle.
 */
type Scroller = (top: number) => void;

let active: Scroller | null = null;

/** Called by the smooth-scroll setup when it starts, and with null when it stops. */
export function registerScroller(scroller: Scroller | null): void {
  active = scroller;
}

/**
 * Move the page to `top` immediately. Goes through the registered scroller when
 * there is one — a smooth-scroll library in mid-flight would otherwise override a
 * native scroll on its next frame — and falls back to the browser otherwise.
 */
export function scrollToY(top: number): void {
  if (active) {
    active(top);
    return;
  }
  if (typeof window !== "undefined") {
    window.scrollTo({ top, behavior: "auto" });
  }
}
