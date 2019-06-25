import { OnDestroy } from "@angular/core";
import { ReplaySubject } from "rxjs";

export class ComponentOnDestroy implements OnDestroy {
  protected componentDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
