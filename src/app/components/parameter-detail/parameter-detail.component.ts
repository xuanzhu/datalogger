import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { IDataParameter } from "../../models/data-parameter";
import { DataloggerService } from "../../services/datalogger.service";

@Component({
  selector: "parameter-detail",
  templateUrl: "./parameter-detail.component.html",
  styleUrls: ["./parameter-detail.component.css"]
})
export class ParameterDetailComponent implements OnInit {
  public parameter: IDataParameter;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataloggerService: DataloggerService
  ) {}

  public ngOnInit(): void {
    this.getData();
  }

  public save(): void {
    this.dataloggerService
      .updateDataParameter(this.parameter)
      .subscribe(() => this.navigateToList());
  }

  private getData(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.dataloggerService
      .getDataParameter(id)
      .subscribe(p => (this.parameter = p));
  }

  private navigateToList(): void {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
