import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CellValueChangedEvent,
  RowDoubleClickedEvent
} from "ag-grid-community";
import { ColDef } from "ag-grid/src/ts/entities/colDef";
import { Subject } from "rxjs";
import {
  auditTime,
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from "rxjs/operators";

import { DataloggerService } from "../../services/datalogger.service";
import {
  FavoriteParameterService,
  IFavoriteParameter
} from "../../services/favorite-parameter.service";
import { GridBase } from "../../utilities/grid-base";
import { ModalDataRequestComponent } from "../modal-data-request/modal-data-request.component";

// TODO: fetch from the API
const dataTypeOPC = {
  1: "Boolean",
  2: "Char",
  3: "Byte",
  4: "Short",
  5: "Word ",
  6: "Long ",
  7: "DWord  ",
  8: "Float  ",
  9: "Double ",
  10: "String",
  11: "BCD   ",
  12: "LBCD  ",
  13: "Date  ",
  14: "None  "
};
const deadBandType = {
  1: "None",
  2: "Abs",
  3: "Percent",
  4: "AbsLin",
  5: "SMA",
  6: "SMA_Abs",
  7: "SMA_AbsLin"
};

export interface IRouteParameters {
  filter?: string;
  parameter_ids?: number[];
  selected_ids?: number[];
  group?: string;
}

@Component({
  selector: "parameter-list",
  templateUrl: "./parameter-list.component.html",
  styleUrls: ["./parameter-list.component.css"]
})
export class ParameterListComponent extends GridBase implements OnInit {
  public get isDisabled(): boolean {
    return this.selectedIds.length === 0;
  }

  public readonly gridId: string = ParameterListComponent.name;
  public parameterIds: number[] = [];
  public parameterIds$: Subject<number[]> = new Subject<number[]>();
  public selectedIds: number[] = [];
  public selectedIds$: Subject<number[]> = new Subject<number[]>();
  public filterText: string = "";
  public groupName: string;

  public rowData: any;
  public columnDefinitions: ColDef[] = [
    {
      field: "Id",
      width: 40
    },
    {
      field: "LongName",
      width: 150
    },
    {
      field: "Description",
      width: 150,
      editable: true
    },
    {
      field: "RangeLow",
      editable: true
    },
    {
      field: "RangeHigh",
      editable: true
    },
    {
      field: "Unit",
      editable: true
    },
    {
      headerName: "Data Type",
      field: "DataTypeId",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: this.extractValues(dataTypeOPC) },
      valueFormatter: params => this.lookupValue(dataTypeOPC, params.value),
      valueParser: params => this.lookupKey(dataTypeOPC, params.newValue),
      suppressFilter: true
    },
    {
      field: "Address",
      editable: true
    },
    {
      headerName: "DeadBandType",
      field: "DeadBandTypeId",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: this.extractValues(deadBandType) },
      suppressFilter: true,
      refData: deadBandType
    },
    {
      headerName: "DeadBand",
      field: "DeadBandValue",
      editable: true
    },
    {
      field: "StorageRate",
      editable: true
    }
  ];

  private favoriteParameters: IFavoriteParameter[] = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private dataloggerService: DataloggerService,
    private favoriteParameterService: FavoriteParameterService
  ) {
    super();

    this.gridApi$.subscribe(() => this.parseRouteParameters());
    this.selectedIds$
      .pipe(
        debounceTime(50),
        distinctUntilChanged()
      )
      .subscribe(selectedIds => {
        this.selectedIds = selectedIds;
        this.updateCurrentRoute();
      });
  }

  public ngOnInit() {
    this.parseRouteParameters();
    this.loadParameters();

    this.favoriteParameters = this.favoriteParameterService.getFavoriteParameters();
    this.favoriteParameterService
      .getFavoriteParametersSubject()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        favoriteParameters => (this.favoriteParameters = favoriteParameters)
      );
  }

  public getGroupNames() {
    return this.favoriteParameters
      .map(favoriteParameter => favoriteParameter.groupName)
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter(groupName => !!groupName)
      .sort();
  }

  public onFirstDataRendered() {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
      this.checkSelectedRows();
    }
  }

  public onRowDoubleClicked(event: RowDoubleClickedEvent): void {
    const id = event.node.data.Id;

    this.router.navigate([id, "plot"], { relativeTo: this.route });
  }

  public onSelectionChanged(event: any): void {
    this.selectedIds$.next(
      event.api.getSelectedRows().map(row => Number(row.Id))
    );
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (
      !event.ctrlKey ||
      event.key !== "c" ||
      event.shiftKey ||
      event.altKey ||
      event.metaKey
    ) {
      return;
    }

    const node = event.srcElement;

    if (node instanceof HTMLElement) {
      const selection = window.getSelection();
      const range = document.createRange();
      node.style.userSelect = "text";
      range.selectNode(event.srcElement);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      node.style.userSelect = "none";
      selection.removeAllRanges();
    }
  }

  public setFilterText(filterText: string): void {
    if (this.gridApi) {
      this.filterText = filterText;
      this.gridApi.setQuickFilter(filterText);
      this.updateCurrentRoute();
    }
  }

  public onCellValueChanged(params: CellValueChangedEvent): void {
    this.dataloggerService.updateDataParameter(params.data).subscribe();
  }

  public checkSelectedRows(): void {
    if (this.gridApi) {
      this.gridApi.forEachNode(node => {
        if (this.selectedIds.includes(node.data.Id)) {
          node.setSelected(true);
        } else {
          node.setSelected(false);
        }
      });
    }
  }

  public addParametersToFavorite(groupName?: string): void {
    this.selectedIds.forEach(parameterId => {
      this.favoriteParameterService.add(parameterId, groupName);
    });
  }

  public addParametersToNewFavorite(): void {
    const favoriteGroupName = prompt(
      "Please give a name to your new favorite group: "
    );

    if (favoriteGroupName) {
      this.addParametersToFavorite(favoriteGroupName.trim());
    }
  }

  public removeParametersFromFavorite(): void {
    this.selectedIds.forEach(parameterId => {
      const favoriteParameter = this.favoriteParameterService.find(
        parameterId,
        this.groupName
      );

      if (favoriteParameter) {
        this.favoriteParameterService.delete(favoriteParameter);
        const index = this.parameterIds.indexOf(parameterId);
        this.parameterIds.splice(index, 1);
      }
    });

    this.parameterIds$.next(this.parameterIds);
    this.selectedIds$.next([]);
  }

  public openDialog(actionName: string): void {
    const modalRef = this.modalService.open(ModalDataRequestComponent, {
      backdrop: "static"
    });

    modalRef.componentInstance.setInitialData({
      actionName: actionName,
      selectedIds: this.selectedIds
    });

    modalRef.result
      .then((jobIds: number[]) => {
        this.router.navigate(
          [
            "../data-requests",
            {
              job_ids: jobIds
            },
            actionName.toLowerCase(),
            {
              job_ids: jobIds
            }
          ],
          { relativeTo: this.route }
        );
      })
      .catch(() => {
        // Modal dismissed
      });
  }

  private loadParameters(): void {
    this.dataloggerService
      .getDataParameters()
      .subscribe(products => (this.rowData = products));
  }

  private parseRouteParameters() {
    this.route.paramMap.pipe(auditTime(50)).subscribe(params => {
      if (params.has("filter")) {
        this.filterText = params.get("filter");
      } else {
        this.filterText = "";
      }

      if (params.has("parameter_ids")) {
        this.parameterIds = this.getNumberArrayFromParams(
          params,
          "parameter_ids"
        );
      } else {
        this.parameterIds = [];
      }

      if (params.has("selected_ids")) {
        this.selectedIds = this.getNumberArrayFromParams(
          params,
          "selected_ids"
        );
      } else {
        this.selectedIds = [];
      }

      if (params.has("group")) {
        this.groupName = params.get("group");
      } else {
        this.groupName = undefined;
      }

      this.setFilterText(this.filterText);
      this.checkSelectedRows();
      this.filterVisibleRows();
    });
  }

  private filterVisibleRows(): void {
    if (this.gridApi) {
      this.gridOptions.isExternalFilterPresent = () =>
        this.parameterIds.length > 0;
      this.gridOptions.doesExternalFilterPass = node =>
        this.parameterIds.includes(node.data.Id);
      this.gridApi.onFilterChanged();
    }
  }

  private updateCurrentRoute(): void {
    const routeParameters: IRouteParameters = {};

    if (this.filterText.trim().length > 0) {
      routeParameters.filter = this.filterText;
    }

    if (this.parameterIds.length > 0) {
      routeParameters.parameter_ids = this.parameterIds;
    }

    if (this.selectedIds.length > 0) {
      routeParameters.selected_ids = this.selectedIds;
    }

    if (this.groupName) {
      routeParameters.group = this.groupName;
    }

    this.router.navigate([routeParameters], {
      relativeTo: this.route,
      replaceUrl: true
    });
  }

  private extractValues(mappings): string[] {
    return Object.keys(mappings);
  }

  private lookupValue(mappings, key): string {
    return mappings[key];
  }

  private lookupKey(mappings, name): string {
    for (const key in mappings) {
      if (mappings.hasOwnProperty(key)) {
        if (name === mappings[key]) {
          return key;
        }
      }
    }
  }

  private getNumberArrayFromParams(params: ParamMap, param: string): number[] {
    let selectedIds: number[] | string[] = params.getAll(param);

    if (selectedIds.length === 1 && typeof selectedIds[0] === "string") {
      selectedIds = selectedIds[0].split(",").map(Number);
    }

    return selectedIds as number[];
  }
}
