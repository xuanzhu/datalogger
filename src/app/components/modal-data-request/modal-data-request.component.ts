/* tslint:disable:prefer-array-literal */
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NotifierService } from "angular-notifier";
import * as moment from "moment";

import {
  AggregationType,
  IDataRequestDialogItem
} from "../../models/data-request-dialog-item";
import { NotificationMessageType } from "../../models/notification-message-item";
import { DataRequestService } from "../../services/data-request.service";
import { DataloggerService } from "../../services/datalogger.service";
import { DATE_TIME_FORMAT } from "../date-time-input/date-time-input.component";

@Component({
  selector: "modal-data-request",
  templateUrl: "./modal-data-request.component.html",
  styleUrls: ["./modal-data-request.component.css"]
})
export class ModalDataRequestComponent {
  private static timestampLatestEntry = moment.utc();

  private static validatorDateTimes(
    control: FormGroup
  ): ValidationErrors | null {
    const { dateStart, dateEnd } = control.value;

    if (dateStart >= dateEnd) {
      return { timeSpanNegative: true };
    } else {
      return null;
    }
  }

  private static validatorValues(control: FormGroup): ValidationErrors | null {
    const { valueMin, valueMax } = control.value;

    if (valueMin && valueMax && valueMin >= valueMax) {
      return { valueDiffNegative: true };
    } else {
      return null;
    }
  }

  private static validatorSampleRate(
    control: FormGroup
  ): ValidationErrors | null {
    const sampleRates = control.value;
    const sampleRateMs = sampleRates * 1000;

    if (Number.isInteger(sampleRateMs)) {
      return null;
    } else {
      return { sampleRateNotInteger: true };
    }
  }

  public AggregationType = AggregationType;
  public form: FormGroup;
  public isSubmitting = false;

  private data: IDataRequestDialogItem = {
    actionName: "Plot",
    selectedIds: []
  };

  constructor(
    public activeModal: NgbActiveModal,
    private dataloggerService: DataloggerService,
    private dataRequestService: DataRequestService,
    private notifier: NotifierService
  ) {
    this.form = new FormGroup(
      {
        dateStart: new FormControl(undefined, [Validators.required]),
        dateEnd: new FormControl(undefined, [Validators.required]),
        valueMin: new FormControl(undefined),
        valueMax: new FormControl(undefined),
        deadBand: new FormControl(undefined, [
          Validators.required,
          Validators.min(0)
        ]),
        sampleRates: new FormControl(undefined, [
          Validators.required,
          Validators.min(0),
          ModalDataRequestComponent.validatorSampleRate
        ]),
        aggregationPeriods: new FormControl(undefined, [
          Validators.required,
          Validators.min(1)
        ]),
        aggregationType: new FormControl()
      },
      {
        validators: [
          ModalDataRequestComponent.validatorValues,
          ModalDataRequestComponent.validatorDateTimes
        ]
      }
    );
  }

  public setInitialData(data: IDataRequestDialogItem): void {
    this.data = data;
    this.initializeFormValues({
      ...this.dataRequestService.getDataRequestDialogDefaults(),
      ...this.data
    });
    this.initializeValidatorDataAvailable();
  }

  public get aggregationTypes(): Array<{ key: string; value: string }> {
    return Object.keys(AggregationType).map(k => ({
      key: AggregationType[k].toString(),
      value: k
    }));
  }

  public get title(): string {
    const countSelectedIds = this.data.selectedIds.length;

    if (countSelectedIds === 1) {
      return "One parameter selected";
    } else {
      return `${countSelectedIds} parameters selected`;
    }
  }

  public get actionName(): string {
    return this.data.actionName;
  }

