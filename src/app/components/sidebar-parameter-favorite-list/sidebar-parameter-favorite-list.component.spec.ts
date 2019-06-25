import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarParameterFavoriteListComponent } from "./sidebar-parameter-favorite-list.component";

describe("SidebarParameterFavoriteListComponent", () => {
  let component: SidebarParameterFavoriteListComponent;
  let fixture: ComponentFixture<SidebarParameterFavoriteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarParameterFavoriteListComponent,
        SidebarBlockComponent
      ],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarParameterFavoriteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
