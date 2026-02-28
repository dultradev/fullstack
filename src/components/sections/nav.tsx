import Link from "next/link";
import type { Locale } from "@/lib/types";

export function HeaderNav({
  locale,
  labels
}: Readonly<{
  locale: Locale;
  labels: {
    about: string;
    experience: string;
    leadership: string;
    projects: string;
    ambitions: string;
    contact: string;
  };
}>) {
  const alternate = locale === "pt-BR" ? "en" : "pt-BR";

  return (
    <header className="top-nav">
      <div className="container nav-row">
        <Link href={`/${locale}`} className="brand">
          RD
        </Link>
        <nav aria-label="Primary">
          <a href="#about">{labels.about}</a>
          <a href="#experience">{labels.experience}</a>
          <a href="#leadership">{labels.leadership}</a>
          <a href="#projects">{labels.projects}</a>
          <a href="#ambitions">{labels.ambitions}</a>
          <a href="#contact">{labels.contact}</a>
        </nav>
        <Link href={`/${alternate}`} className="lang-switch" hrefLang={alternate}>
          {alternate.toUpperCase()}
        </Link>
      </div>
    </header>
  );
}
