const SAFE_MSR_DOCUMENT_BYTES = 12 * 1024 * 1024;
export function withinMsrDocumentBudget(sourceBytes: number, entries: unknown[]) {
  return sourceBytes + Buffer.byteLength(JSON.stringify(entries), "utf8") <= SAFE_MSR_DOCUMENT_BYTES;
}
