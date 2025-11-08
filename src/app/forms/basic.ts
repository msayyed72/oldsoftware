import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Inject} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AwbServiceService } from '../services/awb-service.service';
import { CustomerServiceService } from '../services/customer-service.service';
import { ReportServiceService } from '../services/report-service.service'

@Component({
    moduleId: module.id,
    templateUrl: './basic.html',
})
export class BasicComponent {
    agent: any;
    userdetails
    userid
    pointid
    point_code_pefix
    invoicedetails: any;
    country_id
    v_point_Id_Branch;
    point_type_id
    v_location_id
    transit: any;
    state: any;
    country: any;
    region: any;
    valForm
    branch: any;
    reportlist: any;
    total_invo: any;
    total_car: any;
    total_wt: any;
    Date:any;
    save_spin: any;
    myDate= new Date();
    term: any;
    btn3: any;
    employee_list: any;
    pointname: any;
    v_user_type: any;
    total_amt: any;
    total_val: any;
    total_comm: any;
    ratePerkg: any;
    search_btn:any;
    inv_len: any;
    constructor( private datep: DatePipe, fb: FormBuilder,
      public service: AwbServiceService, private service2: CustomerServiceService,
      private service3: ReportServiceService,private datePipe: DatePipe) {
        this.Date = this.datep.transform(this.myDate, 'yyyy-MM-dd')
        var user: any = localStorage.getItem("log_data")
        this.userdetails = JSON.parse(user)
        this.userid = "1";
        this.pointid = this.userdetails.v_point_id
        this.point_type_id = this.userdetails.v_point_type_id
        this.point_code_pefix = this.userdetails.v_origin_prefix
        this.country_id = this.userdetails.V_country_id
        this.v_point_Id_Branch = this.userdetails.v_point_Id_Branch
        this.v_location_id = this.userdetails.v_location_id
        this.pointname = this.userdetails.v_point_name
        this.v_user_type=this.userdetails.v_user_type
        this.valForm = fb.group({
          'country':["-1"],
          'state':["-1"],
          'shipment':["-1"],
          'region':["-1"],
          'from_date':[""],
          'to_date':[""],
          'agent':["-1"],
          'user':["-1"],
          'snofrom':[""],
          'snoto':[""],
          'branch':[this.pointid],
          'branch_name':[this.pointname],
          'transit_type_name':["-1"],
          'region_name_val':["-1"],
          'reference_number':["-1"],
          'org_country':["-1"]
        })
       this.valForm.patchValue({
         from_date:this.Date,
         to_date:this.Date
       })
       }
  
       reset(){}
       
