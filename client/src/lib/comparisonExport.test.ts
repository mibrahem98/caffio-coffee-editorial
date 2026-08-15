import { describe, expect, it } from "vitest";
import { buildComparisonSvg } from "./comparisonExport";

describe("comparison image export", () => {
  it("creates a branded SVG that retains comparison rows and safely escapes record text", () => {
    const svg = buildComparisonSvg({ firstName: "ALTO", secondName: "SOMBRA", lang: "en", rows: [{ label: "Origin", first: "Pending & reviewed", second: "<pending>" }] });
    expect(svg).toContain("CAFFIO / COFFEE COMPARISON");
    expect(svg).toContain("ALTO");
    expect(svg).toContain("Pending &amp; reviewed");
    expect(svg).toContain("&lt;pending&gt;");
  });

  it("uses the bilingual comparison heading for Arabic exports", () => {
    const svg = buildComparisonSvg({ firstName: "ألتو", secondName: "سومبرا", lang: "ar", rows: [] });
    expect(svg).toContain("مقارنة كافيو");
    expect(svg).toContain('direction="rtl"');
  });
});
