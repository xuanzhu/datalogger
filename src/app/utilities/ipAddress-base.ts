import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalIpAddressDetailComponent } from "../components/modal-ip-address-detail/modal-ip-address-detail.component";
import { NetworkOverviewService } from "../services/network-overview.service";

export class IpAddressBase {
  constructor(
    public modalService: NgbModal,
    public networkOverviewService: NetworkOverviewService
  ) {}
  public showIpAddressDetail(ipAddress: string): void {
    if (ipAddress !== null) {
      this.networkOverviewService.getIpAddress(ipAddress).subscribe(ip => {
        this.openModal(ModalIpAddressDetailComponent, ip);
      });
    }
  }

  private openModal(component, data): void {
    const modalRef = this.modalService.open(component);
    modalRef.componentInstance.data = data;
  }
}
