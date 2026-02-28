export type Locale = "pt-BR" | "en";

export interface ProfileConfig {
  name: string;
  title: Record<Locale, string>;
  education: Record<Locale, string>;
  heroQuote: Record<Locale, string>;
  location?: string;
  links: {
    linkedin: string;
    github: string;
    email: string;
  };
}

export interface ExperienceItem {
  id: string;
  role: string;
  org: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
}

export interface LeadershipItem {
  id: string;
  title: string;
  org: string;
  startDate: string;
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  problem: string;
  solution: string;
  tech: string[];
  impact: string;
  link: string;
  visibilityNote?: string;
}

export interface LocaleContent {
  nav: {
    about: string;
    experience: string;
    leadership: string;
    projects: string;
    ambitions: string;
    contact: string;
  };
  hero: {
    subtitle: string;
    ctaProjects: string;
    ctaContact: string;
  };
  sectionTitles: {
    about: string;
    experience: string;
    leadership: string;
    projects: string;
    ambitions: string;
    contact: string;
  };
  aboutMarkdown: string;
  ambitionsMarkdown: string;
  experiences: ExperienceItem[];
  leadership: LeadershipItem[];
  projects: ProjectItem[];
  contact: {
    intro: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
  };
}
