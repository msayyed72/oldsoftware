import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AwbService } from '../../cfServices/awb.service';
import { ChatService } from '../../cfServices/chat-service.service';
import { CustomerService } from '../../cfServices/customer.service';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dispatch-report',
  templateUrl: './dispatch-report.component.html',
  styleUrls: ['./dispatch-report.component.css']
})
export class DispatchReportComponent implements OnInit {
 @ViewChild('mainGrid') mainGrid:any;
valForm:FormGroup;
userDetails:any
fetchCheckWeightData:any[]=[]
  constructor(public _chat: ChatService , private datep: DatePipe, fb: FormBuilder,
    public service: AwbService, private service2: CustomerService,
    public serviceNew:NewApiCloudService,public router:Router) {
      this.userDetails =JSON.parse(localStorage.getItem('log_data'));
      this.valForm = fb.group({
          'fromDate':[new Date().toISOString().split('T')[0]],
          'toDate':[new Date().toISOString().split('T')[0]],
          'type':['-1'],

      })
     }
     filterSettings:any;
    
  ngOnInit() {
        const currentUrl = this.router.url;

    //    this._chat.onMessageBySource('check_weight').subscribe(msg => {
    //   if (currentUrl == '/checkWeightReport') {
    //     this.getreport();
    //   }
    // });
    this.get_CO_Loader();
    this.getreport();
        this.filterSettings = { ignoreAccent: true, hierarchyMode: 'None', type: 'Excel' };

  }
  CO_Loader: any = [];
  get_CO_Loader() {
    this.service.get_CO_Loader().subscribe(data => {
      this.CO_Loader = data['data']
    })
  }
  getreport(){
    this.serviceNew.v1_SP_Report_Dispatch_Manifest_Wise_page(this.valForm.value).subscribe(d=>{
      this.fetchCheckWeightData = d['data']
    })
  }
    ToogledToolBar(args: any) {
    switch (args.item.text) {
      case 'PDF Export':
        this.mainGrid.pdfExport({
          fileName: 'Custom_File_Name.pdf',
          pageOrientation: 'Landscape'
        });
        break;
      case 'Excel Export':
        this.mainGrid.excelExport({ fileName: 'PaymentReport.xlsx' });
        break;
      case 'CSV Export':
        this.mainGrid.csvExport({ fileName: 'CheckWeight.csv' });
        break;
      case 'Print':
        this.mainGrid.print();
        break;
      case 'Add':  // Handle Add button click
        console.log('Add button clicked');
        this.mainGrid.addRecord(); // This adds a new row in the grid
        break;
      default:
        console.log('No matching toolbar action found:', args.item.text);
    }
  }
  onRowDataBound(args: any): void {
  if (args.data && args.data.item_details !== undefined) {
    const trimmedItemDetails = args.data.item_details.trim();
    args.data.item_details = trimmedItemDetails;

    const length = trimmedItemDetails.length;

    if (length === 0) {
      args.row.style.backgroundColor = 'red'; // Light red
    } else if (length < 20) {
      args.row.style.backgroundColor = 'yellow'; // Light yellow
    }
  }
}
GoToModify(data){
  data.inv_no =  data.hawb_no,
  data.inv_id =  data.hawb_id,
  data.view_modify = 'modify',

      this.serviceNew.sendData(data);
                  this.router.navigate(['/EditShipmentDetails', data.hawb_no, 'modify', data.hawb_id])
}
formateUsingChatGPt() {
  const chatgot = this.fetchCheckWeightData.map(r => ({
    ...r,
    inv_no: r['hawb_no'],
    prompt: r['item_details'],
    created_by: this.userDetails['v_user_id'],
    carton_id: r['carton_id']
  }));

  const data = chatgot.filter(d => d['chatgpt_updated_status'] != 1);
  console.log(data)
  if (data.length === 0) {
    // this.toastr.warningToastr("All STS is already updated or no packages to update");
        this.showAlert('warning','All STS is already updated or no packages to update')

    return;
  }

  const payload = {
    status: "success",
    data: data
  };

  this.serviceNew.getPackingList(payload).subscribe(response => {
    this.getreport();
  });
}

async showAlert(icon: 'success' | 'error' | 'warning' | 'info' | 'question', message: string) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            padding: '1em',
            customClass: 'sweet-alerts'
        });
        toast.fire({
            icon: icon,
            title: message,
            padding: '1em',
            customClass: 'sweet-alerts'
        });
    }

}




