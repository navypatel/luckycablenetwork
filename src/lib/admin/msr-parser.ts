import { createHash } from "node:crypto";
import JSZip from "jszip";
import { cellValue, columnIndex, sharedStrings, tagAttributes } from "./msr-xml";
import { readMsrEntries } from "./msr-rows";
import { MSR_HEADERS, type MsrParseResult } from "./msr-types";
export { MSR_HEADERS } from "./msr-types";

function blank(sha256: string, errors: string[], warnings: string[] = [], extra: Partial<MsrParseResult> = {}): MsrParseResult {
  return { sha256, sheetName: "", sheetNames: [], headersOk: false, entries: [], warnings, errors, hasMacros: false, ...extra };
}

export async function parseMsrWorkbook(bytes: Buffer, preferredSheet?: string): Promise<MsrParseResult> {
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (bytes.length > 8 * 1024 * 1024) return blank(sha256, ["Workbook exceeds the 8 MB upload limit."]);
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) return blank(sha256, ["File is not an Excel workbook."]);
  let zip: JSZip;
  try { zip = await JSZip.loadAsync(bytes); } catch { return blank(sha256, ["Workbook could not be opened."]); }
  const xmlEntries = Object.values(zip.files).filter(entry => !entry.dir && /^(?:xl\/|\[Content_Types\]\.xml)/i.test(entry.name));
  const expandedSize = (entry: JSZip.JSZipObject) => (entry as unknown as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize ?? 0;
  const expandedBytes = xmlEntries.reduce((sum, entry) => sum + expandedSize(entry), 0);
  if (expandedBytes > 16 * 1024 * 1024 || xmlEntries.some(entry => expandedSize(entry) > 12 * 1024 * 1024)) return blank(sha256, ["Expanded workbook content exceeds the safety budget."]);
  const hasMacros = zip.file(/vbaProject\.bin/i).length > 0;
  const warnings: string[] = [];
  const errors: string[] = [];
  if (hasMacros) errors.push("Macro-enabled workbooks are rejected.");
  if (zip.file("xl/calcChain.xml")) warnings.push("Workbook contains a calculation chain. Formulas were not executed.");
  const workbookXml = await zip.file("xl/workbook.xml")?.async("string");
  const relsXml = await zip.file("xl/_rels/workbook.xml.rels")?.async("string");
  if (!workbookXml || !relsXml) return blank(sha256, ["Workbook structure is incomplete.", ...errors], warnings, { hasMacros });
  const sheets = [...workbookXml.matchAll(/<sheet\b[^>]*\/>/g)].map(match => tagAttributes(match[0]));
  const rels = [...relsXml.matchAll(/<Relationship\b[^>]*\/>/g)].map(match => tagAttributes(match[0]));
  const sheetNames = sheets.map(sheet => sheet.name).filter(Boolean);
  const selected = sheets.find(sheet => sheet.name === preferredSheet) ?? (preferredSheet ? undefined : sheets.length === 1 ? sheets[0] : undefined);
  if (!selected) return blank(sha256, [`Choose one worksheet. Found: ${sheetNames.join(", ") || "none"}.`, ...errors], warnings, { hasMacros, sheetNames });
  const target = rels.find(rel => rel.Id === selected["r:id"])?.Target;
  const sheetPath = target ? (target.startsWith("/") ? target.slice(1) : `xl/${target.replace(/^\.\//, "")}`) : "";
  const sheetXml = sheetPath ? await zip.file(sheetPath)?.async("string") : undefined;
  if (!sheetXml) return blank(sha256, ["The selected worksheet could not be read.", ...errors], warnings, { hasMacros, sheetNames, sheetName: selected.name });
  if (sheetXml.includes("sheetProtection")) warnings.push("Worksheet protection was detected and left unchanged.");
  if (selected.name !== "SubscriberReport") warnings.push("Worksheet name is not SubscriberReport. Headers were still checked.");
  const strings = sharedStrings(await zip.file("xl/sharedStrings.xml")?.async("string") ?? "");
  const rows = [...sheetXml.matchAll(/<row\b([^>]*)>([\s\S]*?)<\/row>/g)].map(match => {
    const cells = new Map<number, { raw: string | null; formula: string | null }>();
    for (const cell of match[2].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ref = tagAttributes(`<c ${cell[1]}>`).r ?? "";
      const column = columnIndex(ref);
      if (column >= 0) cells.set(column, cellValue(cell[1], cell[2], strings));
    }
    return { row: Number(tagAttributes(`<row ${match[1]}>`).r), cells };
  });
  const header = rows.find(row => row.row === 1);
  const headersOk = MSR_HEADERS.every((expected, index) => header?.cells.get(index)?.raw === expected);
  if (!headersOk) errors.push("The worksheet header does not match the approved SubscriberReport columns.");
  const entries = headersOk && !hasMacros ? readMsrEntries(rows) : [];
  if (entries.some(entry => entry.issues.some(issue => issue.level === "error"))) errors.push("One or more cells need review before this import can be confirmed.");
  return { sha256, sheetName: selected.name, sheetNames, headersOk: headersOk && !hasMacros, entries, warnings, errors, hasMacros };
}
