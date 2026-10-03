"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

// Formgong: hosted form backend. No API route, Server Action or email code needed.
const ENDPOINT = "https://formgong.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_FORMGONG_ACCESS_KEY ?? "fk_your_access_key"; // public by design
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message: string };

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void } }
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const captcha = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !captcha.current) return;
    const mount = () => {
      if (window.turnstile && captcha.current && !widget.current) {
        widget.current = window.turnstile.render(captcha.current, { sitekey: TURNSTILE_SITE_KEY, language: document.documentElement.lang || "en" });
      }
    };
    if (window.turnstile) return mount();
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = mount;
    document.head.appendChild(script);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;
    const form = event.currentTarget;
    const body = new FormData(form);
    body.set("access_key", ACCESS_KEY);
    body.set("_lang", document.documentElement.lang || "en");
    setStatus({ kind: "sending", message: "Sending…" });
    try {
      const response = await fetch(ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body });
      const result = (await response.json()) as { success: boolean; message?: string };
      if (result.success) {
        form.reset();
        setStatus({ kind: "sent", message: result.message || "Thank you! Your message has been sent." });
      } else {
        setStatus({ kind: "error", message: result.message || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", message: "Network error. Check your connection and try again." });
    } finally {
      if (widget.current) window.turnstile?.reset(widget.current);
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} aria-busy={status.kind === "sending"}>
      <label>Name <input name="name" autoComplete="name" required /></label>
      <label>Email <input type="email" name="email" autoComplete="email" required /></label>
      <label>Message <textarea name="message" rows={5} required /></label>
      {/* Honeypot: hidden from people, filled by bots. Keep it empty. */}
      <div aria-hidden="true" className="hp"><input name="botcheck" tabIndex={-1} autoComplete="off" /></div>
      {TURNSTILE_SITE_KEY ? <div ref={captcha} /> : null}
      <button type="submit" disabled={status.kind === "sending"}>{status.kind === "sending" ? "Sending…" : "Send"}</button>
      <p role="status" className={`status ${status.kind}`}>{status.message}</p>
    </form>
  );
}
