import { Region, regions } from "../../domain/regions";
import { WeatherDay, WeatherHour } from "../../domain/weather";
import { weatherAPIUrl } from "./constants";
import { WeatherAPIResponse } from "./types";

export async function getWeatherInUkrainianRegionsTomorrow(): Promise<WeatherDay> {
  let weatherTomorrow: WeatherDay = [];

  await Promise.all(
    regions.map(async (region) => {
      const weatherHours = await getWeatherInRegionTomorrow(
        `${region}, Ukraine`
      );
      weatherTomorrow = weatherTomorrow.concat(weatherHours);
    })
  );

  return weatherTomorrow;
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
  resolvedAddress,
  address,
  timezone,
  tzoffset,
  days,
}: WeatherAPIResponse): WeatherDay {
  const dayData = days[0];

  const day = {
    city_latitude: latitude,
    city_longitude: longitude,
    city_resolvedAddress: resolvedAddress,
    city_address: address,
    city_timezone: timezone,
    city_tzoffset: tzoffset,
    day_datetime: dayData.datetime,
    day_datetimeEpoch: dayData.datetimeEpoch,
    day_tempmax: dayData.tempmax,
    day_tempmin: dayData.tempmin,
    day_temp: dayData.temp,
    day_feelslikemax: dayData.feelslikemax,
    day_feelslikemin: dayData.feelslikemin,
    day_feelslike: dayData.feelslike,
    day_dew: dayData.dew,
    day_humidity: dayData.humidity,
    day_precip: dayData.precip,
    day_precipprob: dayData.precipprob,
    day_precipcover: dayData.precipcover,
    day_snow: dayData.snow,
    day_snowdepth: dayData.snowdepth,
    day_windgust: dayData.windgust,
    day_windspeed: dayData.windspeed,
    day_winddir: dayData.winddir,
    day_pressure: dayData.pressure,
    day_cloudcover: dayData.cloudcover,
    day_visibility: dayData.visibility,
    day_solarradiation: dayData.solarradiation,
    day_solarenergy: dayData.solarenergy,
    day_uvindex: dayData.uvindex,
    day_severerisk: dayData.severerisk,
    day_sunrise: dayData.sunrise,
    day_sunriseEpoch: dayData.sunriseEpoch,
    day_sunset: dayData.sunset,
    day_sunsetEpoch: dayData.sunsetEpoch,
    day_moonphase: dayData.moonphase,
    day_conditions: dayData.conditions,
    day_description: dayData.description,
    day_icon: dayData.icon,
    day_source: dayData.source,
    day_preciptype: dayData.preciptype,
    day_stations: dayData.stations,
  };

  return dayData.hours.map((hourData) => {
    return {
      ...day,
      hour_datetime: hourData.datetime,
      hour_datetimeEpoch: hourData.datetimeEpoch,
      hour_temp: hourData.temp,
      hour_feelslike: hourData.feelslike,
      hour_humidity: hourData.humidity,
      hour_dew: hourData.dew,
      hour_precip: hourData.precip,
      hour_precipprob: hourData.precipprob,
      hour_snow: hourData.snow,
      hour_snowdepth: hourData.snowdepth,
      hour_preciptype: hourData.preciptype,
      hour_windgust: hourData.windgust,
      hour_windspeed: hourData.windspeed,
      hour_winddir: hourData.winddir,
      hour_pressure: hourData.pressure,
      hour_visibility: hourData.visibility,
      hour_cloudcover: hourData.cloudcover,
      hour_solarradiation: hourData.olarradiation,
      hour_solarenergy: hourData.solarenergy,
      hour_uvindex: hourData.uvindex,
      hour_severerisk: hourData.severerisk,
      hour_conditions: hourData.conditions,
      hour_icon: hourData.icon,
      hour_source: hourData.source,
      hour_stations: hourData.stations,
    };
  }) as WeatherHour[];
}
