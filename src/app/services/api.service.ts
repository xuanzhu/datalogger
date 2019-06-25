import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

import { IApiVersion } from "../models/api-version";
import { VesselService } from "./vessel.service";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private apiVersion$;

  constructor(private http: HttpClient, private vesselService: VesselService) {}

  public getUrl(): string {
    if (this.vesselService.isRemote()) {
      const vessel = this.vesselService
        .getVessel()
        .toLowerCase()
        .replace(/[0-9]*$/, "");

      return `http://datalogger-api.${vessel}.allseas.global/`;
    } else {
      return window.API_BASE;
    }
  }

  public getVersion(): Observable<IApiVersion> {
    if (!this.apiVersion$) {
      const url = `${this.getUrl()}api/v1/version`;

      this.apiVersion$ = this.http.get<IApiVersion>(url).pipe(shareReplay(1));
    }

    return this.apiVersion$;
  }
}
