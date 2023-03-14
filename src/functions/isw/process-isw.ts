import { TfIdf, TfIdfTerm } from "natural";
import * as fs from "fs";
import { join } from "path";
import { dateAfter, dateBefore } from "./util";
import { RESULTS_PATH } from "./constants";

export function calcTfIdf(docsPath: string, fromDate: Date, toDate: Date) {
  const tfIdf = new TfIdf();

  const files = fs.readdirSync(docsPath);

  let docsCount = 0;
  const datesByIndex: string[] = [];

  for (const fileName of files) {
    const dateStr = fileName.substring(0, fileName.indexOf("."));
    const date = new Date(dateStr);

    if (dateBefore(date, fromDate) || dateAfter(date, toDate)) {
      continue;
    }

    console.log("Reading document", fileName);

    const doc = JSON.parse(
      fs.readFileSync(join(docsPath, fileName)).toString()
    ).words;

    tfIdf.addDocument(doc);

    ++docsCount;
    datesByIndex.push(dateStr);
  }

  if (!fs.existsSync(RESULTS_PATH)) {
    fs.mkdirSync(RESULTS_PATH);
  }

  for (let i = 0; i < docsCount; ++i) {
    const formatted = tfIdf.listTerms(i).reduce<Record<string, Omit<TfIdfTerm, 'term'>>>((acc, {term, ...data}) => {
        acc[term] = data;
        return acc;
    }, {})

    fs.writeFileSync(
      join(RESULTS_PATH, `${datesByIndex[i]}.json`),
      JSON.stringify({ date: datesByIndex[i], tfIdf: formatted}, null, 2)
    );
  }
}
