"use client";

import { FormEvent, useState } from "react";
import type { Locale, ProfileConfig } from "@/lib/types";

export function ContactSection({
  locale,
  profile,
  title,
  intro,
  labels
}: Readonly<{
  locale: Locale;
  profile: ProfileConfig;
  title: string;
  intro: string;
  labels: {
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
  };
}>) {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "loading">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          locale,
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          message: String(formData.get("message") ?? "")
        })
      });

      if (response.ok) {
        setStatus("ok");
        event.currentTarget.reset();
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container contact-grid">
        <div>
          <h2>{title}</h2>
          <p>{intro}</p>
          <ul className="social-links">
            <li>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.links.email}`}>{profile.links.email}</a>
            </li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="contact-form">
          <label>
            {labels.nameLabel}
            <input name="name" type="text" required maxLength={120} />
          </label>
          <label>
            {labels.emailLabel}
            <input name="email" type="email" required maxLength={200} />
          </label>
          <label>
            {labels.messageLabel}
            <textarea name="message" rows={5} required maxLength={2000} />
          </label>
          <button className="button primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "..." : labels.submitLabel}
          </button>
          {status === "ok" ? <p className="ok">{labels.successMessage}</p> : null}
          {status === "error" ? <p className="error">{labels.errorMessage}</p> : null}
        </form>
      </div>
    </section>
  );
}
