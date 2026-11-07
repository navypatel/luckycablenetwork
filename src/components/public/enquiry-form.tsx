"use client";

import { useState, useRef } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { company } from "@/lib/company";

export function EnquiryForm({ planLabel }: { planLabel?: string }) {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");
  function prepare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Record<string, string> = {};
    if (name.length < 2) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (message.length < 10) next.message = "Add a little more detail (at least 10 characters).";
    setErrors(next);
    setDraft("");
    if (Object.keys(next).length) { form.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus(); return; }
    setDraft(`Lucky Cable Daman — enquiry draft\nNot submitted or delivered.\n\nName: ${name}\nEmail: ${email}\nInterest: ${data.get("interest")}\n\n${message}`);
  }
  function download() {
    const url = URL.createObjectURL(new Blob([draft], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "lucky-cable-enquiry.txt"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <form ref={form} onSubmit={prepare} noValidate className="contact-form" onChange={() => setDraft("")}>
    {planLabel && <p className="notice">Enquiring about: {planLabel}</p>}
    <div className="form-field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" maxLength={100} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</div>
    <div className="form-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" spellCheck={false} maxLength={254} required aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</div>
    <div className="form-field"><label htmlFor="interest">I’m interested in</label><select id="interest" name="interest" defaultValue={planLabel ? "Broadband" : "Cable TV"}><option>Cable TV</option><option>Broadband</option><option>Package information</option><option>Something else</option></select></div>
    <div className="form-field"><label htmlFor="message">What would you like to know?</label><textarea defaultValue={planLabel ? `Please share the current terms and availability for ${planLabel}.` : undefined} id="message" name="message" maxLength={2000} required aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</div>
    <button type="submit" className="button button-dark">Prepare enquiry <ArrowUpRight size={17} aria-hidden="true" /></button>
    <div aria-live="polite" role="status">{draft && <div className="draft-result"><p>Your draft is ready. It has not been sent.</p><p>Download a copy, or open your email app to review and send it yourself.</p><button type="button" className="button button-outline" onClick={download}>Download enquiry draft <Download size={16} aria-hidden="true" /></button><a className="text-link draft-email" href={`mailto:${company.email}?subject=${encodeURIComponent("Lucky Cable service enquiry")}&body=${encodeURIComponent(draft)}`}>Open in email app <ArrowUpRight size={16} aria-hidden="true" /></a></div>}</div>
  </form>;
}