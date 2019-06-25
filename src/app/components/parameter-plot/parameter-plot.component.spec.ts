import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ChartModule } from "angular-highcharts";

import { MockVesselServiceProvider } from "../../services/vessel.service.spec";
import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarContainerComponent } from "../sidebar-container/sidebar-container.component";
import { SpinnerComponent } from "../spinner/spinner.component";
import { ParameterPlotComponent } from "./parameter-plot.component";

describe("ParameterPlotComponent", () => {
  let component: ParameterPlotComponent;
  let fixture: ComponentFixture<ParameterPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ParameterPlotComponent,
        SidebarBlockComponent,
        SidebarContainerComponent,
        SpinnerComponent
      ],
      imports: [
        ChartModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [MockVesselServiceProvider]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
