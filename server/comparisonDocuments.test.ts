import { describe, expect, it } from "vitest";
import { comparisonCanonicalPath, comparisonHead, getComparisonRecord, renderRouteHead } from "./comparisonDocuments";

describe("server comparison documents", () => {
  it("builds a distinct, source-governed comparison record only for valid pairs", () => {
    const record = getComparisonRecord({ a: "alto", b: "sombra", lang: "ar" });
    expect(record?.lang).toBe("ar");
    expect(comparisonCanonicalPath(record!)).toBe("/compare?a=alto&b=sombra&lang=ar");
    expect(getComparisonRecord({ a: "alto", b: "alto" })).toBeUndefined();
  });

  it("emits comparison-specific social metadata and a dynamic image endpoint", () => {
    const origin = "https://example.test";
    const meta = comparisonHead("/compare?a=alto&b=sombra", origin);
    expect(meta.title).toContain("ALTO × SOMBRA");
    expect(meta.image).toContain("/compare/og.png?a=alto&b=sombra");
    expect(meta.description).toContain("pending");
    const head = renderRouteHead("/compare?a=alto&b=sombra", origin);
    expect(head).toContain('property="og:image"');
    expect(head).toContain("ALTO × SOMBRA");
  });

  it("keeps Arabic comparison metadata localized and self-canonicalized", () => {
    const meta = comparisonHead("/compare?a=alto&b=sombra&lang=ar", "https://example.test");
    expect(meta.locale).toBe("ar_AR");
    expect(meta.title).toContain("مقارنة كافيو");
    expect(meta.canonical).toBe("https://example.test/compare?a=alto&b=sombra&lang=ar");
  });
});
