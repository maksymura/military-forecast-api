import * as AWS from "aws-sdk";
import { getWeatherInKyivTomorrow } from "../../external/weather/api";

export async function parseWeatherInKyivTomorrow() {
  const weatherInKyivTomorrow = await getWeatherInKyivTomorrow();

  const s3 = new AWS.S3();
  await s3
    .putObject({
      Bucket: process.env.BUCKET as string,
      Key: "weather-in-kyiv-tomorrow.json",
      Body: JSON.stringify(weatherInKyivTomorrow),
      ContentType: "application/json",
    })
    .promise();
}
