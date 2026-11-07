import type { CountKey, MsrEntry } from "./msr-types";

const keys: CountKey[] = ["day7", "day14", "day21", "day28"];

const latin = (value: string) => value.replace(/[^\x20-\x7E]/g, "?").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const clip = (value: string, max: number) => {
  const safe = value.replace(/[^\x20-\x7E]/g, "?");
  return safe.length > max ? `${safe.slice(0, Math.max(0, max - 3))}...` : safe;
};
const countText = (entry: MsrEntry, key: CountKey) => {
  const value = entry.weeklyCounts[key];
  if (value === null || value === undefined) return "-";
  return entry.formulas?.[key] ? `${value}*` : String(value);
};

export function renderMsrPdf(report: { period: string; filename: string; entries: MsrEntry[]; warnings?: string[] }) {
  const size = 24;
  const pages = Math.max(1, Math.ceil(report.entries.length / size));
  const streams = Array.from({ length: pages }, (_, page) => {
    const rows = report.entries.slice(page * size, page * size + size);
    const commands: string[] = [];
    const text = (x: number, y: number, font: 1 | 2, px: number, value: string) => commands.push(`BT /F${font} ${px} Tf 1 0 0 1 ${x} ${y} Tm (${latin(value)}) Tj ET`);
    text(36, 560, 2, 14, "Lucky Cable Network");
    text(36, 542, 1, 10, clip(`Subscriber report ${report.period} · ${report.filename}`, 90));
    text(690, 560, 1, 9, `Page ${page + 1} of ${pages}`);
    text(36, 524, 1, 8, "Weekly counts are printed as recorded. Blanks stay blank, zeroes stay zero, and no totals are calculated.");
    const headers = ["Row", "Customer", "Contract", "State", "Type", "Channel", "7th", "14th", "21st", "28th", "Month"];
    const xs = [36, 72, 150, 214, 258, 340, 560, 612, 664, 716, 768];
    headers.forEach((header, index) => text(xs[index], 498, 2, 8, header));
    rows.forEach((entry, index) => {
      const y = 480 - index * 16;
      const values = [String(entry.sourceRowNumber), entry.customerNumber, entry.contractNumber ?? "-", entry.state ?? "-", entry.subscriptionType ?? "-", entry.channelName ?? "-", ...keys.map(key => countText(entry, key)), entry.monthYear ?? "-"];
      values.forEach((value, column) => text(xs[column], y, 1, 8, clip(value, column === 5 ? 26 : 14)));
    });
    if (page === pages - 1) text(36, 40, 1, 8, clip(`* cached formula result, not recalculated. ${report.warnings?.join(" ") ?? ""}`.trim(), 150));
    return commands.join("\n");
  });
  return assemblePdf(streams);
}

function assemblePdf(streams: string[]) {
  const pieces: { id: number; body: string }[] = [{ id: 1, body: "<< /Type /Catalog /Pages 2 0 R >>" }];
  const kids: number[] = [];
  let id = 3;
  for (const stream of streams) {
    const contentId = id++;
    const pageId = id++;
    kids.push(pageId);
    pieces.push({ id: contentId, body: `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream` });
    pieces.push({ id: pageId, body: `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >> /Contents ${contentId} 0 R >>` });
  }
  pieces.push({ id: 2, body: `<< /Type /Pages /Count ${streams.length} /Kids [${kids.map(kid => `${kid} 0 R`).join(" ")}] >>` });
  pieces.sort((left, right) => left.id - right.id);
  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (const piece of pieces) {
    offsets[piece.id] = Buffer.byteLength(body, "latin1");
    body += `${piece.id} 0 obj\n${piece.body}\nendobj\n`;
  }
  const start = Buffer.byteLength(body, "latin1");
  body += `xref\n0 ${pieces.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= pieces.length; index += 1) body += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  body += `trailer\n<< /Size ${pieces.length + 1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return Buffer.from(body, "latin1");
}
