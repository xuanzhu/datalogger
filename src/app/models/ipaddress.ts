import { OnlineState } from "./network-overview-item";

export interface IIpaddress {
  Id: number;
  Description: string;
  IpAddress: string;
  SwitchID: number;
  SwitchPort: string;
  NumericID: number;
  HostName: string;
  MAC_Address: string;
  SubNet_Mask: string;
  Online: OnlineState;
}