       get_transit() {
        this.service.get_service_typeall().subscribe(data => {
          this.transit = data['data']
        })
      }
      employee_name_based_pointId() {
        this.service.employee_name_based_pointId(this.pointid).subscribe(data => {
          this.employee_list = data['data']     
        })
      }
      get_state(value: any) {
        this.service.get_State_By_Region_Id(value).subscribe(data => {
          this.state = data['data']
        })
      }
      get_country_list() {
          if(this.valForm.value.country == 'All')
          {
            // console.log('yes',this.country)
            this.get_region('-1')
            this.get_state('-1')
          }
          else
          {
            this.service.get_country().subscribe(data => {
            this.country = data['data']
              // console.log('No',this.country)
              this.get_region(this.country[0].country_code)
              this.get_state(this.country[0].country_code)
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
        
        this.service3.get_branch().subscribe((data: { [x: string]: any; }) => {
          this.branch = data['data']
          this.valForm.controls['branch'].setValue("-1");
        })
      }
      getAgent(id: any) {
          this.valForm.controls['agent'].setValue("-1")
          this.service3.get_agent(id).subscribe((data: { [x: string]: any; }) => {
            this.agent = data['data']
          })
      }
      getreport()
      {
        this.search_btn='1'
        this.save_spin=true;
        this.reportlist=[]
        this.inv_len = 0
        this.total_invo = 0
        this.total_wt = 0
        this.total_car = 0
        this.total_amt=0
        this.total_val=0
        this.total_comm=0
        this.ratePerkg=0
        // console.log('val',this.valForm.value)
        this.service3.get_date_wise_report(this.valForm.value).subscribe((data: { [x: string]: any; }) => {
          
          if(data['data'])
          {
            this.reportlist = data['data']
            this.inv_len = this.reportlist.length
            this.search_btn='2'
            this.save_spin=false
            // console.log('val',this.reportlist)
          for (let i = 0; i < this.reportlist.length; i++) {
             
            this.total_wt = 1*this.reportlist[i]['total_weight']+this.total_wt
            this.total_car = 1*Number(this.reportlist[i]['total_carton'])+this.total_car
            this.total_amt = 1*this.reportlist[i]['total']+this.total_amt
            this.total_val = 1*this.reportlist[i]['value_charge']+this.total_val
            this.total_comm = 1*this.reportlist[i]['extra_charge']+this.total_comm  
            // console.log('val',i,this.reportlist[i]['total_carton'])
          }
          this.total_invo = 1*this.reportlist.length 
          this.ratePerkg = (this.total_amt/this.total_wt).toFixed(2);
          }
          else
          {
            this.search_btn='2'
            this.save_spin=false
          }
          
        },
            (        error: any)=>{ 
          this.search_btn='2'
            this.save_spin=false
        })
      }
      
    export():void {
//       if (this.reportlist == null || this.reportlist == undefined || this.reportlist.length==0)
//       {
//         this.toastr.errorToastr('No Report Found!')
//       }else{
//      this.excelService.exportAsExcelFile(this.reportlist, 'Agent Wise');
//   }
  }
  download(){
    var search_data={
      shipment_name:"",
       reg_name:"",
       state_name:"",
       agent_name:"",
       from_date:"",
       to_date:""
     }
    // console.log('val',this.valForm.value.shipment,this.transit)
    for (let i = 0; i < this.transit.length; i++) {
     if(this.transit[i].service_type_id == this.valForm.value.shipment)
      {
        // console.log('valif',this.transit[i].transit_type_name)
        var shipment_name=this.transit[i].service_type_name
      }
    }
    for (let i = 0; i < this.region.length; i++) {
      if(this.valForm.value.region == this.region[i].region_id)
       {
         var reg_name=this.region[i].region_name
       }
     }
     if(this.state)
     {
      for (let i = 0; i < this.state.length; i++) {
        if(this.valForm.value.state == this.state[i].delivery_state_id)
        {
          var state_name=this.state[i].state_name
        }
      }
    }
     if(this.agent)
     {
      for (let i = 0; i < this.agent.length; i++) {
        if(this.valForm.value.agent == this.agent[i].point_id)
         {
           var agent_name=this.agent[i].origin_name
         }
       }
     }
     
     search_data={
      shipment_name:shipment_name,
       reg_name:reg_name,
       state_name:state_name,
       agent_name:agent_name,
       from_date:"",
       to_date:""
     }
    //  search_data.from_date = this.valForm.value.from_date
     this.reportlist[0].ship=search_data.shipment_name
     this.reportlist[0].reg_name=search_data.reg_name
     this.reportlist[0].state_name=search_data.state_name
     this.reportlist[0].from_date=this.valForm.value.from_date
     this.reportlist[0].to_date=this.valForm.value.from_date
    //  console.log('search_data',search_data)
    // console.log(this.reportlist.push({'det':search_data}))
    if(this.reportlist.length > 0)
    {
      this.service3.download_date_wise_PDF(this.reportlist,shipment_name,reg_name,state_name,this.valForm.value.from_date,this.valForm.value.to_date).subscribe(
          (        res: { file_url: string | URL | undefined; })=>{
          window.open(res.file_url)
        }
      )
    }
    else
    {
    //   this.toastr.warningToastr('No Data Found')
    }
    //this.reportlist=[]
  }
    ngOnInit() {
      this.get_transit()
      this.get_country_list()
      if(this.v_user_type == 'ADMIN')
      {
        this.getBranch()
      } 
      this.employee_name_based_pointId()
      this.getAgent(this.pointid)
    }
  
  }