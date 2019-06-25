import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Chart } from "angular-highcharts";
import * as moment from "moment";

import { IDataParameter } from "../../models/data-parameter";
import { DataloggerService } from "../../services/datalogger.service";
import { DATE_TIME_FORMAT } from "../date-time-input/date-time-input.component";

enum RouteParameter {
  DateStart = "date_start",
  Interval = "interval",
  ParameterId = "id"
}

@Component({
  selector: "app-parameter-plot",
  templateUrl: "./parameter-plot.component.html",
  styleUrls: ["./parameter-plot.component.scss"]
})
export class ParameterPlotComponent implements OnInit {
  public get dateStartText(): string {
    if (this.dateStart) {
      return this.dateStart.format(DATE_TIME_FORMAT);
    }
  }

  public get dateEndText(): string {
    if (this.dateStart && this.timeInterval) {
      return moment
        .utc(this.dateStart)
        .add(this.timeInterval, "s")
        .format(DATE_TIME_FORMAT);
    }
  }

  public get interval(): string {
    return this.timeInterval.toString();
  }

  public set interval(value: string) {
    const valueNumber = parseInt(value, 10);

    if (this.timeInterval !== valueNumber) {
      this.timeInterval = valueNumber;
      this.updateCurrentRoute();
    }
  }

  public get intervalText(): string {
    if (this.timeInterval) {
      return moment.duration(this.timeInterval, "s").humanize();
    }
  }

  public get isLaterDisabled(): boolean {
    const dateStartLater = moment
      .utc(this.dateStart)
      .add(this.timeInterval, "s");

    return dateStartLater >= this.parameterLatestTimestamp;
  }

  public initialized = false;
  public plot: Chart;

  private timeInterval = 300;
  private dateStart: moment.Moment;
  private parameter: IDataParameter;
  private parameterId: number;
  private parameterLatestTimestamp: moment.Moment;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataloggerService: DataloggerService
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.parameterId = parseInt(params.get(RouteParameter.ParameterId), 10);

      if (params.has(RouteParameter.DateStart)) {
        this.dateStart = moment.utc(params.get(RouteParameter.DateStart));
      }

      if (params.has(RouteParameter.Interval)) {
        this.timeInterval = parseInt(params.get(RouteParameter.Interval), 10);
      }

      if (this.initialized) {
        this.loadData();
      } else {
        this.initializeChart();
        this.initializeParameter();
      }
    });
  }

  @HostListener("document:keydown", ["$event"])
  public keyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        this.setEarlier();
        break;
      case "ArrowRight":
        event.preventDefault();
        this.setLater();
        break;
    }
  }

  public setEarlier(): void {
    this.dateStart.subtract(this.timeInterval, "s");
    this.updateCurrentRoute();
  }

  public setLater(): void {
    if (!this.isLaterDisabled) {
      this.dateStart.add(this.timeInterval, "s");
      this.updateCurrentRoute();
    }
  }

  private initializeChart(): void {
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

  private initializeParameter(): void {
    this.dataloggerService
      .getDataParameter(this.parameterId)
      .subscribe(parameter => (this.parameter = parameter));
    this.dataloggerService
      .getLatestTimestampForParameter(this.parameterId)
      .subscribe(timestamp => {
        this.parameterLatestTimestamp = timestamp;

        if (this.dateStart) {
          this.loadData();
        } else {
          this.dateStart = moment
            .utc(timestamp)
            .subtract(this.timeInterval, "s");
          this.updateCurrentRoute();
        }
      });
  }

  private loadData(): void {
    this.plot.ref$.subscribe(chart => chart.showLoading("Loading data..."));
    this.dataloggerService
      .getDataForParameter(this.parameterId, this.dateStart, this.timeInterval)
      .subscribe(data => {
        const plotData = data.map(point => [
          Date.parse(point.Timestamp),
          Number(point.Value)
        ]);

        this.initialized = true;
        this.plot.ref$.subscribe(chart => {
          if (chart.series.length > 0) {
            chart.series[0].setData(plotData);
          } else {
            const name = this.parameter.Unit
              ? `${this.parameter.LongName} (${this.parameter.Unit})`
              : this.parameter.LongName;

            this.plot.addSerie({
              name: name,
              data: plotData,
              step: "left"
            } as any);
          }

          chart.hideLoading();
        });
      });
  }

  private updateCurrentRoute(): void {
    const routeParameters = {
      [RouteParameter.DateStart]: this.dateStart.toISOString(),
      [RouteParameter.Interval]: this.interval
    };

    this.router.navigate([routeParameters], {
      relativeTo: this.route,
      replaceUrl: true
    });
  }
}
