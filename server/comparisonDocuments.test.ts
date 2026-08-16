import { describe, expect, it } from "vitest";
import { comparisonCanonicalPath, comparisonHead, getComparisonRecord, productHead, renderRouteHead, routeHead } from "./comparisonDocuments";

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

  it("emits product-specific metadata and preserves pending tasting evidence", () => {
    const meta = productHead("/coffee/alto", "https://example.test");
    expect(meta.title).toContain("ALTO");
    expect(meta.canonical).toBe("https://example.test/coffee/alto");
    expect(meta.image).toBe("https://example.test/coffee/alto/og.png?lang=en");
    expect(meta.body).toContain("Tasting cues await a verified batch record.");
  });

  it("localizes product metadata without adding unverified tasting claims", () => {
    const meta = productHead("/coffee/alto?lang=ar", "https://example.test");
    expect(meta.locale).toBe("ar_AR");
    expect(meta.canonical).toBe("https://example.test/coffee/alto?lang=ar");
    expect(meta.body).toContain("بانتظار سجل دفعة موثّق");
  });

  it("emits auditable SSR metadata and a social card for Field Notes", () => {
    const meta = routeHead("/notes", "https://example.test");
    expect(meta.title).toContain("Field Notes");
    expect(meta.canonical).toBe("https://example.test/notes");
    expect(meta.image).toBe("https://example.test/editorial/og.png?kind=notes&lang=en");
    expect(meta.body).toContain("batch documents");
    expect(renderRouteHead("/notes", "https://example.test")).toContain('property="og:image"');
  });

  it("localizes case-study SSR metadata and preserves the language canonical", () => {
    const meta = routeHead("/case-study?lang=ar", "https://example.test");
    expect(meta.locale).toBe("ar_AR");
    expect(meta.title).toContain("دراسة حالة كافيو");
    expect(meta.canonical).toBe("https://example.test/case-study?lang=ar");
    expect(meta.image).toBe("https://example.test/editorial/og.png?kind=case-study&lang=ar");
  });
});
