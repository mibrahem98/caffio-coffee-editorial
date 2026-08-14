import { describe, expect, it } from "vitest";
import { describeSearchStatus } from "./searchAccessibility";

const base = { resultCount: 3, resultLabel: "coffees found", activeCount: 0, activeLabel: "active refinements", isUpdating: false, updatingLabel: "Updating search results", action: "filter" as const, sortedLabel: "Sorted by", sortLabel: "Editorial order", preferencesClearedLabel: "Saved filter preferences cleared." };

describe("search accessibility status", () => {
  it("announces active refinements and a sort choice after results settle", () => {
    expect(describeSearchStatus({ ...base, activeCount: 2, action: "sort", sortLabel: "Price: high to low" })).toBe("3 coffees found · 2 active refinements · Sorted by: Price: high to low");
  });

  it("prioritizes the updating state and then explicitly reports saved-preference clearing", () => {
    expect(describeSearchStatus({ ...base, isUpdating: true, action: "saved" })).toBe("Updating search results");
    expect(describeSearchStatus({ ...base, action: "saved" })).toBe("3 coffees found · Saved filter preferences cleared.");
  });
});
