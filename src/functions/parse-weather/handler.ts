import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { parseWeatherInUkraineTomorrow } from "./case";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  await parseWeatherInUkraineTomorrow();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Parsed weather",
    }),
  };
};
