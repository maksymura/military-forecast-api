import * as AWS from "aws-sdk";

export async function putJSONObject(fileKey: string, data: string) {
  const s3 = new AWS.S3();
  await s3
    .putObject({
      Bucket: process.env.BUCKET as string,
      Key: fileKey,
      Body: data,
      ContentType: "application/json",
    })
    .promise();
}

export async function getObjectStream(fileKey: string) {
  const s3 = new AWS.S3();
  return s3
    .getObject({
      Bucket: process.env.BUCKET as string,
      Key: fileKey,
    })
    .createReadStream();
}

export async function getObjectPromise(fileKey: string) {
  const s3 = new AWS.S3();
  return s3
    .getObject({
      Bucket: process.env.BUCKET as string,
      Key: fileKey,
    }).promise()
}

export async function listObjects(prefix: string) {
  const s3 = new AWS.S3();
  return s3.listObjectsV2({
    Bucket: process.env.BUCKET as string,
    Prefix: prefix,
  }).promise();
}
