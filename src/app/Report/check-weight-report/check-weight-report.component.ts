import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AwbService } from '../../cfServices/awb.service';
import { ChatService } from '../../cfServices/chat-service.service';
import { CustomerService } from '../../cfServices/customer.service';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import { ReportServiceService } from '../../services/report-service.service';

@Component({
  selector: 'app-check-weight-report',
  templateUrl: './check-weight-report.component.html',
  styleUrls: ['./check-weight-report.component.css']
})
export class CheckWeightReportComponent implements OnInit {
  @ViewChild('mainGrid') mainGrid:any;
valForm:FormGroup;
fetchCheckWeightData:any[]=[]
  constructor(public _chat: ChatService , private datep: DatePipe, fb: FormBuilder,
    public service: AwbService,  private service2: CustomerService,
    private service3: ReportServiceService,
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

       this._chat.onMessageBySource('check_weight').subscribe(msg => {
      if (currentUrl == '/checkWeightReport') {
        this.getreport();
      }
    });
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

  summaryKeys:any =[]
  summaryValues:any=[]
 getreport() {
  this.serviceNew.v1_SP_get_check_weight_report_list(this.valForm.value).subscribe(d => {
    const data = d['data'];

    // Filter out unique invoice numbers
    const uniqueInvoices = Array.from(new Set(data.map(item => item.invoice_no)));

    // Prepare the summary data dynamically
    this.summaryKeys = ['Total Hawb', 'Total Package', 'Total Weight', 'Total Volumetric Weight', 'Total Chargeable Weight'];

    this.summaryValues = {
      'Total Hawb': uniqueInvoices.length,
      'Total Package': data.length,
      'Total Weight': data.reduce((acc, item) => acc + parseFloat(item.act_wgt), 0),
      'Total Volumetric Weight': data.reduce((acc, item) => acc + parseFloat(item.vol_weight), 0),
      'Total Chargeable Weight': data.reduce((acc, item) => acc + parseFloat(item.charagble_wt), 0),
    };

    this.fetchCheckWeightData = data;
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
        this.mainGrid.excelExport({ fileName: 'CheckWeight.xlsx' });
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




