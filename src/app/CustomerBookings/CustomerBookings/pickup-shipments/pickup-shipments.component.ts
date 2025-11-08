import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { AwbService } from 'src/app/cfServices/awb.service';
import { NewApiCloudService } from 'src/app/cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pickup-shipments',
  templateUrl: './pickup-shipments.component.html',
  styleUrls: ['./pickup-shipments.component.css']
})
export class PickupShipmentsComponent implements OnInit {
userdetails:any;
editSettings:any;
filterSettings:any;
toolbarOptions:any;
  constructor(public service: AwbService,private serviceNew: NewApiCloudService,public router:Router) 
 {
   this.filterSettings = { ignoreAccent: true, hierarchyMode: 'None', type: 'Excel' };
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;
            this.toolbarOptions = ['ColumnChooser', 'Search'];

  }
 private sanitizeFilterState(filterSettings: FilterSettingsModel): FilterSettingsModel | null {
    if (!filterSettings || !filterSettings.columns || filterSettings.columns.length === 0) {
      return null;
    }

    const sanitizedColumns = filterSettings.columns.map(col => {
      // This is the crucial step: manually create a new object with only the required properties
      // The properties `field`, `operator`, `value`, `predicate` are safe to serialize.
      return {
        field: col.field,
        operator: col.operator,
        value: col.value,
        predicate: col.predicate
      };
    });

    return { columns: sanitizedColumns };
  }
  isDark=true;
  getIconClass(status: string): string {
  switch (status) {
    case 'Not Generated':
      return 'text-danger'; // Class for red icon
    case 'Generated':
      return 'text-primary'; // Class for blue icon
    case 'Marked as Sent':
      return 'text-warning'; // Class for yellow icon
    case 'Sent to Customer':
      return 'text-success'; // Class for green icon
    default:
      return 'text-secondary'; // Class for grey icon for any other status
  }
}
  ngOnInit(): void {
 
            this.userdetails = JSON.parse(localStorage.getItem("log_data"));
            this.get_Pickup_allocatedListByCoLoader(1,4)

  }
  get_Pickup_allocatedListByCoLoader(id, flag) {
    this.serviceNew.get_Pickup_allocatedList(id, this.userdetails.v_location_id, flag,-1).subscribe(response => {
      const dataList = response['data'];
      this.pickupShipemnts = dataList;

      if (dataList.length > 0) {
        this.pickupShipemnts = dataList.map(item => ({
          ...item,
            depositInvoiceAction: 
              item['deposit_invoice_status'] == 0  ? 'Not Generated' :
              item['deposit_invoice_status'] == 1 ? 'Generated' :
              item['deposit_invoice_status'] == 2 ? 'Marked as Sent' :
              null,
          collection_status_new: item['collection_status'] === '1' ? 'Collected' : item['collection_status'] === '2' ? 'Nothing To Collect' : 'Not Collected',
          type_of_shipment_text: item['type_of_shipment'] == '1' ? 'Normal' : item['type_of_shipment'] == '2' ? 'Commercial' : '',
          call_status_new: item['call_status'] === '1' ? 'Called' : 'Not Called',
          conformation_img: item['conformation_img'] === '1' ? 'Received' : 'Not Received',
          mail_status: item['mail_status'] === '1' ? 'Mail Sended' : item['mail_status'] === '2' ? 'Mail Sended With Label' : 'Mail Not Sended',
          co_loader_tracking_no:
            item['transporter_name'] === 'DPD' || item['transporter_name'] === 'Dpd Drop off'
              ? (item.co_loader_tracking_no || '') + (item.collection_ref_no ? '/' + '\n' + item.collection_ref_no : '') + '\n'
              : item['transporter_name'] === 'Parcel Force'
                ? item.co_loader_tracking_no
                : item.co_loader_tracking_no
        }));
      }
    });
  }
pickupShipemnts!: any[];
   AssignClient=-1;
    pickuptypevalue=''
selectedData:any;
_btnAssign = false;
  totalReceivedData:any[] = [];
orderViewAssign(list, _t,i) {
  console.log(list)
  console.log("list")
  this.AssignClient=i;
  if(list['collection_type'] != 'Drop_At_Warehouse'){
   
    
  }else{
    this.pickuptypevalue='Drop Off'

  }
  if(list){
    this.selectedData=list;
  }
  // this.order_remarks = '';
  if (_t == '1') {
    this._btnAssign = false
    // this._btnnonAssign = true
  }
  else {
    this._btnAssign = true
    // this._btnnonAssign = false
  }
  this.service.orderViewAssign(list.order_no).subscribe(data => {
    console.log(data['data'])
    if (data['data'].length > 0) {
      this.totalReceivedData = data['data'].map((item: any) => ({
        ...item,
        chargeable_wt: Math.ceil(this.GreattestOfTwo(item.weight,item.vol_wgt)), // Initializing chargeable_wt to 0
        parcelNumbers:''
      }));
            } else {
      this.totalReceivedData = []
    }
    console.log(this.totalReceivedData)
    console.log('this.totalReceivedData')
    // this.assignData = data['data'][0]
    // this.order_remarks = data['data'][0].remarks;
    // this.viewForm.patchValue({
    //   orderNo: this.assignData.pickup_id,
    //   totCtn: this.assignData.total_pcs,
    //   totWgt: this.assignData.total_wgt,
    //   serviceType: this.assignData.order_date
    // })
    // this.senderName = this.assignData.sender_name
    // this.senderAddress = this.assignData.sender_address
    // this.senderPhone = this.assignData.sender_contact_no
    // this.recName = this.assignData.receiver_name
    // this.recAddress = this.assignData.receiver_address
    // this.recPhone = this.assignData.receiver_contact_no
    // this.remarks - this.assignData.order_assigned_remarks

  })
}
  UpdateSts() {
    if (this.pickupShipemnts.length > 0) {
      const DpdFilter = this.pickupShipemnts.filter(d => d['transporter_name'] == 'DPD' && (d['co_loader_tracking_no'] != '' || null));
      if (DpdFilter.length > 0) {


        this.serviceNew.multipleTractingStsUpdate(DpdFilter).subscribe(r => {
          this.get_Pickup_allocatedListByCoLoader('1', '4')

        })
      } else {
        // this.toastr.warningToastr("No Dpd Shipments Found")
      }
    }
  }
  GreattestOfTwo(a: any, b: any) {
    return Math.max(a || 0, b || 0);
  }
    onRowDataBound(args: any) {
  // Highlight selected row by index
  // if (this.AssignClient === args.rowIndex) {
  //   args.row.style.backgroundColor = 'lightblue';
  // } else {
  //   args.row.style.backgroundColor = 'white';
  // }

  // Safely check the field
  const data = args.data || {};

  if (
    data.agent_customer &&
    String(data.agent_customer).trim().toLowerCase() === 'bookingagent'
  ) {
    (args.row as HTMLTableRowElement).classList.add('row-booking-agent');
  }
}
 navigateShipment(data){
 this.router.navigate(['/customer/EditPickUp'], {
      queryParams: { data: encodeURIComponent(JSON.stringify(data)) }
    });
}
  
