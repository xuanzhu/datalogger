import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  auditTime,
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from "rxjs/operators";

import { ID3TreeItem } from "../../models/d3-tree-item";
import {
  ChannelState,
  INetworkOverviewItem,
  NetworkOverviewType,
  OnlineState,
  PingStatus
} from "../../models/network-overview-item";
import { NetworkOverviewService } from "../../services/network-overview.service";
import { VesselService } from "../../services/vessel.service";
import { ComponentOnDestroy } from "../../utilities/component-on-destroy";
import { ModalChannelDetailComponent } from "../modal-channel-detail/modal-channel-detail.component";
import { ModalConverterDetailComponent } from "../modal-converter-detail/modal-converter-detail.component";
import { ModalDataSourceDetailComponent } from "../modal-data-source-detail/modal-data-source-detail.component";
import { ModalNetworkSwitchDetailComponent } from "../modal-network-switch-detail/modal-network-switch-detail.component";

export interface IRouteParameters {
  filter?: string;
  onlineState?: OnlineState;
  channelState?: ChannelState;
}

@Component({
  selector: "network-overview-tree",
  templateUrl: "./network-overview.component.html",
  styleUrls: ["./network-overview.component.scss"]
})
export class NetworkOverviewComponent extends ComponentOnDestroy
  implements OnInit {
  public filterText: string = "";
  public filterState: OnlineState = null;
  public channelFilterState: ChannelState = null;
  public loading: boolean = true;
  public networkOverviewData: ID3TreeItem;
  public onlineState = OnlineState;
  public channelState = ChannelState;
  public pingStatus = PingStatus;

  private networkOverview: INetworkOverviewItem[];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private networkOverviewService: NetworkOverviewService,
    private vesselService: VesselService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.networkOverviewService
      .getNetworkOverview()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(networkOverview => {
        this.loading = false;
        this.networkOverview = networkOverview;
        this.generateNetworkOverviewData();
        this.parseRouteParameters();
      });
  }

  public setFilterText(filterText: string): void {
    this.filterText = filterText;
    this.updateCurrentRoute();
    this.generateNetworkOverviewData();
  }

  public setFilterState(filterState: string): void {
    if (filterState === "null") {
      this.filterState = null;
    } else {
      this.filterState = parseInt(filterState, 10);
    }

    this.updateCurrentRoute();
    this.generateNetworkOverviewData();
  }

  public setChannelFilterState(channelFilterState: string): void {
    if (channelFilterState === "null") {
      this.channelFilterState = null;
    } else {
      this.channelFilterState = parseInt(channelFilterState, 10);
    }

    this.updateCurrentRoute();
    this.generateNetworkOverviewData();
  }

  public click(node: ID3TreeItem): void {
    if (!node.id) {
      return;
    }

    switch (node.type) {
      case NetworkOverviewType.Channel: {
        this.networkOverviewService.getChannel(node.id).subscribe(channel => {
          this.openModal(ModalChannelDetailComponent, channel);
        });
        break;
      }
      case NetworkOverviewType.DataSource: {
        this.networkOverviewService
          .getDataSource(node.id)
          .subscribe(dataSource => {
            this.openModal(ModalDataSourceDetailComponent, dataSource);
          });
        break;
      }
      case NetworkOverviewType.Converter: {
        this.networkOverviewService
          .getConverter(node.id)
          .subscribe(converter => {
            this.openModal(ModalConverterDetailComponent, converter);
          });
        break;
      }
      case NetworkOverviewType.NetworkSwitch: {
        this.networkOverviewService
          .getNetworkSwitch(node.id)
          .subscribe(networkSwitch => {
            this.openModal(ModalNetworkSwitchDetailComponent, networkSwitch);
          });
        break;
      }
      case NetworkOverviewType.Vessel: {
        break;
      }
      default: {
        throw new Error(`Network type "${node.type}" does not exist.`);
        break;
      }
    }
  }

  private openModal(component, data): void {
    const modalRef = this.modalService.open(component);
    modalRef.componentInstance.data = data;
  }

  private generateNetworkOverviewData(): void {
    const networkOverviewFiltered = this.getNetworkOverviewFiltered();
    if (networkOverviewFiltered.length > 0) {
      const switches = this.getSwitches(networkOverviewFiltered);

      this.networkOverviewData = {
        name: this.vesselService.getVessel(),
        children: switches,
        type: NetworkOverviewType.Vessel,
        icon: "assets/converter.svg"
      };
    } else {
      this.networkOverviewData = null;
    }
  }

  private getNetworkOverviewFiltered(): INetworkOverviewItem[] {
    let networkOverview = this.networkOverview;

    if (
      this.filterState === OnlineState.Online ||
      this.filterState === OnlineState.Offline
    ) {
      networkOverview = networkOverview.filter(
        item =>
          item.ChannelOnline === this.filterState ||
          item.DataSourceOnline === this.filterState ||
          item.ConverterOnline === this.filterState
      );
    }

    if (
      this.channelFilterState === ChannelState.Good ||
      this.channelFilterState === ChannelState.Bad
    ) {
      networkOverview = networkOverview.filter(
        item => item.ChannelLastState === this.channelFilterState
      );
    }

    if (this.filterText.trim().length > 0) {
      const searchTerm = this.filterText.toUpperCase();

      networkOverview = networkOverview.filter(
        item =>
          (item.ChannelName &&
            item.ChannelName.toUpperCase().includes(searchTerm)) ||
          (item.DataSourceName &&
            item.DataSourceName.toUpperCase().includes(searchTerm)) ||
          (item.ConverterName &&
            item.ConverterName.toUpperCase().includes(searchTerm)) ||
          (item.SwitchName &&
            item.SwitchName.toUpperCase().includes(searchTerm))
      );
    }

    return networkOverview;
  }

  private getSwitches(networkOverview: INetworkOverviewItem[]): ID3TreeItem[] {
    return networkOverview
      .map(item => item.SwitchId)
      .filter((id, index, self) => self.indexOf(id) === index)
      .map(id => {
        const item = networkOverview.find(i => i.SwitchId === id);

        return {
          id: item.SwitchId,
          name: item.SwitchName,
          children: this.getConverters(networkOverview, id),
          type: NetworkOverviewType.NetworkSwitch,
          icon: "assets/switch.svg"
        };
      })
      .sort(this.orderByName);
  }

  private getConverters(
    networkOverview: INetworkOverviewItem[],
    switchId: number
  ): ID3TreeItem[] {
    return networkOverview
      .filter(item => item.SwitchId === switchId)
      .map(item => item.ConverterId)
      .filter((id, index, self) => self.indexOf(id) === index)
      .map(id => {
        const item = networkOverview.find(i => i.ConverterId === id);

        return {
          id: item.ConverterId,
          name: item.ConverterName,
          pingStatus: item.ConverterState,
          onlineState: item.ConverterOnline,
          children: this.getDataSources(networkOverview, switchId, id),
          type: NetworkOverviewType.Converter,
          icon: "assets/converter.svg"
        };
      })
      .sort(this.orderByName);
  }

  private getDataSources(
    networkOverview: INetworkOverviewItem[],
    switchId: number,
    converterId: number
  ): ID3TreeItem[] {
    return networkOverview
      .filter(
        item => item.SwitchId === switchId && item.ConverterId === converterId
      )
      .map(item => item.DataSourceId)
      .filter((id, index, self) => self.indexOf(id) === index)
      .map(id => {
        const item = networkOverview.find(i => i.DataSourceId === id);

        return {
          id: item.DataSourceId,
          name: item.DataSourceName,
          pingStatus: item.DataSourceState,
          onlineState: item.DataSourceOnline,
          children: this.getChannels(
            networkOverview,
            switchId,
            converterId,
            id
          ),
          type: NetworkOverviewType.DataSource,
          icon: ""
        };
      })
      .sort(this.orderByName);
  }

  private getChannels(
    networkOverview: INetworkOverviewItem[],
    switchId: number,
    converterId: number,
    dataSourceId: number
  ): ID3TreeItem[] {
    return networkOverview
      .filter(
        item =>
          item.SwitchId === switchId &&
          item.ConverterId === converterId &&
          item.DataSourceId === dataSourceId
      )
      .map(item => item.ChannelId)
      .filter((id, index, self) => self.indexOf(id) === index)
      .map(id => {
        const item = networkOverview.find(i => i.ChannelId === id);
        return {
          id: item.ChannelId,
          name: item.ChannelName,
          channelState: item.ChannelLastState,
          pingStatus: PingStatus.Unknown, // TODO: set it from API
          onlineState: item.ChannelOnline,
          children: [],
          type: NetworkOverviewType.Channel,
          icon: ""
        };
      })
      .sort(this.orderByName);
  }

  private orderByName(a: ID3TreeItem, b: ID3TreeItem): number {
    if (!a.name) {
      return -1;
    } else if (!b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  }

  private updateCurrentRoute(): void {
    const routeParameters: IRouteParameters = {};

    if (this.filterText.trim().length > 0) {
      routeParameters.filter = this.filterText;
    }

    if (this.channelFilterState != null) {
      routeParameters.channelState = this.channelFilterState;
    }

    if (this.filterState != null) {
      routeParameters.onlineState = this.filterState;
    }

    this.router.navigate([routeParameters], {
      relativeTo: this.route,
      replaceUrl: true
    });
  }

  private parseRouteParameters() {
    this.route.paramMap.pipe(auditTime(50)).subscribe(params => {
      if (params.has("filter")) {
        this.filterText = params.get("filter");
      } else {
        this.filterText = "";
      }

      if (params.has("onlineState")) {
        this.filterState = parseInt(params.get("onlineState"), 10);
      } else {
        this.filterState = null;
      }

      if (params.has("channelState")) {
        this.channelFilterState = parseInt(params.get("channelState"), 10);
      } else {
        this.channelFilterState = null;
      }

      this.setFilterText(this.filterText);
      this.setFilterState(
        this.filterState !== null ? this.filterState.toString() : "null"
      );
      this.setChannelFilterState(
        this.channelFilterState !== null
          ? this.channelFilterState.toString()
          : "null"
      );
    });
  }
}
