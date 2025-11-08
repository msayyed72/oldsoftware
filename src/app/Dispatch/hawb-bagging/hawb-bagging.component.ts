import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { AwbService } from 'src/app/cfServices/awb.service';
import { NewApiCloudService } from 'src/app/cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hawb-bagging',
  templateUrl: './hawb-bagging.component.html',
  styleUrls: ['./hawb-bagging.component.css']
})
export class HawbBaggingComponent implements OnInit {

  @ViewChild('baggingModal') public baggingModal!: any;
  
  baggedInvoices: { bag: string; invoice: string; cartons: string[] }[] = [];
  selectedInvoice: string | null = null;
  bagLabel: string = '';
  valForm: FormGroup;
  userdetails: any;
  pointid: any;
  v_point_name: any;
  receivedCartons: any[] = [];
  selectedCartonsPreview: any[] = [];
  selectedCartonIds: Set<string> = new Set();
  alphabet: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // Generates ['A', 'B', 'C', ..., 'Z']
  // bagLabel: string = 'A'; // Default selection
  
  constructor( public awbser: AwbService,  public fb: FormBuilder, public serviceNew: NewApiCloudService,) {

    this.userdetails = JSON.parse(localStorage.getItem("log_data") || '{}');
    this.pointid = this.userdetails.v_point_id;
    this.v_point_name = this.userdetails.v_point_name;

    this.valForm = this.fb.group({
      'pointId': [this.pointid],
      'country_id': ["-1"],
      'sateId': ["-1"],
      'transitType': ["-1"],
      'region': ["-1"],
      'agent': ["-1"],
      'serialFromNo': ["-1"],
      'serialTONo': ["-1"],
      'operationalfacilityId': ["-1"],
      'shipment': ["-1"],
      'region_name_val': ["-1"],
      'pointname': ["-1"]
    });
  }
  filterSettings
    public toolbarOptions: ToolbarItems[] = [ 'Search'];
  
  ngOnInit() {
    this.alphabet=Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    this.getBaggedCartonData();
    this.filterSettings = { ignoreAccent:true ,hierarchyMode:'None', type: 'Excel' };
    this.toolbarOptions = ['Search'];

  }
  filteredRowAssignList=[]

  getBaggedCartonData() {
    this.serviceNew.get_pending_report(this.valForm.value).subscribe(r => {
        let data = r['data'].map((item: any) => {
  // Convert completed_time from "yyyy-mm-dd HH:mm:ss" to "dd-mm-yyyy HH:mm:ss"
  if (item.created_time) {
    const [datePart, timePart] = item.created_time.split(' ');
    const [year, month, day] = datePart.split('-');
    item.created_time = `${day}-${month}-${year} `;
  }

  // Optional: convert collection_type if needed (yyyy-mm-dd)
  if (item.collection_type) {
    const [year, month, day] = item.collection_type.split('-');
    item.collection_type = `${day}-${month}-${year}`;
  }

  return item;
});;

        // Count occurrences of each invoice_no
        let invoiceCountMap = data.reduce((acc: { [key: string]: number }, item) => {
            acc[item.invoice_no] = (acc[item.invoice_no] || 0) + 1;
            return acc;
        }, {});

        this.receivedCartons = [];
        let groupedBaggedCartons: { [key: string]: any } = {};

        data.forEach((item: any) => {
            if (invoiceCountMap[item.invoice_no] > 1) { // Only include invoices that appear more than once
                if (!item.bag_no) {
                    this.receivedCartons.push(item);
                } else {
                    // Create a unique key using invoice_no and bag_no
                    let key = `${item.invoice_no}-${item.bag_no}`;

                    if (!groupedBaggedCartons[key]) {
                        groupedBaggedCartons[key] = { 
                            ...item, 
                            carton_no: [item.carton_no],  // Store carton_no as an array
                            carton_id: [item.carton_id]  // Store carton_no as an array
                        };
                    } else {
                        groupedBaggedCartons[key].carton_no.push(item.carton_no);
                        groupedBaggedCartons[key].carton_id.push(item.carton_id);
                    }
                }
            }
        });

        // Convert grouped object back to array and join carton_no values
        this.filteredRowAssignList = Object.values(groupedBaggedCartons).map(item => ({
            ...item,
            carton_no: item.carton_no.join(","),  // Convert array to comma-separated string
            carton_id: item.carton_id.join(',')  // Convert array to comma-separated string
        }));
        console.log(this.filteredRowAssignList)
        console.log('this.filteredRowAssignList')
    });
}



  handleSelection(carton: any, event: Event) {
    const target = event.target as HTMLInputElement;
    const invoiceNumber = carton.invoice_no;

    if (target.checked) {
      if (this.selectedInvoice === null) {
        this.selectedInvoice = invoiceNumber;
      }
      if (this.selectedInvoice === invoiceNumber) {
        this.selectedCartonIds.add(carton.carton_id);
      } else {
        target.checked = false;
      }
    } else {
      this.selectedCartonIds.delete(carton.carton_id);
      if (this.selectedCartonIds.size === 0) {
        this.selectedInvoice = null;
      }
    }
  }

