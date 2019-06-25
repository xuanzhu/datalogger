/* tslint:disable:prefer-array-literal */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, OperatorFunction, Subject, timer } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";

import { DataRequestStatus, IDataRequest } from "../models/data-request";
import { IDataRequestDialogItem } from "../models/data-request-dialog-item";
import { IDataRequestPlotItem } from "../models/data-request-plot-item";
import { ApiService } from "./api.service";
import { VesselService } from "./vessel.service";

@Injectable({
  providedIn: "root"
})
export class DataRequestService {
  private static stopPolling(dataReady: Subject<boolean>): void {
    dataReady.next(true);
    dataReady.complete();
  }

  private get dataRequestsUrl(): string {
    const apiUrl = this.apiService.getUrl();
    const vessel = this.vesselService.getVessel();

    return `${apiUrl}api/v1/DataRequests/${vessel}`;
  }

  private dataRequestDialogDefaults: IDataRequestDialogItem = {} as any;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private vesselService: VesselService
  ) {}

  public getAll(): Observable<IDataRequest[]> {
    return this.http.get<IDataRequest[]>(this.dataRequestsUrl);
  }

  public get(jobId: number): Observable<IDataRequest> {
    const url = `${this.dataRequestsUrl}/${jobId}`;
    const options = {
      headers: { "Cache-Control": "no-cache" }
    };

    return this.http.get<IDataRequest>(url, options).pipe(
      map(dataRequest => {
        dataRequest.AggregationType = dataRequest.AggregationType.toLowerCase().trim() as any;
        return dataRequest;
      })
    );
  }

  public pollUntilReady(
    jobId: number,
    ...preFilterOperations: Array<OperatorFunction<IDataRequest, IDataRequest>>
  ): Observable<IDataRequest> {
    const dataReady$: Subject<boolean> = new Subject();
    let timer$ = timer(1000, 3000).pipe(
      takeUntil(dataReady$),
      switchMap(() => this.get(jobId))
    );

    if (preFilterOperations.length > 0) {
      preFilterOperations.forEach(operation => {
        timer$ = timer$.pipe(operation);
      });
    }

    timer$ = timer$.pipe(
      filter(dataRequest => dataRequest.Status !== DataRequestStatus.Pending),
      tap(() => DataRequestService.stopPolling(dataReady$))
    );

    return timer$;
  }

  public post(parameters: any): Observable<any> {
    return this.http.post<any>(this.dataRequestsUrl, parameters);
  }

  public getData(jobId: number): Observable<IDataRequestPlotItem[]> {
    const url = `${this.dataRequestsUrl}/${jobId}/Data`;
    return this.http.get<IDataRequestPlotItem[]>(url);
  }

  public getExportCsvUrl(jobId: number): string {
    return `${this.dataRequestsUrl}/${jobId}/Data?format=csv`;
  }

  public cancel(jobId: number): Observable<boolean> {
    const url = `${this.dataRequestsUrl}/${jobId}/Cancel`;
    return this.http.post<any>(url, jobId);
  }

  public getDataRequestDialogDefaults(): IDataRequestDialogItem {
    return this.dataRequestDialogDefaults;
  }

  public setDataRequestDialogDefaults(data: IDataRequestDialogItem): void {
    this.dataRequestDialogDefaults = {
      actionName: undefined,
      selectedIds: undefined,
      timeStart: data.timeStart,
      timeEnd: data.timeEnd,
      valueMin: data.valueMin,
      valueMax: data.valueMax,
      sampleRates: data.sampleRates,
      deadBand: data.deadBand,
      aggregationType: data.aggregationType,
      aggregationPeriods: data.aggregationPeriods
    };
  }

  public isListEqual(dataRequests: IDataRequest[]): boolean {
    let isListEqual: boolean = true;

    if (dataRequests.length >= 2) {
      const dataRequestFirst = dataRequests.shift();

      dataRequests.forEach(dataRequest => {
        if (!this.isEqual(dataRequestFirst, dataRequest)) {
          isListEqual = false;
        }
      });
    }

    return isListEqual;
  }

  public isEqual(
    dataRequestA: IDataRequest,
    dataRequestB: IDataRequest
  ): boolean {
    return (
      dataRequestA.TimeStart === dataRequestB.TimeStart &&
      dataRequestA.TimeEnd === dataRequestB.TimeEnd &&
      dataRequestA.AggregationType === dataRequestB.AggregationType &&
      dataRequestA.AggregationPeriodMs === dataRequestB.AggregationPeriodMs &&
      dataRequestA.DeadBand === dataRequestB.DeadBand &&
      dataRequestA.ValueMin === dataRequestB.ValueMin &&
      dataRequestA.ValueMax === dataRequestB.ValueMax
    );
  }
}
