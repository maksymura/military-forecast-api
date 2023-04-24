import { getObject } from "../../external-api/s3/api";

export async function getPredictionUseCase() {
  return {
    ...(await getModelInfo()),
    ...(await getPrediction()),
  };
}

async function getModelInfo() {
  const modelTrainTimeFileKey = "model/train_time.json";
  const modelTrainTimeObject = await getObject(modelTrainTimeFileKey);
  const modelTrainTime = JSON.parse(modelTrainTimeObject.Body!.toString());

  return {
    last_model_train_time: modelTrainTime["date"],
  };
}

async function getPrediction() {
  const predictionFileKey = "predictions/current.json";
  const predictionObject = await getObject(predictionFileKey);
  const prediction = JSON.parse(predictionObject.Body!.toString());
  const predictionTrainTime = new Date(); // create a new Date object for the current datetime
  predictionTrainTime.setMinutes(0); // set the minutes to 0
  predictionTrainTime.setSeconds(0);

  return {
    last_prediction_time: predictionTrainTime,
    regions_forecast: prediction,
  };
}
