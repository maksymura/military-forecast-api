# military-forecast-api

Requirements:
1. Install Node v18+
2. Install aws-cli https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
3. Login to aws-cli (With key and secret): `aws configure`

How to deploy functions locally:
1. Run cmd: `npm run deploy`

How to run scripts locally (e.g. src/scripts/parse-weather.ts):
1. Install ts-node `npm i ts-node -g`
2. Run cmd: `BUCKET=military-forecast ts-node src/parse-weather.ts`
