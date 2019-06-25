import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

@Component({
  selector: "modal-production-event",
  templateUrl: "./modal-production-event.component.html",
  styleUrls: ["./modal-production-event.component.scss"]
})
export class ModalProductionEventComponent {
  private static validatorDateTimes(
    control: FormGroup
  ): ValidationErrors | null {
    const { dateStart, dateEnd } = control.value;

    if (dateStart >= dateEnd) {
      return { timeSpanNegative: true };
    } else if (dateStart && dateEnd && dateEnd.diff(dateStart, "days") > 7) {
      return { timeSpanOutOfRange: true };
    } else {
      return null;
    }
  }

  public form: FormGroup;
  public isSubmitting: boolean = false;

  constructor(public activeModal: NgbActiveModal) {
    this.form = new FormGroup(
      {
        dateStart: new FormControl(undefined, [Validators.required]),
        dateEnd: new FormControl(undefined, [Validators.required])
      },
      {
        validators: [ModalProductionEventComponent.validatorDateTimes]
      }
    );
  }

  public initializeDates(
    dateStart: moment.Moment,
    dateEnd: moment.Moment
  ): void {
    this.form.setValue({
      dateStart: dateStart,
      dateEnd: dateEnd
    });
  }

  public setLastHour(): void {
    this.form.setValue({
      dateStart: moment.utc().subtract(1, "hour"),
      dateEnd: moment.utc()
    });
  }

  public setLastDay(): void {
    this.form.setValue({
      dateStart: moment.utc().subtract(1, "day"),
      dateEnd: moment.utc()
    });
  }

  public setLastWeek(): void {
    this.form.setValue({
      dateStart: moment.utc().subtract(1, "week"),
      dateEnd: moment.utc()
    });
  }

  public cancel(): void {
    this.activeModal.dismiss();
  }

  public submit(): void {
    if (!this.isSubmitting) {
      this.isSubmitting = true;

      this.activeModal.close(this.form.value);
    }
  }
}
