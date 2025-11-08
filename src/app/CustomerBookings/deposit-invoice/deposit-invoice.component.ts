import { Component, OnInit, ViewChild } from '@angular/core';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposit-invoice',
  templateUrl: './deposit-invoice.component.html',
  styleUrls: ['./deposit-invoice.component.css']
})
export class DepositInvoiceComponent implements OnInit {
  @ViewChild('mainGrid') public mainGrid!: GridComponent ;
        public editSettings: Object ={ allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };

filteredRowAssignList:any;
userDetails:any;
filterSettings:any;
toolbarOptions:any;
  constructor(private serviceNew: NewApiCloudService,public router:Router) {
        this.filterSettings = { ignoreAccent:true ,hierarchyMode:'None', type: 'Excel' };
            this.toolbarOptions = ['Search'];
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;

    this.userDetails = JSON.parse(localStorage.getItem('log_data'));

   }

  ngOnInit(): void {
    this.getHawbListAssignedLoad()
    
 
  }
  //   verifyFreeagentCall() {
  //   this.serviceNew.verifyFreeagent()
  // }
getHawbListAssignedLoad() {
  // this.isLoading = true;
  
  // Prepare filter parameters
  this.serviceNew.getPickupNonAllocationListLoad('1', -1, 0, 1000)
    .subscribe((data: { [x: string]: any[]; }) => {
      this.filteredRowAssignList = data['data']
        .filter(d => d['collection_type'] != 'Drop_At_Warehouse') // Filter out rows
        .map((d, i) => {
          return { 
            ...d, 
            pageNo: i + 1,
            depositInvoiceAction: 
              d['deposit_invoice_status'] == 0  ? 'Not Generated' :
              d['deposit_invoice_status'] == 1 ? 'Generated' :
              d['deposit_invoice_status'] == 2 ? 'Marked as Sent' :
              null
          };
        });
    });
}

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

onActionBegin(args: any) {

  if (args.requestType === 'searching' && args.searchString) {
    let searchText = args.searchString.trim();
    let pattern = /^(aa|AA|aA|Aa)\d{4}$/;

    if (searchText.length === 6 && pattern.test(searchText)) {
      // Wait for filtering to complete
      setTimeout(() => {
        let gridData: any = this.mainGrid.dataSource;
        let filteredData: any[] = [];

        if (Array.isArray(gridData)) {
          filteredData = gridData;
        } else if (gridData && gridData.result && Array.isArray(gridData.result)) {
          filteredData = gridData.result;
        }

        console.log("Filtered Data:", filteredData);

        // Check if the searched term exists in the filtered data
        let isFound = filteredData.some(item => item.invoice_no == String(searchText).toUpperCase());

        if (!isFound) {
          console.log("No records found for:", searchText);
          this.callApi(searchText)
          // const emptyRow = document.querySelector('tr.e-emptyrow td.e-lastrowcell');
          // if (emptyRow) {
          //   emptyRow.textContent = 'No records available...';
          // }
          
        } else {
          console.log("Records found for:", searchText);
        }
      }, 500);
    }
  }
}

callApi(searchText: any) {
  this.serviceNew.v1_SP_ds_invoice_current_status_get(searchText).subscribe((r: any) => {
    const emptyRow = document.querySelector('tr.e-emptyrow td.e-lastrowcell');
    if (true) {
      if (r['code'] == 200 && r['data'].length > 0 ) {
        Swal.fire(
          'Shipment Found',
          `The current shipment status is: <span class="badge bg-danger">${r['data'][0]['status']}</span>`,
          'error' // alert icon
        );
      } else {
        Swal.fire(
          'Shipment Status Not Found',
          'The current shipment status could not be found for this shipment.',
          'error'
        );
      }
    }
  });
}
 navigateShipment(data){
 this.router.navigate(['/customer/deposit_invoice',data.order_no], {
      queryParams: { data: encodeURIComponent(JSON.stringify(data)) }
    });
}
   codeArr: any = [];
    toggleCode = (name: string) => {
        if (this.codeArr.includes(name)) {
            this.codeArr = this.codeArr.filter((d: string) => d != name);
        } else {
            this.codeArr.push(name);
        }
    };
pickupShipemnts:any=[]
 
    tab4: string = 'home';
      get_Pickup_allocatedListByCoLoader(id, flag) {
    this.serviceNew.get_Pickup_allocatedList(id, this.userDetails.v_location_id, flag,-1).subscribe(response => {
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
}
