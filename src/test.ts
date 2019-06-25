// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import "zone.js/dist/zone-testing";

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests load the modules.
const context = require.context("./", true, /\.spec\.ts$/);
context.keys().map(context);

/**
 * Workaround for ResizeObserver bug in ag-grid
 * @see {@link https://github.com/ag-grid/ag-grid/issues/2588}
 */
(window as any).ResizeObserver = undefined;
