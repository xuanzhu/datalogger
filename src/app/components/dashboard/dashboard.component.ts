import { Component, OnInit, ViewChild } from "@angular/core";
import { NotifierService } from "angular-notifier";
import * as moment from "moment";

import { IApiVersion } from "../../models/api-version";
import { NotificationMessageType } from "../../models/notification-message-item";
import { IProductionEvent } from "../../models/production-event";
import { IUser, UserRole } from "../../models/user";
import { ApiService } from "../../services/api.service";
import { DataloggerService } from "../../services/datalogger.service";
import { ProductionService } from "../../services/production.service";
import { UserService } from "../../services/user.service";
import { VesselService } from "../../services/vessel.service";
import { DATE_TIME_FORMAT } from "../date-time-input/date-time-input.component";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  @ViewChild("notification") public customNotificationTmpl;
  public get apiIsRemote(): boolean {
    return this.vesselService.isRemote();
  }

  public get apiUrl(): string {
    return this.apiService.getUrl();
  }

  public get dataloggerParameterCountText(): string {
    if (this.dataloggerParameterCount) {
      return this.dataloggerParameterCount.toString();
    } else {
      return "—";
    }
  }

  public get dataloggerTimestampText(): string {
    if (this.dataloggerTimestamp) {
      return this.dataloggerTimestamp.format(DATE_TIME_FORMAT);
    } else {
      return "—";
    }
  }

  public get isApiToggleVisible(): boolean {
    return !this.vesselService.isRunningOnVessel();
  }

  public get productionParameterCountText(): string {
    if (this.productionParameterCount) {
      return this.productionParameterCount.toString();
    } else {
      return "—";
    }
  }

  public get productionEventTimestampText(): string {
    if (this.latestProductionEvent) {
      return this.latestProductionEvent.Timestamp.format(DATE_TIME_FORMAT);
    } else {
      return "—";
    }
  }

  public get vessel(): string {
    return this.vesselService.getVessel();
  }

  public get welcomeUser(): string {
    if (this.currentUser) {
      const userName = this.currentUser.UserName;
      const userNameFriendly = userName.substr(userName.lastIndexOf("\\") + 1);

      return `Welcome, ${userNameFriendly}`;
    } else {
      return "Welcome";
    }
  }

  public get urlVesselLocal(): string {
    return `/${this.vessel.toLowerCase()}`;
  }

  public get urlVesselRemote(): string {
    return `/${this.vessel.toLowerCase()};remote`;
  }

  public apiVersion: IApiVersion;
  public currentUser: IUser;
  public dataloggerParameterCount: number;
  public dataloggerTimestamp: moment.Moment;
  public latestProductionEvent: IProductionEvent;
  public productionParameterCount: number;
  public userRoleEnum = UserRole;

  constructor(
    private apiService: ApiService,
    private dataloggerService: DataloggerService,
    private productionService: ProductionService,
    private userService: UserService,
    private vesselService: VesselService,
    private notify: NotifierService
  ) {}

  public ngOnInit(): void {
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(
      window.navigator.userAgent
    );
    if (isIEOrEdge) {
      this.notify.show({
        message:
          "Viewer not supports Internet Explorer. We recommend upgrading to latest Chrome",
        type: NotificationMessageType.Warning,
        template: this.customNotificationTmpl
      });
    }
    this.apiService
      .getVersion()
      .subscribe(apiVersion => (this.apiVersion = apiVersion));
    this.dataloggerService
      .getDataParameters()
      .subscribe(
        parameters => (this.dataloggerParameterCount = parameters.length)
      );
    this.dataloggerService
      .getLatestTimestamp()
      .subscribe(timestamp => (this.dataloggerTimestamp = timestamp));

    if (this.vessel !== "OCE" && this.vessel !== "CAL") {
      this.productionService
        .getLatestProductionEvent()
        .subscribe(
          productionEvent => (this.latestProductionEvent = productionEvent)
        );
      this.productionService
        .getProductionParameters()
        .subscribe(
          parameters => (this.productionParameterCount = parameters.length)
        );
    }
    this.userService
      .getCurrentUser()
      .subscribe(user => (this.currentUser = user));
  }

  public userRoleClass(userRole: UserRole): object {
    if (this.currentUser) {
      return {
        "badge-danger": !this.currentUser.Roles[userRole],
        "badge-success": this.currentUser.Roles[userRole]
      };
    } else {
      return { "badge-secondary": true };
    }
  }

  public userRoleText(userRole: UserRole): string {
    if (this.currentUser) {
      return this.currentUser.Roles[userRole] ? "Yes" : "No";
    } else {
      return "Unknown";
    }
  }
}
