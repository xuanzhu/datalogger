/* tslint:disable:no-empty */
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AgGridModule } from "ag-grid-angular";
import { of } from "rxjs";

import { FavoriteParameterService } from "../../services/favorite-parameter.service";
import { MockVesselServiceProvider } from "../../services/vessel.service.spec";
import { DebouncedTextInputComponent } from "../debounced-text-input/debounced-text-input.component";
import { GridHeaderComponent } from "../grid-header/grid-header.component";
import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarContainerComponent } from "../sidebar-container/sidebar-container.component";
import { SidebarListKeyboardShortcutComponent } from "../sidebar-list-keyboard-shortcut/sidebar-list-keyboard-shortcut.component";
import { SidebarParameterFavoriteListComponent } from "../sidebar-parameter-favorite-list/sidebar-parameter-favorite-list.component";
import { ParameterListComponent } from "./parameter-list.component";

describe("ParameterListComponent", () => {
  const testGroupName: string = "new-group";
  const testSelectedIds: number[] = [-999, -998, -997];
  let component: ParameterListComponent;
  let fixture: ComponentFixture<ParameterListComponent>;
  let service: FavoriteParameterService;
  let promptSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ParameterListComponent,
        DebouncedTextInputComponent,
        GridHeaderComponent,
        SidebarBlockComponent,
        SidebarContainerComponent,
        SidebarParameterFavoriteListComponent,
        SidebarListKeyboardShortcutComponent
      ],
      imports: [
        AgGridModule.withComponents([]),
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({})
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: () => {}
          }
        },
        FavoriteParameterService,
        MockVesselServiceProvider
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    promptSpy = spyOn(window, "prompt").and.returnValue(testGroupName);
    service = TestBed.get(FavoriteParameterService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add parameters to default group", () => {
    component.selectedIds = testSelectedIds;
    component.addParametersToFavorite();

    expect(promptSpy).not.toHaveBeenCalled();

    testSelectedIds.forEach(id => {
      expect(service.find(id)).toBeDefined();
    });
  });

  it("should add parameters to new favorite group", () => {
    component.selectedIds = testSelectedIds;
    component.addParametersToNewFavorite();

    expect(promptSpy).toHaveBeenCalled();

    testSelectedIds.forEach(id => {
      expect(service.find(id, testGroupName)).toBeDefined();
    });
  });

  it("should remove parameters from favorite group", () => {
    component.selectedIds = testSelectedIds;
    component.groupName = "test";
    component.addParametersToFavorite(component.groupName);

    testSelectedIds.forEach(id => {
      expect(service.find(id, component.groupName)).toBeDefined();
    });

    component.removeParametersFromFavorite();

    testSelectedIds.forEach(id => {
      expect(service.find(id, component.groupName)).toBeUndefined();
    });
  });
});
