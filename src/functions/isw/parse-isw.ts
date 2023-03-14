import { HTMLElement } from "node-html-parser";
import { ParsedPost, ParsePageResult } from "./types";
import { dateAfter, dateBefore, stringifyDate, fetchPageHtml } from "./util";
import * as fs from "fs";
import { join } from "path";
import { PorterStemmer } from "natural";
import { baseUrl, DOCS_PATH, publicationsUrl } from "./constants";

const wordRegex = /^\w+$/;

export async function parseISW(from: Date, to: Date) {
  let shouldContinue = true;
  let page = 0;

  const acc = new DocumentAccumulator();

  do {
    const parsePageResult = await parsePage(from, to, page);

    for (const { date, words } of parsePageResult.parsedPosts) {
      acc.add(date, words);
    }

    shouldContinue = parsePageResult.shouldContinue;

    if (shouldContinue) {
      await new Promise((r) => setTimeout(r, 1000));
    }

    ++page;
  } while (shouldContinue);

  const outPath = DOCS_PATH;

  console.log("Outdir", outPath);

  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }

  for (const [date, words] of acc.docsByDates.entries()) {
    const fileName = `${date}.json`;

    fs.writeFileSync(
      join(outPath, fileName),
      JSON.stringify(
        {
          date,
          words,
        },
        null,
        2
      )
    );
  }
}

async function parsePage(
  from: Date,
  to: Date,
  pageNumber = 0
): Promise<ParsePageResult> {
  const urlWithPageNumber = `${publicationsUrl}&page=${pageNumber}`;

  const html = await fetchPageHtml(urlWithPageNumber);

  const posts = html.querySelectorAll(".field-content");

  const results: Promise<ParsedPost>[] = [];

  let shouldContinue = true;

  for (const post of posts) {
    const date = retrievePostPreviewDate(post);

    if (dateBefore(date, from)) {
      shouldContinue = false;
      break;
    }

    if (!dateAfter(date, to)) {
      const dateStr = stringifyDate(date);

      console.log("Processing:", dateStr);

      results.push(
        Promise.resolve(retrievePostPreviewUrl(post))
          .then((url) => fetchPageHtml(url))
          .then((html) => retrievePostBody(html))
          .then((post) => collectWords(post))
          .then((words) => ({
            date: dateStr,
            words,
          }))
      );
    }
  }

  return {
    shouldContinue,
    parsedPosts: await Promise.all(results),
  };
}

function retrievePostPreviewUrl(postPreview: HTMLElement): string {
  const url = postPreview.querySelector("a")?.getAttribute("href");

  if (!url) {
    throw new Error("Post url not found.");
  }

  return `${baseUrl}${url}`;
}

function retrievePostPreviewDate(postPreview: HTMLElement): Date {
  const datespan = postPreview.querySelector(".datespan");

  if (!datespan) {
    throw new Error("Date not found.");
  }

  const dateStr = datespan.innerText.split("-")[0].trim();

  return new Date(dateStr);
}

function retrievePostBody(postPage: HTMLElement): HTMLElement {
  const body = postPage.querySelector('div[property="content:encoded"]');

  if (!body) {
    throw new Error("Body not found.");
  }

  return body;
}

function parseTextBlock(text: string): string[] {
  return text // text block from HTML tag
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/) // tokenize
    .filter((w) => w.length > 2 && w.length < 50 && wordRegex.test(w)) // pick relevant words
    .map((w) => PorterStemmer.stem(w)); // stem
}

function collectWords(root: HTMLElement, words: string[] = []): string[] {
  if (root.childNodes.length === 0) {
    words.push(...parseTextBlock(root.rawText));
    return words;
  }

  for (const childNode of root.childNodes) {
    if (childNode instanceof HTMLElement) {
      collectWords(childNode, words);
    } else {
      words.push(...parseTextBlock(childNode.rawText));
    }
  }

  return words;
}

class DocumentAccumulator {
  readonly docsByDates: Map<string, string[]>;

  constructor() {
    this.docsByDates = new Map();
  }

  add(key: string, words: string[]) {
    const val = this.docsByDates.get(key);

    if (val) {
      val.push(...words);
    } else {
      this.docsByDates.set(key, words);
    }
  }
}
