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
    templateUrl: './towarehouse.html',
})
export class ToWarehouseComponent {
    @ViewChild("inputBox") _el!: ElementRef;
    @ViewChild('F_DRN') F_DRN: any;
    @ViewChild('F_DES') F_DES: any;
    @ViewChild('DES') DES: any;
    @ViewChild('VEH') VEH: any;
    @ViewChild('SEA') SEA: any;   
    @ViewChild('F_VEH') F_VEH: any;
    @ViewChild('DeleteModal') DeleteModal: any;
    
    Destination_B_To_W:any;
    Manifest_b_to_w:any;
    valForm: FormGroup;
    btn:any;
    userid:any;
    Save_spin:any;
    update_spin:any;
    btn3:any;
    minifest_no:any;
    StockDetailsgodown_b_to_b:any;
    today=new Date();
    date2:any;
    BookingDate:any;
    TotalCarton:any;
    VehicleNo:any;
    BookedBy:any;
    TotalWeight:any;
    DriverName:any;
    DriverNo:any;
    invoice_count:any;
    PostbookingPdfopen:any;
    PostbookingPdf:any;
    stock_B_To_B:any;
    rowsFilter_assign:any;
    stockPdfopen:any;
    manifest:any;
    selected:any = [];
    
    mob_len:any;
    stock_non_booking_B_To_B:any;
    rowClicked: any;
    term:any;
    start_sr: number = 50;
    nxt_action: number = 2;
    coloredToast(color: string, msg: any) {
        const toast = Swal.mixin({
          toast: true,
          position: 'top-right',
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
    mob_val()
    {
      console.log('vf',this.valForm.value )
      
      if(this.valForm.value.drivermobileno && this.valForm.value.drivermobileno.length != this.mob_len)
      {
        this.coloredToast('danger','Invalid Mobile Number '+'Mobile Must Be '+this.mob_len+' Digits' );
        return true;
      }
      {
        return false;
      }
    }

    constructor(public http:HttpClientModule,private excelService:ReportServiceService, public service : BookingServiceService,fb: FormBuilder,
        public router:Router,
        private datep:DatePipe) { 
          this.date2=this.datep.transform(this.today,'yyyy-MM-dd')
          this.valForm = fb.group({
            'manifestDate':[null],
            'sourcePoint':[null],
            'destinationPoint':[null, Validators.required],
            'vechileNo':[null, Validators.required],
            'driverName':[null,],
            'sealNo':[null],
            'scanBy':[null],
            'markedBy':[null],
            'createdBy':[null],
            'manifestNo':[null],
            'vechile_guide':[null],
            'drivermobileno':[null],
            'cr_time':[null],
            'p_routeId':[null],
            'updatedBy':[null]
          })
    
        }
    

  ngOnInit() {
this.reset()

  }
  getDestination_B_To_W(){
    this.service.getDestination_warehouse_new(this.userid.v_point_id).subscribe(get_data=>{
      this.Destination_B_To_W=get_data['data'];
    })
  }
  getManifest_b_to_w(f:any,t:any){
   this.service.getManifest_b_to_w(this.userid.v_point_id,f,t).subscribe(get_data=>{
     this.Manifest_b_to_w=get_data['data'];
     if(this.Manifest_b_to_w.length < 50)
      {
        this.nxt_action = 1
      }
      else{
        this.nxt_action = 2
      }
   })
 }
 getManifest_B_To_B()
 {

 }
 getStockDetailsgodown_b_to_b(){
  this.service.getStockDetailsgodown_b_to_b(this.userid.v_point_id).subscribe(get_data=>{
    this.StockDetailsgodown_b_to_b=get_data['data'];
  })
}
 edit(unit:any)
 {
 this._el.nativeElement.focus();
 this.manifest=unit.ptp_mf_no
 // this.valForm.controls['scanType'].setValue(unit.scan_type)
 this.valForm.controls['manifestDate'].setValue(unit.manifest_date)
 this.valForm.controls['destinationPoint'].setValue(unit.destination_point_id)
 // this.valForm.controls['operationType'].setValue(unit.operation_type)
 // this.valForm.controls['transitType'].setValue(unit.transit_type)
 this.valForm.controls['vechileNo'].setValue(unit.shipment_name)
 this.valForm.controls['drivermobileno'].setValue(unit.driver_mobile_no)
 this.valForm.controls['driverName'].setValue(unit.driver_name)
 this.valForm.controls['sealNo'].setValue(unit.seal_no)
 // this.valForm.controls['markedBy'].setValue(unit.marked_or_indexed_by)
 // this.valForm.controls['createdBy'].setValue(unit.created_by)
 this.valForm.controls['manifestNo'].setValue(unit.ptp_mf_no)
 this.invoice_count=unit.invoice_count;
 this.btn="1"
 this.minifest_no=unit.ptp_mf_no;
 this.BookingDate=unit.manifest_date;
this.TotalCarton=unit.carton_count;
this.VehicleNo=unit.vechile_no;
this.BookedBy=unit.CreatedBy;
this.TotalWeight=unit.total_received_weight;
this.DriverName=unit.driver_name;
this.DriverNo=unit.driver_mobile_no;
 }
 export(){
  if(this.invoice_count == 0 || this.invoice_count == '0'){
    this.coloredToast('danger','No Invoice Found');
  }
  else{
  this.service.getPostbookingPdf(this.userid.v_point_id,this.minifest_no).subscribe(get_data=>{
    this.PostbookingPdf=get_data['data'];
  })
  this.service.getPostbookingPdfopen(this.userid.v_point_id,this.minifest_no,this.invoice_count,
    this.BookingDate,this.TotalCarton,this.VehicleNo,this.BookedBy,this.TotalWeight,this.DriverName,this.DriverNo).subscribe(get_data=>{
    this.PostbookingPdfopen=get_data['file_url'];
    window.open(this.PostbookingPdfopen)
  })
}
}
 update(value:any)
 {
  if(this.valForm.value.destinationPoint =="" || this.valForm.value.destinationPoint ==null || this.valForm.value.destinationPoint ==undefined)
  {
    this.coloredToast('danger','Select Destination')
    this.F_DES.nativeElement.focus()
  }
  else if(this.valForm.value.vechileNo =="" || this.valForm.value.vechileNo ==null || this.valForm.value.vechileNo ==undefined)
  {
    this.coloredToast('danger','Enter Vehicle No')
    this.F_VEH.nativeElement.focus()
  }else{
   this.update_spin='1'
           this.service.UpdateManifest_b_to_w(value).subscribe(res2=>{ 
           if(res2['code'] == '200'){
    this.coloredToast('Successfully Updated.', 'Success!');
    this.reset()
    this.getManifest_b_to_w(0,50);
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
  if(this.TotalWeight == "" || this.TotalWeight == null || this.TotalWeight == undefined)
  {
    this.TotalWeight = 0;
  }
  this.router.navigate(['/Operation/ToWarehouseManifest',this.minifest_no,this.invoice_count,
  this.BookingDate,this.TotalCarton,this.VehicleNo,this.BookedBy,this.TotalWeight,this.DriverName,this.DriverNo]);
        }
        submitForm($ev:any, value: any):any {
            if(this.btn=='2')
            {
             if(this.valForm.value.drivermobileno && this.valForm.value.drivermobileno.length != this.mob_len)
             {
               this.coloredToast('danger','Invalid Mobile Number '+'Mobile Must Be '+this.mob_len+' Digits' );
               return true;
             }
             else{
                  $ev.preventDefault();
                  for (let c in this.valForm.controls) {
                      this.valForm.controls[c].markAsTouched();
                  }
                  if(this.valForm.value.destinationPoint =="" || this.valForm.value.destinationPoint ==null || this.valForm.value.destinationPoint ==undefined)
                  {
                    this.coloredToast('danger','Select Destination')
                    this.F_DES.nativeElement.focus()
                  }
                  else if(this.valForm.value.vechileNo =="" || this.valForm.value.vechileNo ==null || this.valForm.value.vechileNo ==undefined)
                  {
                    this.coloredToast('danger','Enter Vehicle No')
                    this.F_VEH.nativeElement.focus()
                  }else{
                  if (this.valForm.valid) {
                    this.Save_spin = '1'
                      this.service.InsertManifest_b_to_w(value).subscribe(res1=>{ 
                      if(res1['code'] == '200'){
               this.coloredToast( 'success','Successfully Added.');
               this.reset()
               this.getManifest_b_to_w(0,50);
              
               this.Save_spin = '2'
               this.service.getManifest_b_to_w(this.userid.v_point_id,0,50).subscribe(get_data=>{
                 this.Manifest_b_to_w=get_data['data'];
                 this.gobooking_popup();
           
               })
               
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
           }}
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
 
           this.service.deleteManifest_b_to_w(this.deleteunitData.ptp_mf_no).subscribe(res=>{
           if (res['code'] == '200') {
             this.coloredToast('success','Delete Success');
             this.getManifest_b_to_w(0,50);
             this.DeleteModal.close()
             
           }
           else{
            this.coloredToast('danger','Manifest Already Forwarded');
           }
           })
           return true;
         }
            
 reset()
 {
  this.valForm.reset();
  // this.F_DES.nativeElement.focus();
    this.Save_spin = '2'
    this.update_spin = '2'
    this.btn='2';
    var data:any=localStorage.getItem("log_data");
    this.userid = JSON.parse(data);
    if(this.userid)
    {}
    else
    {
      this.router.navigate(['login/0']);
    }
   
 this.changeTableRowColor(-1)
 if(this.userid.v_ph_length == null)
 {
   this.mob_len = 12
 }
 else{
   this.mob_len = this.userid.v_ph_length;
 }
 this.getDestination_B_To_W();
 this.getManifest_b_to_w(0,50);
 this.getStockDetailsgodown_b_to_b();
 this.valForm.controls['sourcePoint'].setValue(this.userid.v_point_id);
this.valForm.controls['vechile_guide'].setValue(this.userid.v_user_id);
this.valForm.controls['createdBy'].setValue(this.userid.v_user_id);
this.valForm.controls['markedBy'].setValue(this.userid.v_user_id);
this.valForm.controls['scanBy'].setValue(this.userid.v_user_id);
this.valForm.controls['updatedBy'].setValue(this.userid.v_user_id);
this.valForm.controls['manifestDate'].setValue(this.date2);
// this.valForm.controls['manifestDate'].disable()
 } 
 pdf_open()
{
  this.service.getStockPdfopen(this.userid.v_point_id).subscribe(get_data=>{
    this.stockPdfopen=get_data['file_url'];
    window.open(this.stockPdfopen)
  })
} 
getstock_B_To_B(){

  this.service.getstock_B_To_B(this.manifest).subscribe(get_data=>{
    this.stock_B_To_B=get_data['data'];
    this.rowsFilter_assign=this.stock_B_To_B;
    // this.invoiceno.nativeElement.focus();
    
  })
}
getstock_B_To_B_popup(){
  this.manifest=this.Manifest_b_to_w[0]['ptp_mf_no']
  this.service.getstock_B_To_B(this.manifest).subscribe(get_data=>{
    this.stock_B_To_B=get_data['data'];
    this.rowsFilter_assign=this.stock_B_To_B;
    // this.invoiceno.nativeElement.focus()
    
  })
}
onChange(checked:any, stock_B_To_B:any){
  if(checked){
  this.selected.push(stock_B_To_B);
  } else {
    this.selected.splice(this.selected.indexOf(stock_B_To_B), 1)
  }
  this.service.get_non_booking_B_To_B(this.manifest,this.selected).subscribe(get_data=>{
    this.stock_non_booking_B_To_B=get_data['data'];
  })
  // this.service.get_booking_B_To_B(this.manifest,this.selected).subscribe(get_data=>{
  //   this.stock_booking_B_To_B=get_data['data'];
  // })
}
CheckAllOptions(){}
changeTableRowColor(idx: any) { 
  this.rowClicked = idx;

  
}


gobooking_popup()
{
// this.popupManager.open('Booking', 'Do you want to Go Booking?', 
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
//                 var unit=this.Manifest_b_to_w[0]
//                 this.invoice_count=unit.invoice_count;
//                 this.minifest_no=unit.ptp_mf_no;
//                 this.BookingDate=unit.manifest_date;
//                 this.TotalCarton=unit.carton_count;
//                 this.VehicleNo=unit.vechile_no;
//                 this.BookedBy=unit.CreatedBy;
//                 this.TotalWeight=0;
//                 this.DriverName=unit.driver_name;
//                 this.DriverNo=unit.driver_mobile_no;
//                 this.router.navigate(['/go-to-booking-warehouse',this.minifest_no,this.invoice_count,
//                 this.BookingDate,this.TotalCarton,this.VehicleNo,this.BookedBy,this.TotalWeight,this.DriverName,this.DriverNo]);
                     
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
// openDialog(value, type): void {
//   const dialogRef = this.dialog.open(StockComponent, {
//     width: '95%', height: '90%',
//     data: { name: 'dialog', type: type },
//     backdropClass: 'dialog-bg-trans'
//   });

//   dialogRef.afterClosed().subscribe(result => {
//   });
// }
pre_cus(id:any)
{
  this.start_sr = this.start_sr - 100
    var end = this.start_sr + 50
    this.getManifest_b_to_w(this.start_sr,end)
    this.start_sr += 50
}
next_cus(id:any)
{
  var end   = 1 * this.start_sr + 50
    this.getManifest_b_to_w(this.start_sr,end)
    this.start_sr = end
}



  // STOCK@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  
  userdetails1:any;
  StockDetailsgodown_b_to_b_details:any=[]
  StockDetailsgodown_b_to_b1:any=[]
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
