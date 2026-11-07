import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { modules } from "@/lib/modules";

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const module = modules.find(item => item.slug === slug);
  if (!module) notFound();
  return <><div className="admin-heading"><div><h1>{module.title}</h1><p>{module.description}</p></div><span className="preview-badge">Not connected</span></div><div className="admin-notice"><Info size={17} aria-hidden="true" /><span>Interface preview only. This module does not read, upload, store, or change business records.</span></div><section className="admin-empty"><module.icon size={44} strokeWidth={1.2} aria-hidden="true" /><h2>{module.empty}</h2><p>Once secure access and the required data services are configured, this workspace can support the approved {module.title.toLowerCase()} workflow.</p><Link href="/preview/admin" className="button button-outline"><ArrowLeft size={16} aria-hidden="true" /> Back to workspace</Link></section><div className="module-requirements"><section className="workspace-panel"><h2>Required before activation</h2><p>{module.needs}</p></section><section className="workspace-panel"><h2>{slug === "msr" ? "Source-data safeguards" : "Access & accountability"}</h2><ul>{(slug === "msr" ? ["Keep the original workbook untouched and private.", "Preview and validate every import before explicit commit.", "Preserve identifiers, formulas, and blank versus zero values.", "Do not infer weekly count meanings or silently remove duplicates."] : ["Authenticate every staff session.", "Authorize reads and writes on the server.", "Validate input and audit approved changes."]).map(item => <li key={item}>{item}</li>)}</ul></section></div></>;
}