"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type Report = { id: string; period: string; filename: string; status: string; entries: number };
type Entry = { sourceRowNumber: number; customerNumber: string; contractNumber: string | null; state: string | null; subscriptionType: string | null; channelName: string | null; weeklyCounts: Record<string, number | null>; monthYear: string | null; issues: { column: string; message: string }[]; duplicateCandidate: boolean };
type Detail = { id: string; period: string; filename: string; status: string; entries: Entry[]; warnings: string[] };

export function MsrWorkspace() {
  const [reports, setReports] = useState<Report[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const refresh = useCallback(async () => {
    try { const response = await fetch(`/api/admin/msr?page=${page}`, { cache: "no-store" }); if (!response.ok) throw new Error(); const data = await response.json(); setReports(data.records); setTotal(data.total); setError(""); } catch { setError("Could not load reports."); } finally { setLoading(false); }
  }, [page]);
  useEffect(() => { void refresh(); }, [refresh]);
  async function open(id: string) { setError(""); try { const response = await fetch(`/api/admin/msr/${id}`, { cache: "no-store" }); if (!response.ok) throw new Error(); setDetail(await response.json()); } catch { setError("Could not load this report."); } }
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    const form = new FormData(event.currentTarget);
    try { const response = await fetch("/api/admin/msr", { method: "POST", body: form }); const data = await response.json(); if (!response.ok) { setError([data.error, ...(data.details ?? [])].join(" ")); return; } setNotice("Workbook staged. Review its rows and warnings before confirming."); await refresh(); await open(data.id); } catch { setError("Upload failed. Try again."); } finally { setBusy(false); }
  }
  async function commit() {
    if (!detail || !confirm(`Import ${detail.entries.length} rows from ${detail.filename} for ${detail.period}? This does not approve or overwrite a report.`)) return;
    setBusy(true); setError("");
    try { const response = await fetch(`/api/admin/msr/${detail.id}/commit`, { method: "POST" }); const data = await response.json(); if (!response.ok) { setError(data.error); return; } setNotice("Import recorded; approval remains pending business policy."); await refresh(); await open(detail.id); } catch { setError("Could not confirm import."); } finally { setBusy(false); }
  }
  return <><div className="admin-heading"><div><h1>MSR Management</h1><p>Stage, inspect and explicitly import monthly workbooks. Weekly counts are preserved without interpretation.</p></div></div>
    <section className="workspace-panel"><h2>Stage a workbook</h2><p>Original .xlsx only · 3.5 MB maximum on Vercel · stored privately in MongoDB.</p><form className="staff-upload" onSubmit={upload}><label>Reporting month<input name="period" type="month" required /></label><label>Workbook<input name="file" type="file" accept=".xlsx" required /></label><label>Worksheet (optional)<input name="worksheet" placeholder="SubscriberReport" /></label><button className="button button-dark" disabled={busy}>Inspect & stage</button></form></section>
    {error && <p className="staff-message" role="alert">{error}</p>}{notice && <p className="staff-message" role="status">{notice}</p>}
    <section className="workspace-panel"><h2>History</h2>{loading ? <p>Loading reports…</p> : reports.length === 0 ? <p>No staged or imported reports yet.</p> : <div className="staff-table-wrap"><table className="staff-table"><thead><tr><th>Period</th><th>Workbook</th><th>Rows</th><th>State</th><th>Action</th></tr></thead><tbody>{reports.map(report => <tr key={report.id}><td>{report.period}</td><td>{report.filename}</td><td>{report.entries}</td><td>{report.status}</td><td><button onClick={() => open(report.id)}>Review</button> <a href={`/api/admin/msr/${report.id}/excel`}>Excel</a> <a href={`/api/admin/msr/${report.id}/pdf`}>PDF</a></td></tr>)}</tbody></table></div>}<div className="staff-pagination"><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} · {total} reports</span><button disabled={page * 20 >= total} onClick={() => setPage(page + 1)}>Next</button></div></section>
    {detail && <section className="workspace-panel"><h2>Import preview · {detail.period}</h2><p>{detail.filename} · {detail.entries.length} rows · {detail.status}</p>{detail.warnings.map((warning, index) => <p className="staff-message" key={index}>{warning}</p>)}<p>Possible duplicates: {detail.entries.filter(entry => entry.duplicateCandidate).length}. Formula cells retain cached values; no formulas have been executed. Review before importing.</p><div className="staff-table-wrap"><table className="staff-table"><thead><tr><th>Row</th><th>Customer</th><th>Contract</th><th>State</th><th>Subscription</th><th>Channel</th><th>7th</th><th>14th</th><th>21st</th><th>28th</th><th>Month Year</th><th>Issues</th></tr></thead><tbody>{detail.entries.map(entry => <tr key={entry.sourceRowNumber}><td>{entry.sourceRowNumber}</td><td>{entry.customerNumber}</td><td>{entry.contractNumber ?? "—"}</td><td>{entry.state ?? "—"}</td><td>{entry.subscriptionType ?? "—"}</td><td>{entry.channelName ?? "—"}</td>{["day7", "day14", "day21", "day28"].map(key => <td key={key}>{entry.weeklyCounts[key] ?? "—"}</td>)}<td>{entry.monthYear ?? "—"}</td><td>{entry.issues.map(issue => `${issue.column}: ${issue.message}`).join("; ") || "—"}</td></tr>)}</tbody></table></div>{detail.status === "staged" && <button className="button button-dark" disabled={busy} onClick={commit}>Confirm import</button>}</section>}</>;
}
