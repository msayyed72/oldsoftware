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
      templateUrl: './tobranch.html',
  })
  export class ToBranchComponent {
    @ViewChild('F_DES') F_DES: any;
    @ViewChild('F_VEH') F_VEH: any;
    @ViewChild('modal12') modal12: any;
    Destination_B_To_B: any;
    Manifest_B_To_B: any;
    valForm: FormGroup;
    btn: any;
    userid: any;
    Save_spin: any;
    update_spin: any;
    btn3: any;
    minifest_no: any;
    StockDetailsgodown_b_to_b: any;
    today = new Date();
    date2: any;
    PostbookingPdf: any;
    invoice_count: any;
    PostbookingPdfopen: any;
    BookingDate: any;
    TotalCarton: any;
    VehicleNo: any;
    BookedBy: any;
    TotalWeight: any;
    DriverName: any;
    DriverNo: any;
    stockPdfopen: string | URL | undefined
    rowClicked: any;
    userdetails: any
    mob_len
    point_type_id
    term:any;
    canDelete:boolean=false;
    DeleteUnitData:any;
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
    constructor( public http: HttpClientModule, fb: FormBuilder,
        public router: Router,private excelService:ReportServiceService,
      private datep: DatePipe,public service: BookingServiceService, public service2: CustomerServiceService ) {

    var data:any  = localStorage.getItem("log_data");
      this.userdetails=JSON.parse(data);
      if (this.userdetails) { }
      else {
        this.router.navigate(['login/0']);
      }
      this.point_type_id = this.userdetails.v_point_id
      if (this.userdetails.v_ph_length == null) {
        this.mob_len = 12
      }
      else {
        this.mob_len = this.userdetails.v_ph_length;
      }

      this.date2 = this.datep.transform(this.today, 'yyyy-MM-dd')
      this.valForm = fb.group({
        'manifestDate': [null],
        'sourcePoint': [null],
        'destinationPoint': [null, Validators.required],
        'vechileNo': [null, Validators.required],
        'driverName': [null,],
        'sealNo': [null],
        'scanBy': [null],
        'markedBy': [null],
        'createdBy': [null],
        'manifestNo': [null],
        'vechile_guide': [null],
        'drivermobileno': [null],
        'cr_time': [null],
        'p_routeId': [null],
        'updatedBy': [null]
      })

    }

    ngOnInit() {
      this.reset()
    }
    getDestination_B_To_B() {
      this.service.getDestination_branch_new(this.point_type_id).subscribe(get_data => {
        this.Destination_B_To_B = get_data['data'];
        console.log("Destination_B_To_B", this.Destination_B_To_B);
      })
    }
    getManifest_B_To_B() {
      this.service.getManifest_B_To_B(this.userid.v_point_id).subscribe(get_data => {
        this.Manifest_B_To_B = get_data['data'];
        console.log("Manifest_B_To_B", this.Manifest_B_To_B);
      })
    }
    getStockDetailsgodown_b_to_b() {
      this.service.getStockDetailsgodown_b_to_b(this.userid.v_point_id).subscribe( get_data => {
        this.StockDetailsgodown_b_to_b = get_data['data'];
        console.log("StockDetailsgodown_b_to_b", this.StockDetailsgodown_b_to_b);

      })
    }
    export() {
      console.log(this.invoice_count);
      if (this.invoice_count == 0 || this.invoice_count == '0') {
        this.coloredToast('Failed', 'No Invoice Found');
      }
      else {
        this.service.getPostbookingPdf(this.userid.v_point_id, this.minifest_no).subscribe(get_data => {
          this.PostbookingPdf = get_data['data'];
          console.log("PostbookingPdf", this.PostbookingPdf);
        })
        this.service.getPostbookingPdfopen(this.userid.v_point_id, this.minifest_no, this.invoice_count,
          this.BookingDate, this.TotalCarton, this.VehicleNo, this.BookedBy, this.TotalWeight, this.DriverName, this.DriverNo).subscribe(get_data => {
            this.PostbookingPdfopen = get_data['file_url'];
            console.log("PostbookingPdfopen", this.PostbookingPdfopen);
            window.open(this.PostbookingPdfopen)
          })
      }
    }
    edit(unit:any) {
      console.log('edit', unit)
      this.F_DES.nativeElement.focus()
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
      this.invoice_count = unit.invoice_count;
      this.btn = "1"
      this.minifest_no = unit.ptp_mf_no;
      this.BookingDate = unit.manifest_date;
      this.TotalCarton = unit.carton_count;
      this.VehicleNo = unit.vechile_no;
      this.BookedBy = unit.CreatedBy;
      this.TotalWeight = unit.total_received_weight;
      this.DriverName = unit.driver_name;
      this.DriverNo = unit.driver_mobile_no;

    }
    update(value: any) {
      if (this.valForm.value.destinationPoint == "" || this.valForm.value.destinationPoint == null || this.valForm.value.destinationPoint == undefined) {
        this.coloredToast('danger','Select Destination')
        this.F_DES.nativeElement.focus()
      }
      else if (this.valForm.value.vechileNo == "" || this.valForm.value.vechileNo == null || this.valForm.value.vechileNo == undefined) {
        this.coloredToast('danger','Enter Vehicle No')
        this.F_VEH.nativeElement.focus()
      } else {
        this.update_spin = '1'
        console.log('valueupdate', value)
        this.valForm.controls['sourcePoint'].setValue(this.userid.v_point_id);

        this.service.UpdateManifest_B_To_B(value).subscribe(res2 => {
          console.log('res', res2)
          if (res2['code'] == '200') {
            console.log('data', res2['code'])
            this.coloredToast('success','Successfully Updated.');
            this.reset()
            this.getManifest_B_To_B();
            this.update_spin = '2'
            //  this.gobooking_popup()
          }
          else {
            this.coloredToast(res2['data'][0]['ERROR'], 'Failed');
            this.update_spin = '2'
          }

        });
      }
    }
    booking() {
      console.log('wt', this.TotalWeight)
      if (this.TotalWeight == null) {
        this.TotalWeight = 0
      }
      this.router.navigate(['/Operation/ToBranchManifest', this.minifest_no, this.invoice_count,
        this.BookingDate, this.TotalCarton, this.VehicleNo, this.BookedBy, this.TotalWeight, this.DriverName, this.DriverNo]);
    }
  
    submitForm($ev:any, value: any):any|undefined {

      if (this.btn == '2') {
        if (this.valForm.value.drivermobileno && this.valForm.value.drivermobileno.length != this.mob_len) {
          this.coloredToast('Invalid Mobile Number', 'Mobile Must Be ' + this.mob_len + ' Digits');
          return true;  
        }
        else {
          $ev.preventDefault();
          for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
          }
          if (this.valForm.value.destinationPoint == "" || this.valForm.value.destinationPoint == null || this.valForm.value.destinationPoint == undefined) {
            this.coloredToast('danger','Select Destination')
            this.F_DES.nativeElement.focus()
          }
          else if (this.valForm.value.vechileNo == "" || this.valForm.value.vechileNo == null || this.valForm.value.vechileNo == undefined) {
            this.coloredToast('danger','Enter Vehicle No')
            this.F_VEH.nativeElement.focus()
          } else {
            if (this.valForm.valid) {


              this.Save_spin = '1'
              console.log('value', value)

              this.service.InsertManifest_B_To_B(value).subscribe(res1 => {
                console.log('res1', res1)
                if (res1['code'] == '200') {
                  console.log('data', res1['code'])
                  this.coloredToast('success','Successfully Added.');
                  this.reset()
                  //  this.getManifest_B_To_B();
                  this.Save_spin = '2'

                  this.service.getManifest_B_To_B(this.userid.v_point_id).subscribe(get_data => {
                    this.Manifest_B_To_B = get_data['data'];
                    console.log("Manifest_B_To_B", this.Manifest_B_To_B);
                    this.gobooking_popup();
                  })
                }
                else {
                  this.coloredToast('Failed', res1['data'][0]['ERROR']);
                  this.Save_spin = '2'
                }

              });


            }
            else {
              this.coloredToast('danger','Please Enter Mandatoryfield');
            }
          }

        }
      }
      else {
        this.update(this.valForm.value)
      }



    }
    delete(unit: any) {
      this.DeleteUnitData=unit;
      this.modal12.open();

    
  }

    DeleteData(){
      this.service.deleteManifest_B_To_B(this.DeleteUnitData.ptp_mf_no).subscribe(res => {
        if (res['code'] == '200') {
          this.coloredToast( 'success','Delete Success');
          this.getManifest_B_To_B();

        }
        else {
          this.coloredToast('warning','Manifest Already Forwarded');
        }
      })
    }
    

    reset() {

      this.valForm.reset();
      // this.F_DES.nativeElement.focus()
      this.changeTableRowColor(-1)
      this.Save_spin = '2'
      this.update_spin = '2'
      this.btn = '2';
      var data:any=localStorage.getItem("log_data");
      this.userid = JSON.parse(data)
      console.log("usid", this.userid.v_user_id);
      this.getDestination_B_To_B();
      this.getManifest_B_To_B();
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

    pdf_open() {
      this.service.getStockPdfopen(this.userid.v_point_id).subscribe(get_data => {
        this.stockPdfopen = get_data['file_url'];
        console.log("stockPdfopen", this.stockPdfopen);
        window.open(this.stockPdfopen)
      })
    }
    changeTableRowColor(idx: any) {
      this.rowClicked = idx;
    }

    mob_val() {
      console.log('vf', this.valForm.value)

      if (this.valForm.value.drivermobileno && this.valForm.value.drivermobileno.length != this.mob_len) {
        this.coloredToast('Invalid Mobile Number', 'Mobile Must Be ' + this.mob_len + ' Digits');
        return true;
      }
      {
        return false;
      }
    }

    gobooking_popup() {
      // this.popupManager.open('Booking', 'Do you want to Go Booking?',
      //   {
      //     width: '300px',
      //     closeOnOverlay: false,
      //     animate: 'scale',
      //     actionButtons:
      //       [
      //         {
      //           text: 'Yes',
      //           buttonClasses: 'btn-ok',
      //           onAction: () => {
      //             var unit = this.Manifest_B_To_B[0]
      //             console.log('unit', unit)
      //             this.invoice_count = unit.invoice_count;
      //             this.minifest_no = unit.ptp_mf_no;
      //             this.BookingDate = unit.manifest_date;
      //             this.TotalCarton = unit.carton_count;
      //             this.VehicleNo = unit.vechile_no;
      //             this.BookedBy = unit.CreatedBy;
      //             this.TotalWeight = 0;
      //             this.DriverName = unit.driver_name;
      //             this.DriverNo = unit.driver_mobile_no;
      //             this.router.navigate(['/go-to-booking-branch', this.minifest_no, this.invoice_count,
      //               this.BookingDate, this.TotalCarton, this.VehicleNo, this.BookedBy, this.TotalWeight, this.DriverName, this.DriverNo]);

      //             return true;
      //           }
      //         },
      //         {
      //           text: 'No',
      //           buttonClasses: 'btn-cancel',
      //           onAction: () => {
      //             return false;
      //           }
      //         }
      //       ],

      //   });
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
      this.service.getStockDetailsgodown_b_to_b(this.point_type_id).subscribe(get_data=>{
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
      
      this.service.getStockDetailsgodown_b_to_b_details(this.point_type_id).subscribe(get_data=>{
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
