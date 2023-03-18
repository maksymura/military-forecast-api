import { parse } from "csv-parse";
import { WeatherDay } from "../domain/weather";
import { getObjectStream, putJSONObject } from "../external-api/s3/api";

export async function parseWeather() {
  const weatherDaysMap: Record<string, WeatherDay[]> = {};

  const fileKey = "static/all_weather_by_hour.csv";
  const stream = await getObjectStream(fileKey);

  stream
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
        address: address.split(",")[0],
        timezone,
        datetime,
        datetimeEpoch,
        temp,
      };

      if (!weatherDaysMap[datetime]) {
        weatherDaysMap[datetime] = [];
      }

      // there is duplicate data in csv file
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
