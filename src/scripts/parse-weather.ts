import { parse } from "csv-parse";
import * as fs from "fs";
import * as path from "path";
import { WeatherDay } from "../domain/weather";
import { putJSONObject } from "../external-api/s3/api";

export async function parseWeather() {
  const weatherDaysMap: Record<string, WeatherDay[]> = {};

  const filePath = "../static/all_weather_by_hour.csv";

  fs.createReadStream(path.resolve(filePath))
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      const [
        latitude,
        longitude,
        urkAddress,
        address,
        timezone,
        tzOffset,
        datetime,
        datetimeEpoch,
        tempMin,
        tempMax,
        temp,
      ] = row;

      const weatherDay: WeatherDay = {
        latitude,
        longitude,
        address,
        timezone,
        datetime,
        datetimeEpoch,
        temp,
      };

      if (!weatherDaysMap[datetime]) {
        weatherDaysMap[datetime] = [];
      }

      const dayInDate = weatherDaysMap[datetime].find(
        (weatherDay) => weatherDay.address === address
      );

      if (!dayInDate) {
        weatherDaysMap[datetime].push(weatherDay);
      }
    })
    .on("close", async () => {
      for (const datetime of Object.keys(weatherDaysMap)) {
        const weatherDays = weatherDaysMap[datetime];

        await putJSONObject(
          `weather/${datetime}.json`,
          JSON.stringify(weatherDays)
        );
      }
    });
}

parseWeather().catch((err) => console.log(err));
