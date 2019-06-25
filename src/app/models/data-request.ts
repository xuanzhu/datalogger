import { AggregationType } from "./data-request-dialog-item";

export enum DataRequestStatus {
  Error = -1,
  Pending = 0,
  Finished = 1
}

export interface IDataRequest {
  Id: number;
  JobId: number;
  JobCreated: string;
  JobStart: string;
  JobFinish: string;
  Status: DataRequestStatus;
  ParameterLongName?: string;
  ParameterId: number;
  TimeStart: string;
  TimeEnd: string;
  ValueMin: number | null;
  ValueMax: number | null;
  SampleRateMs: number;
  DeadBand: number;
  AggregationType: AggregationType;
  AggregationPeriodMs: number;
}
