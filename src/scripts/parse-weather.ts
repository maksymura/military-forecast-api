import { parseWeatherInUkraineTomorrow } from "../functions/parse-weather/case";

export async function parseWeather() {
  await parseWeatherInUkraineTomorrow();
}

parseWeather().catch((err) => console.log(err));
