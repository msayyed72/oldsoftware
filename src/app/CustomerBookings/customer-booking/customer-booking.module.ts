import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NewBookingsComponent } from '../CustomerBookings/new-bookings/new-bookings.component';
import { TaskForEmpComponent } from '../task-for-emp/task-for-emp.component';
import { CheckWeightComponent } from '../check-weight/check-weight.component';
import { ShipmentEditComponent } from '../shipment-edit/shipment-edit.component';
// import { PopupModule } from 'ng6-popup-boxes';
import { ModalModule } from 'angular-custom-modal';
import { DepositInvoiceComponent } from '../deposit-invoice/deposit-invoice.component';
import { DepositInvoiceModifyComponent } from '../deposit-invoice-modify/deposit-invoice-modify.component';
import { PickupShipmentsComponent } from '../CustomerBookings/pickup-shipments/pickup-shipments.component';
import { CancelledBookingsComponent } from '../CustomerBookings/cancelled-bookings/cancelled-bookings.component';
import { NewBookingsComponentols } from '../new-bookings/new-bookings.component';
import { ShipmentEditAfterPickupComponent } from '../shipment-edit-after-pickup/shipment-edit-after-pickup.component';
import { FinalImageComponent } from '../final-image/final-image.component';
import { SalesQuotationComponent } from '../sales-quotation/sales-quotation.component';
import { PendingStoackComponent } from '../pending-stoack/pending-stoack.component';
import { AddPackageImageComponent } from '../add-package-image/add-package-image.component';
import { SheetPaymentHsitoryComponent } from '../sheet-payment-hsitory/sheet-payment-hsitory.component';


const routes: Routes = [
    { path: 'customer/newBookings', component: NewBookingsComponent, title: 'New Bookings' },
    { path: 'customer/newBookingsols', component: NewBookingsComponentols, title: 'New Bookings' },
    { path: 'customer/sheets', component: SheetPaymentHsitoryComponent, title: 'New Bookings' },

    { path: 'customer/awaitpickups', component: PickupShipmentsComponent, title: 'Shipment Arranged For Pickups' },
    { path: 'customer/cancelBookings', component: CancelledBookingsComponent, title: 'Cancel Bookings' },
    { path: 'customer/Edit', component: ShipmentEditComponent, title: 'Edit Shipment' },
    { path: 'customer/EditPickUp', component: ShipmentEditAfterPickupComponent, title: 'EditPickUp Shipment' },
    { path: 'customer/Task', component: TaskForEmpComponent, title: 'Employee Task' },
    { path: 'customer/finalImage', component: FinalImageComponent, title: 'Add Final Image' },
    { path: 'customer/checkWeight', component: CheckWeightComponent, title: 'Check Weight' },
    { path: 'customer/salesQuotation', component: SalesQuotationComponent, title: 'Sales Quotation' },
    { path: 'customer/deposit_invoice', component: DepositInvoiceComponent, title: 'Deposit Invoice' },
    { path: 'customer/package_img', component: AddPackageImageComponent, title: 'Package Image' },
    { path: 'customer/PendingStock', component: PendingStoackComponent, title: 'Pending Stock' },
    { path: 'customer/deposit_invoice/:id', component: DepositInvoiceModifyComponent, title: 'Deposit Invoice' },
    
];

@NgModule({
  declarations: [
    
  ],
  imports: [
    
    // PopupModule,
    RouterModule.forChild(routes),
    CommonModule
  ],  

})
export class CustomerBookingModule { }
