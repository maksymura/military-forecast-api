import { regions, weatherAPIUrl } from "./constants";
import { WeatherApiResponse } from "./types";

export async function getWeatherInUkrainianRegionsTomorrow(): Promise<
  WeatherApiResponse[]
> {
  return (await Promise.all(
    regions.map(async (region) => getWeatherInRegionTomorrow(region))
  )) as WeatherApiResponse[];
}

async function getWeatherInRegionTomorrow(
  region: string
): Promise<WeatherApiResponse> {
  const res = await fetch(
    `${weatherAPIUrl}/timeline/${region}/tomorrow?unitGroup=metric&key=${process.env.WEATHER_API_TOKEN}&contentType=json`
  );
  const data = await res.json();

  return data as WeatherApiResponse;
}
