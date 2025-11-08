import { Component, OnInit } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AwbService } from '../../cfServices/awb.service';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pending-stoack',
  templateUrl: './pending-stoack.component.html',
  styleUrls: ['./pending-stoack.component.css']
})
export class PendingStoackComponent implements OnInit {

invoiceFilter=''
userDetails:any;
receivedDate =[]
packedAndUnpackedDate=[];
filterSettings={};
toolbarOptions=[]
  constructor(private service: AwbService,public serviceNew: NewApiCloudService, private imageCompress: NgxImageCompressService,) { 
        this.userDetails=JSON.parse(localStorage.getItem('log_data'));

  }
  // invoiceFilter=''
  ngOnInit() {
        this.filterSettings = { ignoreAccent: true, hierarchyMode: 'None', type: 'Excel' };
        this.toolbarOptions = ['ColumnChooser', 'Search'];

            this.v1_sp_ds_readyfor_manifest_packed_unpacked()

  }
  v1_sp_ds_readyfor_manifest_packed_unpacked(){
    this.serviceNew.v1_sp_ds_readyfor_manifest_packed_unpacked(this.userDetails['v_point_id']).subscribe(r=>{
      this.packedAndUnpackedDate = r['data']
    })
  }
  v1_sp_ds_hawb_final_invoice_image_get() {
    if (!this.invoiceFilter || this.invoiceFilter.trim() === '') return;

    const filterValue = String(this.invoiceFilter).trim();
    if (
      filterValue.length === 6
    ) {
      this.serviceNew.v1_sp_ds_hawb_final_invoice_image_get(this.invoiceFilter).subscribe(r => {
          this.receivedDate= r['data'].map(r=>({
            ...r,
            hawb_img : r['hawb_img'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['hawb_img'] : '',
            ashawb_final_img1 : r['ashawb_final_img1'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['ashawb_final_img1'] : '',
            ashawb_final_img2 : r['ashawb_final_img2'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['ashawb_final_img2'] : ''
          }))
      })  

    }else{
        this.receivedDate =[]
    }
  }
  changePackingStatus(data: any, newStatus: string) {
  // item.status = newStatus;

  // Optional: Send API request to update status in backend
  // this.apiService.updateStatus(item.hawb_no_box, newStatus).subscribe(...)


  
    const payload ={
      hawb_no:data.hawb_no,
      bag_hawb_no:String(data.hawb_no)+String(data.box_no || '').trim(),
      created_by:this.userDetails['v_user_id'],
      status:newStatus,
      // flag:data.flag
    }
                  this.service.sp_v1_ds_history_log_events_insert(data.hawb_no,this.userDetails['v_user_id'],'Pending Stock Added as '+newStatus).toPromise()

    this.serviceNew.v1_sp_ds_hawb_carton_pack_unpack_update(payload).subscribe(r=>{
      if(r['code']=='200'){
        this.showMessage('Updated Successfully');
        this.v1_sp_ds_hawb_final_invoice_image_get();
        this.v1_sp_ds_readyfor_manifest_packed_unpacked()
      }else{
                this.v1_sp_ds_hawb_final_invoice_image_get();
                        this.v1_sp_ds_readyfor_manifest_packed_unpacked()


                this.showMessage('Failed','error');

      }
    },error=>{
        this.showMessage(error,'error')
    })

  }

  
    showMessage(msg = '', type = 'success') {
      const toast: any = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'toast' },
      });
      toast.fire({
        icon: type,
        title: msg,
        padding: '10px 20px',
      });
    }

deleteCartonDetail(data) {
  Swal.fire({
    title: 'Do You Really Want To Delete This Item?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    customClass: {
      confirmButton: 'btn-ok',
      cancelButton: 'btn-cancel'
    },
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const payload = {
        hawb_no: data.invoice_no,
        bag_hawb_no: String(data.hawb_no) + String(data.box_no || '').trim(),
        created_by: this.userDetails['v_user_id'],
        status: '0',
      };

      this.service.sp_v1_ds_history_log_events_insert(data.invoice_no, this.userDetails['v_user_id'], 'Pending Stock Removed').toPromise();

      this.serviceNew.v1_sp_ds_hawb_carton_pack_unpack_update(payload).subscribe(d => {
        if (d['code'] === '200') {
          Swal.fire('Deleted Successfully', '', 'success');
          this.v1_sp_ds_hawb_final_invoice_image_get();
          this.v1_sp_ds_readyfor_manifest_packed_unpacked();
        }
      });
    }
  });
}


}
