import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { VesselService } from "./vessel.service";

export interface IFavoriteParameter {
  parameterId: number;
  groupName?: string;
}

@Injectable({
  providedIn: "root"
})
export class FavoriteParameterService {
  private favoriteParameters: IFavoriteParameter[] = [];
  private favoriteParameters$ = new Subject<IFavoriteParameter[]>();
  private localStorageKey;

  constructor(private vesselService: VesselService) {
    this.vesselService.getVesselSubject().subscribe(vessel => {
      this.localStorageKey = `${vessel}:favoriteParameters`;
      this.loadFromLocalStorage();
    });
  }

  public getFavoriteParameters(): IFavoriteParameter[] {
    return this.favoriteParameters;
  }

  public getFavoriteParametersSubject(): Subject<IFavoriteParameter[]> {
    return this.favoriteParameters$;
  }

  public add(parameterId: number, groupName?: string): void {
    if (!this.find(parameterId, groupName)) {
      this.favoriteParameters.push({
        parameterId: parameterId,
        groupName: groupName
      });
      this.emit();
    }
  }

  public delete(favoriteParameter: IFavoriteParameter): void {
    const index = this.favoriteParameters.indexOf(favoriteParameter);

    if (index > -1) {
      this.favoriteParameters.splice(index, 1);
      this.emit();
    }
  }

  public clear(): void {
    this.favoriteParameters = [];
    this.emit();
  }

  public find(parameterId: number, groupName?: string): IFavoriteParameter {
    return this.favoriteParameters.find(
      favoriteParameter =>
        favoriteParameter.parameterId === parameterId &&
        favoriteParameter.groupName === groupName
    );
  }

  private emit(): void {
    this.favoriteParameters$.next(this.favoriteParameters);
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.favoriteParameters)
    );
  }

  private loadFromLocalStorage(): void {
    const json = localStorage.getItem(this.localStorageKey);

    if (json) {
      try {
        this.favoriteParameters = JSON.parse(json);
        this.favoriteParameters$.next(this.favoriteParameters);
      } catch {
        console.error("Cannot parse favorite parameters");
      }
    }
  }
}
