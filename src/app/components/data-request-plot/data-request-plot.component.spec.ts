import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ChartModule } from "angular-highcharts";
import { NotifierModule } from "angular-notifier";
import { SpinnerComponent } from "../spinner/spinner.component";

import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarContainerComponent } from "../sidebar-container/sidebar-container.component";
import { SidebarDataRequestDetailsComponent } from "../sidebar-data-request-details/sidebar-data-request-details.component";
import { DataRequestPlotComponent } from "./data-request-plot.component";

describe("DataRequestPlotComponent", () => {
  let component: DataRequestPlotComponent;
  let fixture: ComponentFixture<DataRequestPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataRequestPlotComponent,
        SidebarBlockComponent,
        SidebarContainerComponent,
        SidebarDataRequestDetailsComponent,
        SpinnerComponent
      ],
      imports: [
        ChartModule,
        HttpClientTestingModule,
        NotifierModule,
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
