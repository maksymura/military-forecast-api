# military-forecast-api

* Description: 
The Military Forecast API is a project aimed at predicting potential alarms during the ongoing conflict between Ukraine and Russia. The API is designed to provide real-time analysis and forecasting based on various data sources and machine learning algorithms. By analyzing historical patterns, geopolitical events, and military movements, the API provides users with accurate predictions of potential military activity in the region.
* Requirements:
1. Install Node v18+
2. Install aws-cli https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
3. Login to aws-cli (With key and secret): `aws configure`

How to deploy functions locally:
1. Run cmd: `npm run deploy`

How to run scripts locally (e.g. src/scripts/parse-weather.ts):
1. Install ts-node `npm i ts-node -g`
2. Run cmd: `BUCKET=military-forecast ts-node src/parse-weather.ts`

Weather API limitation: 1000 records/day - free tier
