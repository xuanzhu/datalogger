import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ColDef } from "ag-grid/src/ts/entities/colDef";
import { NotifierService } from "angular-notifier";
import { combineLatest, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, take } from "rxjs/operators";

import { IDataParameter } from "../../models/data-parameter";
import { DataRequestStatus, IDataRequest } from "../../models/data-request";
import { NotificationMessageType } from "../../models/notification-message-item";
import { DataRequestService } from "../../services/data-request.service";
import { DataloggerService } from "../../services/datalogger.service";
import { GridBase } from "../../utilities/grid-base";

export interface IRouteParameters {
  filter?: string;
  job_ids?: number[];
}

@Component({
  selector: "data-request-list",
  templateUrl: "./data-request-list.component.html",
  styleUrls: ["./data-request-list.component.css"]
})
export class DataRequestListComponent extends GridBase implements OnInit {
  public readonly gridId: string = DataRequestListComponent.name;
  public selectedIds: number[] = [];
  public selectedIds$: Subject<number[]> = new Subject<number[]>();
  public filterText: string = "";
  public parameterIds: number[] = [];

  public rowData: any[];
  public columnDefinitions: ColDef[] = [
    {
      field: "JobId",
      sort: "desc",
      width: 40
    },
    {
      field: "JobStart"
    },
    {
      field: "Status",
      width: 30,
      cellStyle: params => {
        switch (params.value) {
          case DataRequestStatus.Finished:
            return { "background-color": "lightgreen" };
          case DataRequestStatus.Error:
            return { "background-color": "lightpink" };
        }
      },
      valueFormatter: params => {
        switch (params.value) {
          case DataRequestStatus.Finished:
          case DataRequestStatus.Pending:
          case DataRequestStatus.Error:
            return DataRequestStatus[params.value];
          default:
            console.error(`Unexpected status "${params.value}".`);

            return null;
        }
      }
    },
    {
      field: "ParameterLongName",
      width: 150
    },
    {
      field: "ParameterId",
      width: 30
    },
    {
      field: "TimeStart"
    },
    {
      field: "TimeEnd"
    },
    {
      headerName: "Min",
      field: "ValueMin",
      width: 30
    },
    {
      headerName: "Max",
      field: "ValueMax",
      width: 30
    },
    {
      field: "SampleRateMs",
      width: 40
    },
    {
      field: "DeadBand",
      width: 40
    },
    {
      field: "AggregationType",
      width: 40
    },
    {
      field: "AggregationPeriodMs",
      width: 40
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataloggerService: DataloggerService,
    private dataRequestService: DataRequestService,
    private notifier: NotifierService
  ) {
    super();

    this.gridApi$.subscribe(() => this.parseRouteParameters());
    this.selectedIds$
      .pipe(
        debounceTime(50),
        distinctUntilChanged()
      )
      .subscribe(selectedIds => {
        this.selectedIds = selectedIds;
        this.updateCurrentRoute();
      });
  }

  public ngOnInit() {
    this.parseRouteParameters();
    this.loadDataRequests();
  }

  public get isDisabled(): boolean {
    return this.selectedIds.length === 0;
  }

  public onFirstDataRendered() {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
      this.checkSelectedRows();
    }
  }

  public onSelectionChanged(event: any) {
    const rowsSelected = event.api.getSelectedRows();

    this.selectedIds = rowsSelected.map(row => row.JobId);
    this.parameterIds = rowsSelected.map(row => row.ParameterId);
    this.updateCurrentRoute();
  }

  public export(): void {
    this.router.navigate(["export", { job_ids: this.selectedIds }], {
      relativeTo: this.route
    });
  }

  public plot(): void {
    this.router.navigate(["plot", { job_ids: this.selectedIds }], {
      relativeTo: this.route
    });
  }

  public setFilterText(filterText: string) {
    if (this.gridApi) {
      this.filterText = filterText;
      this.gridApi.setQuickFilter(filterText);
      this.updateCurrentRoute();
    }
  }

  public checkSelectedRows() {
    if (this.gridApi) {
      this.gridApi.forEachNode(node => {
        if (this.selectedIds.includes(node.data.JobId)) {
          node.setSelected(true);
        } else {
          node.setSelected(false);
        }
      });
    }
  }

  private parseRouteParameters() {
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      if (params.has("job_ids")) {
        this.selectedIds = params
          .get("job_ids")
          .toString()
          .split(",")
          .map(Number);
      }

      if (params.has("filter")) {
        this.filterText = params.get("filter");
      }

      this.setFilterText(this.filterText);
      this.checkSelectedRows();
    });
  }

  private loadDataRequests() {
    combineLatest(
      this.dataloggerService.getDataParameters(),
      this.dataRequestService.getAll()
    ).subscribe(
      ([parameters, requests]: [IDataParameter[], IDataRequest[]]) => {
        this.rowData = requests.map(request => {
          const parameter = parameters.find(p => p.Id === request.ParameterId);

          if (parameter) {
            request.ParameterLongName = parameter.LongName;
          }

          return request;
        });
      },
      () =>
        this.notifier.notify(
          NotificationMessageType.Error,
          "Something went wrong"
        )
    );
  }

  private updateCurrentRoute(): void {
    const routeParameters: IRouteParameters = {};

    if (this.filterText.trim().length > 0) {
      routeParameters.filter = this.filterText;
    }

    if (this.selectedIds.length > 0) {
      routeParameters.job_ids = this.selectedIds;
    }

    this.router.navigate([routeParameters], {
      relativeTo: this.route,
      replaceUrl: true
    });
  }
}
