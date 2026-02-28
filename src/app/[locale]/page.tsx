import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/sections/contact";
import { ExperienceSection } from "@/components/sections/experience";
import { HeroSection } from "@/components/sections/hero";
import { LeadershipSection } from "@/components/sections/leadership";
import { HeaderNav } from "@/components/sections/nav";
import { ProjectsSection } from "@/components/sections/projects";
import { RichTextSection } from "@/components/sections/rich-text";
import { getLocaleContent, getProfileConfig } from "@/lib/content";
import { isValidLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isValidLocale(params.locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const profile = await getProfileConfig();
  const title = `${profile.name} | ${profile.title[locale]}`;

  return {
    title,
    description: profile.heroQuote[locale],
    openGraph: {
      title,
      description: profile.heroQuote[locale]
    }
  };
}

export default async function LocaleHome({
  params
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const [profile, content] = await Promise.all([getProfileConfig(), getLocaleContent(locale)]);

  return (
    <>
      <HeaderNav locale={locale} labels={content.nav} />
      <main>
        <HeroSection
          locale={locale}
          profile={profile}
          subtitle={content.hero.subtitle}
          ctaProjects={content.hero.ctaProjects}
          ctaContact={content.hero.ctaContact}
        />
        <RichTextSection id="about" title={content.sectionTitles.about} markdown={content.aboutMarkdown} />
        <ExperienceSection id="experience" title={content.sectionTitles.experience} locale={locale} items={content.experiences} />
        <LeadershipSection id="leadership" title={content.sectionTitles.leadership} locale={locale} items={content.leadership} />
        <ProjectsSection id="projects" title={content.sectionTitles.projects} items={content.projects} locale={locale} />
        <RichTextSection id="ambitions" title={content.sectionTitles.ambitions} markdown={content.ambitionsMarkdown} />
        <ContactSection
          locale={locale}
          profile={profile}
          title={content.sectionTitles.contact}
          intro={content.contact.intro}
          labels={content.contact}
        />
      </main>
    </>
  );
}
