"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      if (!response.ok) { setError((await response.json()).error ?? "Unable to sign in."); return; }
      router.replace("/admin"); router.refresh();
    } catch { setError("Could not connect. Try again."); } finally { setBusy(false); }
  }
  return <form className="staff-login" onSubmit={submit}><label htmlFor="staff-email">Work email</label><input id="staff-email" name="email" type="email" required autoComplete="username" /><label htmlFor="staff-password">Password</label><input id="staff-password" name="password" type="password" required autoComplete="current-password" /><button className="button button-dark" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>{error && <p role="alert">{error}</p>}</form>;
}
