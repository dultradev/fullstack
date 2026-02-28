export function formatMonthYear(value: string, locale: string): string {
  const [year, month] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(date);
}
