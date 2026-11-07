export const MSR_HEADERS = ["Customer Nbr", "Contract Nbr", "State", "Bouquet/Alacarte/Add on", "Bouquet/Alacarte Channel Name", "Count on 7th day", "Count on 14th day", "Count on 21st day", "Count on 28th day", "Month Year"] as const;
export type CountKey = "day7" | "day14" | "day21" | "day28";
export type MsrIssue = { level: "error" | "warning"; column: string; message: string };
export type MsrEntry = {
  sourceRowNumber: number; customerNumber: string; contractNumber: string | null; state: string | null;
  subscriptionType: string | null; channelName: string | null; monthYear: string | null;
  weeklyCounts: Record<CountKey, number | null>; formulas: Partial<Record<CountKey, string>>;
  issues: MsrIssue[]; duplicateCandidate: boolean;
};
export type MsrParseResult = { sha256: string; sheetName: string; sheetNames: string[]; headersOk: boolean; entries: MsrEntry[]; warnings: string[]; errors: string[]; hasMacros: boolean };
