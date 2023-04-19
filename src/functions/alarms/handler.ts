import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { fetchAlarms } from "./fetch-alarms";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await fetchAlarms(yesterday);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Fetched alarms",
    }),
  };
};
