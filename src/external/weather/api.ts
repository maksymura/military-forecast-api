import { WeatherApiResponse } from "./types";

const weatherAPIUrl =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services";

export async function getWeatherInKyivTomorrow() {
  const res = await fetch(
    `${weatherAPIUrl}/timeline/Kyiv/tomorrow?unitGroup=metric&key=${process.env.WEATHER_API_TOKEN}&contentType=json`
  );
  const data = await res.json();

  return data as WeatherApiResponse;
}
