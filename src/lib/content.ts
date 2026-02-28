import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale, LocaleContent, ProfileConfig } from "@/lib/types";

const ROOT = process.cwd();

async function readTextFile(filePath: string) {
  return fs.readFile(filePath, "utf8");
}

export async function getProfileConfig(): Promise<ProfileConfig> {
  const filePath = path.join(ROOT, "src", "content", "site.config.json");
  const raw = await readTextFile(filePath);
  return JSON.parse(raw) as ProfileConfig;
}

export async function getLocaleContent(locale: Locale): Promise<LocaleContent> {
  const contentPath = path.join(ROOT, "src", "content", locale, "content.json");
  const aboutPath = path.join(ROOT, "src", "content", locale, "about.md");
  const ambitionsPath = path.join(ROOT, "src", "content", locale, "ambitions.md");

  const [rawJson, aboutMarkdown, ambitionsMarkdown] = await Promise.all([
    readTextFile(contentPath),
    readTextFile(aboutPath),
    readTextFile(ambitionsPath)
  ]);

  const parsed = JSON.parse(rawJson) as Omit<LocaleContent, "aboutMarkdown" | "ambitionsMarkdown">;
  return {
    ...parsed,
    aboutMarkdown,
    ambitionsMarkdown
  };
}
