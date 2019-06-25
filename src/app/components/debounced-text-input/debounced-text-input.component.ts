import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "debounced-text-input",
  templateUrl: "./debounced-text-input.component.html",
  styleUrls: ["./debounced-text-input.component.css"]
})
export class DebouncedTextInputComponent implements OnInit {
  @Input()
  public text: string = "";
  @Input()
  public placeholder: string = "";
  @Input()
  public debounceTime: number = 500;
  @Output()
  public textChange = new EventEmitter<string>();

  private text$: Subject<string> = new Subject<string>();

  public setInputText(text: string) {
    this.text$.next(text);
  }

  public ngOnInit() {
    this.text$
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(text => this.textChange.emit(text));
  }
}
