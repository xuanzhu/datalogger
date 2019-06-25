import { Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IDataSource } from "../../models/data-source";
import { OnlineState, PingStatus } from "../../models/network-overview-item";
import { NetworkOverviewService } from "../../services/network-overview.service";
import { IpAddressBase } from "../../utilities/ipAddress-base";

@Component({
  selector: "app-modal-data-source-node-detail",
  templateUrl: "./modal-data-source-detail.component.html",
  styleUrls: ["./modal-data-source-detail.component.scss"]
})
export class ModalDataSourceDetailComponent extends IpAddressBase {
  @Input() public data: IDataSource;
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
