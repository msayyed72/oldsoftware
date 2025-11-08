import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

//Routes
import { routes } from './app.route';

import { AppComponent } from './app.component';

// service
import { AppService } from './service/app.service';

// store
import { StoreModule } from '@ngrx/store';
import { indexReducer } from './store/index.reducer';

// i18n
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// perfect-scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

// apexchart
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

// highlightjs
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

// tippy
import { NgxTippyModule } from 'ngx-tippy-wrapper';

// headlessui
import { MenuModule } from 'headlessui-angular';

// modal
import { ModalModule } from 'angular-custom-modal';

// sortable
import { SortablejsModule } from '@dustfoundation/ngx-sortablejs';

// quill editor
import { QuillModule } from 'ngx-quill';
import { SpreadsheetComponent, SpreadsheetModule } from '@syncfusion/ej2-angular-spreadsheet';

// dashboard
import { IndexComponent } from './index';
import { AnalyticsComponent } from './analytics';
import { FinanceComponent } from './finance';
import { CryptoComponent } from './crypto';

// widgets
import { WidgetsComponent } from './widgets';
import { NgxSpinnerModule } from "ngx-spinner";

// tables
import { TablesComponent } from './tables';

// font-icons
import { FontIconsComponent } from './font-icons';

// charts
import { ChartsComponent } from './charts';
import { NgSelectModule } from '@ng-select/ng-select';

// dragndrop
import { DragndropComponent } from './dragndrop';
import { GridModule, PageService,AggregateService, SortService, FilterService,PdfExportService,ExcelExportService,ToolbarService, ResizeService, ReorderService } from '@syncfusion/ej2-angular-grids';
import { NgxImageCompressService } from 'ngx-image-compress';
// pages
import { KnowledgeBaseComponent } from './pages/knowledge-base';
import { FaqComponent } from './pages/faq';

// Layouts
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';

