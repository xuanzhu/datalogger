import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "vessel-selection",
  templateUrl: "./vessel-selection.component.html",
  styleUrls: ["./vessel-selection.component.css"]
})
export class VesselSelectionComponent implements OnInit {
  constructor(private router: Router) {}

  public ngOnInit() {
    if (window.IS_RUNNING_ON_VESSEL) {
      this.router.navigate([window.VESSEL]);
    }
  }
}
