import parse, { HTMLElement } from "node-html-parser";

export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function dateBefore(date: Date, before: Date): boolean {
  return normalizeDate(date) < normalizeDate(before);
}

export function dateAfter(date: Date, after: Date): boolean {
  return normalizeDate(date) > normalizeDate(after);
}

export async function fetchPageHtml(url: string): Promise<HTMLElement> {
  const raw = await (await fetch(url)).text();
  return parse(raw);
}

export function stringifyDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
