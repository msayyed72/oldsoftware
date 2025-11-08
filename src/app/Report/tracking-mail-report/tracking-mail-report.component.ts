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
  selector: 'app-tracking-mail-report',
  templateUrl: './tracking-mail-report.component.html',
  styleUrls: ['./tracking-mail-report.component.css']
})
export class TrackingMailReportComponent implements OnInit {
 @ViewChild('mainGrid') mainGrid:any;
valForm:FormGroup;
fetchCheckWeightData:any[]=[]
  constructor(public _chat: ChatService , private datep: DatePipe, fb: FormBuilder,
    public service: AwbService, private service2: CustomerService,
    public serviceNew:NewApiCloudService,public router:Router) {
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
    this.getCourierNames();
    this.getreport();
        this.filterSettings = { ignoreAccent: true, hierarchyMode: 'None', type: 'Excel' };

  }
  CO_Loader: any = [];
  getCourierNames() {
    this.serviceNew.getCourierNames().subscribe(data => {
      this.CO_Loader = data['data']
    })
  }
  getreport(){
    this.serviceNew.v1_SP_Report_get_tracking_details_carton_box_wise(this.valForm.value).subscribe(d=>{
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
}





