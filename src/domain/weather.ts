import { Region } from "./regions";

export type WeatherDay = {
  latitude: number; // 50.4506
  longitude: number; // 30.5243
  address: Region; // "Kyiv"
  timezone: string; // "Europe/Kiev"
  datetime: string; // "2023-03-09";
  datetimeEpoch: number; // 1678312800
  temp: number; // 6.8
};
