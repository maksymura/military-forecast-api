import { saveIswArticles } from "../functions/isw/parse-isw";

export async function parseIsw() {
   await saveIswArticles(new Date("2022-02-24"), new Date());
}

parseIsw().catch(console.error)