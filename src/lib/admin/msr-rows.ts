import { MSR_HEADERS, type MsrEntry, type MsrIssue } from "./msr-types";

const COUNT_KEYS = ["day7", "day14", "day21", "day28"] as const;
const COUNT_COLUMNS = ["Count on 7th day", "Count on 14th day", "Count on 21st day", "Count on 28th day"];
type Cell = { raw: string | null; formula: string | null };
type Row = { row: number; cells: Map<number, Cell> };

export function readMsrEntries(rows: Row[]) {
  const entries: MsrEntry[] = [];
  for (const row of rows.filter(item => item.row > 1)) {
    const textAt = (index: number) => { const raw = row.cells.get(index)?.raw; return raw == null || raw === "" ? null : raw; };
    if (!MSR_HEADERS.some((_, index) => textAt(index) != null)) continue;
    const issues: MsrIssue[] = [];
    const formulas: MsrEntry["formulas"] = {};
    const weeklyCounts: MsrEntry["weeklyCounts"] = { day7: null, day14: null, day21: null, day28: null };
    COUNT_KEYS.forEach((key, index) => {
      const cell = row.cells.get(index + 5);
      if (cell?.formula) { formulas[key] = cell.formula; issues.push({ level: "warning", column: COUNT_COLUMNS[index], message: "Formula cell stored from its cached value and was not recalculated." }); }
      const raw = cell?.raw;
      if (raw == null || raw === "") weeklyCounts[key] = null;
      else if (!/^-?\d+(?:\.\d+)?$/.test(raw)) { weeklyCounts[key] = null; issues.push({ level: "error", column: COUNT_COLUMNS[index], message: "Weekly count is not a blank or a plain number." }); }
      else weeklyCounts[key] = Number(raw);
    });
    const customerNumber = textAt(0) ?? "";
    if (!customerNumber) issues.push({ level: "error", column: "Customer Nbr", message: "Customer Nbr is blank." });
    entries.push({ sourceRowNumber: row.row, customerNumber, contractNumber: textAt(1), state: textAt(2), subscriptionType: textAt(3), channelName: textAt(4), weeklyCounts, monthYear: textAt(9), formulas, issues, duplicateCandidate: false });
  }
  const seen = new Map<string, number>();
  const identity = (entry: MsrEntry) => [entry.customerNumber, entry.contractNumber, entry.subscriptionType, entry.channelName].join("\u0000");
  for (const entry of entries) seen.set(identity(entry), (seen.get(identity(entry)) ?? 0) + 1);
  for (const entry of entries) if ((seen.get(identity(entry)) ?? 0) > 1) { entry.duplicateCandidate = true; entry.issues.push({ level: "warning", column: "Customer Nbr", message: "Possible duplicate row. It was kept for review and not deleted." }); }
  return entries;
}
