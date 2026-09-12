import { describe, expect, it } from "vitest";
import {
  hashTargetId,
  initialHashReapplyState,
  isHashReapplyDone,
  shouldReapplyOnRefresh,
  type HashReapplyState,
} from "./deepLinkHash";

describe("hashTargetId", () => {
  it("reads the id out of a hash", () => {
    expect(hashTargetId("#work")).toBe("work");
  });

  it("decodes a percent-encoded hash", () => {
    expect(hashTargetId("#a%20b")).toBe("a b");
  });

  it("returns null for no hash, an empty hash, or a bare #", () => {
    expect(hashTargetId("")).toBeNull();
    expect(hashTargetId("#")).toBeNull();
  });

  it("returns null instead of throwing on a malformed percent-encoding", () => {
    expect(hashTargetId("#%")).toBeNull();
  });
});

describe("shouldReapplyOnRefresh / isHashReapplyDone", () => {
  it("keeps reapplying while the page is still loading", () => {
    const state = initialHashReapplyState();
    expect(shouldReapplyOnRefresh(state)).toBe(true);
    expect(isHashReapplyDone(state)).toBe(false);
  });

  it("reapplies exactly once more after the page has loaded, then stops", () => {
    const state: HashReapplyState = { hasScrollIntent: false, pageLoaded: true, refreshesAfterLoad: 0 };
    expect(shouldReapplyOnRefresh(state)).toBe(true);
    state.refreshesAfterLoad += 1;
    expect(shouldReapplyOnRefresh(state)).toBe(false);
    expect(isHashReapplyDone(state)).toBe(true);
  });

  it("never reapplies once the visitor has shown scroll intent, loaded or not", () => {
    const midLoad: HashReapplyState = { hasScrollIntent: true, pageLoaded: false, refreshesAfterLoad: 0 };
    expect(shouldReapplyOnRefresh(midLoad)).toBe(false);
    expect(isHashReapplyDone(midLoad)).toBe(true);

    const afterLoad: HashReapplyState = { hasScrollIntent: true, pageLoaded: true, refreshesAfterLoad: 0 };
    expect(shouldReapplyOnRefresh(afterLoad)).toBe(false);
    expect(isHashReapplyDone(afterLoad)).toBe(true);
  });
});
