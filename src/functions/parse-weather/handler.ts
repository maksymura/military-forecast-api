import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { parseWeather } from "../../scripts/parse-weather";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  await parseWeather();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Parsed weather",
    }),
  };
};
