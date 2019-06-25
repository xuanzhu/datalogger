import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable, of } from "rxjs";
import { map, share, tap } from "rxjs/operators";

import { IProductionEvent } from "../models/production-event";
import { IProductionParameter } from "../models/production-parameter";
import { ApiService } from "./api.service";
import { VesselService } from "./vessel.service";

@Injectable({
  providedIn: "root"
})
export class ProductionService {
  private get urlProductionEvents(): string {
    const apiUrl = this.apiService.getUrl();
    const vessel = this.vesselService.getVessel();

    return `${apiUrl}api/v1/ProductionEvents/${vessel}`;
  }

  private get urlProductionParameters(): string {
    const apiUrl = this.apiService.getUrl();
    const vessel = this.vesselService.getVessel();

    return `${apiUrl}api/v1/ProductionParameters/${vessel}`;
  }

  private productionParameters: IProductionParameter[];
  private productionParameters$: Observable<IProductionParameter[]>;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private vesselService: VesselService
  ) {}

  public getProductionParameters(): Observable<IProductionParameter[]> {
    if (this.productionParameters) {
      return of(this.productionParameters);
    } else if (this.productionParameters$) {
      return this.productionParameters$;
    } else {
      this.productionParameters$ = this.http
        .get<IProductionParameter[]>(this.urlProductionParameters)
        .pipe(
          tap(
            productionParameters =>
              (this.productionParameters = productionParameters)
          ),
          share()
        );

      return this.productionParameters$;
    }
  }

  public getProductionParameter(id: number): Observable<IProductionParameter> {
    return this.getProductionParameters().pipe(
      map(productionParameters =>
        productionParameters.find(
          productionParameter => productionParameter.Id === id
        )
      )
    );
  }

  public getProductionEvents(
    dateStart: moment.Moment,
    dateEnd: moment.Moment,
    productionParameterIds: number[] = []
  ): Observable<IProductionEvent[]> {
    const url = `${this.urlProductionEvents}/Filtered`;
    const params = {
      dateStart: dateStart.toISOString(),
      dateEnd: dateEnd.toISOString(),
      productionParameterIds: productionParameterIds.map(String)
    };

    if (productionParameterIds.length === 0) {
      delete params.productionParameterIds;
    }

    return this.http
      .get<IProductionEvent[]>(url, { params: params })
      .pipe(
        map(productionEvents => productionEvents.map(this.parseProductionEvent))
      );
  }

  public getLatestProductionEvent(): Observable<IProductionEvent> {
    return this.http
      .get<IProductionEvent>(`${this.urlProductionEvents}/LatestEntry`)
      .pipe(map(this.parseProductionEvent));
  }

  private parseProductionEvent(
    productionEvent: IProductionEvent
  ): IProductionEvent {
    if (productionEvent.Timestamp) {
      productionEvent.Timestamp = moment.utc(productionEvent.Timestamp);
    }

    return productionEvent;
  }
}
