import { GridApi, GridOptions } from "ag-grid-community";
import { ColDef } from "ag-grid/src/ts/entities/colDef";
import { Subject } from "rxjs";

import { ComponentOnDestroy } from "./component-on-destroy";

export class GridBase extends ComponentOnDestroy {
  public gridOptions: GridOptions;

  protected gridApi: GridApi;
  protected gridApi$: Subject<any> = new Subject<any>();
  protected csvColumnSeparator = ";";
  protected gridColumnApi;
  protected gridState = {
    colState: {},
    groupState: {},
    sortState: {},
    filterState: {}
  };
  protected columnDefinitions: ColDef[];

  constructor() {
    super();

    this.gridOptions = {
      columnDefs: this.columnDefinitions as any[],
      defaultColDef: {
        width: 60,
        filterParams: { newRowsAction: "keep" }
      },
      rowSelection: "multiple",
      rowDeselection: true,
      autoGroupColumnDef: false,
      enableSorting: true,
      enableColResize: true,
      enableFilter: true,
      debug: false,
      pagination: false,
      enableCellChangeFlash: true,
      cacheQuickFilter: true
    } as GridOptions;
  }

  public onGridReady(params, gridId) {
    this.gridApi = params.api;
    this.gridApi$.next(this.gridApi);
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
    this.restoreState(gridId);
  }

  public saveState(gridId) {
    if (gridId) {
      this.gridState.colState = this.gridColumnApi.getColumnState();
      this.gridState.groupState = this.gridColumnApi.getColumnGroupState();
      this.gridState.sortState = this.gridApi.getSortModel();
      this.gridState.filterState = this.gridApi.getFilterModel();

      localStorage.setItem(gridId, JSON.stringify(this.gridState));
    }
  }

  public restoreState(gridId) {
    const gridState = JSON.parse(localStorage.getItem(gridId));

    if (gridId && gridState) {
      // @TODO remove this nasty hack regarding touching private properties
      (this
        .gridApi as any).gridOptionsWrapper.gridOptions.suppressSetColumnStateEvents = true;
      this.gridColumnApi.setColumnState(gridState.colState);
      this.gridColumnApi.setColumnGroupState(gridState.groupState);
      this.gridApi.setSortModel(gridState.sortState);
      this.gridApi.setFilterModel(gridState.filterState);
    }
  }

  public resetState(gridId) {
    // @TODO remove this nasty hack regarding touching private properties
    (this
      .gridApi as any).gridOptionsWrapper.gridOptions.suppressSetColumnStateEvents = true;
    this.gridColumnApi.resetColumnState();
    this.gridColumnApi.resetColumnGroupState();
    this.gridApi.setSortModel(null);
    this.gridApi.setFilterModel(null);
    this.gridApi.sizeColumnsToFit();
  }

  public onExport() {
    const params = {
      skipHeader: false,
      columnGroups: false,
      skipFooters: false,
      skipGroups: false,
      skipPinnedTop: false,
      skipPinnedBottom: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      processCellCallback: null,
      processHeaderCallback: null,
      customHeader: null,
      customFooter: null,
      columnSeparator: this.csvColumnSeparator
    };

    this.gridApi.exportDataAsCsv(params);
  }
}
