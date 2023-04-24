import { putJSONObject } from "../../external-api/s3/api";
import { weatherBucket } from "../../external-api/s3/buckets";
import { getWeatherInUkrainianRegionsTomorrow } from "../../external-api/weather/api";

export async function parseWeatherInUkraineTomorrow() {
  const weatherTomorrow = await getWeatherInUkrainianRegionsTomorrow();

  const tomorrow = new Date();
  tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);

  const year = tomorrow.getFullYear(); // get the year
  const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
  const day = tomorrow.getDate().toString().padStart(2, "0");
  const fileKey = `${weatherBucket}/${year}-${month}-${day}.json`;

  return putJSONObject(fileKey, JSON.stringify(weatherTomorrow));
}
