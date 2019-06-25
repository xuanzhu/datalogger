import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { INetworkSwitch } from "../../models/network-switch";

@Component({
  selector: "app-modal-network-switch-node-detail",
  templateUrl: "./modal-network-switch-detail.component.html",
  styleUrls: ["./modal-network-switch-detail.component.scss"]
})
export class ModalNetworkSwitchDetailComponent {
  @Input() public data: INetworkSwitch;

  constructor(public activeModal: NgbActiveModal) {}
}
