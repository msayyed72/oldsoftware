import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingServiceService } from 'src/app/services/booking-service.service';
import { ReportServiceService } from 'src/app/services/report-service.service';
import Swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    templateUrl: './fromAgent.html',
})
export class FromAgentComponent {
  
  @ViewChild("inputBox") _el!: ElementRef;
  @ViewChild("DeleteModal") DeleteModal: any;
  Manifest_from_booking_agent:any;
  Destination_from_booking_agent:any;
  valForm: FormGroup;
  btn:any;
  userid:any;
  Save_spin:any;
  update_spin:any;
  btn3:any;
  minifest_no:any;
  destination_point_id: any;
  source_point_id: any;
  rowClicked: any;
  constructor(public http:HttpClientModule,private excelService:ReportServiceService, public service : BookingServiceService,fb: FormBuilder,
    public router:Router,
    private datep:DatePipe) {
      this.valForm = fb.group({
        'manifestDate':[null],
        'sourcePoint':[null, Validators.required],
        'destinationPoint':[null],
        'vechileNo':[null, Validators.required],
        'driverName':[null, Validators.required],
        'sealNo':[null],
        'scanBy':[null],
        'markedBy':[null],
        'createdBy':[null],
        'manifestNo':[null],
        'vechile_guide':[null],
        // 'drivermobileno':[null],
        'cr_time':[null],
        'p_routeId':[null],
        'updatedBy':[null]
      })

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
  ngOnInit() {
    this.Save_spin = '2'
    this.update_spin = '2'
    this.btn='2';
    const data:any=localStorage.getItem("log_data");
    this.userid= JSON.parse(data)
    console.log("usid",this.userid.v_user_id);
    this.getManifest_from_booking_agent();
    this.getDestination_from_booking_agent();
    this.valForm.controls['destinationPoint'].setValue(this.userid.v_point_id);
this.valForm.controls['vechile_guide'].setValue(this.userid.v_user_id);
this.valForm.controls['createdBy'].setValue(this.userid.v_user_id);
this.valForm.controls['markedBy'].setValue(this.userid.v_user_id);
this.valForm.controls['scanBy'].setValue(this.userid.v_user_id);
this.valForm.controls['updatedBy'].setValue(this.userid.v_user_id)
  }
  getManifest_receiving_f_branch(){}
  getManifest_from_booking_agent(){
    this.service.getManifest_from_booking_agent(this.userid.v_point_id).subscribe(get_data=>{
      this.Manifest_from_booking_agent=get_data['data'];
      console.log("Manifest_from_booking_agent",this.Manifest_from_booking_agent);
    })
  }
  getDestination_from_booking_agent(){
   this.service.getDestination_from_booking_agent('12').subscribe(get_data=>{
     this.Destination_from_booking_agent=get_data['data'];
     console.log("Destination_from_booking_agent",this.Destination_from_booking_agent);
   })
 }
 update($ev:any,value:any)
{
  this.update_spin='1'
console.log('valueupdate', value)
          this.service.UpdateManifest_from_booking_agent(value).subscribe(res2=>{ 
          console.log('res', res2) 
          if(res2['code'] == '200'){
   console.log('data',  res2['code'])
   this.coloredToast('success','Successfully Updated.');
   this.reset()
   this.getManifest_from_booking_agent();
   this.update_spin='2'
} 
else{
  this.coloredToast('danger',res2['data']);
 this.update_spin='2'
}

});
}
booking(){
  this.router.navigate(['/Operation/FromAgentManifest',this.minifest_no,this.source_point_id,this.destination_point_id]);
        }
submitForm($ev: any, value: any) {
  $ev.preventDefault();
  for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
  }

  if (this.valForm.valid) {
    this.Save_spin = '1'
      console.log('value', value)
      this.service.InsertManifest_from_booking_agent(value).subscribe(res1=>{ 
      console.log('res1', res1) 
      if(res1['code'] == '200'){
console.log('data',  res1['code'])
this.coloredToast('success','Successfully Added.');
this.reset()
this.getManifest_from_booking_agent();
this.Save_spin = '2'
} 
else{
  this.coloredToast('danger',res1['data']);
this.Save_spin = '2'
}           

});        
}
}
edit(unit:any)
{
console.log('edit', unit)
this._el.nativeElement.focus();
// this.valForm.controls['scanType'].setValue(unit.scan_type)
this.valForm.controls['manifestDate'].setValue(unit.manifest_date)
this.valForm.controls['sourcePoint'].setValue(unit.source_point_id)
// this.valForm.controls['operationType'].setValue(unit.operation_type)
// this.valForm.controls['transitType'].setValue(unit.transit_type)
this.valForm.controls['vechileNo'].setValue(unit.shipment_name)
// this.valForm.controls['drivermobileno'].setValue(unit.driver_mobile_no)
this.valForm.controls['driverName'].setValue(unit.driver_name)
this.valForm.controls['sealNo'].setValue(unit.seal_no)
// this.valForm.controls['markedBy'].setValue(unit.marked_or_indexed_by)
// this.valForm.controls['createdBy'].setValue(unit.created_by)
this.valForm.controls['manifestNo'].setValue(unit.ptp_mf_no)
this.destination_point_id=unit.destination_point_id;
this.source_point_id=unit.source_point_id;
this.btn="1"
this.minifest_no=unit.ptp_mf_no;
}
deleteunitData:any;
data(deleteunitData:any){
  this.deleteunitData=deleteunitData;
}
delete()
{

          this.service.deleteManifest_from_booking_agent(this.deleteunitData.ptp_mf_no).subscribe(res=>{
          if (res['code'] == '200') {
            this.coloredToast('success','Delete Success');
            this.getManifest_from_booking_agent();
            this.DeleteModal.close()
          }
          else{
            this.coloredToast('danger',res['data']);
          }
          })
          return true;
        }
          
reset()
{
this.btn='2';
this.valForm.reset();
this.changeTableRowColor(-1)
    
} 

 
userdetails1:any;
StockDetailsgodown_b_to_b_details:any=[]
StockDetailsgodown_b_to_b:any=[]
branch_name:any
tot_wgt:any
non_arr:any=[]
tot_ctn:any
tot_inv:any
st_summary=true
getStockDetailsgodown_b_to_b1(){
  this.tot_wgt=0
  this.tot_ctn=0
  this.tot_inv=0
  this.service.getStockDetailsgodown_b_to_b(this.userid.v_point_id).subscribe(get_data=>{
    this.StockDetailsgodown_b_to_b=get_data['data'];
    console.log("StockDetailsgodown_b_to_b",this.StockDetailsgodown_b_to_b);
    for (let i = 0; i < this.StockDetailsgodown_b_to_b.length; i++) {
      this.tot_wgt = 1*this.StockDetailsgodown_b_to_b[i]['total_weight']+this.tot_wgt 
      this.tot_ctn = 1*this.StockDetailsgodown_b_to_b[i]['total_carton']+this.tot_ctn 
      this.tot_inv = 1*this.StockDetailsgodown_b_to_b[i]['total_invoice']+this.tot_inv 
    }
  
  })
}
getStockDetailsgodown_b_to_b_detailss(){
  
  this.service.getStockDetailsgodown_b_to_b_details(this.userid.v_point_id).subscribe(get_data=>{
    this.StockDetailsgodown_b_to_b_details=get_data['data'];
    console.log("StockDetailsgodown_b_to_b",this.StockDetailsgodown_b_to_b_details);
   
  
  })
}
summary()
{
  this.st_summary=true
}
details()
{
  this.st_summary=false
}
changeTableRowColor(idx: any) {
  this.rowClicked = idx;
} 
export1():void {
  if(this.st_summary == true)
  {
    if (this.StockDetailsgodown_b_to_b == null || this.StockDetailsgodown_b_to_b == undefined || this.StockDetailsgodown_b_to_b.length==0)
    {
      this.coloredToast('warning','No Report Found!')
    }else{
   this.excelService.exportAsExcelFile(this.StockDetailsgodown_b_to_b, 'Stock Summary');
}
  }
  else{
    if (this.StockDetailsgodown_b_to_b_details == null || this.StockDetailsgodown_b_to_b_details == undefined || this.StockDetailsgodown_b_to_b_details.length==0)
    {
      this.coloredToast('warning','No Report Found!')
    }else{
   this.excelService.exportAsExcelFile(this.StockDetailsgodown_b_to_b_details, 'Stock Details');
}
  }
 
}

}
