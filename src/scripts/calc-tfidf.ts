import { processTfIdf } from "../functions/isw/process-isw";

export async function calcTfIdf() {
    await processTfIdf();   
}

calcTfIdf().catch(console.error);