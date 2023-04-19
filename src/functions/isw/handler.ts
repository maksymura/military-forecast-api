import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { processTfIdf } from "./process-isw";
import { saveIswArticles } from "./parse-isw";
import { getObjectStream } from "../../external-api/s3/api";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1)
  const newDocsCount = await saveIswArticles(yesterday, yesterday);
  
  if(newDocsCount) {
    console.log('Found', newDocsCount, 'new docs, recalculating tf-idf');
    await processTfIdf();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: newDocsCount ? 'Updated tf-idf' : 'No new docs were published',
    }),
  };
};
