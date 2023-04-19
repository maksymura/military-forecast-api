import { TfIdf, TfIdfTerm } from "natural";
import {
  getObjectPromise,
  listObjects,
  putJSONObject,
} from "../../external-api/s3/api";

export async function processTfIdf() {
  const docsPrefix = "isw/docs";
  const stream = await listObjects(docsPrefix);

  if (!stream.Contents) {
    return;
  }

  const tfIdf = new TfIdf();

  let docsCount = 0;
  const datesByIndex: string[] = [];

  for (const obj of stream.Contents) {
    const key = obj.Key as string;

    console.log(key);
    const file = JSON.parse(
      (await getObjectPromise(key)).Body?.toString() as string
    );

    const dateStr: string = file.date;
    console.log("Retrieved file with date:", dateStr);

    const doc: string[] = file.words;
    tfIdf.addDocument(doc);

    ++docsCount;
    datesByIndex.push(dateStr);
  }

  for (let i = 0; i < docsCount; ++i) {
    const formatted = tfIdf
      .listTerms(i)
      .reduce<Record<string, Omit<TfIdfTerm, "term">>>(
        (acc, { term, ...data }) => {
          acc[term] = data;
          return acc;
        },
        {}
      );
    const key = `isw/tfidf/${datesByIndex[i]}.json`;
    await putJSONObject(
      key,
      JSON.stringify({ date: datesByIndex[i], tfIdf: formatted })
    );
  }
}
