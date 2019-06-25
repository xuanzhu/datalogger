import { Component, Input } from "@angular/core";

@Component({
  selector: "sidebar-block",
  templateUrl: "./sidebar-block.component.html",
  styleUrls: ["./sidebar-block.component.scss"]
})
export class SidebarBlockComponent {
  @Input() public header: string;
}
