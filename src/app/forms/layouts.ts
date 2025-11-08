import { Component } from '@angular/core';
import { AwbServiceService } from '../services/awb-service.service';
import { ReportServiceService } from '../services/report-service.service';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { CustomerServiceService } from '../services/customer-service.service';
import Swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    templateUrl: './layouts.html',
})
export class LayoutsComponent {
    agent: any;
    userdetails
    userid
    pointid
    pointId:any
    point_code_pefix
    invoicedetails:any;
    country_id
    v_point_Id_Branch;
    point_type_id
    v_location_id
    transit:any
    state:any
    country:any
    region:any
    valForm:any
    branch:any
    reportlist:any
    v_point_name
    save_spin:any
    term:any
    btn3:any
    v_user_type: any;
    total_invo:any
    total_car:any
    total_wt:any=0;
    constructor( private excelService:ReportServiceService,private datep: DatePipe, fb: FormBuilder,
        public service: AwbServiceService, private service2: CustomerServiceService,
        private service3: ReportServiceService,private datePipe: DatePipe) {
            const data:any=localStorage.getItem("log_data")
        this.userdetails = JSON.parse(data)
        this.userid = "1";
        this.pointid = this.userdetails.v_point_id
        this.point_type_id = this.userdetails.v_point_type_id
        this.point_code_pefix = this.userdetails.v_origin_prefix
        this.country_id = this.userdetails.V_country_id
        this.v_point_Id_Branch = this.userdetails.v_point_Id_Branch
        this.v_location_id = this.userdetails.v_location_id
        this.v_point_name=this.userdetails.v_point_name
        this.v_user_type=this.userdetails.v_user_type
        this.valForm = fb.group({
         
          'group_type':["1"],
          'pointId':[this.pointid],
          'pointname':[this.v_point_name]
  
        })
       }
       
      getBranch() {
        
        this.service3.get_branch().subscribe(data => {
          this.pointId = data['data']
          this.valForm.controls['pointId'].setValue("-1");
        })
      }
      reset(){}
      getreport()
      {
        // console.log('val',this.valForm.value)
        this.reportlist=[]
        this.total_invo = 0
        this.total_wt = 0
        this.total_car = 0
        this.service3.get_stock_summary(this.valForm.value).subscribe(data => {
          this.reportlist = data['data']
          for (let i = 0; i < this.reportlist.length; i++) {
            this.total_wt = 1*this.reportlist[i]['weight']+this.total_wt
            this.total_car = 1*Number(this.reportlist[i]['tot_carton'])+this.total_car
            this.total_invo = 1*Number(this.reportlist[i]['total_invoice'])+this.total_invo
          }
          // this.total_invo = 1*this.reportlist.length 
        })
      }
  
      keytab(event:any){
        let element = event.srcElement.nextElementSibling; // get the sibling element
    
        if(element == null)  // check if its null
            return;
        else
            element.focus();   // focus if not null
    }
    coloredToast(color: string, msg: any) {
        const toast = Swal.mixin({
          toast: true,
          position: 'bottom-start',
          showConfirmButton: false,
          timer: 3000,
          showCloseButton: true,
          customClass: {
            popup: `color-${color}`,
          },
          target: document.getElementById(color + '-toast') || 'body',
        });
        toast.fire({
          title: msg,
        });
      }
    export():void {
      if (this.reportlist == null || this.reportlist == undefined || this.reportlist.length==0)
      {
        this.coloredToast('danger','No Report Found!')
      }else{
     this.excelService.exportAsExcelFile(this.reportlist, 'Agent Wise');
  }
  }
    ngOnInit() 
    {
      if(this.v_user_type == 'ADMIN')
      {
        this.getBranch()
        
      }
    }
  
}
