import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from "@angular/core";
import { hierarchy, HierarchyPointNode, tree } from "d3-hierarchy";

import { ID3TreeItem } from "../../models/d3-tree-item";

@Component({
  selector: "d3-tree",
  template: `
    <svg #svg width="100%" [attr.height]="height">
      <g font-size="10" [attr.transform]="transform">
        <g fill="none" stroke="#555" stroke-opacity="0.4" stroke-width="1.5">
          <path
            treeLink
            *ngFor="let link of treeLinks"
            [link]="link"
            [treeDY]="treeDY"
          ></path>
        </g>
        <g stroke-linejoin="round" stroke-width="3">
          <g
            treeNode
            *ngFor="let node of treeNodes"
            [node]="node"
            [class.clickable]="isNodeClickable(node.data)"
            (click)="click(node)"
          ></g>
        </g>
      </g>
    </svg>
  `,
  styleUrls: ["./d3-tree-node.component.scss"]
})
export class D3TreeComponent {
  public get transform(): string {
    if (this.treeOffsetX !== undefined && this.treeOffsetY !== undefined) {
      return `translate(${this.treeOffsetX}, ${this.treeOffsetY})`;
    }
  }

  @Input("data")
  public set data(data: ID3TreeItem[]) {
    let x0 = Infinity;
    let x1 = -x0;

    if (!data) {
      return;
    }

    this.treeRoot = this.generateTree(data);
    this.treeRoot.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    this.treeLinks = this.treeRoot
      .links()
      .filter(link => link.source.depth >= 1);
    this.treeNodes = this.treeRoot
      .descendants()
      .filter(node => node.depth >= 1);
    this.treeOffsetX = -(this.treeDY / 2);
    this.treeOffsetY = this.treeDX - x0;
  }
  @ViewChild("svg") public svg: ElementRef<SVGSVGElement>;

  public height: number = 0;
  public treeDX: number;
  public treeDY: number;
  public treeOffsetX: number;
  public treeOffsetY: number;
  public treeNodes: any[];
  public treeLinks: any[];
  public treeRoot: any;

  @Output()
  public nodeClicked = new EventEmitter<ID3TreeItem>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public ngAfterViewChecked(): void {
    const boundingBox = this.svg.nativeElement.getBBox();
    let height;

    if (boundingBox.y > 0) {
      height = boundingBox.height + boundingBox.y * 2;
    } else {
      height = boundingBox.height;
    }

    if (height !== this.height) {
      this.height = height;
      this.changeDetectorRef.detectChanges();
    }
  }

  public click(node: ID3TreeItem) {
    this.nodeClicked.emit(node);
  }

  public isNodeClickable(node: ID3TreeItem): boolean {
    return !!node.id;
  }

  private generateTree(data): HierarchyPointNode<{}> {
    const root = hierarchy(data);

    this.treeDX = 20;
    this.treeDY = this.svg.nativeElement.scrollWidth / root.height;

    return tree().nodeSize([this.treeDX, this.treeDY])(root);
  }
}
