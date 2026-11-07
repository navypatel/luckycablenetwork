/** Source: user-supplied, reference-only price.jpeg. These are term totals, not monthly rates. */
export const broadbandPackages = [
  { speedMbps: 200, months: 12, priceInr: 9799 },
  { speedMbps: 100, months: 12, priceInr: 5999 },
  { speedMbps: 50, months: 12, priceInr: 4999 },
  { speedMbps: 100, months: 6, priceInr: 4000 },
  { speedMbps: 50, months: 6, priceInr: 3499 }
] as const;
export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}