  verifyColoaderPickup(data, sts, type) {
    let actionText = '';

    // Determine action text based on type and status
    if (type === 'call') {
      actionText = sts === '1' ? 'Assign' : 'Redo';
    } else if (type === 'pickup') {
      if (sts === '1') {
        actionText = 'Mark as Collected';
      } else if (sts === '0') {
        actionText = 'Reset';
      } else if (sts === '2') {
        actionText = 'Mark as Nothing to Collect';
      }
    } else if (type === 'con_img') {
      actionText = 'Confirm';
    } else if (type === 'verified') {
      actionText = 'Verify';
    }

    let eventLogText = '';

    if (type === 'call') {
      eventLogText = sts === '1' ? 'Call Assigned' : 'Call Redo';
    } else if (type === 'pickup') {
      if (sts === '1') {
        eventLogText = 'Marked as Collected';
      } else if (sts === '0') {
        eventLogText = 'Pickup Reset';
      } else if (sts === '2') {
        eventLogText = 'Marked as Nothing to Collect';
      }
    } else if (type === 'con_img') {
      eventLogText = sts === '1' ? 'Collection Image Marked as Received' : 'Collection Image Marked as Not Received';
    } else if (type === 'verified') {
      eventLogText = sts === '1' ? 'Shipment Verified' : 'Verification Reverted';
    }

    this.service.sp_v1_ds_history_log_events_insert(data.invoice_no, this.userdetails['v_user_id'], eventLogText).toPromise();

    // Define confirmation message
    let message = '';
    if (type === 'call') {
      message = `Are you sure you want to ${actionText.toLowerCase()} the call status?`;
    } else if (type === 'pickup') {
      message = `Are you sure you want to ${actionText.toLowerCase()}?`;
    } else if (type === 'con_img') {
      message = `Are you sure the collection image has been received?`;
    } else if (type === 'verified') {
      message = `Are you sure the shipment details are verified?`;
    }

    // SweetAlert Confirmation Popup
    Swal.fire({
      title: 'Confirm',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: actionText,
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const d = {
          hawb_no: data.invoice_no,
          status: sts,
          created_by: this.userdetails.v_user_id,
          type: type
        };

        this.serviceNew.v1_SP_ds_Pickup_order_status_update(d).subscribe({
          next: (response) => {
            let successType =
              type === 'call' ? 'Call' :
                type === 'pickup' ? 'Pickup' :
                  type === 'con_img' ? 'Collection image' :
                    type === 'verified' ? 'Shipment details' : 'Status';

            this.showMessage(`${successType} ${actionText.toLowerCase()} successfully`);
            this.get_Pickup_allocatedListByCoLoader(1,4)
          },
          error: (error) => {
            let errorType =
              type === 'call' ? 'call' :
                type === 'pickup' ? 'pickup' :
                  type === 'con_img' ? 'collection image' :
                    type === 'verified' ? 'shipment details' : 'status';

            this.showMessage(`Failed to ${actionText.toLowerCase()} ${errorType}. Please try again.`);
          }
        });
      }
    });
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
    
    convertNumber(value: any): number {
  return isNaN(value) ? 0 : parseFloat(value);
}
}
