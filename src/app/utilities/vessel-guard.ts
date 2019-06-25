import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";

import { VESSELS, VesselService } from "../services/vessel.service";

@Injectable({
  providedIn: "root"
})
export class VesselGuard implements CanActivate {
  constructor(private router: Router, private vesselService: VesselService) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const vessel = route.params.vessel.toLowerCase();

    if (VESSELS.includes(vessel)) {
      const remote = route.paramMap.has("remote");

      this.vesselService.initVessel(vessel, remote);

      return true;
    } else {
      this.router.navigate(["/"]);

      return false;
    }
  }
}
