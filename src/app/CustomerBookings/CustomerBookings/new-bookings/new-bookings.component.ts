import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionEventArgs, FilterSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { AwbService } from '../../../cfServices/awb.service';
import { NewApiCloudService } from '../../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { GridStateService } from '../../../services/grid-state.service';

@Component({
  selector: 'app-new-bookings',
  templateUrl: './new-bookings.component.html',
  styleUrls: ['./new-bookings.component.css']
})
export class NewBookingsComponent implements OnInit {
@ViewChild('mainGrid') public mainGrid!: GridComponent ;
userdetails:any;
editSettings:any;
filterSettings:any;
toolbarOptions:any;
  constructor(public service: AwbService,private serviceNew: NewApiCloudService,private router: Router,private gridStateService: GridStateService) {
        this.userdetails = JSON.parse(localStorage.getItem("log_data"))
    this.filterSettings = { ignoreAccent: true, hierarchyMode: 'None', type: 'Excel' };
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;

   }

  ngOnInit(): void {
        this.toolbarOptions = ['ColumnChooser', 'Search'];

    this.getHawbListAssigned()
    
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
// dataBound() {
//   const savedFilterState = this.gridStateService.getFilterState();
//   const savedSearchText = this.gridStateService.getSearchText();

//   // Use setTimeout to ensure the grid is fully initialized and has rendered its data.
//   // This prevents the race condition where state is applied to an empty table.
//   setTimeout(() => {
//     // 1. Restore the filter state first
//     if (savedFilterState && savedFilterState.columns?.length > 0) {
//       const currentFilterState = this.sanitizeFilterState(this.mainGrid.filterSettings);
      
//       // Compare the sanitized states to avoid re-applying if they're the same
//       if (JSON.stringify(currentFilterState) !== JSON.stringify(savedFilterState)) {
//         this.mainGrid.filterSettings = savedFilterState;
//       }
//     }

//     // 2. Restore the search text second
//     // if (savedSearchText) {
//     //   if (this.mainGrid.searchSettings.key !== savedSearchText) {
//     //     this.mainGrid.searchSettings.key = savedSearchText;
//     //   }
//     // }
//   }, 0);
// }
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
  GreattestOfTwo(a: any, b: any) {
    return Math.max(a || 0, b || 0);
  }
  ToogledToolBar(args: any) {
  switch (args.item.text) {
    case 'PDF Export':
      this.mainGrid?.pdfExport({
        fileName: 'Custom_File_Name.pdf',
        pageOrientation: 'Landscape'
      });
      break;
    case 'Excel Export':
      this.mainGrid?.excelExport({ fileName: 'CustomerBooking.xlsx' });
      break;
    case 'CSV Export':
      this.mainGrid?.csvExport({ fileName: 'Custom_File_Name.csv' });
      break;
    case 'Print':
      this.mainGrid?.print();
      break;
    case 'Add':
      console.log('Add button clicked');
      this.mainGrid?.addRecord();
      break;
    default:
      console.log('No matching toolbar action found:', args.item.text);
  }
}
totalItems: number = 0;

 filteredRowAssignList!: string | any[] 
AssignList:any=[]
// Modify your data fetching method
getHawbListAssigned() {
  // this.isLoading = true;
  
  // Prepare filter parameters
  this.service.getPickupNonAllocationList('1', -1, 0, 1000)
    .subscribe(data => {
      this.AssignList = data['data'];
      this.filteredRowAssignList = data['data'].map((d: any, i: number) => {
        return { ...d, pageNo: i + 1,
          totalNoAndWeight: d['total_carton'] + " - " +d['total_weight']
         }; // Ensure to return modified object
      });
      this.totalItems = this.filteredRowAssignList.length; // Correctly set total items
      // this.isLoading = false;
    });
}
onActionBegin(args: any) {

    if (args.requestType === 'searching' && args.searchString) {
      let searchText = args.searchString.trim();
      let pattern = /^[a-zA-Z]{2}\d{4}$/;

      if (searchText.length === 6 && pattern.test(searchText)) {
              this.service.sp_v1_ds_history_log_events_insert(searchText,this.userdetails['v_user_id'],'Shipment Searched In All Bookings').toPromise()

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


  callApi(searchText) {
    this.serviceNew.v1_SP_ds_invoice_current_status_get(searchText).subscribe(r => {
      const emptyRow = document.querySelector('tr.e-emptyrow td.e-lastrowcell');
      if (true) {
        if (r['code'] == 200 && r['data'].length > 0) {
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
  console.log(data,"ajay")
 this.router.navigate(['/customer/Edit'], {
      queryParams: { data: encodeURIComponent(JSON.stringify(data)) }
    });
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
// actionComplete(args) {
//   if (args.requestType === 'filtering') {
//     const sanitizedState = this.sanitizeFilterState(this.mainGrid.filterSettings);
//     this.gridStateService.setFilterState(sanitizedState);
//   }
//   if (args.requestType === 'clearing') {
//     this.gridStateService.clearFilterState();
//   }
//   // New code to handle searching
//   if (args.requestType === 'searching') {
//     this.gridStateService.setSearchText(this.mainGrid.searchSettings.key);
//   }
// }

  // ngOnDestroy() {
  //   // You might want to save the state here as well if the user leaves the page without an action
  //   this.gridStateService.setFilterState(this.mainGrid.filterSettings.columns);
  // }
    // @ViewChild('mainGrid') public mainGrid: GridComponent;

}
