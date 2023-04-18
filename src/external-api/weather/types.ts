export type WeatherAPIResponse = {
  latitude: number; // 50.4506
  longitude: number; // 30.5243
  resolvedAddress: string;
  address: string; // "Kyiv"
  timezone: string; // "Europe/Kiev"
  tzoffset: number;
  days: [
    {
      datetime: string; // "2023-03-09";
      datetimeEpoch: number; // 1678312800
      tempmax: number; // 11.8
      tempmin: number; // 1.3
      temp: number; // 6.8
      hours: Record<string, unknown>[];
    } & Record<string, unknown>
  ];
  alerts: Record<string, unknown>[];
};
