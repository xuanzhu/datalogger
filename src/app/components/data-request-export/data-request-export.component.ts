import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { Observable } from "rxjs";
import { share, takeUntil, tap } from "rxjs/operators";

import { IDataParameter } from "../../models/data-parameter";
import { DataRequestStatus, IDataRequest } from "../../models/data-request";
import { NotificationMessageType } from "../../models/notification-message-item";
import { DataRequestService } from "../../services/data-request.service";
import { DataloggerService } from "../../services/datalogger.service";
import { ComponentOnDestroy } from "../../utilities/component-on-destroy";

@Component({
  selector: "data-request-export",
  templateUrl: "./data-request-export.component.html",
  styleUrls: ["./data-request-export.component.css"]
})
export class DataRequestExportComponent extends ComponentOnDestroy
  implements OnInit {
  public loadingInfo: string = "Loading...";
  public jobIds: number[] = [];
  public parameters$ = new Map<number, Observable<IDataParameter>>();

  private exportDataLoaded: number = 0;

  constructor(
    private route: ActivatedRoute,
    private notifier: NotifierService,
    private dataloggerService: DataloggerService,
    private dataRequestService: DataRequestService,
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
          .map(Number)
          .sort();

        this.getExportData();
      } else {
        this.jobIds = [];
      }
    });
  }

  public getUrl(jobId: number): string {
    return this.dataRequestService.getExportCsvUrl(jobId);
  }

  public get isLoading(): boolean {
    return this.exportDataLoaded < this.jobIds.length;
  }

  public cancelExport(): void {
    this.jobIds.forEach(jobId => {
      this.dataRequestService.cancel(jobId).subscribe();
    });

    this.location.back();
  }

  private getExportData(): void {
    this.jobIds.forEach(jobId => {
      this.dataRequestService
        .pollUntilReady(
          jobId,
          tap(dataRequest => this.setParameter(dataRequest))
        )
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(dataRequest => this.parseDataRequest(dataRequest));
    });
  }

  private setParameter(dataRequest: IDataRequest): void {
    if (!this.parameters$.has(dataRequest.JobId)) {
      const dataParameterObservable = this.dataloggerService
        .getDataParameter(dataRequest.ParameterId)
        .pipe(share());

      this.parameters$.set(dataRequest.JobId, dataParameterObservable);
      dataParameterObservable.subscribe();
    }
  }

  private parseDataRequest(dataRequest: IDataRequest): void {
    this.exportDataLoaded = this.exportDataLoaded + 1;

    if (dataRequest.Status === DataRequestStatus.Finished) {
      this.downloadFile(dataRequest.JobId);
    } else if (dataRequest.Status === DataRequestStatus.Error) {
      this.notifier.notify(
        NotificationMessageType.Error,
        `Error occurred during data request #${dataRequest.JobId}`
      );
    }
  }

  private downloadFile(jobId: number): void {
    const iframe: HTMLIFrameElement = document.createElement("iframe");

    iframe.src = this.getUrl(jobId);
    iframe.style.display = "none";

    document.body.appendChild(iframe);

    setTimeout(() => document.body.removeChild(iframe), 60 * 1000);
  }
}
