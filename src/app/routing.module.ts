import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DataRequestExportComponent } from "./components/data-request-export/data-request-export.component";
import { DataRequestListComponent } from "./components/data-request-list/data-request-list.component";
import { DataRequestPlotComponent } from "./components/data-request-plot/data-request-plot.component";
import { LayoutComponent } from "./components/layout/layout.component";
import { NetworkOverviewComponent } from "./components/network-overview/network-overview.component";
import { ParameterDetailComponent } from "./components/parameter-detail/parameter-detail.component";
import { ParameterListComponent } from "./components/parameter-list/parameter-list.component";
import { ParameterPlotComponent } from "./components/parameter-plot/parameter-plot.component";
import { ProductionEventListComponent } from "./components/production-event-list/production-event-list.component";
import { ProductionParameterListComponent } from "./components/production-parameter-list/production-parameter-list.component";
import { VesselSelectionComponent } from "./components/vessel-selection/vessel-selection.component";
import { VesselGuard } from "./utilities/vessel-guard";

const routes: Routes = [
  {
    path: ":vessel",
    component: LayoutComponent,
    canActivate: [VesselGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "welcome", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "network-overview", component: NetworkOverviewComponent },
      { path: "parameters", component: ParameterListComponent },
      { path: "parameters/:id", component: ParameterDetailComponent },
      { path: "parameters/:id/plot", component: ParameterPlotComponent },
      { path: "data-requests", component: DataRequestListComponent },
      {
        path: "data-requests/plot",
        component: DataRequestPlotComponent
      },
      {
        path: "data-requests/export",
        component: DataRequestExportComponent
      },
      { path: "production-events", component: ProductionEventListComponent },
      {
        path: "production-parameters",
        component: ProductionParameterListComponent
      }
    ]
  },
  { path: "", component: VesselSelectionComponent, pathMatch: "full" },
  { path: "**", redirectTo: "", pathMatch: "full" } // @TODO implement error page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {}
