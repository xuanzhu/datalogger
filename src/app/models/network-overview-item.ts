export enum NetworkOverviewType {
  Channel,
  Converter,
  DataSource,
  NetworkSwitch,
  Vessel
}

export enum OnlineState {
  Offline = 0,
  Online = 1
}

export enum ChannelState {
  Bad = 0,
  Good = 1
}

/// <summary>
/// -1 : not pingable
///  0 : not tracked
///  1 : pingable
/// </summary>
export enum PingStatus {
  Offline = -1,
  Unknown = 0,
  Online = 1
}

export interface INetworkOverviewItem {
  ChannelId: number;
  ChannelName: string;
  ChannelOnline?: OnlineState;
  ChannelLastState?: ChannelState;
  DataSourceId?: number;
  DataSourceName?: string;
  DataSourceLocation?: string;
  DataSourceDescription?: string;
  DataSourceOnline?: OnlineState;
  DataSourceState?: PingStatus;
  ConverterId?: number;
  ConverterName?: string;
  ConverterLocation?: string;
  ConverterOnline?: OnlineState;
  ConverterState?: PingStatus;
  SwitchId?: number;
  SwitchName?: string;
}
