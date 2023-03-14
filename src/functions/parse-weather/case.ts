import * as AWS from "aws-sdk";
import { getWeatherInUkrainianRegionsTomorrow } from "../../external/weather/api";

export async function parseWeatherInUkraineTomorrow() {
  const weatherInKyivTomorrow = await getWeatherInUkrainianRegionsTomorrow();

  const tomorrow = new Date();
  tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);

  const fileKey = `${tomorrow.getFullYear()}-${
    tomorrow.getMonth() + 1
  }-${tomorrow.getDate()}.json`;

  const s3 = new AWS.S3();
  await s3
    .putObject({
      Bucket: process.env.BUCKET as string,
      Key: fileKey,
      Body: JSON.stringify(weatherInKyivTomorrow),
      ContentType: "application/json",
    })
    .promise();
}

parseWeatherInUkraineTomorrow().catch((e) => console.log(e));
