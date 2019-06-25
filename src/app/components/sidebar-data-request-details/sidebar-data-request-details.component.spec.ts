import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarDataRequestDetailsComponent } from "./sidebar-data-request-details.component";

describe("SidebarDataRequestDetailsComponent", () => {
  let component: SidebarDataRequestDetailsComponent;
  let fixture: ComponentFixture<SidebarDataRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarDataRequestDetailsComponent, SidebarBlockComponent],
      imports: [RouterTestingModule, HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarDataRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