import { HeaderComponent } from './layouts/header';
import { FooterComponent } from './layouts/footer';
import { SidebarComponent } from './layouts/sidebar';
import { DispatchComponent } from './operaion/dispatch/dispatch';
import { ThemeCustomizerComponent } from './layouts/theme-customizer';
import { IconModule } from './shared/icon/icon.module';
import { DatePipe } from '@angular/common';
import { DispatchManifestComponent } from './operaion/dispatch/dispatchmanifest';
import { ToBranchComponent } from './operaion/forwarding/tobranch';
import { ToBranchManifestComponent } from './operaion/forwarding/tobranchmanifest';
import { ToWarehouseComponent } from './operaion/forwarding/towarehouse';
import { ToWarehouseManifestComponent } from './operaion/forwarding/towarehousemanifest';
import { FromAgentComponent } from './operaion/receiving/fromAgent';
import { FromWarehouseManifestComponent } from './operaion/receiving/fromWarehouseManifest';
import { FromBranchComponent } from './operaion/receiving/fromBranch';
import { FromBranchManifestComponent } from './operaion/receiving/fromBranchManifest';
import { FromWarehouseComponent } from './operaion/receiving/fromWarehouse';
import { FromAgentManifestComponent } from './operaion/receiving/fromAgentManifest';
import { HawbAllocationComponent } from './allocaion/hawbAllocation';
import { TrackingComponent } from './Utilities/Tracking';
import { AgentAllocationComponent } from './allocaion/agentAllocation';
// import { NewBookingsComponent } from './CustomerBookings/new-bookings/new-bookings.component';
import { ChatService } from './cfServices/chat-service.service';
import { CustomerService } from './cfServices/customer.service';
import { EventEmitterService } from './cfServices/event-emitter.service';
import { ExcelService } from './cfServices/excel.service';
import { NewApiCloudService } from './cfServices/new-api-cloud.service';
import { ValidateEndPointsService } from './cfServices/validate.service';
import {  NewBookingsComponentols } from './CustomerBookings/new-bookings/new-bookings.component';
import { MatMenuModule } from '@angular/material/menu';
import { AuditComponent } from './warehouseShipment/audit/audit.component';
import { EditShipmentComponent } from './warehouseShipment/edit-shipment/edit-shipment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskForEmpComponent } from './CustomerBookings/task-for-emp/task-for-emp.component';
import { TodolistComponent } from './apps/todolist';
import { CheckWeightComponent } from './CustomerBookings/check-weight/check-weight.component';
import { HttpInterceptorService } from './interceptors/http-interceptor.service';
import { ShipmentEditComponent } from './CustomerBookings/shipment-edit/shipment-edit.component';
import { InputSearchDirective } from './interceptors/input-search.directive';
import { SafeUrlPipe } from './interceptors/safeurlPipe.pipe';
import { DepositInvoiceComponent } from './CustomerBookings/deposit-invoice/deposit-invoice.component';
import { DepositInvoiceModifyComponent } from './CustomerBookings/deposit-invoice-modify/deposit-invoice-modify.component';
import { AddNotesComponent } from './Notes/add-notes/add-notes.component';
import { PickupShipmentsComponent } from './CustomerBookings/CustomerBookings/pickup-shipments/pickup-shipments.component';
import { CancelledBookingsComponent } from './CustomerBookings/CustomerBookings/cancelled-bookings/cancelled-bookings.component';
import { NewBookingsComponent } from './CustomerBookings/CustomerBookings/new-bookings/new-bookings.component';
import { ShipmentEditAfterPickupComponent } from './CustomerBookings/shipment-edit-after-pickup/shipment-edit-after-pickup.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { SalesQuotationComponent } from './CustomerBookings/sales-quotation/sales-quotation.component';
import { FinalImageComponent } from './CustomerBookings/final-image/final-image.component';
import { AddPackageImageComponent } from './CustomerBookings/add-package-image/add-package-image.component';
import { HawbBaggingComponent } from './Dispatch/hawb-bagging/hawb-bagging.component';
import { ToShipmentCompanyComponent } from './Dispatch/manifest/to-shipment-company/to-shipment-company.component';
import { ToGoCargoComponent } from './Dispatch/manifest/to-go-cargo/to-go-cargo.component';
import { FinalInvoiceComponent } from './warehouseShipment/finalFreeAgentInvoices/final-invoice/final-invoice.component';
import { FinalInvoiceModifyComponent } from './warehouseShipment/finalFreeAgentInvoices/final-invoice-modify/final-invoice-modify.component';
import { CheckWeightReportComponent } from './Report/check-weight-report/check-weight-report.component';
import { PaymentReportComponent } from './Report/payment-report/payment-report.component';
import { BaggedShipmentReportComponent } from './Report/bagged-shipment-report/bagged-shipment-report.component';
import { CollectionReportComponent } from './Report/collection-report/collection-report.component';
import { PackingListReportComponent } from './Report/packing-list-report/packing-list-report.component';
import { TrackingMailReportComponent } from './Report/tracking-mail-report/tracking-mail-report.component';
import { AgentReportComponent } from './Report/agent-report/agent-report.component';
import { DispatchReportComponent } from './Report/dispatch-report/dispatch-report.component';
import { PendingStoackComponent } from './CustomerBookings/pending-stoack/pending-stoack.component';
import { IncompleteBookingComponent } from './Incomplete/incomplete-booking/incomplete-booking.component';
import { GridStateService } from './services/grid-state.service';
import { SheetPaymentHsitoryComponent } from './CustomerBookings/sheet-payment-hsitory/sheet-payment-hsitory.component';
import { DropOffShipmentComponent } from './CustomerBookings/CustomerBookings/drop-off-shipment/drop-off-shipment.component';
import { ViewerDirective } from './interceptors/viewer.directive';
import { SortDirective } from './interceptors/sortDirective.directive';
import { RemoveItemEmailComponent } from './warehouseShipment/remove-item-email/remove-item-email.component';
import { CustomerPaymentComponent } from './CustomerBookings/customer-payment/customer-payment.component';
import { SendNotificationMailComponent } from './UniversalMail/notification/send-notification-mail/send-notification-mail.component';
import { NotificationComponent } from './UniversalMail/notification/notification.component';
import { NpdReportComponent } from './Report/npd-report/npd-report.component';
import { MailEventComponent } from './UniversalMail/mail-event/mail-event.component';
import { EditTemplateComponent } from './UniversalMail/mail-event/MailEvent/edit-template/edit-template.component';
// import {NgxCustomModalModule } 
// import { ExcelExportModule } from '@syncfusion/ej2-angular-grids';  // Import the ExcelExportModule

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled',useHash:true }),
        BrowserModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        MatMenuModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgSelectModule,
        NgxSpinnerModule,
        SpreadsheetModule ,
        
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient],
            },
        }),
        MenuModule,
        GridModule,
        StoreModule.forRoot({ index: indexReducer }),
        NgxTippyModule,
        NgApexchartsModule,
        NgScrollbarModule.withConfig({
            visibility: 'hover',
            appearance: 'standard',
        }),
        HighlightModule,
        SortablejsModule,
        ModalModule,
        QuillModule.forRoot(),
        IconModule,
        MatDialogModule ,
        Ng2FlatpickrModule,
        NgxDocViewerModule,
    ],

    declarations: [
        SortDirective,
        InputSearchDirective,
        ViewerDirective,
        SafeUrlPipe,
        TodolistComponent,
        AppComponent,
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        ThemeCustomizerComponent,
        TablesComponent,
        FontIconsComponent,
        ChartsComponent,
        IndexComponent,
        DispatchComponent,
        AnalyticsComponent,
        FinanceComponent,
        CryptoComponent,
        WidgetsComponent,
        DragndropComponent,
        AppLayout,
        AuthLayout,
        KnowledgeBaseComponent,
        FaqComponent,
        DispatchManifestComponent,
        ToBranchComponent,
        ToBranchManifestComponent,
        ToWarehouseComponent,
        ToWarehouseManifestComponent,
        FromAgentComponent,
        FromAgentManifestComponent,
        FromWarehouseComponent,
        FromWarehouseManifestComponent,
        FromBranchComponent,
        FromBranchManifestComponent,
        DispatchReportComponent,
        HawbAllocationComponent,
        TrackingComponent,
        AgentAllocationComponent,
        AuditComponent,
        EditShipmentComponent,
        TaskForEmpComponent,
        CheckWeightComponent,
        ShipmentEditComponent,
        DepositInvoiceComponent,
        DepositInvoiceModifyComponent,
        AddNotesComponent,
        PickupShipmentsComponent,
        NewBookingsComponent,
        CancelledBookingsComponent,
        NewBookingsComponentols,
        ShipmentEditAfterPickupComponent,
        SalesQuotationComponent,
        FinalImageComponent,
        AddPackageImageComponent,
        HawbBaggingComponent,
        ToShipmentCompanyComponent,
        ToGoCargoComponent,
        FinalInvoiceComponent,
        FinalInvoiceModifyComponent,
        CheckWeightReportComponent,
        PaymentReportComponent,
        BaggedShipmentReportComponent,
        CollectionReportComponent,
        PackingListReportComponent,
        TrackingMailReportComponent,
        AgentReportComponent,
        NpdReportComponent,
        PendingStoackComponent,
        IncompleteBookingComponent,
        SheetPaymentHsitoryComponent,
        DropOffShipmentComponent,
        RemoveItemEmailComponent,
        CustomerPaymentComponent,
        SendNotificationMailComponent,
        NotificationComponent,
        MailEventComponent,
        EditTemplateComponent
    ],
    exports:[
        InputSearchDirective,
        ViewerDirective,
        SortDirective
    ],

    providers: [
        DatePipe,
        AppService,
        ChatService,
        CustomerService,
        EventEmitterService,
        ExcelService,
        NewApiCloudService,
        ValidateEndPointsService,
        PageService,
        AggregateService,
        SortService,
        NgxImageCompressService,
        FilterService,
        PdfExportService,
        ExcelExportService,
        ToolbarService,
        ResizeService,
        ReorderService,
        GridStateService,
 {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },        Title,
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                languages: {
                    json: () => import('highlight.js/lib/languages/json'),
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    xml: () => import('highlight.js/lib/languages/xml'),
                },
            },
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
