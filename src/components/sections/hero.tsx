import Image from "next/image";
import Link from "next/link";
import type { Locale, ProfileConfig } from "@/lib/types";
import { Reveal } from "@/components/motion/reveal";

export function HeroSection({
  locale,
  profile,
  subtitle,
  ctaProjects,
  ctaContact
}: Readonly<{
  locale: Locale;
  profile: ProfileConfig;
  subtitle: string;
  ctaProjects: string;
  ctaContact: string;
}>) {
  return (
    <section className="hero" id="top">
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="container hero-grid">
        <Reveal>
          <p className="eyebrow">{profile.title[locale]}</p>
          <h1>{profile.name}</h1>
          <p className="lead">{subtitle}</p>
          <p className="quote">“{profile.heroQuote[locale]}”</p>
          <div className="hero-cta">
            <Link className="button primary" href="#projects">
              {ctaProjects}
            </Link>
            <Link className="button ghost" href="#contact">
              {ctaContact}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="hero-image-wrap">
          <Image
            src="/images/fotodultradev.png"
            alt={profile.name}
            width={520}
            height={660}
            priority
            className="hero-image"
          />
        </Reveal>
      </div>
    </section>
  );
}
