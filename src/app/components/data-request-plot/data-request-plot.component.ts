import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Chart } from "angular-highcharts";
import { NotifierService } from "angular-notifier";
import { combineLatest } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IDataParameter } from "../../models/data-parameter";
import { DataRequestStatus, IDataRequest } from "../../models/data-request";
import { AggregationType } from "../../models/data-request-dialog-item";
import { IDataRequestPlotItem } from "../../models/data-request-plot-item";
import { NotificationMessageType } from "../../models/notification-message-item";
import { DataRequestService } from "../../services/data-request.service";
import { DataloggerService } from "../../services/datalogger.service";
import { ComponentOnDestroy } from "../../utilities/component-on-destroy";
import { ModalDataRequestComponent } from "../modal-data-request/modal-data-request.component";

interface IRouteParameters {
  job_ids?: string;
}

interface ISeriesExtremes {
  [seriesIndex: number]: {
    max: number;
    min: number;
    difference: number;
  };
}

const INDEX_SERIES_Y_AXIS = 1;

@Component({
  selector: "data-request-plot",
  templateUrl: "./data-request-plot.component.html",
  styleUrls: ["./data-request-plot.component.scss"]
})
export class DataRequestPlotComponent extends ComponentOnDestroy
  implements OnInit {
  public get isLoading(): boolean {
    return this.plotSeriesLoaded < this.jobIds.length;
  }

  public get loadingInfo(): string {
    return `${this.plotSeriesLoaded} / ${this.jobIds.length} lines loaded`;
  }

  public isNormalized: boolean = false;
  public jobIds: number[] = [];
  public plot: Chart;

  private dataRequest: IDataRequest;
  private dataRequests: IDataRequest[];
  private parameterIds: number[];
  private plotSeriesLoaded: number = 0;
  private seriesExtremes: ISeriesExtremes = {};

  constructor(
    private route: ActivatedRoute,
    private dataloggerService: DataloggerService,
    private dataRequestService: DataRequestService,
    private notifier: NotifierService,
    private modalService: NgbModal,
    private router: Router,
    private location: Location
  ) {
    super();
  }

  public ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has("job_ids")) {
        this.jobIds = params
          .get("job_ids")
          .toString()
          .split(",")
          .map(Number);
      } else {
        this.jobIds = [];
      }

      this.pollDataRequests();
    });
  }

  public setYMin() {
    const yMin = prompt("Set Low");

    if (yMin) {
      this.plot.ref.yAxis[0].update(
        {
          min: Number(yMin)
        },
        true
      );
    }
  }

  public setYMax() {
    const yMax = prompt("Set High");

    if (yMax) {
      this.plot.ref.yAxis[0].update(
        {
          max: Number(yMax)
        },
        true
      );
    }
  }

  public setYAuto() {
    this.plot.ref.yAxis[0].update(
      {
        max: null,
        min: null
      },
      true
    );
  }

  public normalizeYAxis() {
    if (this.isNormalized) {
      this.plot.ref.series.forEach((series: any) => {
        series.options.data.forEach((data: number[]) => {
          data[INDEX_SERIES_Y_AXIS] =
            data[INDEX_SERIES_Y_AXIS] *
              this.seriesExtremes[series.index].difference +
            this.seriesExtremes[series.index].min;
        });
        series.update(series.options);
      });
    } else {
      this.plot.ref.series.forEach((series: any) => {
        this.seriesExtremes[series.index] = {
          min: series.dataMin,
          max: series.dataMax,
          difference: series.dataMax - series.dataMin
        };

        if (
          Math.abs(this.seriesExtremes[series.index].difference) <
          Number.EPSILON
        ) {
          this.seriesExtremes[series.index].difference = 1;
        }

        series.options.data.forEach((data: number[]) => {
          data[INDEX_SERIES_Y_AXIS] =
            (data[INDEX_SERIES_Y_AXIS] -
              this.seriesExtremes[series.index].min) /
            this.seriesExtremes[series.index].difference;
        });
        series.update(series.options);
      });
    }

    this.isNormalized = !this.isNormalized;
  }

  public cancelPlot(): void {
    this.jobIds.forEach(jobId => {
      this.dataRequestService.cancel(jobId).subscribe();
    });

    this.location.back();
  }

  public createNewPlot(): void {
    const modalRef = this.modalService.open(ModalDataRequestComponent, {
      backdrop: "static"
    });

    if (this.dataRequest) {
      modalRef.componentInstance.setInitialData({
        actionName: "Plot",
        selectedIds: this.parameterIds,
        timeStart: new Date(this.dataRequest.TimeStart),
        timeEnd: new Date(this.dataRequest.TimeEnd),
        valueMin: this.dataRequest.ValueMin,
        valueMax: this.dataRequest.ValueMax,
        sampleRates: this.dataRequest.SampleRateMs / 1000,
        deadBand: this.dataRequest.DeadBand,
        aggregationType: this.dataRequest.AggregationType,
        aggregationPeriods: this.dataRequest.AggregationPeriodMs / 1000
      });
    } else {
      modalRef.componentInstance.setInitialData({
        actionName: "Plot",
        selectedIds: this.parameterIds
      });
    }

    modalRef.result
      .then((jobIds: number[]) => {
        const routeParameters: IRouteParameters = {
          job_ids: jobIds.toString()
        };

        this.router.navigate([routeParameters], {
          relativeTo: this.route,
          replaceUrl: true
        });
      })
      .catch(() => {
        // Modal dismissed
      });
  }

  private createPlot(): void {
    this.plot = new Chart({
      chart: {
        type: "line",
        zoomType: "xy",
        panning: true,
        panKey: "shift"
      },
      boost: {
        enabled: true,
        useGPUTranslations: true
      },
      mapNavigation: {
        enabled: true,
        enableButtons: false
      },
      credits: {
        enabled: false
      },
      exporting: {
        chartOptions: {
          title: undefined
        },
        fallbackToExportServer: false,
        scale: 3,
        sourceHeight: 595, // A4 points
        sourceWidth: 842 // A4 points
      },
      title: undefined,
      plotOptions: {
        series: {
          boostThreshold: 5000,
          stickyTracking: false,
          marker: {
            enabled: false
          },
          states: {
            hover: {
              lineWidthPlus: 0
            }
          }
        }
      },
      xAxis: {
        type: "datetime",
        dateTimeLabelFormats: {
          millisecond: "%Y-%b-%e %H:%M:%S.%L"
        }
      },
      yAxis: {
        title: undefined
      }
    } as any);
  }

  private pollDataRequests(): void {
    this.dataRequest = undefined;
    this.dataRequests = [];
    this.parameterIds = [];
    this.plotSeriesLoaded = 0;

    this.createPlot();
    this.jobIds.forEach(jobId => {
      this.dataRequestService
        .pollUntilReady(jobId)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(dataRequest => this.parseDataRequest(dataRequest));
    });
  }

  private parseDataRequest(dataRequest: IDataRequest): void {
    if (dataRequest.Status === DataRequestStatus.Finished) {
      this.createPlotSeries(dataRequest);
    } else if (dataRequest.Status === DataRequestStatus.Error) {
      this.plotSeriesLoaded = this.plotSeriesLoaded + 1;
      this.notifier.notify(
        NotificationMessageType.Error,
        `Error occurred during data request #${dataRequest.JobId}`
      );
    }

    this.dataRequests.push(dataRequest);
    this.parameterIds.push(dataRequest.ParameterId);

    if (this.dataRequests.length === this.jobIds.length) {
      if (this.dataRequestService.isListEqual(this.dataRequests)) {
        this.dataRequest = dataRequest;
      }
    }
  }

  private createPlotSeries(dataRequest: IDataRequest): void {
    combineLatest(
      this.dataloggerService.getDataParameter(dataRequest.ParameterId),
      this.dataRequestService.getData(dataRequest.JobId)
    )
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        ([parameter, plotData]: [IDataParameter, IDataRequestPlotItem[]]) => {
          const name = parameter.Unit
            ? `${parameter.LongName} (${parameter.Unit})`
            : parameter.LongName;
          const step =
            dataRequest.AggregationType === AggregationType.None
              ? "left"
              : undefined;
          const data = plotData.map(point => [
            Date.parse(point.Timestamp),
            Number(point.Value)
          ]);

          this.plot.addSerie({
            name: name,
            step: step,
            data: data as any[]
          } as any);

          this.plotSeriesLoaded = this.plotSeriesLoaded + 1;
        }
      );
  }
}
