import { parseWeatherInKyivTomorrow } from "../functions/parse-weather/case";

export async function parseWeather() {
  await parseWeatherInKyivTomorrow();
}

parseWeather().catch((err) => console.log(err));
