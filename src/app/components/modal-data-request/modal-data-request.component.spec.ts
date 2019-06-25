import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbAccordionModule,
  NgbActiveModal,
  NgbDatepickerModule
} from "@ng-bootstrap/ng-bootstrap";
import { NotifierModule } from "angular-notifier";

import { DateTimeInputComponent } from "../date-time-input/date-time-input.component";
import { SubmitButtonComponent } from "../submit-button/submit-button.component";
import { ModalDataRequestComponent } from "./modal-data-request.component";

describe("ModalDataRequestComponent", () => {
  let component: ModalDataRequestComponent;
  let fixture: ComponentFixture<ModalDataRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModalDataRequestComponent,
        DateTimeInputComponent,
        SubmitButtonComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbAccordionModule,
        NgbDatepickerModule,
        NotifierModule
      ],
      providers: [NgbActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDataRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