  public getErrorMessage(control: AbstractControl): string {
    if (control.hasError("required")) {
      return "You must enter a value";
    } else if (control.hasError("min")) {
      return `Value must be at least ${control.errors.min.min}`;
    } else if (control.hasError("max")) {
      return `Value can be at most ${control.errors.max.max}`;
    } else if (control.hasError("sampleRateNotInteger")) {
      return "Value should represent whole milliseconds";
    } else if (control.hasError("dataNotAvailable")) {
      const timestampString = ModalDataRequestComponent.timestampLatestEntry.format(
        DATE_TIME_FORMAT
      );

      return `Data is not available after ${timestampString}`;
    } else {
      return null;
    }
  }

  public cancel(): void {
    this.activeModal.dismiss();
  }

  public submit(): void {
    if (this.form.valid && !this.isSubmitting) {
      const formValues = this.form.value;
      const data: IDataRequestDialogItem = {
        ...this.data,
        ...formValues,
        timeStart: formValues.dateStart.toDate(),
        timeEnd: formValues.dateEnd.toDate()
      };

      this.isSubmitting = true;
      this.dataRequestService.setDataRequestDialogDefaults(data);
      this.createDataRequests(data);
    }
  }

  private createDataRequests(parameterSettings: IDataRequestDialogItem): void {
    const jobIds = [];

    parameterSettings.selectedIds.forEach(projectParameterId => {
      const parameters = {
        ParameterId: projectParameterId,
        TimeStart: parameterSettings.timeStart,
        TimeEnd: parameterSettings.timeEnd,
        DeadBand: parameterSettings.deadBand,
        ValueMin: parameterSettings.valueMin,
        ValueMax: parameterSettings.valueMax,
        AggregationType: parameterSettings.aggregationType,
        AggregationPeriodMs: parameterSettings.aggregationPeriods * 1000,
        SampleRateMs: parameterSettings.sampleRates * 1000
      };

      this.dataRequestService.post(parameters).subscribe(
        jobId => {
          jobIds.push(jobId);

          if (jobIds.length >= parameterSettings.selectedIds.length) {
            this.activeModal.close(jobIds);
          }
        },
        () => {
          this.notifier.notify(
            NotificationMessageType.Error,
            "Could not create data request"
          );

          this.isSubmitting = false;
        }
      );
    });
  }

  private initializeFormValues(data: IDataRequestDialogItem): void {
    let dateStart: moment.Moment;
    let dateEnd: moment.Moment;

    if (data.timeStart) {
      dateStart = moment(data.timeStart).utc();
    } else {
      dateStart = moment()
        .utc()
        .subtract(5, "minutes");
    }

    if (data.timeEnd) {
      dateEnd = moment(data.timeEnd).utc();
    } else {
      dateEnd = moment().utc();
    }

    this.form.controls.dateStart.setValue(dateStart);
    this.form.controls.dateEnd.setValue(dateEnd);
    this.form.controls.valueMin.setValue(data.valueMin || undefined);
    this.form.controls.valueMax.setValue(data.valueMax || undefined);
    this.form.controls.deadBand.setValue(data.deadBand || 0);
    this.form.controls.sampleRates.setValue(data.sampleRates || 0);
    this.form.controls.aggregationType.setValue(
      data.aggregationType || AggregationType.None
    );
    this.form.controls.aggregationPeriods.setValue(
      data.aggregationPeriods || 60
    );
  }

  private initializeValidatorDataAvailable(): void {
    ModalDataRequestComponent.timestampLatestEntry = moment.utc();

    if (Array.isArray(this.data.selectedIds)) {
      this.data.selectedIds.forEach(id =>
        this.dataloggerService
          .getLatestTimestampForParameter(id)
          .subscribe(timestamp => {
            if (timestamp < ModalDataRequestComponent.timestampLatestEntry) {
              ModalDataRequestComponent.timestampLatestEntry = timestamp;

              if (this.form.controls.dateEnd.value > timestamp) {
                const dateEnd = moment.utc(timestamp);
                const dateStart = moment.utc(timestamp).subtract(5, "minutes");

                this.form.controls.dateStart.setValue(dateStart);
                this.form.controls.dateEnd.setValue(dateEnd);
              }
            }
          })
      );
    }
  }
}
