import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NotifierModule } from "angular-notifier";

import { MockVesselServiceProvider } from "../../services/vessel.service.spec";
import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarContainerComponent } from "../sidebar-container/sidebar-container.component";
import { SidebarParameterFavoriteListComponent } from "../sidebar-parameter-favorite-list/sidebar-parameter-favorite-list.component";
import { DashboardComponent } from "./dashboard.component";

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        SidebarBlockComponent,
        SidebarContainerComponent,
        SidebarParameterFavoriteListComponent
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, NotifierModule],
      providers: [MockVesselServiceProvider]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
