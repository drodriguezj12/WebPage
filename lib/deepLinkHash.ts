/**
 * A deep link to a section after Pulse (`#work`, `#approach`, `#track`,
 * `#contact`) lands correctly on the server-rendered layout, but once the
 * Pulse pin exists it inserts `innerHeight * (beats - 1)` of spacing above
 * everything that follows, and nothing re-applies the hash after that — so
 * the browser's own anchor jump, made before the pin existed, ends up
 * roughly two screens short.
 *
 * The fix re-applies `location.hash` on every ScrollTrigger `refresh` (the
 * point at which pin spacing has just been recalculated) until either the
 * visitor shows scroll intent of their own, or the page has finished
 * loading and one refresh after that has already run. This module holds the
 * decision logic as pure functions so it can be unit-tested without a DOM;
 * the imperative wiring (event listeners, ScrollTrigger, scrollIntoView)
 * lives in Pinned, which is what shifts the layout in the first place.
 */

export type HashReapplyState = {
  /** The visitor pressed a key, touched, wheeled, or pressed a pointer down. */
  hasScrollIntent: boolean;
  /** The document has finished loading (readyState "complete", or the `load` event fired). */
  pageLoaded: boolean;
  /** How many refreshes have fired since `pageLoaded` became true. */
  refreshesAfterLoad: number;
};

export function initialHashReapplyState(): HashReapplyState {
  return { hasScrollIntent: false, pageLoaded: false, refreshesAfterLoad: 0 };
}

/**
 * Whether a ScrollTrigger `refresh` firing right now should re-apply the
 * hash. Once the visitor has shown scroll intent, never again — their
 * scroll position is theirs. Otherwise: always before the page has finished
 * loading (layout is still settling), and exactly one more time after.
 */
export function shouldReapplyOnRefresh(state: HashReapplyState): boolean {
  if (state.hasScrollIntent) return false;
  if (!state.pageLoaded) return true;
  return state.refreshesAfterLoad < 1;
}

/**
 * Whether no future event can ever cause another re-apply — the caller can
 * tear down its listeners once this is true.
 */
export function isHashReapplyDone(state: HashReapplyState): boolean {
  if (state.hasScrollIntent) return true;
  return state.pageLoaded && state.refreshesAfterLoad >= 1;
}

/**
 * The element id a deep link targets, or null when there is no hash, it is
 * empty, or it fails to decode. Never throws.
 */
export function hashTargetId(hash: string): string | null {
  if (hash.length < 2 || hash[0] !== "#") return null;
  try {
    const decoded = decodeURIComponent(hash.slice(1));
    return decoded.length > 0 ? decoded : null;
  } catch {
    return null;
  }
}
