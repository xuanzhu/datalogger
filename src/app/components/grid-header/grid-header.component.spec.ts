import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { DebouncedTextInputComponent } from "../debounced-text-input/debounced-text-input.component";
import { GridHeaderComponent } from "./grid-header.component";

describe("GridHeaderComponent", () => {
  let component: GridHeaderComponent;
  let fixture: ComponentFixture<GridHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GridHeaderComponent, DebouncedTextInputComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
