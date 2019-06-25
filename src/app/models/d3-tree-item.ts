import {
  ChannelState,
  NetworkOverviewType,
  OnlineState,
  PingStatus
} from "./network-overview-item";

export interface ID3TreeItem {
  id?: number;
  name: string;
  channelState?: ChannelState;
  onlineState?: OnlineState;
  pingStatus?: PingStatus;
  children: ID3TreeItem[];
  type: NetworkOverviewType;
  icon: string;
}
