import { Component, OnInit } from '@angular/core';
import { AwbService } from 'src/app/cfServices/awb.service';
import { NewApiCloudService } from 'src/app/cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancelled-bookings',
  templateUrl: './cancelled-bookings.component.html',
  styleUrls: ['./cancelled-bookings.component.css']
})
export class CancelledBookingsComponent implements OnInit {
userdetails:any;
v_location_id:any
filterSettings:any;
editSettings:any;
toolbarOptions:any;
  constructor(private serviceNew: NewApiCloudService,public service: AwbService,) { 
        this.userdetails = JSON.parse(localStorage.getItem("log_data"))

        this.v_location_id = this.userdetails.v_location_id

  }

  ngOnInit(): void {
      this.filterSettings = { ignoreAccent: true, hierarchyMode: 'None', type: 'Excel' };
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;
            this.toolbarOptions = ['ColumnChooser', 'Search'];
            this.get_Pickup_non_assignList()

  }
  
  CancelledShipment: any;
  get_Pickup_non_assignList() {
    this.serviceNew.get_Pickup_non_assignList().subscribe(d => {
      this.CancelledShipment = d['data']
    })
  }
  update_Pickup_assignToBranch(input: any) {
  Swal.fire({
    title: 'Do you want to undo the cancellation of this shipment and move it to customer booking?',
    text: '',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      const payload = {
        orderNo: input.order_no,
        branchId: this.v_location_id,
        cretedBy: this.userdetails.v_user_id,
        remarks: ''
      };

      this.service.sp_v1_ds_history_log_events_insert(input['invoice_no'], this.userdetails['v_user_id'], 'From Cancellation of this shipment and move it to customer booking').toPromise();

      this.serviceNew.update_Pickup_assignToBranch(payload).subscribe(d => {
        this.get_Pickup_non_assignList();
      });
    }
  });
}
}
