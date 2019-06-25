import { Component, ElementRef, Input } from "@angular/core";

@Component({
  selector: "[treeLink]",
  template: ""
})
export class D3TreeLinkComponent {
  @Input("treeDY") public treeDY;

  private link;

  constructor(private el: ElementRef<SVGPathElement>) {}

  @Input("link")
  public set treeLink(link: any) {
    this.link = link;
    this.el.nativeElement.setAttribute("d", this.d);
  }

  public get d(): string {
    return `
      M${this.link.target.y},${this.link.target.x}
      C${this.link.source.y + this.treeDY / 2},${this.link.target.x}
       ${this.link.source.y + this.treeDY / 2},${this.link.source.x}
       ${this.link.source.y},${this.link.source.x}
    `;
  }
}
