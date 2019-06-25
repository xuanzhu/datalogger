import { Component, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/operators";

import {
  FavoriteParameterService,
  IFavoriteParameter
} from "../../services/favorite-parameter.service";
import { ComponentOnDestroy } from "../../utilities/component-on-destroy";

export interface IRouteParameters {
  parameter_ids?: number[];
  selected_ids?: number[];
  group?: string;
}

@Component({
  selector: "sidebar-parameter-favorite-list",
  templateUrl: "./sidebar-parameter-favorite-list.component.html",
  styleUrls: ["./sidebar-parameter-favorite-list.component.scss"]
})
export class SidebarParameterFavoriteListComponent extends ComponentOnDestroy
  implements OnInit {
  public favoriteParameters: IFavoriteParameter[] = [];

  constructor(private favoriteParameterService: FavoriteParameterService) {
    super();
  }

  public ngOnInit() {
    this.favoriteParameters = this.favoriteParameterService.getFavoriteParameters();
    this.favoriteParameterService
      .getFavoriteParametersSubject()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        favoriteParameters => (this.favoriteParameters = favoriteParameters)
      );
  }

  public hasDefaultGroup() {
    return this.favoriteParameters
      .map(favoriteParameter => favoriteParameter.groupName)
      .includes(undefined);
  }

  public getGroupNames() {
    return this.favoriteParameters
      .map(favoriteParameter => favoriteParameter.groupName)
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter(groupName => !!groupName)
      .sort();
  }

  public getFavoriteParametersByGroup(groupName?: string) {
    return this.favoriteParameters.filter(
      favoriteParameter => favoriteParameter.groupName === groupName
    );
  }

  public getParameterIdsByGroup(groupName?: string) {
    return this.getFavoriteParametersByGroup(groupName).map(
      favoriteParameter => favoriteParameter.parameterId
    );
  }

  public getRouterLink(groupName?: string) {
    const routeParameters: IRouteParameters = {
      parameter_ids: this.getParameterIdsByGroup(groupName),
      selected_ids: this.getParameterIdsByGroup(groupName)
    };

    if (groupName) {
      routeParameters.group = groupName;
    }

    return ["../parameters", routeParameters];
  }

  public removeGroup(event: MouseEvent, groupName?: string) {
    event.preventDefault();

    if (window.confirm("Are you sure?")) {
      this.getFavoriteParametersByGroup(groupName).forEach(favoriteParameter =>
        this.favoriteParameterService.delete(favoriteParameter)
      );
    }
  }
}
