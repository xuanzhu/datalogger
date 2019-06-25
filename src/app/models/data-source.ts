import { OnlineState, PingStatus } from "./network-overview-item";

export interface IDataSource {
  Id: number;
  IpAddress?: string;
  Name: string;
  Location?: string;
  ItemNumber?: string;
  Type?: string;
  Maker?: string;
  Supplier?: string;
  Description?: string;
  Online: OnlineState;
  Converter?: string;
  ConverterPort?: string;
  ShortName: string;
  PingStatus?: PingStatus;
  PingStatusTime?: Date;
}
