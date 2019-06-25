import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbActiveModal,
  NgbDatepickerModule,
  NgbModalModule
} from "@ng-bootstrap/ng-bootstrap";

import { DateTimeInputComponent } from "../date-time-input/date-time-input.component";
import { SubmitButtonComponent } from "../submit-button/submit-button.component";
import { ModalProductionEventComponent } from "./modal-production-event.component";

describe("ModalProductionEventComponent", () => {
  let component: ModalProductionEventComponent;
  let fixture: ComponentFixture<ModalProductionEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModalProductionEventComponent,
        DateTimeInputComponent,
        SubmitButtonComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbDatepickerModule,
        NgbModalModule
      ],
      providers: [NgbActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProductionEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
