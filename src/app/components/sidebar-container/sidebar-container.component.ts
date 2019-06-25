import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from "@angular/core";

@Component({
  selector: "sidebar-container",
  templateUrl: "./sidebar-container.component.html",
  styleUrls: ["./sidebar-container.component.scss"]
})
export class SidebarContainerComponent implements AfterViewInit {
  @ViewChild("sidebarContent") public sidebarContentRef: ElementRef<
    HTMLDivElement
  >;

  public hasSidebar: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.hasSidebar =
      this.sidebarContentRef.nativeElement.childNodes.length > 0;
    this.changeDetectorRef.detectChanges();
  }
}
