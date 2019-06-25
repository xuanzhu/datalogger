import { Component, Input } from "@angular/core";

import { IProductionParameter } from "../../models/production-parameter";
import { ProductionService } from "../../services/production.service";

@Component({
  selector: "sidebar-production-parameter-selected-list",
  templateUrl: "./sidebar-production-parameter-selected-list.component.html",
  styleUrls: ["./sidebar-production-parameter-selected-list.component.scss"]
})
export class SidebarProductionParameterSelectedListComponent {
  @Input()
  public set parameterIds(ids: number[]) {
    if (Array.isArray(ids) && this.productionParameterIds !== ids) {
      this.productionParameterIds = ids;
      this.productionParameters = [];

      ids.forEach(id =>
        this.productionService
          .getProductionParameter(id)
          .subscribe(p => this.productionParameters.push(p))
      );
    }
  }

  public productionParameters: IProductionParameter[] = [];
  private productionParameterIds: number[] = [];

  constructor(private productionService: ProductionService) {}
}
