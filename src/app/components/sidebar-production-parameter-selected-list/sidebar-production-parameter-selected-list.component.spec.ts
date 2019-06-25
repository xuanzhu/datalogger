import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarProductionParameterSelectedListComponent } from "./sidebar-production-parameter-selected-list.component";

describe("SidebarProductionParameterSelectedListComponent", () => {
  let component: SidebarProductionParameterSelectedListComponent;
  let fixture: ComponentFixture<
    SidebarProductionParameterSelectedListComponent
  >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarProductionParameterSelectedListComponent,
        SidebarBlockComponent
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      SidebarProductionParameterSelectedListComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