  isDisabled(carton: any): boolean {
    return this.selectedInvoice !== null && this.selectedInvoice !== carton.invoice_no;
  }

  isSelected(cartonId: string): boolean {
    return this.selectedCartonIds.has(cartonId);
  }
  

  openBaggingModal() {
        this.alphabet=Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    this.selectedCartonsPreview = this.receivedCartons.filter(c => this.selectedCartonIds.has(c.carton_id));
    this.bagLabel = this.alphabet[0];
    if(this.filteredRowAssignList.length>0){
      const filtered=  this.filteredRowAssignList.filter(r=> r['invoice_no'] == this.selectedCartonsPreview[0].invoice_no)
    
          console.log(this.selectedCartonsPreview)
      if(this.selectedCartonsPreview[0].type_of_shipment == '2'){
          this.showMessage('Commercial Shipment Cannot Be Bagged','error');
          return;
      }
      this.alphabet=Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
        if(filtered.length>0){
          filtered.forEach(r=>{
            
            this.alphabet =this.alphabet.filter(d => d != r['bag_no'] )
            console.log(this.alphabet)
            // this.alphabet = [this.alphabet[0]];
            console.log(this.alphabet)
            console.log('this.alphabet')
            this.bagLabel=this.alphabet[0]
          })
        }
      }  
    
    this.baggingModal.open();
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
  confirmBagging(type) {
    if (!this.bagLabel.trim() || this.selectedCartonIds.size === 0) return;

    const selectedCartons = this.receivedCartons.filter(c => this.selectedCartonIds.has(c.carton_id));
    const groupedInvoice: { [key: string]: string[] } = {};

    selectedCartons.forEach(carton => {
      const invoiceNumber = carton.invoice_no;
      if (!groupedInvoice[invoiceNumber]) {
        groupedInvoice[invoiceNumber] = [];
      }
      groupedInvoice[invoiceNumber].push(carton.carton_id);
    });

    for (const invoice in groupedInvoice) {
      this.baggedInvoices.push({
        bag: type=='A' ? this.bagLabel.toUpperCase() : null,
        invoice: invoice,
        cartons: groupedInvoice[invoice]
      });
    }

    this.printBaggingDetails();
    this.baggingModal.close();
    this.clearSelections();
  }

confirmBaggingDelete(information) {
  const message = `Do you really want to delete Bag No: ${information.bag_no} for HAWB No.: ${information.invoice_no} ?`;

  Swal.fire({
    title: 'Delete Confirmation',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    customClass: {
      confirmButton: 'btn-ok',
      cancelButton: 'btn-cancel',
    },
    focusCancel: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const d = {
        bag_no: null,
        carton_no: information.carton_id,
      };

      this.awbser.sp_v1_ds_history_log_events_insert(
        information.invoice_no,
        this.userdetails['v_user_id'],
        'Bagged Shipment Deleted ' + information.invoice_no + information.bag_no
      ).toPromise();

      this.serviceNew.v1_SP_update_bag_no(d).subscribe({
        next: (response) => {
          this.showMessage('Bagging details updated successfully!');
          console.log(response);
          this.getBaggedCartonData();
          // Optional cleanup
          // this.printBaggingDetails();
          // this.baggingModal.hide();
          // this.clearSelections();
        },
        error: (err) => {
          this.showMessage('Failed to update bagging details.', 'error');
          console.error(err);
        }
      });
    }
  });
}
  
onRowDataBound(args: any): void {
  // Apply red background for commercial shipments
  if (args.data.type_of_shipment == 2) {
    args.row.classList.add('red-row');
  }
}

  private clearSelections() {
    this.selectedInvoice = null;
    this.selectedCartonIds.clear();
  }
  getCheckedCartons(): any {
   
    return this.selectedCartonIds.size ? this.selectedCartonIds.size :0 ;
  }
  
  printBaggingDetails() {
    if (!this.selectedCartonsPreview || this.selectedCartonsPreview.length === 0) {
      this.showMessage('No cartons selected!', 'warning');
      return;
    }
  
    const d = {
      carton_no: this.selectedCartonsPreview.map(d => d.carton_id).join(','),
      bag_no: this.bagLabel
    };
    this.awbser.sp_v1_ds_history_log_events_insert(this.selectedCartonsPreview[0]['invoice_no'],this.userdetails['v_user_id'],'Shipment Bagged '+this.bagLabel).toPromise()
    this.serviceNew.v1_SP_update_bag_no(d).subscribe({
      next: (response) => {
        this.showMessage('Bagging details updated successfully!');
        console.log(response);
        this.getBaggedCartonData()
      },
      error: (err) => {
        this.showMessage('Failed to update bagging details.', 'error');
        console.error(err);
      }
    });
  
    console.log(this.selectedCartonsPreview);
  }
  
  calculateTotalWt() {
    if (!this.selectedCartonsPreview || this.selectedCartonsPreview.length === 0) {
      return 0;
    }
  
    return this.selectedCartonsPreview.reduce((sum, item) => {
      return sum + (Number(item.weight) || 0);
    }, 0);
  }
}
