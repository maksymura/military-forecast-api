import { parse } from "csv-parse";
import { Alarm } from "../domain/alarm";
import { RegionEnum } from "../domain/regions";
import { getObjectStream, putJSONObject } from "../external-api/s3/api";
import {add} from "husky";

function convertToRegion(region_id: string): string {
    return RegionEnum[region_id as keyof typeof RegionEnum];
}

export async function parseAlarms() {
  process.env.TZ = 'Europe/Kyiv';
  const alarmsMap: Record<string, Alarm[]> = {};

  const fileKey = "static/alarms.csv";
  const stream = await getObjectStream(fileKey);

  stream
    .pipe(parse({ delimiter: ";", from_line: 2 }))
    .on("data", function (row) {
      const [
          id,
          region_id,
          region_title,
          region_city,
          all_region,
          start,
          end,
          clean_end,
          intersection_alarm_id
      ] = row;


      const alarm: Alarm = {
          id: Number.parseInt(id),
          address: convertToRegion(region_id),
          all_region: (all_region !== '0'),
          start: start,
          end: end,
          clean_end: (clean_end === 'NULL' ? null : clean_end),
          intersection_alarm_id: (intersection_alarm_id === 'NULL' ? null : Number.parseInt(intersection_alarm_id))
      };

        const datetime1 = new Date('2022-02-25 00:00:00');
        const datetime2 = new Date('2022-02-25 23:59:59');
        let datetime = datetime2.toISOString().split('T')[0]

        const datetime_start = new Date(start);
        const datetime_end = new Date(end);
        const cont = true
        while (cont) {
            // datetime_start (datetime_end datetime1) datetime2
            if (datetime_end < datetime1) {
                break;
            }
            // datetime1 (datetime2 datetime_start) datetime_end
            if (datetime2 < datetime_start) {
                datetime1.setDate(datetime1.getDate() + 1);
                datetime2.setDate(datetime2.getDate() + 1);
                datetime = datetime2.toISOString().split('T')[0]
            }

            // datetime1 (datetime2 datetime_start) datetime_end OR datetime_start (datetime_end datetime1) datetime2
            if (!(datetime2 < datetime_start || datetime_end < datetime1)) {
                if (!alarmsMap[datetime]) {
                    alarmsMap[datetime] = [];
                }

                const alarmDay = alarmsMap[datetime];
                alarmDay.push(alarm);
                datetime1.setDate(datetime1.getDate() + 1);
                datetime2.setDate(datetime2.getDate() + 1);
                datetime = datetime2.toISOString().split('T')[0]
            }
        }
    })
    .on("close", async () => {
      for (const datetime of Object.keys(alarmsMap)) {
        const alarmDay = alarmsMap[datetime];

        await putJSONObject(
          `alarms_v2/${datetime}.json`,
          JSON.stringify(alarmDay, null, 2)
        );
      }
    });
}

parseAlarms().catch((err) => console.log(err));
