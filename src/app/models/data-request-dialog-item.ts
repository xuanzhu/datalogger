export enum AggregationType {
  None = "none",
  Average = "avg",
  Min = "min",
  Max = "max",
  StandardDeviation = "stddev",
  Resample = "ds"
}

export interface IDataRequestDialogItem {
  actionName: string;
  selectedIds: number[];
  timeStart?: Date;
  timeEnd?: Date;
  valueMin?: number;
  valueMax?: number;
  sampleRates?: number;
  deadBand?: number;
  aggregationType?: AggregationType;
  aggregationPeriods?: number;
}
