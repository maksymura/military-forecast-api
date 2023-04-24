import { BASE_ALARMS_URL } from "./constants";
import { AlarmApiResponse } from "./types";

export async function fetchRegions() {
  const headers = {
    authorization: process.env.ALARM_API_TOKEN as string,
  };
  return (
    await fetch(`${BASE_ALARMS_URL}/regions`, {
      headers,
    })
  ).json();
}

export async function getAlarms(regionId: string): Promise<AlarmApiResponse> {
  const headers = {
    authorization: process.env.ALARM_API_TOKEN as string,
  };

  return (
    await fetch(`${BASE_ALARMS_URL}/alerts/regionHistory?regionId=${regionId}`, {
      headers,
    })
  ).json();
}
