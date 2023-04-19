import { RegionEnum } from "../../domain/regions";
import { getAlarms } from "../../external-api/alarms/api";
import { putJSONObject } from "../../external-api/s3/api";
import { normalizeDate, stringifyDate } from "../isw/util";
import { ApiRegionToDatasetRegion, apiRegionIds } from "./region-mapper";
import { AlarmDatasetItem } from "./types";

function convertISODateToStupidFormat(isoDate: string) {
  return isoDate.split("T").join(" ");
}

export async function fetchAlarms(date: Date) {
  const normalized = normalizeDate(date);

  const tomorrow = new Date(normalized);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const alarmsByDay: AlarmDatasetItem[] = [];

  for (const apiRegionId of apiRegionIds) {
    const [{ alarms }] = await getAlarms(apiRegionId);

    for (const { startDate, endDate, isContinue } of alarms) {
      const startDateParsed = new Date(startDate);
      const endDateParsed = new Date(endDate);

      if (
        !(
          (startDateParsed <= normalized && endDateParsed >= normalized) || // start date within, end date either during or after
          (startDateParsed <= tomorrow && endDateParsed >= tomorrow) || // start date within or before, end date after
          (startDateParsed >= normalized && endDateParsed <= tomorrow) // both dates within period
        )
      ) {
        // if conditions are not met, continue
        continue;
      }

      const datasetRegionId =
        ApiRegionToDatasetRegion[
          apiRegionId as keyof typeof ApiRegionToDatasetRegion
        ];

      const address = RegionEnum[datasetRegionId];

      const start = convertISODateToStupidFormat(startDate);

      const end = convertISODateToStupidFormat(
        isContinue ? tomorrow.toISOString().split('.')[0] : endDate
      );

      alarmsByDay.push({
        start,
        end,
        address,
      });
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  await putJSONObject(
    `alarms_v2/${stringifyDate(normalized)}.json`,
    JSON.stringify(alarmsByDay, null, 2)
  );
}
