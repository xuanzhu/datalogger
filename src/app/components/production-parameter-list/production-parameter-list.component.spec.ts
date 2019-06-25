/* tslint:disable:no-empty */
import { HttpClientTestingModule } from "@angular/common/http/testing";
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
import { ProductionParameterListComponent } from "./production-parameter-list.component";

describe("ProductionParameterListComponent", () => {
  let component: ProductionParameterListComponent;
  let fixture: ComponentFixture<ProductionParameterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductionParameterListComponent,
        DebouncedTextInputComponent,
        GridHeaderComponent,
        SidebarContainerComponent,
        SidebarBlockComponent,
        SidebarListKeyboardShortcutComponent
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
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionParameterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
