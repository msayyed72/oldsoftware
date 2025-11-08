import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ToShipmentCompanyComponent } from '../manifest/to-shipment-company/to-shipment-company.component';
import { ToGoCargoComponent } from '../manifest/to-go-cargo/to-go-cargo.component';
import { HawbBaggingComponent } from '../hawb-bagging/hawb-bagging.component';

const routes: Routes = [
      { path: 'Manifest/to-shipment-company', component: ToShipmentCompanyComponent, title: 'Manifest Shipment Company' },
      { path: 'Manifest/to-go-package/:id', component: ToGoCargoComponent, title: 'To Go Package' },
      { path: 'Manifest/ShipmentBagging', component: HawbBaggingComponent, title: '' },
  
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
        RouterModule.forChild(routes),
    
  ]
})
export class DispatchModule { }
