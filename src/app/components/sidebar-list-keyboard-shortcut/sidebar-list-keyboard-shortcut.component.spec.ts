import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SidebarBlockComponent } from "../sidebar-block/sidebar-block.component";
import { SidebarListKeyboardShortcutComponent } from "./sidebar-list-keyboard-shortcut.component";

describe("SidebarListKeyboardShortcutComponent", () => {
  let component: SidebarListKeyboardShortcutComponent;
  let fixture: ComponentFixture<SidebarListKeyboardShortcutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarListKeyboardShortcutComponent,
        SidebarBlockComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarListKeyboardShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
