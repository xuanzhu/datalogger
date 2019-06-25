import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ColDef } from "ag-grid/src/ts/entities/colDef";
import { NotifierService } from "angular-notifier";
import { take } from "rxjs/operators";

import { NotificationMessageType } from "../../models/notification-message-item";
import { IProductionParameter } from "../../models/production-parameter";
import { ProductionService } from "../../services/production.service";
import { GridBase } from "../../utilities/grid-base";

export enum RouteParameter {
  Filter = "filter",
  ParameterIds = "parameter_ids"
}

@Component({
  selector: "production-parameter-list",
  templateUrl: "./production-parameter-list.component.html",
  styleUrls: ["./production-parameter-list.component.scss"]
})
export class ProductionParameterListComponent extends GridBase
  implements OnInit {
  public get isDisabled(): boolean {
    return this.selectedIds.length === 0;
  }

  public readonly gridId: string = ProductionParameterListComponent.name;
  public readonly columnDefinitions: ColDef[] = [
    { field: "Id" },
    { field: "Name" },
    { field: "Description" }
  ];
  public filterText: string = "";
  public productionParameters: IProductionParameter[];
  public selectedIds: number[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notifier: NotifierService,
    private productionService: ProductionService
  ) {
    super();

    this.gridApi$.subscribe(() => this.parseRouteParameters());
  }

  public ngOnInit(): void {
    this.parseRouteParameters();
    this.loadProductionParameters();
  }

  public onFirstDataRendered(): void {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  public onSelectionChanged(event: any): void {
    const rowsSelected = event.api.getSelectedRows();

    this.selectedIds = rowsSelected.map(row => row.Id);
    this.updateCurrentRoute();
  }

  public setFilterText(filterText: string): void {
    if (this.gridApi) {
      this.filterText = filterText;
      this.gridApi.setQuickFilter(filterText);
      this.updateCurrentRoute();
    }
  }

  public showEvents(): void {
    const routeParameters = {};

    if (this.selectedIds.length > 0) {
      routeParameters[RouteParameter.ParameterIds] = this.selectedIds;
    }

    this.router.navigate(["../production-events", routeParameters], {
      relativeTo: this.route
    });
  }

  private loadProductionParameters(): void {
    this.productionService
      .getProductionParameters()
      .subscribe(
        productionParameters =>
          (this.productionParameters = productionParameters),
        () =>
          this.notifier.notify(
            NotificationMessageType.Error,
            "Couldn't load production parameters"
          )
      );
  }

  private checkSelectedRows(): void {
    if (this.gridApi) {
      this.gridApi.forEachNode(node => {
        if (this.selectedIds.includes(node.data.Id)) {
          node.setSelected(true);
        } else {
          node.setSelected(false);
        }
      });
    }
  }

  private parseRouteParameters(): void {
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      if (params.has(RouteParameter.ParameterIds)) {
        this.selectedIds = params
          .getAll(RouteParameter.ParameterIds)
          .toString()
          .split(",")
          .map(Number);
      }

      if (params.has(RouteParameter.Filter)) {
        this.filterText = params.get(RouteParameter.Filter);
      }

      this.setFilterText(this.filterText);
      this.checkSelectedRows();
    });
  }

  private updateCurrentRoute(): void {
    const routeParameters = {};

    if (this.filterText.trim().length > 0) {
      routeParameters[RouteParameter.Filter] = this.filterText;
    }

    if (this.selectedIds.length > 0) {
      routeParameters[RouteParameter.ParameterIds] = this.selectedIds;
    }

    this.router.navigate([routeParameters], {
      relativeTo: this.route,
      replaceUrl: true
    });
  }
}
