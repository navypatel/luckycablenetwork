import type { Field } from "./record-config";
const caption = (record: Record<string, any>) => record.name ?? record.customerNumber ?? record.invoiceNumber ?? record.code ?? record.reference ?? record.id;
export function RecordField({ field, records }: { field: Field; records: Record<string, any>[] }) {
  if (field.lookup) return <label>{field.label}<select name={field.name} required={field.required} defaultValue=""><option value="">Select…</option>{records.map(record => <option key={record.id} value={record.id}>{caption(record)}</option>)}</select></label>;
  if (field.options) return <label>{field.label}<select name={field.name} required={field.required} defaultValue={field.options[0]}>{field.options.map(option => <option key={option}>{option}</option>)}</select></label>;
  return <label>{field.label}{field.name === "notes" || field.name === "description" || field.name === "value" ? <textarea name={field.name} required={field.required} /> : <input name={field.name} type={field.type ?? "text"} required={field.required} step={field.type === "number" ? "0.01" : undefined} />}</label>;
}
export const label = (value: string) => value.replace(/([A-Z])/g, " $1").replace(/^./, character => character.toUpperCase());
export const display = (value: unknown) => value === null || value === undefined || value === "" ? "—" : typeof value === "boolean" ? value ? "Yes" : "No" : value instanceof Object ? String(value) : String(value);
