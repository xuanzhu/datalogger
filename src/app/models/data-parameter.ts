export interface IDataParameter {
  Id: number;
  GroupId: number;
  LongName: string; // OPC Tag Name
  Name: string;
  Description: string;
  RangeLow: number | null;
  RangeHigh: number | null;
  Unit: string | null;
  DataTypeId: number;
  Address: string | null;
  DeadBandTypeId: number;
  DeadBandValue: number;
  StorageRate: number;
}
