import { ChannelState, OnlineState, PingStatus } from "./network-overview-item";

export interface IChannel {
  Id: number;
  Converter?: string;
  Name: string;
  FilingCodeTD?: string;
  ConverterPort?: string;
  Location?: string;
  Protocol?: string;
  ItemNumber?: string;
  Type?: string;
  Maker?: string;
  SourceFrequency?: number;
  SerialConnectionParameter?: string;
  Supplier?: string;
  Description?: string;
  KepserverFrequency?: number;
  IpAddress?: string;
  Online: OnlineState;
  DataSource?: string;
  ShortName: string;
  PingStatus?: PingStatus;
  PingStatusTime?: Date;
  ChannelLastState?: ChannelState;
  ChannelLastStateTimestamp?: Date;
}
