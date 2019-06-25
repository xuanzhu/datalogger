import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ColDef } from "ag-grid/src/ts/entities/colDef";
import { NotifierService } from "angular-notifier";
import * as moment from "moment";
import { combineLatest } from "rxjs";

import { NotificationMessageType } from "../../models/notification-message-item";
import { IProductionEvent } from "../../models/production-event";
import { IProductionParameter } from "../../models/production-parameter";
import { ProductionService } from "../../services/production.service";
import { GridBase } from "../../utilities/grid-base";
import {
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_FRACTIONAL
} from "../date-time-input/date-time-input.component";
import { ModalProductionEventComponent } from "../modal-production-event/modal-production-event.component";

enum RouteParameter {
  DateStart = "date_start",
  DateEnd = "date_end",
  Filter = "filter",
  ParameterIds = "parameter_ids"
}

@Component({
  selector: "production-event-list",
  templateUrl: "./production-event-list.component.html",
  styleUrls: ["./production-event-list.component.scss"]
})
export class ProductionEventListComponent extends GridBase implements OnInit {
  public get loadingInfo(): string {
    if (this.dateStart && this.dateEnd) {
      const from = this.dateStart.format(DATE_TIME_FORMAT);
      const until = this.dateEnd.format(DATE_TIME_FORMAT);

      return `Loading production events from ${from} until ${until}.`;
    }
  }

  public readonly gridId: string = ProductionEventListComponent.name;
  public columnDefinitions: ColDef[] = [
    { headerName: "Parameter Id", field: "ProductionParameterId" },
    {
      headerName: "Parameter",
      getQuickFilterText: params =>
        this.getParameterNameById(params.data.ProductionParameterId),
      valueGetter: params =>
        this.getParameterNameById(params.data.ProductionParameterId)
    },
    { field: "StationId" },
    {
      headerName: "Start (UTC)",
      valueGetter: params =>
        params.data.Timestamp.format(DATE_TIME_FORMAT_FRACTIONAL)
    },
    {
      headerName: "End (UTC)",
      valueGetter: params => {
        const start = params.data.Timestamp;
        const end = start.clone().add(params.data.Duration, "s");

        return end.format(DATE_TIME_FORMAT_FRACTIONAL);
      }
    },
    { headerName: "Duration [s]", field: "Duration" },
    { field: "Value" }
  ];

  public dateEnd: moment.Moment;
  public dateStart: moment.Moment;
  public dateTimeFormat: string = DATE_TIME_FORMAT;
  public filterText: string = "";
  public isLoading: boolean = true;
  public parameterIds: number[] = [];
  public productionEvents: IProductionEvent[];
  public productionParameters: IProductionParameter[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private notifier: NotifierService,
    private productionService: ProductionService
  ) {
    super();

    this.gridApi$.subscribe(() => this.parseRouteParameters());
  }

  public ngOnInit(): void {
    this.parseRouteParameters();
  }

  public changeDateRange(): void {
    const modalRef = this.modalService.open(ModalProductionEventComponent, {
      backdrop: "static"
    });

    modalRef.componentInstance.initializeDates(this.dateStart, this.dateEnd);
    modalRef.result
      .then(({ dateStart, dateEnd }) =>
        this.updateCurrentRoute(dateStart, dateEnd)
      )
      .catch(() => {
        // Modal closed
      });
  }

  public changeParameters(): void {
    const routeParameters = {};

    if (Array.isArray(this.parameterIds) && this.parameterIds.length > 0) {
      routeParameters[RouteParameter.ParameterIds] = this.parameterIds;
    }

    this.router.navigate(["../production-parameters", routeParameters], {
      relativeTo: this.route
    });
  }

  public setFilterText(filterText: string): void {
    this.updateCurrentRoute(undefined, undefined, filterText);
  }

  public onFirstDataRendered(): void {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
      this.gridApi.setQuickFilter("RL_Total");
    }
  }

  private parseRouteParameters(): void {
    this.route.paramMap.subscribe(params => {
      this.parseRouteParametersParameterIds(params);
      this.parseRouteParametersFilter(params);
      this.parseRouteParametersDateRange(params);
    });
  }

  private parseRouteParametersParameterIds(params: ParamMap): void {
    if (params.has(RouteParameter.ParameterIds)) {
      const parameterIds = params
        .getAll(RouteParameter.ParameterIds)
        .toString();

      if (parameterIds.length > 0) {
        this.parameterIds = parameterIds.split(",").map(Number);
      } else {
        this.parameterIds = [];
      }
    } else {
      this.parameterIds = [];
    }
  }

  private parseRouteParametersFilter(params: ParamMap): void {
    if (params.has(RouteParameter.Filter)) {
      this.filterText = params.get(RouteParameter.Filter);
    } else {
      this.filterText = "";
    }

    if (this.gridApi) {
      this.gridApi.setQuickFilter(this.filterText);
    }
  }

  private parseRouteParametersDateRange(params: ParamMap): void {
    if (
      params.has(RouteParameter.DateStart) &&
      params.has(RouteParameter.DateEnd)
    ) {
      const dateStart = moment.utc(params.get(RouteParameter.DateStart));
      const dateEnd = moment.utc(params.get(RouteParameter.DateEnd));

      if (!dateStart.isSame(this.dateStart) || !dateEnd.isSame(this.dateEnd)) {
        this.loadDateRange(dateStart, dateEnd);
      }
    } else {
      const dateStart = moment.utc().subtract(1, "hour");
      const dateEnd = moment.utc();

      this.updateCurrentRoute(dateStart, dateEnd);
    }
  }

  private loadDateRange(
    dateStart: moment.Moment,
    dateEnd: moment.Moment
  ): void {
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;

    this.loadProductionEvents();
  }

  private loadProductionEvents(): void {
    this.isLoading = true;

    combineLatest(
      this.productionService.getProductionParameters(),
      this.productionService.getProductionEvents(
        this.dateStart,
        this.dateEnd,
        this.parameterIds
      )
    ).subscribe(
      ([productionParameters, productionEvents]) => {
        this.productionParameters = productionParameters;
        this.productionEvents = productionEvents;
        this.isLoading = false;
      },
      () =>
        this.notifier.notify(
          NotificationMessageType.Error,
          "Couldn't load production events"
        )
    );
  }

  private getParameterNameById(id: number): string {
    const parameter = this.productionParameters.find(p => p.Id === id);

    if (parameter) {
      return parameter.Name;
    } else {
      return "";
    }
  }

  private updateCurrentRoute(
    dateStart?: moment.Moment,
    dateEnd?: moment.Moment,
    filterText?: string
  ): void {
    const routeParameters = {};

    if (dateStart && dateEnd) {
      routeParameters[RouteParameter.DateStart] = dateStart.toISOString();
      routeParameters[RouteParameter.DateEnd] = dateEnd.toISOString();
    } else {
      routeParameters[RouteParameter.DateStart] = this.dateStart.toISOString();
      routeParameters[RouteParameter.DateEnd] = this.dateEnd.toISOString();
    }

    if (filterText !== undefined) {
      routeParameters[RouteParameter.Filter] = filterText;
    } else if (this.filterText) {
      routeParameters[RouteParameter.Filter] = this.filterText;
    }

    if (Array.isArray(this.parameterIds) && this.parameterIds.length > 0) {
      routeParameters[RouteParameter.ParameterIds] = this.parameterIds;
    }

    this.router.navigate([routeParameters], {
      relativeTo: this.route,
      replaceUrl: true
    });
  }
}
