import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { DebouncedTextInputComponent } from "./debounced-text-input.component";

describe("DebouncedTextInputComponent", () => {
  let component: DebouncedTextInputComponent;
  let fixture: ComponentFixture<DebouncedTextInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DebouncedTextInputComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebouncedTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
