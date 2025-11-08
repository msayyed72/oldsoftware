import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Inject} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AwbServiceService } from '../services/awb-service.service';
import { CustomerServiceService } from '../services/customer-service.service';
import { ReportServiceService } from '../services/report-service.service'
import Swal from 'sweetalert2';
import { includes } from 'lodash';
@Component({
    moduleId: module.id,
    templateUrl: './input-group.html',
    
})
export class InputGroupComponent {
    agent: any;
    userdetails
    userid
    pointid
    point_code_pefix
    invoicedetails: any;;
    country_id
    v_point_Id_Branch;
    point_type_id
    v_location_id
    transitType: any;
    state: any;
    region: any;
    valForm
    pointId: any;
    reportlist: any;
    v_point_name
    save_spin: any;
    term: any;
    btn3: any;
    total_invo: any;
    total_car: any;
    total_wt: any=0;
    v_user_type: any;
    constructor( private excelService:ReportServiceService,private datep: DatePipe, fb: FormBuilder,
        public service: AwbServiceService, private service2: CustomerServiceService,
        private service3: ReportServiceService,private datePipe: DatePipe)  {
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
          'country_id':["-1"],
          'sateId':["-1"],
          'transitType':["-1"],
          'region':["-1"],
          'agent':["-1"],
          'serialFromNo':[""],
          'serialTONo':[""],
          'operationalfacilityId':["-1"],
          'shipment':["-1"],
          'region_name_val':["-1"],
          'pointId':[this.pointid],
          'pointname':[this.v_point_name],
          // 'branch':[this.pointid],
          // 'branch_name':[this.v_point_name],
  
        })
       }
       
       get_transit() {
        this.service.get_service_typeall().subscribe(data => {
          this.transitType = data['data']
          
        })
      }
      reset(){}
      get_state(value: any) {
        this.service2.get_statebycid(value).subscribe(data => {
          this.state = data['data']
        })
      }
      get_country_list() {
        if(this.valForm.value.country_id == 'All')
          {
            // console.log('yes',this.country)
            this.get_region('-1')
            this.get_state('-1')
          }
          else
          {
            this.service.get_country().subscribe(data => {
            this.country_id = data['data']
              // console.log('No',this.country)
              // this.get_region(this.country_id[0].country_code)
              // this.get_state(this.country_id[0].country_code)
          })
          } 
      }
      
      get_region(value: any) {
        this.region =[];
        this.service.get_Region_By_Country_Id(value).subscribe(data => {
          this.region = data['data']
        })
      }
      getBranch() {
        this.service3.get_branch().subscribe(data => {
          this.pointId = data['data']
          this.valForm.controls['pointId'].setValue("-1");
        })
      }
      getAgent() 
      {
        if(this.v_user_type == 'ADMIN')
        {
          this.service3.get_agent('-1').subscribe(data => {
            this.agent = data['data']
          })
        }
        else
        {
          this.service3.get_agent(this.pointid).subscribe(data => {
            this.agent = data['data']
          })
        }
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
      getreport()
      {
        this.reportlist=[]
        var tempArr:any[] =[]
        this.total_invo = 0
        this.total_wt = 0
        this.total_car = 0
        this.service3.get_pending_report(this.valForm.value).subscribe(data => {
          this.reportlist = data['data']
  
          for (let i = 0; i < this.reportlist.length; i++) {
            this.total_wt = 1*this.reportlist[i]['weight']+this.total_wt
            this.total_car = 1*Number(this.reportlist[i]['count(distinct FS.carton_id)'])+this.total_car
          }
          // this.total_invo = 1*this.reportlist.length 
          this.reportlist.forEach((obj:any) => {
                if (obj.invoice_no && !includes(tempArr, obj.invoice_no)) {
                  tempArr.push(obj.invoice_no)
                  // console.log('res', obj.invoice_no)
                  this.total_invo= 1*this.total_invo + 1
                }
              });
              // console.log('res', this.total_invo)
        })
      }
      
    export():void {
      if (this.reportlist == null || this.reportlist == undefined || this.reportlist.length==0)
      {
        this.coloredToast('danger','No Report Found!')
      }else{
     this.excelService.exportAsExcelFile(this.reportlist, 'Agent Wise');
  }
  }
    ngOnInit() {
      this.get_transit()
      this.get_country_list()
      if(this.v_user_type == 'ADMIN')
      {
      this.getBranch()
      }
      this.getAgent()
    }
  
  
}
