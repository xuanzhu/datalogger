import { Component, ElementRef, Input } from "@angular/core";
import { ID3TreeItem } from "../../models/d3-tree-item";
import {
  ChannelState,
  OnlineState,
  PingStatus
} from "../../models/network-overview-item";

@Component({
  selector: "[treeNode]",
  template: `
    <svg:image
      [attr.xlink:href]="icon"
      [attr.height]="30"
      [attr.width]="30"
      [attr.y]="-15"
    ></svg:image>
    <svg:text
      dy="0.31em"
      [attr.x]="x"
      [attr.text-anchor]="textAnchor"
      [attr.fill]="textColor"
      [attr.font-size]="15"
    >
      {{ name }}
    </svg:text>
  `,
  styleUrls: ["./d3-tree-node.component.scss"]
})
export class D3TreeNodeComponent {
  private node;

  constructor(private el: ElementRef<SVGPathElement>) {}

  @Input("node")
  public set treeNode(node) {
    this.node = node;
    this.el.nativeElement.setAttribute("transform", this.transform);
  }

  public get data(): ID3TreeItem {
    return this.node.data as ID3TreeItem;
  }

  public get circleColor(): string {
    return this.getColor("#999");
  }

  public get textColor(): string {
    return this.getColor("#444");
  }

  public get name(): string {
    return this.node.data.name || "Unknown";
  }

  public get textAnchor(): string {
    return this.node.children ? "end" : "start";
  }

  public get transform(): string {
    return `translate(${this.node.y}, ${this.node.x})`;
  }

  public get x(): number {
    return this.node.children ? -6 : 6;
  }

  public get icon(): string {
    return this.node.data.icon;
  }

  private getColor(defaultColor: string): string {
    if (this.data.onlineState === OnlineState.Online) {
      if (
        this.data.channelState === ChannelState.Good ||
        // tslint:disable-next-line
        this.data.pingStatus == PingStatus.Online
      ) {
        return "green";
      } else if (
        this.data.channelState === ChannelState.Bad ||
        // tslint:disable-next-line
        this.data.pingStatus == PingStatus.Offline
      ) {
        return "red";
      }
    } else {
      return defaultColor;
    }
  }
}
