import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuditComponent } from '../audit/audit.component';
import { EditShipmentComponent } from '../edit-shipment/edit-shipment.component';
import { FinalInvoiceComponent } from '../finalFreeAgentInvoices/final-invoice/final-invoice.component';
import { FinalInvoiceModifyComponent } from '../finalFreeAgentInvoices/final-invoice-modify/final-invoice-modify.component';
import { RemoveItemEmailComponent } from '../remove-item-email/remove-item-email.component';

const routes: Routes = [
    { path: 'wareHouseShipment/Audit', component: AuditComponent, title: 'Audit' },
    { path: 'wareHouseShipment/removeItemMail', component: RemoveItemEmailComponent, title: 'Remove Imgge Mail' },
    { path: 'wareHouseShipment/FinalInvoice', component: FinalInvoiceComponent, title: 'Final Invoice' },
    { path: 'wareHouseShipment/FinalInvoiceEdit/:id', component: FinalInvoiceModifyComponent, title: 'Final Invoice' },
    { path: 'wareHouseShipment/Modify/:inv_no/:view_modify/:inv_id', component: EditShipmentComponent, title: 'Modify' },
   
];

@NgModule({
  declarations: [],
  imports: [
        RouterModule.forChild(routes),
  
    CommonModule
  ]
})
export class WarehouseShipmentModule { }
