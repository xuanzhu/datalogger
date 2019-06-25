/* tslint:disable:no-empty */
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AgGridModule } from "ag-grid-angular";
import { NotifierModule } from "angular-notifier";
import { of } from "rxjs";

import { DebouncedTextInputComponent } from "../debounced-text-input/debounced-text-input.component";
import { GridHeaderComponent } from "../grid-header/grid-header.component";
import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarContainerComponent } from "../sidebar-container/sidebar-container.component";
import { SidebarListKeyboardShortcutComponent } from "../sidebar-list-keyboard-shortcut/sidebar-list-keyboard-shortcut.component";
import { SidebarProductionParameterSelectedListComponent } from "../sidebar-production-parameter-selected-list/sidebar-production-parameter-selected-list.component";
import { SpinnerComponent } from "../spinner/spinner.component";
import { ProductionEventListComponent } from "./production-event-list.component";

describe("ProductionEventListComponent", () => {
  let component: ProductionEventListComponent;
  let fixture: ComponentFixture<ProductionEventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductionEventListComponent,
        DebouncedTextInputComponent,
        GridHeaderComponent,
        SidebarBlockComponent,
        SidebarContainerComponent,
        SidebarListKeyboardShortcutComponent,
        SidebarProductionParameterSelectedListComponent,
        SpinnerComponent
      ],
      imports: [
        AgGridModule.withComponents([]),
        FormsModule,
        HttpClientTestingModule,
        NotifierModule,
        RouterTestingModule
      ],
      providers: [
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
              has: () => false,
              params: {
                date_start: "2019-01-17T13:37:00.000Z",
                date_end: "2019-01-17T14:37:00.000Z"
              }
            })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
