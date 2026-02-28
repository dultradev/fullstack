import { Locale } from "@/lib/types";

export const LOCALES: Locale[] = ["pt-BR", "en"];

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string): Locale {
  return isValidLocale(value) ? value : "pt-BR";
}
