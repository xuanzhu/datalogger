import { Component } from "@angular/core";

import { RoutingState } from "../../utilities/routing-state";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(private routingState: RoutingState) {
    this.routingState.loadRouting();
  }
}
