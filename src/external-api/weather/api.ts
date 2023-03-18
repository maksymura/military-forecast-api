import { Region, regions } from "../../domain/regions";
import { WeatherDay } from "../../domain/weather";
import { weatherAPIUrl } from "./constants";
import { WeatherAPIResponse } from "./types";

export async function getWeatherInUkrainianRegionsTomorrow(): Promise<
  WeatherDay[]
> {
  return (await Promise.all(
    regions.map(async (region) =>
      getWeatherInRegionTomorrow(`${region}, Ukraine`)
    )
  )) as WeatherDay[];
}

async function getWeatherInRegionTomorrow(region: string): Promise<WeatherDay> {
  const res = await fetch(
    `${weatherAPIUrl}/timeline/${region}/tomorrow?unitGroup=metric&key=${process.env.WEATHER_API_TOKEN}&contentType=json`
  );
  const data = (await res.json()) as WeatherAPIResponse;

  return createWeatherAPIDay(data);
}

function createWeatherAPIDay({
  latitude,
  longitude,
  address,
  timezone,
  days,
}: WeatherAPIResponse): WeatherDay {
  const { temp, datetime, datetimeEpoch } = days[0];

  return {
    latitude,
    longitude,
    address: address.split(",")[0] as Region,
    timezone,
    temp,
    datetime,
    datetimeEpoch,
  };
}
