import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AwbService } from '../../cfServices/awb.service';
import { ChatService } from '../../cfServices/chat-service.service';
import { CustomerService } from '../../cfServices/customer.service';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrls: ['./collection-report.component.css']
})
export class CollectionReportComponent implements OnInit {

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
    this.CO_Loader = [];

    // Add fixed options
    this.CO_Loader.push(
      { transporter_name: 'DROP_AT_WAREHOUSE' },
      { transporter_name: 'COLLECTION' }
    );

    // Check if the response is an array, then spread it
    if (Array.isArray(data['data'])) {
      this.CO_Loader.push(...data['data']); // Spread the array
    }
  });
  
}
totalCount=0
summaryTransporters: { [key: string]: number } = {};
getTransporterKeys() {
  return Object.keys(this.summaryTransporters);
}
getreport() {
  this.serviceNew.sp_get_pickup_order_collection_report(this.valForm.value).subscribe(d => {
    this.fetchCheckWeightData = d['data'] || [];

    // Compute transporter counts
    this.summaryTransporters = {};
    this.totalCount = 0;  // Initialize total count

    this.fetchCheckWeightData.forEach(item => {
      const transporter = item.transporter_name.toUpperCase() || 'UNKNOWN';
      if (!this.summaryTransporters[transporter]) {
        this.summaryTransporters[transporter] = 1;
      } else {
        this.summaryTransporters[transporter]++;
      }
    });

    // Calculate total count by summing all transporter counts
    this.totalCount = Object.values(this.summaryTransporters).reduce((acc, count) => acc + count, 0);
  });
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


