import { putJSONObject } from "../../external-api/s3/api";
import { weatherBucket } from "../../external-api/s3/buckets";
import { getWeatherInUkrainianRegionsTomorrow } from "../../external-api/weather/api";

export async function parseWeatherInUkraineTomorrow() {
  const weatherTomorrow = await getWeatherInUkrainianRegionsTomorrow();

  const tomorrow = new Date();
  tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);

  const fileKey = `${weatherBucket}/${tomorrow.getFullYear()}-${
    tomorrow.getMonth() + 1
  }-${tomorrow.getDate()}.json`;

  return putJSONObject(fileKey, JSON.stringify(weatherTomorrow));
}
