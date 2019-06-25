import { Component, forwardRef, Input, OnInit } from "@angular/core";
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from "@angular/forms";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm";
export const DATE_TIME_FORMAT_FRACTIONAL = "YYYY-MM-DD HH:mm:ss.SSS";

@Component({
  selector: "date-time-input",
  templateUrl: "./date-time-input.component.html",
  styleUrls: ["./date-time-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeInputComponent),
      multi: true
    }
  ]
})
export class DateTimeInputComponent implements ControlValueAccessor, OnInit {
  @Input() public autofocus: boolean = false;
  @Input() public formControlName: string;
  @Input() public inputId: string;
  @Input() public invalid: boolean = false;
  @Input() public required: boolean = false;
  @Input() public placeholder: string = "yyyy-mm-dd";

  public dateInput: string;
  public dateDatepicker: NgbDate;
  public formControl: AbstractControl;

  private date: moment.Moment;
  private onChange: (date: moment.Moment) => void;
  private onTouched: () => void;

  constructor(private controlContainer: ControlContainer) {}

  public ngOnInit(): void {
    if (this.formControlName) {
      this.formControl = this.controlContainer.control.get(
        this.formControlName
      );
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    // Not implemented
  }

  public writeValue(value: moment.Moment): void {
    if (value) {
      this.setDate(value, true);
      this.formatDateInput();
    }
  }

  public setDateSelect(ngbDate: NgbDate): void {
    const date = moment
      .utc()
      .year(ngbDate.year)
      .month(ngbDate.month - 1)
      .date(ngbDate.day)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);

    this.setDate(date);
    this.formatDateInput();
  }

  public setDateInput(dateInput: string): void {
    const date = moment.utc(dateInput);

    if (date.isValid()) {
      this.setDate(date);
    }
  }

  public formatDateInput(): void {
    if (this.date) {
      this.dateInput = this.date.format(DATE_TIME_FORMAT);
    }
  }

  private setDate(date: moment.Moment, initialDate: boolean = false): void {
    this.date = date;
    this.dateDatepicker = new NgbDate(
      date.year(),
      date.month() + 1,
      date.date()
    );

    if (initialDate) {
      this.formatDateInput();
    } else if (this.onChange) {
      this.onChange(this.date);
      this.onTouched();
    }
  }
}
