import { Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IConverter } from "../../models/converter";
import { OnlineState, PingStatus } from "../../models/network-overview-item";
import { NetworkOverviewService } from "../../services/network-overview.service";
import { IpAddressBase } from "../../utilities/ipAddress-base";

@Component({
  selector: "app-modal-converter-node-detail",
  templateUrl: "./modal-converter-detail.component.html",
  styleUrls: ["./modal-converter-detail.component.scss"]
})
export class ModalConverterDetailComponent extends IpAddressBase {
  @Input() public data: IConverter;
  public onlineState = OnlineState;
  public pingState = PingStatus;

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public networkOverviewService: NetworkOverviewService
  ) {
    super(modalService, networkOverviewService);
  }
}
