import { parse } from "csv-parse";
import { Alarm } from "../domain/alarm";
import { getObjectStream, putJSONObject } from "../external-api/s3/api";

export async function parseAlarms() {
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
          region_id: Number.parseInt(region_id),
          region_title,
          region_city,
          all_region: (all_region !== '0'),
          start: start,
          end: end,
          clean_end: (clean_end === 'NULL' ? null : clean_end),
          intersection_alarm_id: (intersection_alarm_id === 'NULL' ? null : Number.parseInt(intersection_alarm_id))
      };

        const datetime = start.split(' ')[0];

        if (!alarmsMap[datetime]) {
            alarmsMap[datetime] = [];
        }

        const alarmDay = alarmsMap[datetime]
        alarmDay.push(alarm)
    })
    .on("close", async () => {
      for (const datetime of Object.keys(alarmsMap)) {
        const alarmDay = alarmsMap[datetime];

        await putJSONObject(
          `alarms/${datetime}.json`,
          JSON.stringify(alarmDay, null, 2)
        );
      }
    });
}

parseAlarms().catch((err) => console.log(err));
