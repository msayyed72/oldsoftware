import { Component, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
// import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { CustomerServiceService } from '../services/customer-service.service';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { BookingServiceService } from 'src/app/services/booking-service.service';
import { ReportServiceService } from 'src/app/services/report-service.service';



@Component({
    selector: 'app-agent',
    templateUrl: './agentAllocation.html',
})
export class AgentAllocationComponent {
  @ViewChild("inputBox") _el!: ElementRef;
  @ViewChild('DeleteModal') DeleteModal: any;

  valForm: FormGroup;
  btn:any;
  btn3:any;
  pointType:any;
  branchName:any;
  agentName:any;
  dataGrid:boolean | undefined;
  userid:any;
  Save_spin:any;
  pointId: any
  stockStartNo:any;
  startNoInt:any;
  issuQtyInt:any;

  constructor( public http: HttpClientModule, fb: FormBuilder,
    public router: Router,private excelService:ReportServiceService,
  private datep: DatePipe,public service: BookingServiceService, public service2: CustomerServiceService )  { 
      this.valForm = fb.group({
        'issue_pointid':[null],
        'agentName':[null],
        'branchName':[null, Validators.required],
        'startingNo':[null, Validators.required],
        'endingNo':[null, Validators.required],
        'issueQty':[null, Validators.required],
        'totalAwbNo':[null],
        'createdBy': [null],
        'pointcodepefix': [null]
  
      })
    }

    getBranchHawbAllocation()
    {
      this.dataGrid=true;
      this.service.getBranchHawbAllocation(this.userid.v_point_id,'2').subscribe(get_data=>{
        this.pointType=get_data['data'];
        this.dataGrid=false;
        console.log("pointType",this.pointType);
        })
    }
    getBranchName(){
      this.service.getBranchName(1,-1).subscribe(get_data=>{
        this.branchName=get_data['data'];
        console.log("branchName",this.branchName);

      })
    }
    getAgentName(value:any){
      var a=value.branchName.split('$')[0];
      this.service.getBranchName(12,a).subscribe(get_data=>{
        this.agentName=get_data['data'];
        console.log("agentName",this.agentName);

      })
    }
    getBranchStockStartNo(value:any)
    {
      console.log(value.agentName);
      var a=value.agentName.split('$')[0];
      var b=value.agentName.split('$')[1];
        this.dataGrid=true;
        this.service.getBranchStockStartNo(this.userid.v_point_id,a,b).subscribe(get_data=>{
        this.stockStartNo=get_data['data'];
        this.dataGrid=false;
        this.valForm.controls['startingNo'].setValue(this.stockStartNo[0].awbStartNo)
        this.valForm.controls['totalAwbNo'].setValue(this.stockStartNo[0].awbStock)
        console.log("stockStartNo",this.stockStartNo);
        })
    }

    changeIssueQty()
    {
      this.startNoInt=Number(this.valForm.controls['startingNo'].value);
      this.issuQtyInt=Number(this.valForm.controls['issueQty'].value);
      this.valForm.controls['endingNo'].setValue((this.startNoInt+this.issuQtyInt)-1)
    }

    edit(branchName:any)
    {
      this.btn="1"
      console.log('edit', branchName.receiving_point_id + '$' + branchName.point_code_pefix)
      this._el.nativeElement.focus();
      //this.valForm.controls['point_id'].setValue(branchName.issuing_point_id)
      this.valForm.controls['branchName'].setValue(branchName.receiving_point_id + '$' + branchName.point_code_pefix)
      //this.valForm.controls['branchName'].setValue(branchName.receiving_point_id + '$' + branchName.point_code_pefix)
      this.valForm.controls['issueQty'].setValue(branchName.total_no_leaf)
      this.valForm.controls['startingNo'].setValue(branchName.awb_starting_no)
      this.valForm.controls['endingNo'].setValue(branchName.awb_ending_no)
      this.valForm.controls['totalAwbNo'].setValue(branchName.Total_stock)
     
    }

    reset()
    {
      //this.getBranchName();
    	this.btn='2';
	    this.valForm.reset();
      this.getBranchHawbAllocation();
      //this.getBranchName();
      //this.branchName="";
      this._el.nativeElement.focus();
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
    submitForm($ev:any, value: any) 
    {
      $ev.preventDefault();
      for (let c in this.valForm.controls) 
      {
          this.valForm.controls[c].markAsTouched();
      }
      if (this.valForm.valid) 
      {
        console.log('value', value)
        var a=value.agentName.split('$')[0];
        var b=value.agentName.split('$')[1];
         value.branchName = a;
         value.pointcodepefix = b;
        //console.log('value', value)
          this.service.InsertBranchAllocation(value).subscribe(res1=>{ 
          console.log('res1', res1) 
          if(res1['code'] == '200')
          {
            console.log('data',  res1['code'])
            this.coloredToast('success','Successfully Added.');
            this.reset()
            this.getBranchHawbAllocation();
          } 
          else
          {
            this.coloredToast('danger','Cannot Add ');
          }           
        });        	
      }
  }
  deleteunitData:any;
  data(deleteunitData:any){
    this.deleteunitData=deleteunitData;
  }

  delete()
  {
	 
                this.service.deleteBranchAllocation( this.deleteunitData.c_note_issue_id, this.deleteunitData.awb_starting_no, this.deleteunitData.awb_ending_no, this.deleteunitData.issuing_point_id, this.deleteunitData.receiving_point_id).subscribe(res=>{
                  if (res['code'] == '200') 
                  {
                    this.coloredToast('success','Delete Success');
                      this.getBranchHawbAllocation();
                      this.reset();
                      this.DeleteModal.close()

                  }
                  else
                  {
                    this.coloredToast('danger','Cannot Delete ');
                  }
                })
                return true;
            } 
        
  

  export(value: any) {
    this.service.getBranchHawbAllocation(this.userid.v_point_id,'2').subscribe(res => {
      if (res['data'] == null || res['data'] == undefined || res['data'].length == 0) {
        this.coloredToast('danger','No Records here!')
      } else {
        this.excelService.exportAsExcelFile(res['data'], 'Report_Booking_For_Form8F');
      }
    })
  }

  ngOnInit() 
  {
    var data:any=localStorage.getItem("log_data")
      this.userid= JSON.parse(data)
      this.btn='2';
      this.dataGrid=true;
      if(this._el){
        this._el.nativeElement.focus();

      }
      this.valForm.controls['issueQty'].setValue("0");
      this.valForm.controls['totalAwbNo'].setValue("0");
      this.getBranchHawbAllocation();
      this.getBranchName();
      //this.branchName="";
      console.log("usid",this.userid.v_user_id);
      this.valForm.controls['createdBy'].setValue(this.userid.v_user_name);
      this.valForm.controls['issue_pointid'].setValue(this.userid.v_point_id);
      //this.valForm.controls['pointcodepefix'].setValue('54');
      
      /*this.valForm = new FormGroup({
        endingNo: new FormControl({value: null, disabled: true}),
        totalAwbNo: new FormControl({value: '0', disabled: true}),
        issue_pointid: new FormControl(null, Validators.required),
        branchName: new FormControl(null, Validators.required),
        startingNo: new FormControl(null, Validators.required),
        createdBy: new FormControl(null, Validators.required),
        issueQty: new FormControl('0', Validators.required),
        agentName: new FormControl(null, Validators.required),
        pointcodepefix: new FormControl(null, Validators.required)
      });*/
  }


}
