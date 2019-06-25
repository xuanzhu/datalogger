import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";

import { IDataParameter } from "../models/data-parameter";
import { IDataRequestPlotItem } from "../models/data-request-plot-item";
import { ApiService } from "./api.service";
import { VesselService } from "./vessel.service";

@Injectable({
  providedIn: "root"
})
export class DataloggerService {
  private get dataParametersUrl(): string {
    const apiUrl = this.apiService.getUrl();
    const vessel = this.vesselService.getVessel();

    return `${apiUrl}api/v1/DataParameters/${vessel}`;
  }

  private parameters: IDataParameter[];

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private vesselService: VesselService
  ) {}

  public getDataParameters(refresh = false): Observable<IDataParameter[]> {
    if (this.parameters && !refresh) {
      return of(this.parameters);
    } else {
      return this.http
        .get<IDataParameter[]>(
          this.dataParametersUrl,
          this.getHttpOptions(refresh)
        )
        .pipe(tap(parameters => (this.parameters = parameters)));
    }
  }

  public getDataParameter(id: number): Observable<IDataParameter> {
    const url = `${this.dataParametersUrl}/${id}`;

    return this.http.get<IDataParameter>(url, this.getHttpOptions());
  }

  public updateDataParameter(
    parameter: IDataParameter
  ): Observable<IDataParameter> {
    const url = `${this.dataParametersUrl}/${parameter.Id}`;

    return this.http.put<IDataParameter>(url, parameter, this.getHttpOptions());
  }

  public addDataParameter(
    parameter: IDataParameter
  ): Observable<IDataParameter> {
    return this.http.post<IDataParameter>(
      this.dataParametersUrl,
      parameter,
      this.getHttpOptions()
    );
  }

  public deleteDataParameter(
    parameterId: IDataParameter | number
  ): Observable<IDataParameter> {
    const id = typeof parameterId === "number" ? parameterId : parameterId.Id;
    const url = `${this.dataParametersUrl}/${id}`;

    return this.http.delete<IDataParameter>(url, this.getHttpOptions());
  }

  public getLatestTimestamp(): Observable<moment.Moment> {
    const url = `${this.dataParametersUrl}/LatestTimestamp`;

    return this.http
      .get<moment.Moment>(url)
      .pipe(map(timestamp => moment.utc(timestamp)));
  }

  public getDataForParameter(
    parameterId: number,
    dateStart: moment.Moment,
    duration: number
  ): Observable<IDataRequestPlotItem[]> {
    const dateEnd = moment.utc(dateStart).add(duration, "s");
    const url = `${this.dataParametersUrl}/${parameterId}/Data`;
    const options = {
      params: {
        dateStart: dateStart.toISOString(),
        dateEnd: dateEnd.toISOString()
      }
    };

    return this.http.get<IDataRequestPlotItem[]>(url, options);
  }

  public getLatestTimestampForParameter(
    parameterId: number
  ): Observable<moment.Moment> {
    const url = `${this.dataParametersUrl}/${parameterId}/LatestTimestamp`;

    return this.http
      .get<moment.Moment>(url)
      .pipe(map(timestamp => moment.utc(timestamp)));
  }

  private getHttpOptions(refresh = false) {
    const headers = {
      "Content-Type": "application/json"
    };

    if (refresh) {
      headers["x-refresh"] = true;
    }

    return {
      headers: new HttpHeaders(headers)
    };
  }
}
