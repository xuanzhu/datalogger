import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IIpaddress } from "../../models/ipaddress";
import { OnlineState } from "../../models/network-overview-item";

import { ModalIpAddressDetailComponent } from "./modal-ip-address-detail.component";

describe("ModalIpAddressDetailComponent", () => {
  let component: ModalIpAddressDetailComponent;
  let fixture: ComponentFixture<ModalIpAddressDetailComponent>;

  const testIpAddress: IIpaddress = {
    Id: 1,
    NumericID: 999,
    HostName: "Test",
    SwitchID: 1,
    IpAddress: "",
    SwitchPort: "",
    MAC_Address: "",
    Online: OnlineState.Online,
    SubNet_Mask: "",
    Description: ""
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalIpAddressDetailComponent],
      providers: [NgbActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIpAddressDetailComponent);
    component = fixture.componentInstance;
    component.data = testIpAddress;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
