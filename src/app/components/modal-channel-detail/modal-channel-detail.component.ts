import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IChannel } from "../../models/channel";
import {
  ChannelState,
  OnlineState,
  PingStatus
} from "../../models/network-overview-item";
import { NetworkOverviewService } from "../../services/network-overview.service";
import { VesselService } from "../../services/vessel.service";
import { IpAddressBase } from "../../utilities/ipAddress-base";

@Component({
  selector: "app-modal-node-detail",
  templateUrl: "./modal-channel-detail.component.html",
  styleUrls: ["./modal-channel-detail.component.scss"]
})
export class ModalChannelDetailComponent extends IpAddressBase {
  @Input() public data: IChannel;
  public onlineState = OnlineState;
  public channelState = ChannelState;
  public pingState = PingStatus;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public networkOverviewService: NetworkOverviewService
  ) {
    super(modalService, networkOverviewService);
  }

  public navigateToParameter(filterText: string): void {
    this.router.navigate(["./parameters", { filter: filterText }], {
      relativeTo: this.route.children[0]
    });
    this.activeModal.dismiss();
  }
}
