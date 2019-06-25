import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { takeUntil } from "rxjs/operators";

import { IDataRequest } from "../../models/data-request";
import { DataRequestService } from "../../services/data-request.service";
import { ComponentOnDestroy } from "../../utilities/component-on-destroy";
import { DATE_TIME_FORMAT } from "../date-time-input/date-time-input.component";

@Component({
  selector: "sidebar-data-request-details",
  templateUrl: "./sidebar-data-request-details.component.html",
  styleUrls: ["./sidebar-data-request-details.component.scss"]
})
export class SidebarDataRequestDetailsComponent extends ComponentOnDestroy {
  @Input()
  public set jobIds(jobIds: number[]) {
    this.dataRequest = undefined;
    this.dataRequests = [];
    this.dataRequestJobIds = jobIds;

    this.dataRequestJobIds.forEach(jobId => {
      this.retrieveDataRequest(jobId);
    });
  }

  public dataRequest: IDataRequest;
  public dataRequests: IDataRequest[] = [];
  public formatDateInput = DATE_TIME_FORMAT;
  public timeStart: moment.Moment;
  public timeEnd: moment.Moment;

  private dataRequestJobIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataRequestService: DataRequestService
  ) {
    super();
  }

  private retrieveDataRequest(jobId: number): void {
    this.dataRequestService
      .pollUntilReady(jobId)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(dataRequest => {
        this.dataRequests.push(dataRequest);

        if (this.dataRequests.length === this.dataRequestJobIds.length) {
          if (this.dataRequestService.isListEqual(this.dataRequests)) {
            this.setDataRequest(dataRequest);
          } else {
            this.dataRequest = undefined;
          }
        }
      });
  }

  private setDataRequest(dataRequest): void {
    this.dataRequest = dataRequest;
    this.timeStart = moment.utc(dataRequest.TimeStart);
    this.timeEnd = moment.utc(dataRequest.TimeEnd);
  }
}
