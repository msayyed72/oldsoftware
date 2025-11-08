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
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css']
})
export class PaymentReportComponent implements OnInit {

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
 summaryPaymentStatus: { [key: string]: number } = {};
totalWeightSum: number = 0;
totalDepositSum: number = 0;
getreport() {
  this.serviceNew.sp_get_paid_unpaid_booking_get(this.valForm.value).subscribe(d => {
    this.fetchCheckWeightData = d['data'] || [];

    this.summaryPaymentStatus = {};
    this.totalWeightSum = 0;
    this.totalDepositSum = 0;

    this.fetchCheckWeightData.forEach(item => {
      const status = item.payment_status.toUpperCase() || 'UNKNOWN';
      this.summaryPaymentStatus[status] = (this.summaryPaymentStatus[status] || 0) + 1;

      this.totalWeightSum += parseFloat(item.total_weight || '0');
      this.totalDepositSum += parseFloat(item.payable_amount || '0');
    });
  });
}
getPaymentStatusKeys() {
  return Object.keys(this.summaryPaymentStatus);
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

