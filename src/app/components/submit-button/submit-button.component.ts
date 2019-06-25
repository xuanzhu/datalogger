import { Component, Input } from "@angular/core";

@Component({
  selector: "submit-button",
  templateUrl: "./submit-button.component.html",
  styleUrls: ["./submit-button.component.css"]
})
export class SubmitButtonComponent {
  @Input() public color: string = "primary";
  @Input() public disabled: boolean = false;
  @Input() public loading: boolean = false;
  @Input() public text: string;

  public get buttonClass(): string {
    return `btn btn-${this.color}`;
  }
}
