import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AwbService } from '../../cfServices/awb.service';
import { ChatService } from '../../cfServices/chat-service.service';
import { CustomerService } from '../../cfServices/customer.service';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';

@Component({
  selector: 'app-agent-report',
  templateUrl: './agent-report.component.html',
  styleUrls: ['./agent-report.component.css']
})
export class AgentReportComponent implements OnInit {


 @ViewChild('mainGrid') mainGrid:any;
 valForm:FormGroup;
 userDetails:any
 fetchCheckWeightData:any[]=[]
   constructor(public _chat: ChatService , private datep: DatePipe, fb: FormBuilder,
     public service: AwbService, private service2: CustomerService,
     public serviceNew:NewApiCloudService,public router:Router) {
       this.userDetails =JSON.parse(localStorage.getItem('log_data'));
       this.valForm = fb.group({
           'fromdate':[new Date().toISOString().split('T')[0]],
           'todate':[new Date().toISOString().split('T')[0]],
           'agent_id':['-1'],
           'hawb_no':['-1'],
 
       })
      }
      filterSettings:any;
     btn3
   ngOnInit() {
         const currentUrl = this.router.url;
 
     //    this._chat.onMessageBySource('check_weight').subscribe(msg => {
     //   if (currentUrl == '/checkWeightReport') {
     //     this.getreport();
     //   }
     // });
     this.get_booking_agent();
     this.getreport();
         this.filterSettings = { ignoreAccent: true, hierarchyMode: 'None', type: 'Excel' };
 
 
       
   }
   agentget: any = [];
   get_booking_agent() {
     this.service.get_booking_agent().subscribe(data => {
       this.agentget = data['data']
     })
   }
   getreport(){
    const payload = {
     fromdate: this.valForm.value.fromdate,
     todate: this.valForm.value.todate,
     agent_id: this.valForm.value.agent_id,
     hawb_no:this.valForm.value.hawb_no
   };
     this.serviceNew.v1_SP_Report_Agent_booking_list(payload).subscribe((data:any)=>{
       this.fetchCheckWeightData = data['data']
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
 
    onActionBegin(args: any) {
    // console.log("Action Begin Event Fire d:", args);

    if (args.requestType === 'searching' && args.searchString) {
      let searchText = args.searchString.trim();
      let pattern = /^(aa|AA|aA|Aa)\d{4}$/;

      if (searchText.length === 6) {
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
          let isFound = filteredData.some(item => item.hawb === searchText);

          if (!isFound) {
            console.log("No records found for:", searchText);
            this.callApi(searchText);
          } else {
            console.log("Records found for:", searchText);
          }
        }, 500);
      }
    }
  }


callApi(searchText: string) {
  this.btn3 = true;
  const payload = {
    fromdate: '-1',
    todate: '-1',
    agent_id: '-1',
    hawb_no: searchText
  };

  this.serviceNew.v1_SP_Report_Agent_booking_list(payload).subscribe(
    data => {
      console.log(data);
      const newInvoices = data['data'];

      // Check if new invoices exist and merge them without duplicates based on 'merged_hawb'
      if (newInvoices && newInvoices.length > 0) {
        // Filter out already existing entries in fetchCheckWeightData
        const filteredInvoices = newInvoices.filter(
          (invoice) => !this.fetchCheckWeightData.some(
            (existingInvoice) => searchText === invoice.hawb
          )
        );

        // Merge the new, filtered invoices into fetchCheckWeightData
        if (filteredInvoices.length > 0) {
          this.fetchCheckWeightData = [
            ...this.fetchCheckWeightData,
            ...filteredInvoices
          ];
        }
      } else {
        console.log("No new invoices found.");
      }

      this.btn3 = false;
    },
    error => {
      console.error("Error fetching data:", error);
      this.btn3 = false;
    }
  );
}
}
