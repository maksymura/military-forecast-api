import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { parseWeatherInKyivTomorrow } from "./case";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  await parseWeatherInKyivTomorrow();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Parsed weather",
    }),
  };
};
