import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IIpaddress } from "../../models/ipaddress";
import { OnlineState } from "../../models/network-overview-item";

@Component({
  selector: "app-modal-ip-address-detail",
  templateUrl: "./modal-ip-address-detail.component.html",
  styleUrls: ["./modal-ip-address-detail.component.scss"]
})
export class ModalIpAddressDetailComponent {
  @Input() public data: IIpaddress;
  public onlineState = OnlineState;

  constructor(public activeModal: NgbActiveModal) {}
}
