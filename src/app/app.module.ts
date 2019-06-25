import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  NgbAccordionModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule
} from "@ng-bootstrap/ng-bootstrap";
import { AgGridModule } from "ag-grid-angular";
import { ChartModule, HIGHCHARTS_MODULES } from "angular-highcharts";
import { NotifierModule, NotifierOptions } from "angular-notifier";

import * as more from "highcharts/highcharts-more.src";
import * as boost from "highcharts/modules/boost.src";
import * as exporting from "highcharts/modules/exporting.src";
import * as map from "highcharts/modules/map.src";
import * as sunburst from "highcharts/modules/sunburst";

import { RoutingModule } from "./routing.module";

import { AppComponent } from "./components/app/app.component";
import { D3TreeModule } from "./components/d3-tree/d3-tree.module";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DataRequestExportComponent } from "./components/data-request-export/data-request-export.component";
import { DataRequestListComponent } from "./components/data-request-list/data-request-list.component";
import { DataRequestPlotComponent } from "./components/data-request-plot/data-request-plot.component";
import { DateTimeInputComponent } from "./components/date-time-input/date-time-input.component";
import { DebouncedTextInputComponent } from "./components/debounced-text-input/debounced-text-input.component";
import { FeedbackButtonComponent } from "./components/feedback-button/feedback-button.component";
import { GridHeaderComponent } from "./components/grid-header/grid-header.component";
import { LayoutComponent } from "./components/layout/layout.component";
import { ModalChannelDetailComponent } from "./components/modal-channel-detail/modal-channel-detail.component";
import { ModalConverterDetailComponent } from "./components/modal-converter-detail/modal-converter-detail.component";
import { ModalDataRequestComponent } from "./components/modal-data-request/modal-data-request.component";
import { ModalDataSourceDetailComponent } from "./components/modal-data-source-detail/modal-data-source-detail.component";
import { ModalIpAddressDetailComponent } from "./components/modal-ip-address-detail/modal-ip-address-detail.component";
import { ModalNetworkSwitchDetailComponent } from "./components/modal-network-switch-detail/modal-network-switch-detail.component";
import { ModalProductionEventComponent } from "./components/modal-production-event/modal-production-event.component";
import { NetworkOverviewComponent } from "./components/network-overview/network-overview.component";
import { ParameterDetailComponent } from "./components/parameter-detail/parameter-detail.component";
import { ParameterListComponent } from "./components/parameter-list/parameter-list.component";
import { ParameterPlotComponent } from "./components/parameter-plot/parameter-plot.component";
import { ProductionEventListComponent } from "./components/production-event-list/production-event-list.component";
import { ProductionParameterListComponent } from "./components/production-parameter-list/production-parameter-list.component";
import { SidebarBlockComponent } from "./components/sidebar-block/sidebar-block.component";
import { SidebarContainerComponent } from "./components/sidebar-container/sidebar-container.component";
import { SidebarDataRequestDetailsComponent } from "./components/sidebar-data-request-details/sidebar-data-request-details.component";
import { SidebarListKeyboardShortcutComponent } from "./components/sidebar-list-keyboard-shortcut/sidebar-list-keyboard-shortcut.component";
import { SidebarParameterFavoriteListComponent } from "./components/sidebar-parameter-favorite-list/sidebar-parameter-favorite-list.component";
import { SidebarProductionParameterSelectedListComponent } from "./components/sidebar-production-parameter-selected-list/sidebar-production-parameter-selected-list.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { SubmitButtonComponent } from "./components/submit-button/submit-button.component";
import { VesselSelectionComponent } from "./components/vessel-selection/vessel-selection.component";
import { SentryErrorHandler } from "./utilities/sentry-error-handler";
import { WithCredentialsInterceptor } from "./utilities/with-credentials-interceptor";

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: "right",
      distance: 12
    }
  }
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NetworkOverviewComponent,
    ParameterListComponent,
    DataRequestListComponent,
    ParameterDetailComponent,
    ParameterPlotComponent,
    GridHeaderComponent,
    SpinnerComponent,
    ModalDataRequestComponent,
    DataRequestPlotComponent,
    DataRequestExportComponent,
    LayoutComponent,
    SidebarContainerComponent,
    SidebarBlockComponent,
    VesselSelectionComponent,
    SidebarListKeyboardShortcutComponent,
    SidebarParameterFavoriteListComponent,
    SidebarProductionParameterSelectedListComponent,
    DebouncedTextInputComponent,
    ProductionEventListComponent,
    ProductionParameterListComponent,
    ModalProductionEventComponent,
    SidebarDataRequestDetailsComponent,
    SubmitButtonComponent,
    FeedbackButtonComponent,
    DateTimeInputComponent,
    ModalChannelDetailComponent,
    ModalNetworkSwitchDetailComponent,
    ModalDataSourceDetailComponent,
    ModalConverterDetailComponent,
    ModalIpAddressDetailComponent
  ],
  imports: [
    AgGridModule.withComponents([]),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ChartModule,
    D3TreeModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NotifierModule.withConfig(customNotifierOptions),
    RoutingModule
  ],
  providers: [
    {
      provide: HIGHCHARTS_MODULES,
      useFactory: () => [more, exporting, map, sunburst, boost]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ],
  entryComponents: [
    ModalDataRequestComponent,
    ModalProductionEventComponent,
    ModalChannelDetailComponent,
    ModalDataSourceDetailComponent,
    ModalConverterDetailComponent,
    ModalNetworkSwitchDetailComponent,
    ModalIpAddressDetailComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
