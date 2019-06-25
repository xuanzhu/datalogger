import { Component } from "@angular/core";

import { VesselService } from "../../services/vessel.service";

@Component({
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"]
})

// test
export class LayoutComponent {
  public get vessel(): string {
    return this.vesselService.getVessel();
  }

  public get isProductionVessel(): boolean {
    if (this.vessel === "OCE" || this.vessel === "CAL") {
      return false;
    } else return true;
  }

  public get isRunningOnVessel(): boolean {
    return this.vesselService.isRunningOnVessel();
  }

  public get productionViewerUrl(): string {
    return this.vesselService.getProductionViewerUrl();
  }

  constructor(private vesselService: VesselService) {}

  public isVesselActive(vessel: string): boolean {
    return this.vessel === vessel;
  }
}
