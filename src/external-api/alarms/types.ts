export type AlarmItem = {
  startDate: string;
  endDate: string;
  isContinue: boolean;
};

export type AlarmApiResponse = [{
    alarms: AlarmItem[];
}]

