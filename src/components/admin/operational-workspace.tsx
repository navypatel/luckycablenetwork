"use client";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { AdminResource } from "@/lib/admin/permissions";
import { fieldsFor, recordConfigs } from "./record-config";
import { RecordField, display, label } from "./record-field";

export function OperationalWorkspace({ resource, canCreate }: { resource: AdminResource; canCreate: boolean }) {
  const config = recordConfigs[resource]; const [kind, setKind] = useState("records");
  const [records, setRecords] = useState<Record<string, any>[]>([]); const [lookups, setLookups] = useState<Record<string, any[]>>({});
  const [page, setPage] = useState(1); const [total, setTotal] = useState(0); const [q, setQ] = useState("");
  const [error, setError] = useState(""); const [notice, setNotice] = useState(""); const [busy, setBusy] = useState(false);
  const fields = useMemo(() => fieldsFor(resource, kind), [resource, kind]);
  const load = useCallback(async () => { try { const response = await fetch(`/api/admin/${resource}?kind=${kind}&page=${page}&q=${encodeURIComponent(q)}`, { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setRecords(data.records); setTotal(data.total); setError(""); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load records."); } }, [resource, kind, page, q]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { const urls = [...new Set(fields.map(field => field.lookup).filter(Boolean))] as string[]; void Promise.all(urls.map(async url => { const response = await fetch(url, { cache: "no-store" }); if (response.ok) { const data = await response.json(); setLookups(current => ({ ...current, [url]: data.records })); } })); }, [fields]);
  if (!config) return null;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice(""); const form = new FormData(event.currentTarget); const payload: Record<string, unknown> = {};
    for (const field of fields) { const value = String(form.get(field.name) ?? ""); payload[field.name] = ["pricePaise", "amountPaise", "termMonths", "speedMbps"].includes(field.name) ? value ? Math.round(Number(value) * (field.name.endsWith("Paise") ? 100 : 1)) : undefined : value; }
    try { const response = await fetch(`/api/admin/${resource}?kind=${kind}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const data = await response.json(); if (!response.ok) throw new Error([data.error, ...(data.details ?? [])].join(" ")); setNotice("Record saved and added to the audit log."); event.currentTarget.reset(); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save record."); } finally { setBusy(false); }
  }
  const columns = records.length ? Object.keys(records[0]).filter(key => !["id", "_id", "__v", "createdBy", "updatedBy"].includes(key)).slice(0, 7) : [];
  return <><div className="admin-heading"><div><h1>{config.title}</h1><p>{config.help}</p></div></div>
    {config.kinds && <div className="staff-tabs">{Object.entries(config.kinds).map(([value, text]) => <button type="button" className={kind === value ? "active" : ""} key={value} onClick={() => { setKind(value); setPage(1); }}>{text}</button>)}</div>}
    {canCreate && fields.length > 0 && <section className="workspace-panel"><h2>Add {config.kinds?.[kind]?.toLowerCase() ?? "record"}</h2><form className="record-form" onSubmit={submit}>{fields.map(field => <RecordField key={field.name} field={field} records={field.lookup ? lookups[field.lookup] ?? [] : []} />)}<button className="button button-dark" disabled={busy}>{busy ? "Saving…" : "Save record"}</button></form></section>}
    {error && <p role="alert" className="staff-message">{error}</p>}{notice && <p role="status" className="staff-message">{notice}</p>}
    <section className="workspace-panel"><div className="record-toolbar"><h2>Saved records</h2><input aria-label="Search records" placeholder="Search…" value={q} onChange={event => { setQ(event.target.value); setPage(1); }} /></div>{records.length === 0 ? <p>No records yet.</p> : <div className="staff-table-wrap"><table className="staff-table"><thead><tr>{columns.map(column => <th key={column}>{label(column)}</th>)}</tr></thead><tbody>{records.map(record => <tr key={record.id}>{columns.map(column => <td key={column}>{display(record[column])}</td>)}</tr>)}</tbody></table></div>}<div className="staff-pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} · {total} records</span><button disabled={page * 20 >= total} onClick={() => setPage(page + 1)}>Next</button></div></section>
  </>;
}
