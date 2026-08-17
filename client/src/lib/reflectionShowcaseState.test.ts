import { describe, expect, it } from "vitest";
import { getReflectionShowcaseState } from "./reflectionShowcaseState";

describe("getReflectionShowcaseState", () => {
  it("keeps the public showcase loading until the approved-query result resolves", () => {
    expect(getReflectionShowcaseState({ isLoading: true, approvedCount: 2 })).toBe("loading");
  });

  it("returns an explicit empty state rather than invented social proof", () => {
    expect(getReflectionShowcaseState({ isLoading: false, approvedCount: 0 })).toBe("empty");
  });

  it("permits an approved presentation only when the approved count is positive", () => {
    expect(getReflectionShowcaseState({ isLoading: false, approvedCount: 1 })).toBe("approved");
  });
});
