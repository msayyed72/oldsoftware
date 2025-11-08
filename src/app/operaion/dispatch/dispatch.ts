import { Component, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
// import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { AwbServiceService } from '../../services/awb-service.service';
import { CustomerServiceService } from '../../services/customer-service.service';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { BookingServiceService } from 'src/app/services/booking-service.service';
import { ReportServiceService } from 'src/app/services/report-service.service';

@Component({
    moduleId: module.id,
    templateUrl: './dispatch.html',
})
export class DispatchComponent implements OnInit {
   
    PanelExpand:boolean =true;
    Toggle(){
        this.PanelExpand=!this.PanelExpand;
    }

    
    
    @ViewChild('classicModal') classicModal: any;
    @ViewChild('DeleteModal') DeleteModal: any;
  @ViewChild('DES') DES: any;
  @ViewChild('SHM') SHM: any;
  @ViewChild('SHC') SHC: any;
  @ViewChild('DHC') DHC: any;
  @ViewChild('SHM1') SHM1: any;
  @ViewChild('DHC1') DHC1: any;
  valForm: FormGroup;
  dispatchForm: FormGroup;
  DestinationList: any
  S_mode_List: any
  S_company_List: any
  Save_spin: any;
  update_spin: any;
  userid: any
  DP_to_SC_List: any
  pointId: any
  btn: any;
  ptf_no: any
  OrganizationList: any
  Save_spin_1: any
  today = new Date();
  date2: any;
  btn3:any;
  shi_veh:any;
  rowClicked: any;
  manifest: any;
  stock_B_To_B: any;
  selected:any[] = []
  stock_non_booking_B_To_B: any;
  ptp: any;
  stock_booking_B_To_B: any;
  btn2:any;
  ctn_weight: any;
  shipment_link: any;
  country: any;
  StockDetailsgodown_b_to_b:any[] = []
  dispatchStatus: any;
  start_sr: number = 50;
  nxt_action: number = 2;
  des_company_List: any;
  ShipmentModeData:any;
  constructor( public http: HttpClientModule, fb: FormBuilder,
    public router: Router,private excelService:ReportServiceService,
  private datep: DatePipe,public service: BookingServiceService, public service2: CustomerServiceService ) {
    this.date2 = this.datep.transform(this.today, 'yyyy-MM-dd')
    this.valForm = fb.group({
      'country': [null,],
      'booking_id': [null,],
      'destination': [null, Validators.required],
      'booking_date': [null, Validators.required],
      'Shipment_mode': [null, Validators.required],
      'Shipment_company': [null, Validators.required],
      'des_clearance': [null],
      'user_id': [null,],
      'point_id': [null],
      'scan_type': [null],
      'source_id': [null],
      'opr_type': [null],
      'vech_no': [null],
      'dri_name': [null],
      'seal': [null],
      'scan': [null],
      'mark': [null],
      'update': [null],
      'vech_guide': [null],
      'dri_mob': [null],
      'route': [null],
      'manifest_date': [null],
      'trans_mode': [null]
    })

    this.dispatchForm = fb.group({
      'b_id': [null,],
      'clr_org': [null, Validators.required],
      'awb_pices': [null, Validators.required],
      'mawb_code': [null, Validators.required],
      'mawb': [null,],
      'mawb2': [null,]
    })
  }

  edit(list:any) {
    this.dispatchStatus = list.dispatch_status
    this.ctn_weight = list.carton_count
    var id = {
      country: list.country_id
    }
    this.getDestination(id)
    console.log('dispatchForm', this.dispatchForm.value)
    this.dispatchForm.controls['awb_pices'].setValue(this.ctn_weight);
    if (list.dispatch_status == "UNDISPATCHED") {
      this.btn2 = "2"
    }
    else {
      this.btn2 = "1"
    }
    this.btn = "2"
    console.log(list)
    // this.date = this.datep.transform(new Date(), 'yyyy-MM-dd')
    this.ptf_no = list.ptp_mf_no
    this.dispatchForm.controls['b_id'].setValue(list.ptp_mf_no)
    for (let i = 0; i < this.S_mode_List.length; i++) {

      if (this.S_mode_List[i].transit_type_id == list.transit_type) {
        this.shipment_link = this.S_mode_List[i].serviceTransitLinkId
      }

    }
    this.service.getShipmentCompany(this.shipment_link).subscribe(res => {
      this.S_company_List = res['data'];
      // console.log('S_company_List',this.S_company_List)
      for (let i = 0; i < this.S_mode_List.length; i++) {

        if (this.S_mode_List[i].transit_type_id == list.transit_type) {
          this.shipment_link = this.S_mode_List[i].serviceTransitLinkId
        }

      }
      for (let index = 0; index < this.S_company_List.length; index++) {
        // console.log('shnafo',list.shipment_name, this.S_company_List[index].s_company_name)
        if (list.shipment_name == this.S_company_List[index].s_company_name)
          // console.log('shna',list.shipment_name, this.S_company_List[index].s_company_name)
          // this.dispatchForm.controls['awb_pices'].setValue(this.ctn_weight);
          var c = this.S_company_List[index].s_company_code
        this.dispatchForm.controls['mawb_code'].setValue(c);
      }
    })
    this.valForm.patchValue({

      scan_type: list.scan_type,
      country: list.country_id,
      Shipment_company: list.shipment_name,
      booking_date: list.manifest_date,
      manifest_date: list.manifest_date,
      source_id: list.source_point_id,
      destination: list.destination_point_id,
      opr_type: list.operation_type,
      Shipment_mode: list.transit_type,
      vech_no: list.shipment_name,
      dri_name: list.driver_name,
      seal: list.seal_no,
      scan: this.userid.user_id,
      mark: this.userid.user_id,
      update: this.userid.user_id,
      booking_id: list.ptp_mf_no,
      vech_guide: this.userid.user_id,
      dri_mob: list.driver_mobile_no

    })


    console.log('shc', this.valForm.value, this.dispatchForm.value)
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
  gotobooking() {
    this.router.navigate(['/Operation/DispatchManifest', this.ptf_no]);
  }

  getDestination(value:any) {
    this.service.getDestination_dispatch(value.country).subscribe(res => {
      this.DestinationList = res['data'];
      console.log('DestinationList', this.DestinationList)
    })
  }

  get_ClrOrg() {
    this.service.getClrorg().subscribe(res => {
      this.OrganizationList = res['data'];
      console.log('OrganizationList', this.OrganizationList)
    })
  }
getShipmentModeAlter(){
  this.service.getShipmentMode().subscribe(data=>{
    console.log(data)
    this.S_mode_List=data['data'];
  })
}
  getshipmentMode(id:any) {
    this.service.get_service_type(id.trans_mode).subscribe(res => {
      this.S_mode_List = res['data'];
      // console.log('S_mode_List',this.S_mode_List)
    })
  }

  getshipmentCompany_Trans(value:any) {

    this.service.getShipmentCompany(value).subscribe(res => {
      this.S_company_List = res['data'];
    })
  }
  

  getdesAgent(value:any) {
    if (this.valForm.value.Shipment_mode && this.valForm.value.country) {
      this.service.getdesAgent(this.valForm.value.Shipment_mode, this.valForm.value.country).subscribe(res => {
        this.des_company_List = res['data'];
      })
    }
  }

  getshipmentCompany(value:any) {
    for (let i = 0; i < this.S_mode_List.length; i++) {
      if (this.S_mode_List[i].transit_type_id == this.valForm.value.Shipment_mode) {
        this.shipment_link = this.S_mode_List[i].serviceTransitLinkId
      }
      console.log(this.shipment_link)
    }
    this.service.getShipmentCompany(this.shipment_link).subscribe(res => {
      this.S_company_List = res['data'];
      // console.log('S_company_List',this.S_company_List)
    })
  }

  
  get_DP_to_SC(start:any, end:any) {
    this.service.getManifest_DP_to_SC(this.pointId, start, end).subscribe(res => {
      this.DP_to_SC_List = res['data'];
      if (this.DP_to_SC_List.length < 50) {
        this.nxt_action = 1
      }
      else {
        this.nxt_action = 2
      }
    })
  }

  submitForm($ev:any, value: any) {
    this.valForm.value.des_clearance=1;

if(this.btn == '1')
  {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
  if(this.valForm.value.destination =="" || this.valForm.value.destination ==null || this.valForm.value.destination ==undefined)
    {
      this.coloredToast('warning','Select Destination')
      this.DES.nativeElement.focus()
    }
    else if(this.valForm.value.Shipment_mode =="" || this.valForm.value.Shipment_mode ==null || this.valForm.value.Shipment_mode ==undefined)
    {
      this.coloredToast('warning','Select Shipment Mode')
      this.SHM.nativeElement.focus()
    }
    else if(this.valForm.value.Shipment_company =="" || this.valForm.value.Shipment_company ==null || this.valForm.value.Shipment_company ==undefined)
    {
      this.coloredToast('warning','Select Shipment Mode')
      this.SHC.nativeElement.focus()
    }else{
    if (this.valForm.valid) {
      this.Save_spin = '1'
      this.service.InsertManifest_DP_to_SC(value).subscribe(res1 => {
        if (res1['code'] == '200') {
          this.coloredToast('success','Successfully Added.');
          this.reset()
          this.service.getManifest_DP_to_SC(this.pointId,1,50).subscribe(res => {
            this.DP_to_SC_List = res['data'];
            // this.gobooking_popup()
          })
          this.Save_spin = '2'
        }
        else {
          this.coloredToast('danger',res1['data'][0]['@p2']);
          this.Save_spin = '2'
        }
      });
    }
    else
  {
    this.coloredToast('warning','Please Enter Mandatoryfield'); 
  }
  }
  
  }
  else{
    this.update(this.valForm.value)
  } 
    }
  ShipmentCompanyassign(value: any) {
    for (let index = 0; index < this.S_company_List.length; index++) {
      if (value.Shipment_company == this.S_company_List[index].s_company_name)
        var b = this.S_company_List[index].s_company_code
      this.dispatchForm.controls['mawb_code'].setValue(b);
    }
    this.service.getveh_ship_com(value.Shipment_company).subscribe(res1 => {
      this.shi_veh = res1['data']

    })
  }
  mawbnoassign(value: any) {
    for (let index = 0; index < this.S_company_List.length; index++) {
      if (value.Shipment_company == this.S_company_List[index].s_company_name)
        var b = this.S_company_List[index].s_company_code
      this.dispatchForm.controls['mawb_code'].setValue(b);
    }
  }
  DispatchForm(value: any) {
    // $ev.preventDefault();
    value.mawb = value.mawb2
    for (let c in this.dispatchForm.controls) {
      this.dispatchForm.controls[c].markAsTouched();
    }

    if (this.dispatchForm.valid) {
      this.Save_spin_1 = '1'
      this.service.insertDispatch(value).subscribe(res1 => {
        if (res1['code'] == '200') {
            this.coloredToast('success','Successfully Added.');
          this.reset()
          this.get_DP_to_SC(0, 50);
          this.Save_spin_1 = '2'
          this.classicModal.hide()
        }
        else {
            this.coloredToast('danger',res1['data'][0]['@p2']);
          this.Save_spin_1 = '2'
        }

      });
    }
  }
  CheckAllOptions() { }
  update(value: any) {
    if (this.valForm.value.destination == "" || this.valForm.value.destination == null || this.valForm.value.destination == undefined) {
        this.coloredToast('danger','Select Destination')
      this.DES.nativeElement.focus()
    }
    else if (this.valForm.value.Shipment_mode == "" || this.valForm.value.Shipment_mode == null || this.valForm.value.Shipment_mode == undefined) {
        this.coloredToast('danger','Select Shipment Mode')
      this.SHM.nativeElement.focus()
    }
    else if (this.valForm.value.Shipment_company == "" || this.valForm.value.Shipment_company == null || this.valForm.value.Shipment_company == undefined) {
        this.coloredToast('danger','Select Shipment Mode')
      this.SHC.nativeElement.focus()
    } else {
      // $ev.preventDefault();
      for (let c in this.valForm.controls) {
        this.valForm.controls[c].markAsTouched();
      }

      if (this.valForm.valid) {
        this.update_spin = '1'
        this.service.UpdateManifest_DP_to_SC(value).subscribe(res1 => {
          if (res1['code'] == '200') {
            this.coloredToast('success','Successfully Added.');
            this.reset()
            this.get_DP_to_SC(0, 50);
            this.update_spin = '2'
            this.btn = "1"
            this.btn2 = "1"
          }
          else {
            this.coloredToast('danger',res1['data']);
            this.update_spin = '2'
            this.btn = "2"
            this.btn2 = "2"
          }

        });
      }
    }
  }
  deleteunitData:any;
  data(deleteunitData:any){
    this.deleteunitData=deleteunitData;
  }
  delete() {
   
                this.service.deleteManifest_DP_to_SC(this.deleteunitData.ptp_mf_no).subscribe(res => {
                  if (res['code'] == '200') {
                    this.coloredToast('success','Delete Success');
                    this.get_DP_to_SC(0, 50);
                    this.DeleteModal.open()
                  }
                  else {
                    this.coloredToast('danger','Cannot Delete ');
                  }
                })
                return true;
    }
           

  dispatch(value: any) {
    this.service.insertDispatch(value).subscribe(res => { })
  }
  undispatch(value: any) {
    this.service.insertunDispatch(value.booking_id).subscribe(res => {
      if (res['code'] == '200') {
        this.coloredToast('success','Successfully Updated.');
        this.get_DP_to_SC(0, 50)
      }
      else {
        this.coloredToast('danger',res['data'][0]['Manifest has not been dispatched']);
      }
    })
  }
  // export(value: any) {
  //   this.service.export_dispatch_manifest(value.booking_id).subscribe(res => {
  //     if (res['data'] == null || res['data'] == undefined) {
  //       this.toastr.errorToastr('No Booking details here!')
  //     } else {
  //       // window.open('http://65.0.1.125:8080/St_cargo_clearance/export/'+res['message'][0])
  //       this.excelService.exportAsExcelFile(res['data'], value.booking_id+'Manifest');
  //     }
  //   })
  // }

  ktm() {
    var dta = {
      'consignmentNo': this.valForm.value.booking_id
    }
    this.service.ktm_manifest(dta).subscribe(res => {
      if (res['message'] == null || res['message'] == undefined) {
        this.coloredToast('danger','No Booking details here!')
      } else {
        window.open('http://65.0.1.125:8080/ExportFiles/' + res['message'][0])
      }
    })
  }

  ubccj() {
    var dta = {
      'consignmentNo': this.valForm.value.booking_id
    }
    this.service.ubccj_manifest(dta).subscribe(res => {
      if (res['message'] == null || res['message'] == undefined) {
        this.coloredToast('danger','No Booking details here!')
      } else {
        window.open('http://65.0.1.125:8080/ExportFiles/' + res['message'][0])
      }
    })
  }

  packingList() {
    var dta = {
      'consignmentNo': this.valForm.value.booking_id
    }
    this.service.packing_manifest(dta).subscribe(res => {
      if (res['message'] == null || res['message'] == undefined) {
        this.coloredToast('danger','No Booking details here!')
      } else {
        window.open('http://65.0.1.125:8080/ExportFiles/' + res['message'][0])
      }
    })
  }

  checklist() {
    var dta = {
      'consignmentNo': this.valForm.value.booking_id
    }
    this.service.checklist_manifest(dta).subscribe(res => {
      if (res['message'] == null || res['message'] == undefined) {
        this.coloredToast('danger','No Booking details here!')
      } else {
        window.open('http://65.0.1.125:8080/ExportFiles/' + res['message'][0])
      }
    })
  }

  courier() {
    var dta = {
      'consignmentNo': this.valForm.value.booking_id
    }
    this.service.courier_manifest(dta).subscribe(res => {
      if (res['message'] == null || res['message'] == undefined) {
        this.coloredToast('danger','No Booking details here!')
      } else {
        window.open('http://65.0.1.125:8080/ExportFiles/' + res['message'][0])
      }
    })
  }

  delivery() {
    var dta = {
      'consignmentNo': this.valForm.value.booking_id
    }
    this.service.delivery_manifest(dta).subscribe(res => {
      if (res['message'] == null || res['message'] == undefined) {
        this.coloredToast('danger','No Booking details here!')
      } else {
        window.open('http://65.0.1.125:8080/ExportFiles/' + res['message'][0])
      }
    })
  }

  export2() {
    this.service.v1_SP_Report_Dispatch_Manifest_Wise_clearance_excel(this.valForm.value.booking_id).subscribe(res => {
      if (res['data'] == null || res['data'] == undefined) {
        this.coloredToast('danger','No Booking details here!')
      } else {
        this.excelService.exportAsExcelFile(res['data'], 'Manifest');
      }
    })
  }

  reset() {
    var data:any=localStorage.getItem("log_data");
    this.userid = JSON.parse(data)

    this.Save_spin = '2'
    this.Save_spin_1 = '2'
    this.update_spin = '2'
    this.btn = "1"
    this.btn2 = "1"
    this.changeTableRowColor(-1)
    this.valForm.reset();
    this.valForm.patchValue({
      user_id: this.userid.v_user_id,
      point_id: this.userid.v_point_id
    })
    this.valForm.controls['booking_date'].setValue(this.date2);
    this.pointId = this.userid.v_point_id
    // this.getDestination()
    // this.getshipmentMode()
    this.get_DP_to_SC(0, 50)
    this.get_ClrOrg()
    this.get_country_list()
    this.getShipmentModeAlter();
  }
  get_country_list() {
    this.service.get_country().subscribe(data => {
      this.country = data['data']
    })
  }
  getstock_B_To_B() {
    this.manifest = this.DP_to_SC_List[0].ptp_mf_no
    this.service.getstock_B_To_B(this.manifest).subscribe(get_data => {
      this.stock_B_To_B = get_data['data'];
    })


  }
  getstock() {
    this.service.getStockDetailsgodown_b_to_b(this.userid.v_point_id).subscribe(get_data => {
      this.StockDetailsgodown_b_to_b = get_data['data'];
    })
  }
  onChange(checked:any, stock_B_To_B:any) {
    if (checked) {
      this.selected.push(stock_B_To_B);
    } else {
      this.selected.splice(this.selected.indexOf(stock_B_To_B), 1)
    }

    this.service.get_non_booking_B_To_B(this.manifest, this.selected).subscribe(get_data => {
      this.stock_non_booking_B_To_B = get_data['data'];
      for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
      }
    })
    // this.service.get_booking_B_To_B(this.manifest, this.selected).subscribe(get_data => {
    //   this.stock_booking_B_To_B = get_data['data'];
    //   console.log("stock_booking_B_To_B", this.stock_booking_B_To_B);
    // })
  }
  BookingAndNonBokking(id:any) {

    this.ptp = id.ptp_mf_no;
    this.service.get_non_booking_B_To_B(this.manifest, id.ptp_mf_no).subscribe(get_data => {
      this.stock_non_booking_B_To_B = get_data['data'];
    })
    this.service.get_booking_B_To_B(this.manifest, id.ptp_mf_no).subscribe(get_data => {
      this.stock_booking_B_To_B = get_data['data'];

    })
  }
  ngOnInit() {

    this.reset()
    // this.userid = JSON.parse(localStorage.getItem("log_data"))
    // this.valForm.patchValue({
    //   user_id: this.userid.v_user_id,
    //   point_id: this.userid.v_point_id
    // })
    // this.pointId = this.userid.v_point_id
    // this.Save_spin = '2'
    // this.Save_spin_1 = '2'
    // this.update_spin = '2'
    // this.btn = "1"
    // this.btn2 = "1"
    // this.getDestination()
    // this.getshipmentMode()
    // this.get_DP_to_SC()
    // this.get_ClrOrg()
    // this.valForm.controls['booking_date'].setValue(this.date2);
  }
  changeTableRowColor(idx: any) {
    this.rowClicked = idx;
  }





  pre_cus(id:any) {
    this.start_sr = this.start_sr - 100
    var end = this.start_sr + 50
    this.get_DP_to_SC(this.start_sr, end)
    this.start_sr += 50
  }
  next_cus(id:any) {
    var end = 1 * this.start_sr + 50
    this.get_DP_to_SC(this.start_sr, end)
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
     this.service.getStockDetailsgodown_b_to_b(this.pointId).subscribe(get_data=>{
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
     
     this.service.getStockDetailsgodown_b_to_b_details(this.pointId).subscribe(get_data=>{
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
