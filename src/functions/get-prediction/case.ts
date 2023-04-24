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
  const predictionFileKey = "predictions/prediction.json";
  const predictionObject = await getObject(predictionFileKey);
  const prediction = JSON.parse(predictionObject.Body!.toString());

  return prediction;
}
