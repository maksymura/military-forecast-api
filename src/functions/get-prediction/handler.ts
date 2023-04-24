import { APIGatewayProxyResult } from "aws-lambda";
import { getPredictionUseCase } from "./case";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const result = await getPredictionUseCase();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
