import { parse } from "csv-parse";
import { WeatherHour } from "../domain/weather";
import { getObjectStream, putJSONObject } from "../external-api/s3/api";
import { weatherBucket } from "../external-api/s3/buckets";

export async function parseWeather() {
  // <datetime, hours[]>
  const weatherDaysMap: Record<string, WeatherHour[]> = {};

  const fileKey = "static/all_weather_by_hour_v2.csv";
  const stream = await getObjectStream(fileKey);

  stream
    .pipe(parse({ delimiter: ",", from_line: 2, cast: true, cast_date: false }))
    .on("data", function (row) {
      const [
        city_latitude,
        city_longitude,
        city_resolvedAddress,
        city_address,
        city_timezone,
        city_tzoffset,
        day_datetime,
        day_datetimeEpoch,
        day_tempmax,
        day_tempmin,
        day_temp,
        day_feelslikemax,
        day_feelslikemin,
        day_feelslike,
        day_dew,
        day_humidity,
        day_precip,
        day_precipprob,
        day_precipcover,
        day_snow,
        day_snowdepth,
        day_windgust,
        day_windspeed,
        day_winddir,
        day_pressure,
        day_cloudcover,
        day_visibility,
        day_solarradiation,
        day_solarenergy,
        day_uvindex,
        day_severerisk,
        day_sunrise,
        day_sunriseEpoch,
        day_sunset,
        day_sunsetEpoch,
        day_moonphase,
        day_conditions,
        day_description,
        day_icon,
        day_source,
        day_preciptype,
        day_stations,
        hour_datetime,
        hour_datetimeEpoch,
        hour_temp,
        hour_feelslike,
        hour_humidity,
        hour_dew,
        hour_precip,
        hour_precipprob,
        hour_snow,
        hour_snowdepth,
        hour_preciptype,
        hour_windgust,
        hour_windspeed,
        hour_winddir,
        hour_pressure,
        hour_visibility,
        hour_cloudcover,
        hour_solarradiation,
        hour_solarenergy,
        hour_uvindex,
        hour_severerisk,
        hour_conditions,
        hour_icon,
        hour_source,
        hour_stations,
      ] = row;

      const weatherHour: WeatherHour = {
        city_address: city_address.split(",")[0],
        city_latitude,
        city_longitude,
        city_resolvedAddress,
        city_timezone,
        city_tzoffset,
        day_datetime,
        day_datetimeEpoch,
        day_tempmax,
        day_tempmin,
        day_temp,
        day_feelslikemax,
        day_feelslikemin,
        day_feelslike,
        day_dew,
        day_humidity,
        day_precip,
        day_precipprob,
        day_precipcover,
        day_snow,
        day_snowdepth,
        day_windgust,
        day_windspeed,
        day_winddir,
        day_pressure,
        day_cloudcover,
        day_visibility,
        day_solarradiation,
        day_solarenergy,
        day_uvindex,
        day_severerisk,
        day_sunrise,
        day_sunriseEpoch,
        day_sunset,
        day_sunsetEpoch,
        day_moonphase,
        day_conditions,
        day_description,
        day_icon,
        day_source,
        day_preciptype,
        day_stations,
        hour_datetime,
        hour_datetimeEpoch,
        hour_temp,
        hour_feelslike,
        hour_humidity,
        hour_dew,
        hour_precip,
        hour_precipprob,
        hour_snow,
        hour_snowdepth,
        hour_preciptype,
        hour_windgust,
        hour_windspeed,
        hour_winddir,
        hour_pressure,
        hour_visibility,
        hour_cloudcover,
        hour_solarradiation,
        hour_solarenergy,
        hour_uvindex,
        hour_severerisk,
        hour_conditions,
        hour_icon,
        hour_source,
        hour_stations,
      };

      if (!weatherDaysMap[day_datetime]) {
        weatherDaysMap[day_datetime] = [];
      }

      weatherDaysMap[day_datetime].push(weatherHour);
    })
    .on("close", async () => {
      for (const datetime of Object.keys(weatherDaysMap)) {
        const weatherHours = weatherDaysMap[datetime];

        await putJSONObject(
          `${weatherBucket}/${datetime}.json`,
          JSON.stringify(weatherHours, null, 2)
        );
      }
    });
}

parseWeather().catch((err) => console.log(err));
