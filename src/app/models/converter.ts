import { OnlineState, PingStatus } from "./network-overview-item";

export interface IConverter {
  Id: number;
  Name: string;
  Maker?: string;
  Type?: string;
  Location?: string;
  From?: string;
  To?: string;
  ItemNumber?: string;
  IpAddress?: string;
  Online: OnlineState;
  ShortName?: string;
  PingStatus?: PingStatus;
  PingStatusTime?: Date;
}
