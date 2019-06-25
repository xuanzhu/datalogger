import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ControlContainer, FormsModule } from "@angular/forms";
import { NgbDate, NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

import { DateTimeInputComponent } from "./date-time-input.component";

describe("DateTimeInputComponent", () => {
  let component: DateTimeInputComponent;
  let fixture: ComponentFixture<DateTimeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DateTimeInputComponent],
      imports: [FormsModule, NgbDatepickerModule],
      providers: [ControlContainer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return UTC when typing", () => {
    let result: moment.Moment;
    let touched: boolean;

    component.registerOnChange(d => (result = d));
    component.registerOnTouched(() => (touched = true));
    component.setDateInput("2019-01-16 15:05");

    expect(result.toISOString()).toBe("2019-01-16T15:05:00.000Z");
  });

  it("should return UTC when selecting", () => {
    let result: moment.Moment;
    let touched: boolean;

    component.registerOnChange(d => (result = d));
    component.registerOnTouched(() => (touched = true));
    component.setDateSelect(new NgbDate(2019, 1, 16));

    expect(result.toISOString()).toBe("2019-01-16T00:00:00.000Z");
  });
});
