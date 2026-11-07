"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

type Submission = { state: "idle" | "sending" | "success" | "error"; message?: string; reference?: string };

export function EnquiryForm({ planLabel }: { planLabel?: string }) {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<Submission>({ state: "idle" });
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    const payload = { name: String(data.get("name") ?? "").trim(), email: String(data.get("email") ?? "").trim(), interest: String(data.get("interest") ?? ""), message: String(data.get("message") ?? "").trim(), planLabel: planLabel ?? "", website: String(data.get("website") ?? "") };
    const next: Record<string, string> = {};
    if (payload.name.length < 2) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) next.email = "Enter a valid email address.";
    if (payload.message.length < 10) next.message = "Add a little more detail (at least 10 characters).";
    setErrors(next); setSubmission({ state: "idle" });
    if (Object.keys(next).length) { form.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus(); return; }
    setSubmission({ state: "sending" });
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not save your enquiry.");
      setSubmission({ state: "success", reference: result.reference, message: "Your enquiry has been received by Lucky Cable." });
      formElement.reset();
    } catch (cause) { setSubmission({ state: "error", message: cause instanceof Error ? cause.message : "We could not save your enquiry. Please call or email us directly." }); }
  }
  return <form ref={form} onSubmit={submit} noValidate className="contact-form">
    {planLabel && <p className="notice">Enquiring about: {planLabel}</p>}
    <div className="enquiry-honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <div className="form-field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" maxLength={100} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</div>
    <div className="form-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" spellCheck={false} maxLength={254} required aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</div>
    <div className="form-field"><label htmlFor="interest">I’m interested in</label><select id="interest" name="interest" defaultValue={planLabel ? "Broadband" : "Cable TV"}><option>Cable TV</option><option>Broadband</option><option>Package information</option><option>Something else</option></select></div>
    <div className="form-field"><label htmlFor="message">What would you like to know?</label><textarea defaultValue={planLabel ? `Please share the current terms and availability for ${planLabel}.` : undefined} id="message" name="message" maxLength={2000} required aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</div>
    <button type="submit" className="button button-dark" disabled={submission.state === "sending"}>{submission.state === "sending" ? "Sending enquiry…" : <>Send enquiry <ArrowUpRight size={17} aria-hidden="true" /></>}</button>
    <div aria-live="polite" role="status">{submission.state === "success" && <div className="draft-result"><p><CheckCircle2 size={18} aria-hidden="true" /> {submission.message}</p>{submission.reference && <p>Reference: <strong>{submission.reference}</strong></p>}<p>The team can review it in the private management portal. Email forwarding to luckycablenetwork1@gmail.com will activate after mail credentials are configured.</p></div>}</div>
    {submission.state === "error" && <p role="alert" className="field-error enquiry-error">{submission.message}</p>}
  </form>;
}