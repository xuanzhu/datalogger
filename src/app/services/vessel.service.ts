import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

export const VESSELS = [
  "aud",
  "cal",
  "lor",
  "oce",
  "psc",
  "psc2",
  "sol",
  "tgm"
];

@Injectable({
  providedIn: "root"
})
export class VesselService {
  private remote: boolean = false;
  private vessel: string;
  private vessel$: ReplaySubject<string> = new ReplaySubject<string>();

  public initVessel(vessel: string, remote: boolean): void {
    this.remote = remote;

    if (this.vessel !== vessel.toUpperCase()) {
      this.vessel = vessel.toUpperCase();
      this.vessel$.next(this.vessel);
    }
  }

  public isRemote(): boolean {
    return this.remote;
  }

  public getVessel(): string {
    if (!this.vessel) {
      console.error("Vessel is not defined yet");

      return "";
    }

    return this.vessel;
  }

  public getVesselSubject(): ReplaySubject<string> {
    return this.vessel$;
  }

  public getProductionViewerUrl(): string {
    if (this.isRunningOnVessel()) {
      return "http://ppd-viewer.allseas.local/";
    } else {
      const vessel = this.getVessel().toLowerCase();

      return `http://ppd-viewer.allseas.global/${vessel}`;
    }
  }

  public isRunningOnVessel(): boolean {
    return window.IS_RUNNING_ON_VESSEL;
  }
}
