export type ApiFail = { error: string; status: number };
export const fail = (error: string, status: number): ApiFail => ({ error, status });
export const isFail = (value: unknown): value is ApiFail => Boolean(value && typeof value === "object" && "error" in value && "status" in value);

export const clean = (value: unknown, max: number) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
export const multiline = (value: unknown, max: number) => String(value ?? "").replace(/\r/g, "").trim().slice(0, max);
export const objectId = (value: unknown) => typeof value === "string" && /^[a-f\d]{24}$/i.test(value) ? value : "";
export const day = (value: unknown) => /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? "")) ? String(value) : "";
export const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function rupeesToPaise(value: unknown) {
  const text = String(value ?? "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null;
  const [whole, fraction = ""] = text.split(".");
  const paise = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(paise) && paise > 0 && paise <= 100_000_000_00 ? paise : null;
}

export function formatRupees(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);
}

export function paging(url: URL) {
  const page = Math.min(10000, Math.max(1, Number(url.searchParams.get("page")) || 1));
  const q = clean(url.searchParams.get("q"), 80);
  return { page, q, skip: (page - 1) * 20, limit: 20 };
}
