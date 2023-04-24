import { fetchAlarms } from "../functions/alarms/fetch-alarms";

export async function main() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  
    await fetchAlarms(yesterday);
  

    console.log('Success');
}

main().catch(console.error);
