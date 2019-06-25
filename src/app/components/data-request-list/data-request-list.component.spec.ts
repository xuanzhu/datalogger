/* tslint:disable:no-empty */
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AgGridModule } from "ag-grid-angular";
import { NotifierModule } from "angular-notifier";
import { of } from "rxjs";

import { MockVesselServiceProvider } from "../../services/vessel.service.spec";
import { DebouncedTextInputComponent } from "../debounced-text-input/debounced-text-input.component";
import { GridHeaderComponent } from "../grid-header/grid-header.component";
import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarContainerComponent } from "../sidebar-container/sidebar-container.component";
import { SidebarListKeyboardShortcutComponent } from "../sidebar-list-keyboard-shortcut/sidebar-list-keyboard-shortcut.component";
import { SidebarParameterFavoriteListComponent } from "../sidebar-parameter-favorite-list/sidebar-parameter-favorite-list.component";
import { DataRequestListComponent } from "./data-request-list.component";

describe("DataRequestListComponent", () => {
  let component: DataRequestListComponent;
  let fixture: ComponentFixture<DataRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataRequestListComponent,
        DebouncedTextInputComponent,
        GridHeaderComponent,
        SidebarBlockComponent,
        SidebarContainerComponent,
        SidebarListKeyboardShortcutComponent,
        SidebarParameterFavoriteListComponent
      ],
      imports: [
        AgGridModule.withComponents([]),
        FormsModule,
        HttpClientTestingModule,
        NotifierModule
      ],
      providers: [
        MockVesselServiceProvider,
        {
          provide: Router,
          useValue: {
            navigate: () => {}
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              has: () => false
            })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
