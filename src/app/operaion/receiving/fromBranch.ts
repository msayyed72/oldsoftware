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
    templateUrl: './fromBranch.html',
})
export class FromBranchComponent {

    isOpen: boolean = false;

    openModal() {
      this.isOpen = true;
    }
  
    closeModal() {
      this.isOpen = false;
    }
   
    
    @ViewChild("inputBox") _el!: ElementRef;
    @ViewChild("DeleteModal") DeleteModal: any;
  @ViewChild("F_DRI") F_DRI!: ElementRef;
  @ViewChild("F_DES") F_DES!: ElementRef;
  @ViewChild("F_VNO") F_VNO!: ElementRef;
  
  Destination_receiving_f_branch:any;
  Manifest_receiving_f_branch:any;
  valForm: FormGroup;
  btn:any;
  userid:any;
  Save_spin:any;
  update_spin:any;
  btn3:any;
  minifest_no:any;
  source_point_id:any;
  destination_point_id:any;
  today=new Date();
  date2:any;
  rowClicked:any;
  rowClicked_receive: any;
  userdetails
  point_type_id
  term:any;
  start_sr: number = 50;
  nxt_action: number = 2;
  constructor(public http:HttpClientModule,private excelService:ReportServiceService, public service : BookingServiceService,fb: FormBuilder,
    public router:Router,
    private datep:DatePipe) { 
      var data:any =localStorage.getItem("log_data")
      this.userdetails = JSON.parse(data)
    if(this.userdetails)
    {}
    else
    {
      this.router.navigate(['login/0']);
    }
      this.point_type_id = this.userdetails.v_point_id

      this.date2=this.datep.transform(this.today,'yyyy-MM-dd')
      this.valForm = fb.group({
        'manifestDate':[null],
        'sourcePoint':[null, Validators.required],
        'destinationPoint':[null],
        'vechileNo':[null, Validators.required],
        'driverName':[null],
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
    from_branch_reci_available_manifest:any;
    NonClearedCartonDetailsReceivingBranch:any;
  ngOnInit() {
    // this.Save_spin = '2'
    // this.update_spin = '2'
    // this.btn='2';
    // this.userid= JSON.parse(localStorage.getItem("log_data"))
    // console.log("usid",this.userid.v_user_id);
    // this.getDestination_receiving_f_branch();
    // this.getManifest_receiving_f_branch();
   this.reset()
   this.getManifest_receiving_f_branch(0,50);
  //  this.valForm.controls['manifestDate'].disable()
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
  getDestination_receiving_f_branch(){
   this.service.getDestination_branch_new(this.point_type_id).subscribe(get_data=>{
     this.Destination_receiving_f_branch=get_data['data'];
   })
 }
 getManifest_receiving_f_branch(f:any,t:any){
  this.service.getManifest_receiving_f_branch(this.userid.v_point_id,f,t).subscribe(get_data=>{
    this.Manifest_receiving_f_branch=get_data['data'];
    if(this.Manifest_receiving_f_branch.length < 50)
      {
        this.nxt_action = 1
      }
      else{
        this.nxt_action = 2
      }
  })
}
edit(unit:any)
{
console.log('edit', unit)
this.F_DES.nativeElement.focus();
this.minifest_no=unit.ptp_mf_no
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

this.btn="1"
this.minifest_no=unit.ptp_mf_no;
this.source_point_id=unit.source_point_id;
this.destination_point_id=unit.destination_point_id;
}
update(value:any)
{
  if(this.valForm.value.sourcePoint =="" || this.valForm.value.sourcePoint ==null || this.valForm.value.sourcePoint ==undefined)
  {
    this.coloredToast('danger','Select Source Point')
    this.F_DES.nativeElement.focus()
  }
  else if(this.valForm.value.vechileNo =="" || this.valForm.value.vechileNo ==null || this.valForm.value.vechileNo ==undefined)
  {
    this.coloredToast('danger','Enter Vehicle No')
    this.F_VNO.nativeElement.focus()
  }else{
  this.update_spin='1'
console.log('valueupdate', value)
          this.service.UpdateManifest_receiving_f_branch(value).subscribe(res2=>{ 
          console.log('res', res2) 
          if(res2['code'] == '200'){
   console.log('data',  res2['code'])
   this.coloredToast('success','Successfully Updated.');
   this.reset()
   this.getManifest_receiving_f_branch(0,50);
   this.update_spin='2'
} 
else{
 this.coloredToast('danger',res2['data']);
 this.update_spin='2'
}

});
  }
}
booking(){
  this.router.navigate(['/Operation/FromBranchManifest',this.minifest_no,this.source_point_id,this.destination_point_id]);
        }
submitForm($ev:any, value: any) {
  if(this.btn=='2')
  {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
        this.valForm.controls[c].markAsTouched();
    }
    if(this.valForm.value.sourcePoint =="" || this.valForm.value.sourcePoint ==null || this.valForm.value.sourcePoint ==undefined)
    {
      this.coloredToast('danger','Select Source Point')
      this.F_DES.nativeElement.focus()
    }
    else if(this.valForm.value.vechileNo =="" || this.valForm.value.vechileNo ==null || this.valForm.value.vechileNo ==undefined)
    {
      this.coloredToast('danger','Enter Vehicle No')
      this.F_VNO.nativeElement.focus()
    }else{
    if (this.valForm.valid) {
      this.Save_spin = '1'
        console.log('value', value)
        this.service.InsertManifest_receiving_f_branch(value).subscribe(res1=>{ 
        console.log('res1', res1) 
        if(res1['code'] == '200'){
 console.log('data',  res1['code'])
 this.coloredToast('success','Successfully Added.');
 this.reset()
//  this.getManifest_receiving_f_branch();
this.service.getManifest_receiving_f_branch(this.userid.v_point_id,0,50).subscribe(get_data=>{
  this.Manifest_receiving_f_branch=get_data['data'];
  console.log("Manifest_receiving_f_branch",this.Manifest_receiving_f_branch);
  this.gobooking_popup()
})
 this.Save_spin = '2'
 
} 
else{
this.coloredToast('danger',res1['data'][0]['ERROR']);
this.Save_spin = '2'
}           

});        
}
else
  {
    this.coloredToast('danger','Please Enter Mandatoryfield'); 
  }
}
  }
  else{
    this.update(this.valForm.value)
  }
     
}

deleteunitData:any;
data(deleteunitData:any){
  this.deleteunitData=deleteunitData;
}
delete()
{
   
          this.service.deleteManifest_receiving_f_branch(this.deleteunitData.ptp_mf_no).subscribe(res=>{
          if (res['code'] == '200') {
            this.coloredToast('success','Delete Success');
            this.getManifest_receiving_f_branch(0,50);
            this.DeleteModal.close()
          }
          else{
            this.coloredToast('danger','Manifest Already Forwarded');
          }
          })
          return true;
}
           

getfrom_branch_reci_available_manifest(){
  
  this.service.getfrom_branch_reci_available_manifest(this.source_point_id,this.destination_point_id).subscribe(get_data=>{
    this.from_branch_reci_available_manifest=get_data['data'];
    console.log("from_branch_reci_available_manifest",this.from_branch_reci_available_manifest);
  })
}

getfrom_branch_reci_available_manifest_popup(){
  this.source_point_id=-1;
this.destination_point_id=this.Manifest_receiving_f_branch[0].destination_point_id;
  this.service.getfrom_branch_reci_available_manifest(this.source_point_id,this.destination_point_id).subscribe(get_data=>{
    this.from_branch_reci_available_manifest=get_data['data'];
    console.log("from_branch_reci_available_manifest",this.from_branch_reci_available_manifest);
  })
}
getNonClearedCartonDetailsReceivingBranch(value:any){
  // if(value.ptp_mf_no == undefined)value.ptp_mf_no=this.from_branch_reci_available_manifest[0].ptp_mf_no
  if(value.minifest_no == undefined)this.minifest_no=this.Manifest_receiving_f_branch[0].ptp_mf_no
  console.log('2',this.minifest_no,value.ptp_mf_no)
  this.service.getNonClearedCartonDetailsReceivingBranch(this.minifest_no,value.ptp_mf_no).subscribe(get_data=>{
    this.NonClearedCartonDetailsReceivingBranch=get_data['data'];
    console.log("NonClearedCartonDetailsReceivingBranch",this.NonClearedCartonDetailsReceivingBranch);
  })
}

reset()
{
this.valForm.reset();
this.Save_spin = '2'
this.update_spin = '2'
this.btn='2';
var data:any=localStorage.getItem("log_data");
this.userid = JSON.parse(data)
    if(this.userid)
    {}
    else
    {
      this.router.navigate(['login/0']);
    }
console.log("usid",this.userid.v_user_id);
this.getDestination_receiving_f_branch();
this.getManifest_receiving_f_branch(0,50);

// this.valForm.controls['manifestDate'].disable()
// this.F_DES.nativeElement.focus()
this.valForm.controls['destinationPoint'].setValue(this.userid.v_point_id);
this.valForm.controls['vechile_guide'].setValue(this.userid.v_user_id);
this.valForm.controls['createdBy'].setValue(this.userid.v_user_id);
this.valForm.controls['markedBy'].setValue(this.userid.v_user_id);
this.valForm.controls['scanBy'].setValue(this.userid.v_user_id);
this.valForm.controls['updatedBy'].setValue(this.userid.v_user_id);
this.valForm.controls['manifestDate'].setValue(this.date2);
} 
changeTableRowColor(idx: any) { 
  if(this.rowClicked === idx) this.rowClicked = -1;
  else this.rowClicked = idx;
}
changeTableRowColor_receive(idx: any) { 
  this.rowClicked_receive = idx;
}
gobooking_popup()
{
// this.popupManager.open('Receiving', 'Do you want to Go Receiving From Branch?', 
//     {
//           width: '300px',
//           closeOnOverlay: false,
//           animate: 'scale',
//           actionButtons: 
//           [
//             {
//               text: 'Yes',
//               buttonClasses: 'btn-ok',
//               onAction: () =>
//               {
//                 var unit=this.Manifest_receiving_f_branch[0]
//                 console.log('unit',unit)
//                 this.minifest_no=unit.ptp_mf_no;
//                 this.source_point_id=unit.source_point_id;
//                 this.destination_point_id=unit.destination_point_id;
//                 this.router.navigate(['/from-branch-receiving-btn',this.minifest_no,this.source_point_id,this.destination_point_id]);
                     
//           return true;
//         }
//             },
//             {
//               text: 'No',
//               buttonClasses: 'btn-cancel',
//               onAction: () => {
//                 return false;
//               }
//             }
//           ],
        
//         });
}  
veh_foc()
{
  console.log('ss')
  this.F_VNO.nativeElement.focus()
}

pre_cus(id:any)
{
  this.start_sr = this.start_sr - 100
    var end = this.start_sr + 50
    this.getManifest_receiving_f_branch(this.start_sr,end)
    this.start_sr += 50
}
next_cus(id:any)
{
  var end   = 1 * this.start_sr + 50
    this.getManifest_receiving_f_branch(this.start_sr,end)
    this.start_sr = end
}

 // STOCK@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  
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
