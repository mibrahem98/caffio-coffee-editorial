import type { Lang } from "./mizanCatalog";

export type ComparisonExportRow = { label: string; first: string; second: string };

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character] || character);

const shortLine = (value: string) => value.length > 34 ? `${value.slice(0, 31).trim()}…` : value;

export function buildComparisonSvg({ firstName, secondName, rows, lang }: { firstName: string; secondName: string; rows: ComparisonExportRow[]; lang: Lang }) {
  const rowHeight = 66;
  const height = 224 + rows.length * rowHeight;
  const direction = lang === "ar" ? "rtl" : "ltr";
  const title = lang === "ar" ? "مقارنة كافيو" : "CAFFIO / COFFEE COMPARISON";
  const header = lang === "ar" ? "سجلان، دون افتراضات" : "Two records, no assumptions";
  const cells = rows.map((row, index) => {
    const y = 224 + index * rowHeight;
    return `<g><rect x="60" y="${y}" width="1080" height="${rowHeight}" fill="${index % 2 ? "#f3eadb" : "#efe4d2"}"/><text x="88" y="${y + 25}" fill="#745531" font-family="Manrope, Arial, sans-serif" font-size="14" letter-spacing="1.4">${escapeXml(shortLine(row.label).toUpperCase())}</text><text x="405" y="${y + 25}" fill="#1e2224" font-family="Manrope, Arial, sans-serif" font-size="18">${escapeXml(shortLine(row.first))}</text><text x="790" y="${y + 25}" fill="#1e2224" font-family="Manrope, Arial, sans-serif" font-size="18">${escapeXml(shortLine(row.second))}</text><line x1="385" y1="${y}" x2="385" y2="${y + rowHeight}" stroke="#d7c7ae"/><line x1="770" y1="${y}" x2="770" y2="${y + rowHeight}" stroke="#d7c7ae"/></g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}" role="img" aria-label="${escapeXml(title)}" direction="${direction}"><rect width="1200" height="${height}" fill="#f4ecdf"/><rect width="1200" height="164" fill="#1e2224"/><text x="60" y="58" fill="#c29b58" font-family="Manrope, Arial, sans-serif" font-size="16" letter-spacing="3">${escapeXml(title)}</text><text x="60" y="118" fill="#f4ecdf" font-family="Georgia, serif" font-size="42">${escapeXml(header)}</text><text x="405" y="198" fill="#1e2224" font-family="Georgia, serif" font-size="26">${escapeXml(firstName)}</text><text x="790" y="198" fill="#1e2224" font-family="Georgia, serif" font-size="26">${escapeXml(secondName)}</text>${cells}<text x="60" y="${height - 24}" fill="#745531" font-family="Manrope, Arial, sans-serif" font-size="12">CAFFIO COFFEE / DEMO COMPARISON · SOURCE STATES RETAINED</text></svg>`;
}

export function downloadComparisonSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
