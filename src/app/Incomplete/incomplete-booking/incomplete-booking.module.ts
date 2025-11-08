import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IncompleteBookingComponent } from './incomplete-booking.component';

const routes: Routes = [

      { path: 'incomplete/incomplete_booking', component: IncompleteBookingComponent, title: 'Incomplete Booking' },
     
  
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
        RouterModule.forChild(routes),
    
  ]
})
export class IncompleteBookingModule { }
