/* tslint:disable:max-classes-per-file */
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { NotifierModule } from "angular-notifier";

import { MockFavoriteParameterService } from "../../services/favorite-parameter.service.spec";
import { MockVesselServiceProvider } from "../../services/vessel.service.spec";
import { FeedbackButtonComponent } from "../feedback-button/feedback-button.component";
import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarParameterFavoriteListComponent } from "../sidebar-parameter-favorite-list/sidebar-parameter-favorite-list.component";
import { LayoutComponent } from "./layout.component";

describe("LayoutComponent", () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LayoutComponent,
        FeedbackButtonComponent,
        SidebarBlockComponent,
        SidebarParameterFavoriteListComponent
      ],
      imports: [HttpClientTestingModule, NotifierModule, RouterTestingModule],
      providers: [
        MockVesselServiceProvider,
        MockFavoriteParameterService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                vessel: "PSC"
              }
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
