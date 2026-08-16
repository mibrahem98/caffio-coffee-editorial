import { createHash } from "node:crypto";
import { invokeLLM } from "./_core/llm";

export type ApprovedFlavorSignal = { id: number; comment: string; rating: number; updatedAt: Date };
export type GeneratedFlavorSummary = { summaryEn: string; summaryAr: string; sourceCount: number; sourceFingerprint: string };

const restrictedTerms = /\b(origin|farm|altitude|process|organic|fair trade|certified|traceable|منشأ|مزرعة|ارتفاع|معالجة|عضوي|تجارة عادلة|معتمد)\b/i;
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

export function flavorSignalFingerprint(signals: ApprovedFlavorSignal[]) {
  return createHash("sha256").update(signals.map(signal => `${signal.id}:${signal.updatedAt.toISOString()}:${signal.comment}`).join("\n")).digest("hex");
}

function fallback(signals: ApprovedFlavorSignal[]): GeneratedFlavorSummary {
  const count = signals.length;
  return {
    summaryEn: `A careful automated reading of ${count} approved cup reflection${count === 1 ? "" : "s"} is available. It represents visitor language only, not a verified product claim.`,
    summaryAr: `يتوفر تلخيص آلي متأنٍ لـ ${count} من انطباعات الأكواب المعتمدة. يعكس لغة الزوار فقط ولا يمثل ادعاءً موثقًا عن المنتج.`,
    sourceCount: count,
    sourceFingerprint: flavorSignalFingerprint(signals),
  };
}

export async function generateFlavorSummary(signals: ApprovedFlavorSignal[]): Promise<GeneratedFlavorSummary | undefined> {
  if (!signals.length) return undefined;
  const safeFallback = fallback(signals);
  const source = signals.map(signal => `- rating ${signal.rating}/5: ${normalize(signal.comment)}`).join("\n");
  try {
    const response = await invokeLLM({
      model: "gpt-5-mini",
      maxTokens: 230,
      messages: [
        { role: "system", content: "Summarize only explicit sensory language in approved customer cup reflections. Do not infer or claim origin, farm, altitude, processing, certifications, quality, availability, or verified tasting notes. Do not quote names. Use cautious language such as 'reflections mention'." },
        { role: "user", content: `Return strict JSON with English and Arabic summaries, each under 220 characters. Source reflections:\n${source}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "flavor_reflection_summary",
          strict: true,
          schema: {
            type: "object",
            properties: { summaryEn: { type: "string" }, summaryAr: { type: "string" } },
            required: ["summaryEn", "summaryAr"],
            additionalProperties: false,
          },
        },
      },
    });
    const content = response.choices[0]?.message.content;
    const raw = typeof content === "string" ? JSON.parse(content) as { summaryEn?: string; summaryAr?: string } : undefined;
    const summaryEn = normalize(raw?.summaryEn || "");
    const summaryAr = normalize(raw?.summaryAr || "");
    if (!summaryEn || !summaryAr || summaryEn.length > 360 || summaryAr.length > 360 || restrictedTerms.test(summaryEn) || restrictedTerms.test(summaryAr)) return safeFallback;
    return { ...safeFallback, summaryEn, summaryAr };
  } catch {
    return safeFallback;
  }
}
