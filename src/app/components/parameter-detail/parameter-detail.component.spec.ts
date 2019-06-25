import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

import { MockVesselServiceProvider } from "../../services/vessel.service.spec";
import { ParameterDetailComponent } from "./parameter-detail.component";

describe("ParameterDetailComponent", () => {
  let component: ParameterDetailComponent;
  let fixture: ComponentFixture<ParameterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterDetailComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [MockVesselServiceProvider]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
