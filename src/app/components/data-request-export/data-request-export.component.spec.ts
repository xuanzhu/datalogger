import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NotifierModule } from "angular-notifier";

import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarContainerComponent } from "../sidebar-container/sidebar-container.component";
import { SidebarDataRequestDetailsComponent } from "../sidebar-data-request-details/sidebar-data-request-details.component";
import { SpinnerComponent } from "../spinner/spinner.component";
import { DataRequestExportComponent } from "./data-request-export.component";

describe("DataRequestExportComponent", () => {
  let component: DataRequestExportComponent;
  let fixture: ComponentFixture<DataRequestExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataRequestExportComponent,
        SidebarContainerComponent,
        SidebarBlockComponent,
        SidebarDataRequestDetailsComponent,
        SpinnerComponent
      ],
      imports: [HttpClientTestingModule, NotifierModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
