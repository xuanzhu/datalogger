import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { share, tap } from "rxjs/operators";

import { IChannel } from "../models/channel";
import { IConverter } from "../models/converter";
import { IDataSource } from "../models/data-source";
import { IIpaddress } from "../models/ipaddress";
import { INetworkOverviewItem } from "../models/network-overview-item";
import { INetworkSwitch } from "../models/network-switch";
import { ApiService } from "./api.service";
import { VesselService } from "./vessel.service";

@Injectable({
  providedIn: "root"
})
export class NetworkOverviewService {
  private get networkOverviewUrl(): string {
    const apiUrl = this.apiService.getUrl();
    const vessel = this.vesselService.getVessel();

    return `${apiUrl}api/v1/NetworkOverview/${vessel}`;
  }

  private networkOverview: INetworkOverviewItem[];
  private networkOverview$: Observable<INetworkOverviewItem[]>;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private vesselService: VesselService
  ) {}

  public getNetworkOverview(): Observable<INetworkOverviewItem[]> {
    if (this.networkOverview) {
      return of(this.networkOverview);
    } else if (this.networkOverview$) {
      return this.networkOverview$;
    } else {
      this.networkOverview$ = this.http
        .get<INetworkOverviewItem[]>(this.networkOverviewUrl)
        .pipe(
          share(),
          tap(data => (this.networkOverview = data))
        );

      return this.networkOverview$;
    }
  }

  public getChannel(id: number): Observable<IChannel> {
    const url = `${this.networkOverviewUrl}/Channels/${id}`;

    return this.http.get<IChannel>(url);
  }

  public getConverter(id: number): Observable<IConverter> {
    const url = `${this.networkOverviewUrl}/Converters/${id}`;

    return this.http.get<IConverter>(url);
  }

  public getDataSource(id: number): Observable<IDataSource> {
    const url = `${this.networkOverviewUrl}/DataSources/${id}`;

    return this.http.get<IDataSource>(url);
  }

  public getNetworkSwitch(id: number): Observable<INetworkSwitch> {
    const url = `${this.networkOverviewUrl}/NetworkSwitches/${id}`;

    return this.http.get<INetworkSwitch>(url);
  }

  public getIpAddress(ipAddress: string): Observable<IIpaddress> {
    const url = `${this.networkOverviewUrl}/IpAddress/${ipAddress}`;

    return this.http.get<IIpaddress>(url);
  }
}
