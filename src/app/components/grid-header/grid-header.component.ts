import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "grid-header",
  templateUrl: "./grid-header.component.html",
  styleUrls: ["./grid-header.component.css"]
})
export class GridHeaderComponent {
  public showAdvancedOptions: boolean = false;

  @Input()
  public filterText: string = "";
  @Input()
  public csvColumnSeparator = ";";
  @Output()
  public filterTextChange = new EventEmitter<string>();
  @Output()
  public saveState = new EventEmitter<any>();
  @Output()
  public restoreState = new EventEmitter<any>();
  @Output()
  public resetState = new EventEmitter<any>();
  @Output()
  public exportCsv = new EventEmitter<any>();

  public setFilterText(filterText: string) {
    this.filterTextChange.emit(filterText);
  }

  public toggleAdvancedOptions(): void {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  public sendSaveStateEvent() {
    this.saveState.emit();
  }

  public sendRestoreStateEvent() {
    this.restoreState.emit();
  }

  public sendResetStateEvent() {
    this.resetState.emit();
  }

  public onExport() {
    this.exportCsv.emit();
  }
}
