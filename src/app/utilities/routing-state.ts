import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class RoutingState {
  private history = [];

  constructor(private router: Router) {}

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.history.push(urlAfterRedirects);
      });
  }

  public getHistory(): string[] {
    return this.history;
  }
}
