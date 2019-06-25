import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { D3TreeLinkComponent } from "./d3-tree-link.component";
import { D3TreeNodeComponent } from "./d3-tree-node.component";
import { D3TreeComponent } from "./d3-tree.component";

@NgModule({
  declarations: [D3TreeComponent, D3TreeLinkComponent, D3TreeNodeComponent],
  imports: [CommonModule],
  exports: [D3TreeComponent]
})
export class D3TreeModule {}
