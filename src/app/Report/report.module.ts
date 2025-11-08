import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CheckWeightReportComponent } from './check-weight-report/check-weight-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { BaggedShipmentReportComponent } from './bagged-shipment-report/bagged-shipment-report.component';
import { CollectionReportComponent } from './collection-report/collection-report.component';
import { PackingListReportComponent } from './packing-list-report/packing-list-report.component';
import { DispatchReportComponent } from './dispatch-report/dispatch-report.component';
import { TrackingMailReportComponent } from './tracking-mail-report/tracking-mail-report.component';
import { AgentReportComponent } from './agent-report/agent-report.component';
import { NpdReportComponent } from './npd-report/npd-report.component';


const routes: Routes = [
  { path: 'reports/checkweight', component: CheckWeightReportComponent, title: 'Check Weight Report' },
{ path: 'reports/payment', component: PaymentReportComponent, title: 'Payment Report' },
{ path: 'reports/bagged-shipment', component: BaggedShipmentReportComponent, title: 'Bagged Shipment Report' },
{ path: 'reports/collection', component: CollectionReportComponent, title: 'Collection Report' },
{ path: 'reports/packing-list', component: PackingListReportComponent, title: 'Packing List Report' },
{ path: 'reports/dispatch', component: DispatchReportComponent, title: 'Dispatch Report' },
{ path: 'reports/tracking-mail', component: TrackingMailReportComponent, title: 'Tracking Mail Report' },
{ path: 'reports/agent', component: AgentReportComponent, title: 'Agent Report' },
{ path: 'reports/npd', component: NpdReportComponent, title: 'NPD Report' },

  
];

@NgModule({
  declarations: [
  ],
  imports: [
        RouterModule.forChild(routes),
    
    CommonModule
  ]
})
export class ReportModule { }
