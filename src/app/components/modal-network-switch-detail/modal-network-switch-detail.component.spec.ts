import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { INetworkSwitch } from "../../models/network-switch";
import { ModalNetworkSwitchDetailComponent } from "./modal-network-switch-detail.component";

describe("ModalNetworkSwitchDetailComponent", () => {
  let component: ModalNetworkSwitchDetailComponent;
  let fixture: ComponentFixture<ModalNetworkSwitchDetailComponent>;

  const testNetworkSwitch: INetworkSwitch = {
    Id: 1,
    SwitchName: "Tst network switch"
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNetworkSwitchDetailComponent],
      providers: [NgbActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNetworkSwitchDetailComponent);
    component = fixture.componentInstance;
    component.data = testNetworkSwitch;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
