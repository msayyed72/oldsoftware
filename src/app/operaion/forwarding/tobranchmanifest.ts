import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { includes } from 'lodash';
import { BookingServiceService } from 'src/app/services/booking-service.service';
import Swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    templateUrl: './tobranchmanifest.html',
})
export class ToBranchManifestComponent implements OnInit {
    @ViewChild('invoiceno') invoiceno!: ElementRef;
    @ViewChild('save') save!: ElementRef;
    @ViewChild('carton') carton!: ElementRef;
    @ViewChild('weight') weight!: ElementRef;
    @ViewChild('barcode') barcode!: ElementRef;
    @ViewChild('deleteModal') deleteModal: any;
    @ViewChild('updatemodal') updatemodal: any;
    @ViewChild('modal6') modal6: any;
  

    rowClicked:any;
    rowClicked_booked:any;
    isAccOpen2: false | undefined
    manifest: any;
    stock_B_To_B: any;
    btn: any;
    stock_non_booking_B_To_B:any[]=[];
    stock_booking_B_To_B: any;
    assignbyinvoice_no_receiving_branch: any;
    valForm: FormGroup;
    valForm_assign: FormGroup;
    valForm_config: FormGroup;
    InvoiceCartonDetailsreceiving_warehouse: any;
    PackingConditionReceivingBranch: any;
    update_spin: any;
    Save_spin: any;
    ptp: any;
    report: any;
    configure_destination_b_to_b: any;
    // destinationconfig:any;
    assign_destination: any;
    userid: any;
    ReasonCombobox_b_to_b: any;
    ptp_id: any;
    latest_date: any;
    currentDateTime: any;
    PostbookingPdf: any;
    PostbookingPdfopen: any;
    BookingDate: any;
    TotalCarton: any;
    VehicleNo: any;
    BookedBy: any;
    TotalWeight: any;
    DriverName: any;
    DriverNo: any;
    invoice_count: any;
    selected:any[] = [];
    selected2:any[] = [];
    selected3:any[] = [];
    rowsFilter_assign: any;
    prodata = {
      manifestNumber: "",
      carton_id: " ",
      scanBy: ""
    }
    c_id: any
    btn3:any;
    tot_non_clr_wgt: number | undefined;
    tot_non_clr_ctn: number | undefined;
    tot_clr_wgt: number =0;
    tot_clr_ctn: number =0;
    non_arr:any[]= []
    arr:any[]=[]
    mode:any[]=[]
    country:any[]=[]
    nonbookdata: any;
    bookdata: any;
    bookmode:any[]=[]
    bookcountry:any[]=[]
    selecteddel:any[]=[]
    checkall=false
    checkall2: boolean | undefined;
    del_reason:any
    ManualInvoiceDetails: any;
    ManualCartonDetails: any;
    inv_no: any;
    ManualbarcodeDetails: any;
    booked_location: any;
    tot_clr_wgt_add_all: number=0;
    tot_clr_ctn_add_all: number =0;
    selected2_data:any[]=[];
    arrall: any[] =[];
    selected2_inv:any[]=[]
    selected2_wt:any[]=[]
    constructor(public http: HttpClientModule, fb: FormBuilder, public router: Router,
        private datep: DatePipe,private service:BookingServiceService,
        public route: ActivatedRoute, public datepipe: DatePipe) {
        this.route.params.subscribe(data => {
          this.manifest = data['id'];
          this.invoice_count = data['id2'];
          this.BookingDate = data['id3'];
          this.TotalCarton = data['id4'];
          this.VehicleNo = data['id5'];
          this.BookedBy = data['id6'];
          this.TotalWeight = data['id7'];
          this.DriverName = data['id8'];
          this.DriverNo = data['id9'];
          console.log('manifest', this.manifest)
        })
        this.currentDateTime = this.datepipe.transform((new Date), 'MM/dd/yyyy h:mm:ss');
    
        console.log(this.currentDateTime);
        this.valForm = fb.group({
          'p_r_manifestNumber': [null],
          'p_b_manifestNumber': [null],
          'p_barcodeNumber': [null],
          'p_invoiceNumber': [null],
          'p_cartonNumber': [null],
          'p_delivery_area_code': [null],
          'p_packingCondition': [null],
          'p_itemDetails': [null],
          'p_operationReasonId': [null],
          'p_cartonWeight': [null],
          'p_markedBy': [null],
          'p_scanBy': [null],
          'p_scanTime': [null],
          'p_createdBy': [null],
          'p_oprMode': [null],
          'p_mf_details_id': [null],
          'p_total_cartonNumber': [null],
          'p_delivery_state': [null],
          'p_updatedBy': [null],
          'p_manifestNumber': [null]
    
        })
        this.valForm_assign = fb.group({
          'weight': [null],
          'v_wh_location_name': [null],
          'Box_No': [null],
          'Item_Details': [null],
          'delivery_state_name': [null],
          'Receiver_Address': [null],
          'delivery_area_code_name': [null],
          'Origin': [null],
          'Origin_Wgt': [null],
          'Booked_Location': [null]
        })
        this.valForm_config = fb.group({
          'destinationconfig': [null]
        })
      }
    
    PanelExpand:boolean | undefined;
    Toggle(){
        this.PanelExpand=!this.PanelExpand;
    }

    ngOnInit(): void {
       this.PanelExpand=false;
       this.reset();
       this.invoiceradio();
    }
    coloredToast(color: string, msg: any) {
        const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
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
    selectedOption: string = 'on';

    selectOption(option: string) {
        this.selectedOption = option;
      }
    
      getstock_B_To_B() {
        this.rowsFilter_assign = [];
        this.service.getstock_B_To_B(this.manifest).subscribe(get_data => {
          this.stock_B_To_B = get_data['data'];
          console.log("stock_B_To_B", this.stock_B_To_B);
          this.rowsFilter_assign = this.stock_B_To_B;
          this.invoiceno.nativeElement.focus();
        })
      }
      getconfigure_destination_b_to_b() {
        this.service.getconfigure_destination_b_to_b().subscribe(get_data => {
          this.configure_destination_b_to_b = get_data['data'];
          console.log("configure_destination_b_to_b", this.configure_destination_b_to_b);
        })
      }
      getPackingConditionReceivingBranch() {
        this.service.getPackingConditionReceivingBranch().subscribe(get_data => {
          this.PackingConditionReceivingBranch = get_data['data'];
          console.log("PackingConditionReceivingBranch", this.PackingConditionReceivingBranch);
    
        })
      }
      BookingAndNonBokkingautostart() {
        var id={
          ptp_mf_no:1
        }
        this.BookingAndNonBokking(id)
      //   this.service.get_non_booking_B_To_B(this.manifest, '1').subscribe(get_data => {
      //     this.stock_non_booking_B_To_B = get_data['data'];
      //     console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B);
      //     this.tot_non_clr_wgt=0
      //     this.tot_non_clr_ctn=0
      //     this.tot_clr_wgt = 0;
      //   this.tot_clr_ctn = 0;
      //     for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
      //       //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
      //       this.tot_non_clr_wgt = 1*this.stock_non_booking_B_To_B[i]['rcvd_wgt']+this.tot_non_clr_wgt  
      //       this.tot_non_clr_ctn = 1*this.stock_non_booking_B_To_B[i]['total_carton']+this.tot_non_clr_ctn  
      //     }
      //     for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
      //       for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
      //         var color = '#'; // <-----------
      //           var letters = '0123456789ABCDEF';
      //           for (let i = 0; i < 6; i++) {
      //               color += letters[Math.floor(Math.random() * 16)];
      //            }
      //         if(this.stock_non_booking_B_To_B[i].invoice_no == this.stock_booking_B_To_B[j].invoice_no)
      //         {
    
      //           this.stock_non_booking_B_To_B[i].color = color
      //           this.stock_booking_B_To_B[j].color = color
      //           console.log("1", this.stock_non_booking_B_To_B[i].invoice_no,this.stock_booking_B_To_B[j].invoice_no)
                      
      //       }
           
      //     }
      //   }
      //   this.non_arr=[]
      //   if(this.stock_non_booking_B_To_B){
      //     this.stock_non_booking_B_To_B.forEach((obj) => {
      //       if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
      //         // console.log('res', arr)
      //         this.non_arr.push(obj.invoice_no)
      //       }
      //     });
      //   } 
    
      //   })
      //   this.service.get_booking_B_To_B(this.manifest, '1').subscribe(get_data => {
      //     this.stock_booking_B_To_B = get_data['data'];
      //     console.log("stock_booking_B_To_B", this.stock_booking_B_To_B);
      //     for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {  
      //       this.tot_clr_wgt = 1*this.stock_booking_B_To_B[i]['rcvd_wgt']+this.tot_clr_wgt  
      //       this.tot_clr_ctn = 1*this.stock_booking_B_To_B[i]['total_carton']+this.tot_clr_ctn  
      //     }
      //     if(this.stock_booking_B_To_B && this.stock_non_booking_B_To_B){
      //     for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
      //       for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
      //         var color = '#'; // <-----------
      //           var letters = '0123456789ABCDEF';
      //           for (let i = 0; i < 6; i++) {
      //               color += letters[Math.floor(Math.random() * 16)];
      //            }
      //         if(this.stock_non_booking_B_To_B[i].invoice_no == this.stock_booking_B_To_B[j].invoice_no)
      //         {
      
      //           this.stock_non_booking_B_To_B[i].color = color
      //           this.stock_booking_B_To_B[j].color = color
      //           console.log("1", this.stock_non_booking_B_To_B[i].invoice_no,this.stock_booking_B_To_B[j].invoice_no)
                      
      //       }
           
      //     }
      //   }
      // }
      // this.arr=[]
      //   if(this.stock_booking_B_To_B)
      //   {
      //     this.stock_booking_B_To_B.forEach((obj) => {
      //       if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
      //         // console.log('res', arr)
      //         this.arr.push(obj.invoice_no)
      //       }
      //     });
      //     this.stock_booking_B_To_B.forEach((obj) => {
      //       if (obj.transit_type_name && !includes(this.bookmode, obj.transit_type_name)) {
      //         // console.log('res', this.mode)
      //         this.bookmode.push(obj.transit_type_name)
      //       }
      //     });
      //     this.stock_booking_B_To_B.forEach((obj) => {
      //       if (obj.country_name && !includes(this.bookcountry, obj.country_name)) {
      //         // console.log('res', this.mode)
      //         this.bookcountry.push(obj.country_name)
      //       }
      //     });
      //   }
      
      //   })
      }
      BookingAndNonBokking(id:any) {
        console.log(id)
        this.ptp = id.ptp_mf_no;
       
    
          this.service.get_non_booking_B_To_B(this.manifest, id.ptp_mf_no).subscribe(get_data => {
          this.stock_non_booking_B_To_B = get_data['data'];
          this.nonbookdata=this.stock_non_booking_B_To_B 
          console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B);
          this.tot_non_clr_wgt=0
          this.tot_non_clr_ctn=0
         
          for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
            this.tot_non_clr_wgt = Number(this.stock_non_booking_B_To_B[i]['rcvd_wgt'])+Number(this.tot_non_clr_wgt)
            this.tot_non_clr_ctn = 1*this.stock_non_booking_B_To_B[i]['total_carton']+this.tot_non_clr_ctn  
          }
          for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
              var color = '#'; // <-----------
                var letters = '0123456789ABCDEF';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                 }
              if(get_data['data'][i].invoice_no == this.stock_booking_B_To_B[j].invoice_no)
              {
    
                get_data['data'][i].color = color
                this.stock_booking_B_To_B[j].color = color
                console.log("1", get_data['data'][i].invoice_no,this.stock_booking_B_To_B[j].invoice_no)
                      
            }
           
          }
        }
        this.non_arr=[]
        if(get_data['data']){
            get_data['data'].forEach((obj:any) => {
            if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
              // console.log('res', arr)
              this.non_arr.push(obj.invoice_no)
            }
          });
          get_data['data'].forEach((obj:any) => {
          if (obj.transit_type_name && !includes(this.mode, obj.transit_type_name)) {
            // console.log('res', this.mode)
            this.mode.push(obj.transit_type_name)
          }
        });
        get_data['data'].forEach((obj:any) => {
          if (obj.country_name && !includes(this.country, obj.country_name)) {
           
            this.country.push(obj.country_name)
          }
        });
        } 
    
        })
        this.service.get_booking_B_To_B(this.manifest, id.ptp_mf_no).subscribe(get_data => {
          this.stock_booking_B_To_B = get_data['data'];
          this.bookdata=this.stock_booking_B_To_B
          this.tot_clr_wgt = 0;
          this.tot_clr_ctn = 0;
          console.log("stock_booking_B_To_B", this.stock_booking_B_To_B);
          for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {  
            this.tot_clr_wgt = 1*this.stock_booking_B_To_B[i]['rcvd_wgt']+this.tot_clr_wgt
            this.tot_clr_ctn = 1*this.stock_booking_B_To_B[i]['total_carton']+this.tot_clr_ctn  
          }
          if(this.stock_booking_B_To_B && this.stock_non_booking_B_To_B){
          for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
              var color = '#'; // <-----------
                var letters = '0123456789ABCDEF';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                 }
              if(get_data['data'][i].invoice_no == this.stock_booking_B_To_B[j].invoice_no)
              {
      
                get_data['data'][i].color = color
                this.stock_booking_B_To_B[j].color = color
                console.log("1", get_data['data'][i].invoice_no,this.stock_booking_B_To_B[j].invoice_no)
                      
            }
           
          }
        }
     console.log('nonst', this.stock_non_booking_B_To_B)
      }
      this.arr=[]
        if(this.stock_booking_B_To_B)
        {
          this.stock_booking_B_To_B.forEach((obj:any) => {
            if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
              // console.log('res', arr)
              this.arr.push(obj.invoice_no)
            }
          });
          this.stock_booking_B_To_B.forEach((obj:any) => {
            if (obj.transit_type_name && !includes(this.bookmode, obj.transit_type_name)) {
              // console.log('res', this.mode)
              this.bookmode.push(obj.transit_type_name)
            }
          });
          this.stock_booking_B_To_B.forEach((obj:any) => {
            if (obj.country_name && !includes(this.bookcountry, obj.country_name)) {
              // console.log('res', this.mode)
              this.bookcountry.push(obj.country_name)
            }
          });
        }
      
        })
      }
      onChange(checked:any, stock_B_To_B:any) {
        if(this.checkall2 == true)
        {
          this.checkall2 = false 
          this.getstock_B_To_B()
        }
        if (checked) {
          this.selected.push(stock_B_To_B);
          console.log("selected", this.selected)
        } else {
          this.selected.splice(this.selected.indexOf(stock_B_To_B), 1)
          console.log("selected2", this.selected)
        }
        var id={
          ptp_mf_no:this.selected
        }
        console.log("id", id)
        this.BookingAndNonBokking(id)
       
      }
      CheckAllOptions() {
        if (this.stock_B_To_B.every((val: { checked: boolean; }) => val.checked == true)) {
          this.stock_B_To_B.forEach((val: { checked: boolean; }) => { val.checked = false });
          for (let i = 0; i < this.stock_B_To_B.length; i++) {
            this.selected3.splice(this.selected.indexOf(this.stock_B_To_B[i].ptp_mf_no), 1)
          }
          this.selected3=[]
          console.log('1', this.selected3);
    
          var id={
            ptp_mf_no:this.selected3
          }
          console.log("id", id)
          this.BookingAndNonBokking(id)
    
        }
        else {
          this.stock_B_To_B.forEach((val: { checked: boolean; }) => { val.checked = true });
          for (let i = 0; i < this.stock_B_To_B.length; i++) {
            this.selected3.push(this.stock_B_To_B[i].ptp_mf_no);
          }
          console.log('2', this.selected3);
          var id={
            ptp_mf_no:this.selected3
          }
          console.log("id", id)
          this.BookingAndNonBokking(id)
         
        }
      }
      
      CheckAllOptions2() {
        this.tot_clr_wgt_add_all=0
        this.selected2=[]
        this.arrall=[]
        this.selected2_wt=[]
        this.selected2_inv=[]
        if (this.stock_non_booking_B_To_B.every(val => val.checked == true)) {
          this.stock_non_booking_B_To_B.forEach(val => { val.checked = false });
          for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            this.selected2.splice(this.selected.indexOf(this.stock_non_booking_B_To_B[i].carton_id), 1)
            this.selected2.splice(this.selected.indexOf(this.stock_non_booking_B_To_B[i].carton_id), 1)
            this.tot_clr_wgt_add_all = 1*this.stock_non_booking_B_To_B[i]['rcvd_wgt']+this.tot_clr_wgt 
            this.tot_clr_ctn_add_all = 1*this.stock_non_booking_B_To_B[i]['total_carton']+this.tot_clr_ctn  
         
          }
          console.log('1', this.selected2);
          this.tot_clr_wgt_add_all=0
          this.selected2_data=[]
          this.arrall=[]
          this.selected2=[]
        }
        else {
          this.stock_non_booking_B_To_B.forEach(val => { val.checked = true });
          for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            this.selected2.push(this.stock_non_booking_B_To_B[i].carton_id);
            this.selected2_data.push(this.stock_non_booking_B_To_B[i].invoice_no);
    
            this.selected2_inv.push(this.stock_non_booking_B_To_B[i].invoice_no);
            this.selected2_wt.push(this.stock_non_booking_B_To_B[i].org_weight);
            this.tot_clr_wgt_add_all = 1*this.stock_non_booking_B_To_B[i]['rcvd_wgt']+this.tot_clr_wgt_add_all  
            this.tot_clr_ctn_add_all = 1*this.stock_non_booking_B_To_B[i]['total_carton']+this.tot_clr_ctn_add_all  
         
          }
          console.log('2', this.selected2);
          
        }
        this.selected2_data.forEach((obj) => {
          if (obj && !includes(this.arrall, obj)) {
            console.log('res', this.arrall)
            this.arrall.push(obj)
          }
        });
      }
      AvailableNonBookedCarton(checked:any, stock_non_booking_B_To_B:any,inv:any,wt:any) {
        this.tot_clr_wgt_add_all =0
        this.arrall=[]
        if(this.checkall == true)
        {
          this.checkall = false 
        }
        if (checked) {
    
          this.selected2.push(stock_non_booking_B_To_B);
          // console.log("selected",this.selected2);
          this.selected2_inv.push(inv);
          this.selected2_wt.push(wt);
    
        } else {
          this.selected2.splice(this.selected2.indexOf(stock_non_booking_B_To_B), 1)
          this.selected2_inv.splice(this.selected2_inv.indexOf(inv), 1)
          this.selected2_wt.splice(this.selected2_wt.indexOf(wt), 1)
    
        }
        this.selected2_inv.forEach((obj) => {
          if (obj && !includes(this.arrall, obj)) {
            // console.log('res', this.arrall)
            this.arrall.push(obj)
          }
        });
        for (let i = 0; i < this.selected2_wt.length; i++) {
          console.log("selected2_wt", this.selected2_wt[i]+this.tot_clr_wgt_add_all);
          this.tot_clr_wgt_add_all = 1*this.selected2_wt[i]+this.tot_clr_wgt_add_all  
        }
    
        
      }
      save2() {
        this.c_id = ""
        console.log("selected2", this.selected2);
        for (let i = 0; i < this.selected2.length; i++) {
          var a = this.selected2[i]
          if (this.c_id == undefined) {
            this.c_id = a
            console.log("b1", this.c_id);
          }
          else {
            this.c_id = a + ',' + this.c_id;
            console.log("b", this.c_id);
          }
    
        }
        this.prodata.manifestNumber = this.manifest;
        this.prodata.scanBy = this.userid.v_user_id;
        this.c_id = this.c_id.replace(/,\s*$/, "");
        this.prodata.carton_id = this.c_id;
        this.service.InsertNonbookToBookBulk(this.prodata).subscribe(res1 => {
          console.log('res1', res1)
          if (res1['code'] == '200') {
            console.log('data', res1['code'])
            this.coloredToast('success','Successfully Added.');
            this.modal6.close()
            this.checkall=false
            this.prodata=
            {
              manifestNumber: "",
              carton_id: "",
              scanBy: ""
            }
            this.c_id=""
            this.selected2=[]
            var id={
              ptp_mf_no:this.selected
            }
            console.log("id", id)
            this.BookingAndNonBokking(id)
            // this.service.get_non_booking_B_To_B(this.manifest, this.selected).subscribe(get_data => {
            //   this.stock_non_booking_B_To_B = get_data['data'];
            //   console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B);
            //   for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            //     //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
            //     this.tot_non_clr_wgt = 1*this.stock_non_booking_B_To_B[i]['rcvd_wgt']+this.tot_non_clr_wgt  
            //     this.tot_non_clr_ctn = 1*this.stock_non_booking_B_To_B[i]['total_carton']+this.tot_non_clr_ctn  
            //   }
            //   for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            //     for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
            //       var color = '#'; // <-----------
            //         var letters = '0123456789ABCDEF';
            //         for (let i = 0; i < 6; i++) {
            //             color += letters[Math.floor(Math.random() * 16)];
            //          }
            //       if(this.stock_non_booking_B_To_B[i].invoice_no == this.stock_booking_B_To_B[j].invoice_no)
            //       {
        
            //         this.stock_non_booking_B_To_B[i].color = color
            //         this.stock_booking_B_To_B[j].color = color
            //         console.log("1", this.stock_non_booking_B_To_B[i].invoice_no,this.stock_booking_B_To_B[j].invoice_no)
                          
            //     }
               
            //   }
            // }
            // this.non_arr=[]
            // if(this.stock_non_booking_B_To_B){
            //   this.stock_non_booking_B_To_B.forEach((obj) => {
            //     if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
            //       // console.log('res', arr)
            //       this.non_arr.push(obj.invoice_no)
            //     }
            //   });
            // } 
            // })
            // this.service.get_booking_B_To_B(this.manifest, this.selected).subscribe(get_data => {
            //   this.stock_booking_B_To_B = get_data['data'];
            //   console.log("stock_booking_B_To_B", this.stock_booking_B_To_B);
            //   this.tot_clr_wgt=0
            //   this.tot_clr_ctn=0
            //   for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {  
            //     this.tot_clr_wgt = 1*this.stock_booking_B_To_B[i]['rcvd_wgt']+this.tot_clr_wgt  
            //     this.tot_clr_ctn = 1*this.stock_booking_B_To_B[i]['total_carton']+this.tot_clr_ctn  
            //   }
            //   for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            //     for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
            //       var color = '#'; // <-----------
            //         var letters = '0123456789ABCDEF';
            //         for (let i = 0; i < 6; i++) {
            //             color += letters[Math.floor(Math.random() * 16)];
            //          }
            //       if(this.stock_non_booking_B_To_B[i].invoice_no == this.stock_booking_B_To_B[j].invoice_no)
            //       {
          
            //         this.stock_non_booking_B_To_B[i].color = color
            //         this.stock_booking_B_To_B[j].color = color
            //         console.log("1", this.stock_non_booking_B_To_B[i].invoice_no,this.stock_booking_B_To_B[j].invoice_no)
                          
            //     }
               
            //   }
            // }
            // this.arr=[]
            // this.stock_booking_B_To_B.forEach((obj) => {
            //   if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
            //     // console.log('res', arr)
            //     this.arr.push(obj.invoice_no)
            //   }
            // });
            // })
          }
          else {
            console.log(res1['data'][0])
            this.coloredToast('danger', res1['data'][0])
          }
        })
    
      }
      getReasonCombobox_b_to_b() {
        this.service.getReasonCombobox_b_to_b('12').subscribe(get_data => {
          this.ReasonCombobox_b_to_b = get_data['data'];
          console.log("ReasonCombobox_b_to_b", this.ReasonCombobox_b_to_b);
        })
      }
      assignnonbook(id:any) {
        this.btn='1'
        console.log(id);
        this.valForm_assign.controls['Origin_Wgt'].setValue(id.org_weight);
        this.valForm_assign.controls['Origin'].setValue(id.origin_name);
        this.valForm_assign.controls['Item_Details'].setValue(id.item_name);
        this.valForm_assign.controls['Receiver_Address'].setValue(id.receiver_address);
        this.valForm.controls['p_invoiceNumber'].setValue(id.invoice_no);
        this.valForm.controls['p_cartonNumber'].setValue(id.carton_no);
        this.valForm.controls['p_total_cartonNumber'].setValue(id.total_carton);
        this.valForm.controls['p_delivery_state'].setValue(id.delivery_state_name);
        this.valForm.controls['p_packingCondition'].setValue(id.packing_condition);
        this.valForm.controls['p_cartonWeight'].setValue(id.rcvd_wgt);
        this.valForm.controls['p_barcodeNumber'].setValue(id.barcode_no);
        this.valForm.controls['p_itemDetails'].setValue(id.item_name);
        this.valForm.controls['p_delivery_area_code'].setValue(id.delivery_area_code_name);
        this.valForm_assign.controls['Box_No'].setValue(id.box_no);
      }
      assignbook(id:any) {
        this.btn='2'
        console.log(id);
        this.valForm_assign.controls['Origin_Wgt'].setValue(id.org_weight);
        this.valForm_assign.controls['Origin'].setValue(id.origin_name);
        this.valForm_assign.controls['Item_Details'].setValue(id.name);
        this.valForm_assign.controls['Receiver_Address'].setValue(id.receiver_address);
        this.valForm_assign.controls['Booked_Location'].setValue(id.delivery_area_code_name);
        this.valForm.controls['p_invoiceNumber'].setValue(id.invoice_no);
        this.valForm.controls['p_cartonNumber'].setValue(id.carton_no);
        this.valForm.controls['p_total_cartonNumber'].setValue(id.total_carton);
        this.valForm.controls['p_delivery_state'].setValue(id.delivery_state_name);
        this.valForm.controls['p_packingCondition'].setValue(id.packing_condition);
        this.valForm.controls['p_cartonWeight'].setValue(id.rcvd_wgt);
        this.valForm.controls['p_barcodeNumber'].setValue(id.barcode_no);
        this.valForm.controls['p_mf_details_id'].setValue(id.mf_details_id);
        this.ptp_id = id.mf_details_id;
        this.valForm_assign.controls['Box_No'].setValue(id.box_no);
      }
      getassignbyinvoice_no_receiving_branch(value: any) {
        console.log(value.p_invoiceNumber)
        this.service.getassignbyinvoice_no_receiving_branch(value.p_invoiceNumber).subscribe(get_data => {
          this.assignbyinvoice_no_receiving_branch = get_data['data'];
          console.log("assignbyinvoice_no_receiving_branch", this.assignbyinvoice_no_receiving_branch);
          // this.valForm_assign.controls['Origin'].setValue(this.assignbyinvoice_no_receiving_branch[0].origin_name)
          // this.valForm_assign.controls['Receiver_Address'].setValue(this.assignbyinvoice_no_receiving_branch[0].receiver_address)
          // this.valForm.controls['p_cartonNumber'].setValue(this.assignbyinvoice_no_receiving_branch[0].total_ctn)
        })
      }
      getInvoiceCartonDetailsreceiving_warehouse(value: any) {
        console.log(value.p_barcodeNumber)
        this.service.getInvoiceCartonDetailsreceiving_warehouse(value.p_barcodeNumber, this.manifest).subscribe(get_data => {
          this.InvoiceCartonDetailsreceiving_warehouse = get_data['data'];
          console.log("InvoiceCartonDetailsreceiving_warehouse", this.InvoiceCartonDetailsreceiving_warehouse);
          this.valForm_assign.controls['Origin'].setValue(this.InvoiceCartonDetailsreceiving_warehouse[0].origin_name)
          this.valForm_assign.controls['Receiver_Address'].setValue(this.InvoiceCartonDetailsreceiving_warehouse[0].receiver_address)
          this.valForm.controls['p_cartonNumber'].setValue(this.InvoiceCartonDetailsreceiving_warehouse[0].carton_no)
          this.valForm_assign.controls['Item_Details'].setValue(this.InvoiceCartonDetailsreceiving_warehouse[0].item_name)
          this.valForm_assign.controls['Box_No'].setValue(this.InvoiceCartonDetailsreceiving_warehouse[0].box_no)
        })
      }
      barcodefocus() {
        this.save.nativeElement.focus();
      }
      
      reset() {
        this.btn = '1';
        console.log('res', this.btn)
        this.valForm.reset();
        this.changeTableRowColor(-1)
        this.valForm_assign.reset();
        this.valForm.controls['p_total_cartonNumber'].enable();
        var session:any=localStorage.getItem("log_data");
        this.userid = JSON.parse(session)
        if(this.userid)
        {}
        else
        {
          this.router.navigate(['login/0']);
        }
        console.log("usid", this.userid.v_user_id);
        this.getstock_B_To_B();
        this.getPackingConditionReceivingBranch();
        this.getconfigure_destination_b_to_b();
        this.BookingAndNonBokkingautostart();
        this.report = "";
        this.valForm.controls['p_markedBy'].setValue(this.userid.v_user_id);
        this.valForm.controls['p_scanBy'].setValue(this.userid.v_user_id);
        this.valForm.controls['p_createdBy'].setValue(this.userid.v_user_id);
        this.valForm.controls['p_r_manifestNumber'].setValue(this.manifest);
        this.valForm.controls['p_manifestNumber'].setValue(this.manifest);
        this.valForm.controls['p_updatedBy'].setValue(this.userid.v_user_id);
        this.valForm.controls['p_scanTime'].setValue(this.currentDateTime);
        // this.destination_config="";
        this.getReasonCombobox_b_to_b();
      }
    
      update($ev:any, value: any) {
        this.update_spin = '1'
        console.log('valueupdate', value, this.ptp)
        this.service.UpdateForwardingBranchBooking(value).subscribe(res2 => {
          
          if (res2['code'] == '200') {
            console.log('data', res2['code'])
            this.coloredToast('success','Successfully Updated.');
            var id={
              ptp_mf_no:this.selected
            }
            console.log("id", id)
            this.BookingAndNonBokking(id)
            this.reset()
            this.updatemodal.close()
            // this.service.get_non_booking_B_To_B(this.manifest, this.ptp).subscribe(get_data => {
            //   this.stock_non_booking_B_To_B = get_data['data'];
            //   console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B);
            //   this.tot_non_clr_wgt=0
            //   this.tot_non_clr_ctn=0
            //   for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            //     //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
            //     this.tot_non_clr_wgt = 1*this.stock_non_booking_B_To_B[i]['rcvd_wgt']+this.tot_non_clr_wgt  
            //     this.tot_non_clr_ctn = 1*this.stock_non_booking_B_To_B[i]['total_carton']+this.tot_non_clr_ctn  
            //   }
            //   for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            //     for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
            //       var color = '#'; // <-----------
            //         var letters = '0123456789ABCDEF';
            //         for (let i = 0; i < 6; i++) {
            //             color += letters[Math.floor(Math.random() * 16)];
            //          }
            //       if(this.stock_non_booking_B_To_B[i].invoice_no == this.stock_booking_B_To_B[j].invoice_no)
            //       {
        
            //         this.stock_non_booking_B_To_B[i].color = color
            //         this.stock_booking_B_To_B[j].color = color
            //         console.log("1", this.stock_non_booking_B_To_B[i].invoice_no,this.stock_booking_B_To_B[j].invoice_no)
                          
            //     }
               
            //   }
            // }
            // this.non_arr=[]
            // if(this.stock_non_booking_B_To_B){
            //   this.stock_non_booking_B_To_B.forEach((obj) => {
            //     if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
            //       // console.log('res', arr)
            //       this.non_arr.push(obj.invoice_no)
            //     }
            //   });
            // } 
            // })
            // this.service.get_booking_B_To_B(this.manifest, this.ptp).subscribe(get_data => {
            //   this.stock_booking_B_To_B = get_data['data'];
            //   console.log("stock_booking_B_To_B", this.stock_booking_B_To_B);
            //     this.tot_clr_wgt=0
            //       this.tot_clr_ctn=0
            //       for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {  
            //         this.tot_clr_wgt = 1*this.stock_booking_B_To_B[i]['rcvd_wgt']+this.tot_clr_wgt  
            //         this.tot_clr_ctn = 1*this.stock_booking_B_To_B[i]['total_carton']+this.tot_clr_ctn  
            //       }
            //       for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
            //         for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
            //           var color = '#'; // <-----------
            //             var letters = '0123456789ABCDEF';
            //             for (let i = 0; i < 6; i++) {
            //                 color += letters[Math.floor(Math.random() * 16)];
            //              }
            //           if(this.stock_non_booking_B_To_B[i].invoice_no == this.stock_booking_B_To_B[j].invoice_no)
            //           {
              
            //             this.stock_non_booking_B_To_B[i].color = color
            //             this.stock_booking_B_To_B[j].color = color
            //             console.log("1", this.stock_non_booking_B_To_B[i].invoice_no,this.stock_booking_B_To_B[j].invoice_no)
                              
            //         }
                   
            //       }
            //     }
            //     this.arr=[]
            //     this.stock_booking_B_To_B.forEach((obj) => {
            //       if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
            //         // console.log('res', arr)
            //         this.arr.push(obj.invoice_no)
            //       }
            //     });
            // })
            this.reset()
            this.update_spin = '2'
            // this.updatefuntion.hide();
          }
          else {
            this.coloredToast('danger',res2['data']);
            this.update_spin = '2'
          }
    
        });
      }
      submitForm($ev:any, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
          this.valForm.controls[c].markAsTouched();
        }
    
        if (this.valForm.valid) {
          if(value.p_invoiceNumber == "" || value.p_invoiceNumber == null)
          {
            this.coloredToast('warning', 'Please Enter Invoice No');
          }
          else if(value.p_cartonNumber == "" || value.p_cartonNumber == null)
          {
            this.coloredToast('warning', 'Please Enter Carton No');
          }
          // else if(value.p_total_cartonNumber == "" || value.p_total_cartonNumber == null)
          // {
          //   this.toastr.warningToastr('Failed', 'Please Enter Total carton');
          // }
          else if(value.p_cartonWeight == "" || value.p_cartonWeight == null)
          {
            this.coloredToast('warning', 'Please Enter Weight');
          }
          else if(value.p_cartonWeight == 0 || value.p_cartonWeight == 0.00)
          {
            this.coloredToast('warning', 'Weight cannot be 0');
          }
          else
          {
            this.Save_spin = '1'
            console.log('valuesub', this.selected)
            // if (this.assign_destination == "" || this.assign_destination == null) {
            //   this.toastr.errorToastr('Failed', 'Please Select Destination');
            // }
            // else
              this.service.InsertForwardingBranchBooking(value).subscribe(res1 => {
                console.log('res1', res1)
                if (res1['code'] == '200') {
                  this.getstock_B_To_B();
                  this.changeTableRowColor(null)
                  console.log('data', res1['code'])
                  this.coloredToast('success','Successfully Added.');
      
                  var id={
                    ptp_mf_no:this.selected
                  }
                  console.log("id", id)
                  this.BookingAndNonBokking(id)
      
                  // this.service.get_non_booking_B_To_B(this.manifest, this.selected).subscribe(get_data => {
                  //   this.stock_non_booking_B_To_B = get_data['data'];
                  //   console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B);
                  //   for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
                  //     //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
                  //     this.tot_non_clr_wgt = 1*this.stock_non_booking_B_To_B[i]['rcvd_wgt']+this.tot_non_clr_wgt  
                  //     this.tot_non_clr_ctn = 1*this.stock_non_booking_B_To_B[i]['total_carton']+this.tot_non_clr_ctn  
                  //   }
                  //   for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
                  //     for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
                  //       var color = '#'; // <-----------
                  //         var letters = '0123456789ABCDEF';
                  //         for (let i = 0; i < 6; i++) {
                  //             color += letters[Math.floor(Math.random() * 16)];
                  //          }
                  //       if(this.stock_non_booking_B_To_B[i].invoice_no == this.stock_booking_B_To_B[j].invoice_no)
                  //       {
              
                  //         this.stock_non_booking_B_To_B[i].color = color
                  //         this.stock_booking_B_To_B[j].color = color
                  //         console.log("1", this.stock_non_booking_B_To_B[i].invoice_no,this.stock_booking_B_To_B[j].invoice_no)
                                
                  //     }
                     
                  //   }
                  // }
                  // this.non_arr=[]
                  // if(this.stock_non_booking_B_To_B){
                  //   this.stock_non_booking_B_To_B.forEach((obj) => {
                  //     if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
                  //       // console.log('res', arr)
                  //       this.non_arr.push(obj.invoice_no)
                  //     }
                  //   });
                  // } 
                  // })
                  // this.service.get_booking_B_To_B(this.manifest, this.selected).subscribe(get_data => {
                  //   this.stock_booking_B_To_B = get_data['data'];
                  //   console.log("stock_booking_B_To_B", this.stock_booking_B_To_B);
                  //   this.tot_clr_wgt=0
                  //   this.tot_clr_ctn=0
                  //   for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {  
                  //     this.tot_clr_wgt = 1*this.stock_booking_B_To_B[i]['rcvd_wgt']+this.tot_clr_wgt  
                  //     this.tot_clr_ctn = 1*this.stock_booking_B_To_B[i]['total_carton']+this.tot_clr_ctn  
                  //   }
                  //   for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
                  //     for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
                  //       var color = '#'; // <-----------
                  //         var letters = '0123456789ABCDEF';
                  //         for (let i = 0; i < 6; i++) {
                  //             color += letters[Math.floor(Math.random() * 16)];
                  //          }
                  //       if(this.stock_non_booking_B_To_B[i].invoice_no == this.stock_booking_B_To_B[j].invoice_no)
                  //       {
                
                  //         this.stock_non_booking_B_To_B[i].color = color
                  //         this.stock_booking_B_To_B[j].color = color
                  //         console.log("1", this.stock_non_booking_B_To_B[i].invoice_no,this.stock_booking_B_To_B[j].invoice_no)
                                
                  //     }
                     
                  //   }
                  // }
                  // this.arr=[]
                  // this.stock_booking_B_To_B.forEach((obj) => {
                  //   if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
                  //     // console.log('res', arr)
                  //     this.arr.push(obj.invoice_no)
                  //   }
                  // });
                  // })
                  this.Save_spin = '2'
                  this.reset()
                }
                else {
                  this.coloredToast('danger', res1['data']);
                  this.Save_spin = '2'
                }
      
              });
          }
        
        }
      }
    
      delete() {
        console.log('del', this.del_reason)
      
                    if(this.btn == '4')
                    {
                      this.ptp_id=this.selecteddel
                      this.service.deleteForwardingBranchBookingall(this.ptp_id).subscribe(res => {
                        if (res['code'] == '200') {
                          this.changeTableRowColor_booked(null)
                          this.getstock_B_To_B();
                          this.coloredToast( 'success','Delete Success');
                          var id={
                            ptp_mf_no:this.selected
                          }
                          this.BookingAndNonBokking(id)
                          this.reset()
      
                          this.deleteModal.close();
                        }
                        else {
                          this.coloredToast( 'success',res['data']);
                        }
                      })
                    }
                    else
                    {
                      this.service.deleteForwardingBranchBooking(this.ptp_id).subscribe(res => {
                        if (res['code'] == '200') {
                          this.getstock_B_To_B();
                          this.changeTableRowColor_booked(null)
                          this.coloredToast( 'success','Delete Success');
                          var id={
                            ptp_mf_no:this.selected
                          }
                          console.log("id", id)
                          this.BookingAndNonBokking(id)
                          this.reset()
                        
                          this.deleteModal.close();
                        }
                        else {
                          this.coloredToast( 'danger',res['data']);
                        }
                      })
                    }
                  
                    return true;
             }
              
        
      
      delete_close()
      {
        if(this.del_reason == "" || this.del_reason == null)
        {
          this.coloredToast('danger','select Reason');
        }
        else{
        //   this.deletefuntion.hide();
        }
      }
      configuredestination2(id:any) {
        console.log(id)
        if (id == "ConfigureDestination") {
        //   this.configuredestination.show();
        }
        else if (id == "PostBooking") {
          this.service.getPostbookingPdf(this.userid.v_point_id, this.manifest).subscribe(get_data => {
            this.PostbookingPdf = get_data['data'];
            console.log("PostbookingPdf", this.PostbookingPdf);
          })
          this.service.getPostbookingPdfopen(this.userid.v_point_id, this.manifest, this.invoice_count,
            this.BookingDate, this.TotalCarton, this.VehicleNo, this.BookedBy, this.TotalWeight, this.DriverName, this.DriverNo).subscribe(get_data => {
              this.PostbookingPdfopen = get_data['file_url'];
              console.log("PostbookingPdfopen", this.PostbookingPdfopen);
              window.open(this.PostbookingPdfopen)
            })
        }
      }
      saveconfigdes() {
        // console.log(this.destinationconfig);
        // this.configuredestination.hide();
        // this.assign_destination=this.destinationconfig;
      }
      submitForm_config($ev:any, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
          this.valForm.controls[c].markAsTouched();
        }
    
        if (this.valForm.valid) {
          this.Save_spin = '1'
          console.log('value', value.destinationconfig);
        //   this.configuredestination.hide();
          this.assign_destination = value.destinationconfig;
          this.valForm_config.reset();
        }
      }
      changeTableRowColor(idx: any) {
        this.rowClicked = idx;
        this.rowClicked_booked = null;
      }
      changeTableRowColor_booked(idx: any) {
        this.rowClicked_booked = idx;
        this.rowClicked = null;
      }updateFilter(event:any) {
        // this.searchh()
        this.stock_non_booking_B_To_B =this.nonbookdata
        console.log(event)
             const val = event.target.value.toLowerCase();
     // console.log(event.target.value)
             // filter our data
     
             const temp = this.stock_non_booking_B_To_B.filter(function(data2) {
                 return data2.transit_type_name.toLowerCase().indexOf(val) !== -1 || !val;
             });
     
             // update the rows
             this.stock_non_booking_B_To_B = temp;
             // this.data2=this.rowsFilter;
     
             // this.table.offset = 0;
             this.non_arr=[]
              console.log(this.stock_non_booking_B_To_B)
              this.stock_non_booking_B_To_B.forEach((obj) => {
                if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
                  // console.log('res', arr)
                  this.non_arr.push(obj.invoice_no)
                }
              });
                console.log('res', this.non_arr)
              this.tot_non_clr_wgt =0
                this.tot_non_clr_ctn =0 
              for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
                //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
                this.tot_non_clr_wgt = 1*this.stock_non_booking_B_To_B[i]['rcvd_wgt']+this.tot_non_clr_wgt  
                this.tot_non_clr_ctn = 1*this.stock_non_booking_B_To_B[i]['total_carton']+this.tot_non_clr_ctn  
              }
         }
         updateFiltercountry(event:any) {
          // this.searchh()
          this.stock_non_booking_B_To_B =this.nonbookdata 
          console.log(event)
               const val = event.target.value.toLowerCase();
       // console.log(event.target.value)
               // filter our data
       
               const temp = this.stock_non_booking_B_To_B.filter(function(data2) {
                   return data2.country_name.toLowerCase().indexOf(val) !== -1 || !val;
               });
       
               // update the rows
               this.stock_non_booking_B_To_B = temp;
               // this.data2=this.rowsFilter;
       
               // this.table.offset = 0;
               this.non_arr=[]
                console.log(this.stock_non_booking_B_To_B)
                this.stock_non_booking_B_To_B.forEach((obj) => {
                  if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
                    // console.log('res', arr)
                    this.non_arr.push(obj.invoice_no)
                  }
                });
                this.tot_non_clr_wgt =0
                this.tot_non_clr_ctn =0 
                for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
                  //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
                  this.tot_non_clr_wgt = 1*this.stock_non_booking_B_To_B[i]['rcvd_wgt']+this.tot_non_clr_wgt  
                  this.tot_non_clr_ctn = 1*this.stock_non_booking_B_To_B[i]['total_carton']+this.tot_non_clr_ctn  
                }
           }
           updateFilterbookmode(event:any) {
            // this.searchh()
            this.stock_booking_B_To_B =this.bookdata
            console.log(event)
                 const val = event.target.value.toLowerCase();
         // console.log(event.target.value)
                 // filter our data
         
                 const temp = this.stock_booking_B_To_B.filter(function(data2:any) {
                     return data2.transit_type_name.toLowerCase().indexOf(val) !== -1 || !val;
                 });
         
                 // update the rows
                 this.stock_booking_B_To_B = temp;
                 // this.data2=this.rowsFilter;
         
                 // this.table.offset = 0;
                 this.arr=[]
                  console.log(this.stock_booking_B_To_B)
                  this.stock_booking_B_To_B.forEach((obj:any) => {
                    if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
                      // console.log('res', arr)
                      this.arr.push(obj.invoice_no)
                    }
                  });
                  this.tot_clr_wgt=0
                  this.tot_clr_ctn=0
                  for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {  
                    this.tot_clr_wgt = 1*this.stock_booking_B_To_B[i]['rcvd_wgt']+this.tot_clr_wgt  
                    this.tot_clr_ctn = 1*this.stock_booking_B_To_B[i]['total_carton']+this.tot_clr_ctn  
                  }
             }
             updateFilterbookcountry(event:any) {
              // this.searchh()
              this.stock_booking_B_To_B =this.bookdata 
              console.log(event)
                   const val = event.target.value.toLowerCase();
           // console.log(event.target.value)
                   // filter our data
           
                   const temp = this.stock_booking_B_To_B.filter(function(data2:any) {
                       return data2.country_name.toLowerCase().indexOf(val) !== -1 || !val;
                   });
           
                   // update the rows
                   this.stock_booking_B_To_B = temp;
                   // this.data2=this.rowsFilter;
           
                   // this.table.offset = 0;
                   this.arr=[]
                    console.log(this.stock_booking_B_To_B)
                    this.stock_booking_B_To_B.forEach((obj:any) => {
                      if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
                        // console.log('res', arr)
                        this.arr.push(obj.invoice_no)
                      }
                    });
                    this.tot_clr_wgt=0
                    this.tot_clr_ctn=0
                    for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {  
                      this.tot_clr_wgt = 1*this.stock_booking_B_To_B[i]['rcvd_wgt']+this.tot_clr_wgt  
                      this.tot_clr_ctn = 1*this.stock_booking_B_To_B[i]['total_carton']+this.tot_clr_ctn  
                    }
               }
               CheckAlldelete() {
                this.btn='4'
                if (this.stock_booking_B_To_B.every((val: { checked: boolean; }) => val.checked == true)) {
                  this.stock_booking_B_To_B.forEach((val: { checked: boolean; }) => { val.checked = false });
                  for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {
                    this.selecteddel.splice(this.selected.indexOf(this.stock_booking_B_To_B[i].mf_details_id), 1)
                  }
                  ////console.log('1', this.selected2);
                }
                else {
                  this.stock_booking_B_To_B.forEach((val: { checked: boolean; }) => { val.checked = true });
                  for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {
                    this.selecteddel.push(this.stock_booking_B_To_B[i].mf_details_id);
                  }
                  console.log('2', this.selecteddel);
                }
              }
              onChangedelete(checked:any, stock_booking_B_To_B:any ) {
                this.btn='4'
                if (checked) {
            
                  this.selecteddel.push(stock_booking_B_To_B);
                  // ////console.log("selected",this.selected2);
            
                } else {
                  this.selecteddel.splice(this.selecteddel.indexOf(stock_booking_B_To_B), 1)
            
            
                }
                console.log("selected",this.selecteddel);
              }
              addall()
              {
                console.log('sss',this.stock_non_booking_B_To_B)
                this.stock_non_booking_B_To_B=this.stock_non_booking_B_To_B
                this.selected2=[]
               
                  this.stock_non_booking_B_To_B.forEach(val => { val.checked = false });
                  this.checkall=false
                  for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
                    // this.selected2.splice(this.selected.indexOf(this.stock_non_booking_B_To_B[i].carton_id), 1)
                  }
                  ////console.log('1', this.selected2);
                
              }
    
              getsearchbyinvoice(value: any)
              {     
               this.valForm_assign.reset();
                console.log(value.p_invoiceNumber)
                this.inv_no=value.p_invoiceNumber;
                this.service.getManualInvoiceDetails(value.p_invoiceNumber).subscribe(get_data=>{
                 this.ManualInvoiceDetails= get_data['data'];
                 console.log("ManualInvoiceDetails",this.ManualInvoiceDetails);
                 if(this.ManualInvoiceDetails==null || this.ManualInvoiceDetails=="" || this.ManualInvoiceDetails==undefined){
                   this.coloredToast('danger','Invoice Does Not Exist');
                  //  this.reset()
                  this.invoiceno.nativeElement.focus();
                 }
                 else{
                //  this.valForm_assign.controls['Delivery_Area'].setValue(this.ManualInvoiceDetails[0].delivery_area_code_name)
                //  this.valForm_assign.controls['Delivery_State'].setValue(this.ManualInvoiceDetails[0].delivery_state_name)
                 this.valForm_assign.controls['Receiver_Address'].setValue(this.ManualInvoiceDetails[0].receiver_address)
                 this.valForm.controls['p_total_cartonNumber'].setValue(this.ManualInvoiceDetails[0].total_ctn)
                 this.carton.nativeElement.focus();
                 }
               })
               }
              getsearchbycarton(value: any)
              {
              //  this.btn='2';
                console.log(value.p_cartonNumber)
               this.service.getManualCartonDetails(value.p_cartonNumber,'-1',this.inv_no,'FWD').subscribe(get_data=>{
                 this.ManualCartonDetails=get_data['data'];
                 console.log("ManualCartonDetails",this.ManualCartonDetails);
                 if(this.ManualCartonDetails == "" || this.ManualCartonDetails == null){
                  //  this.valForm_assign.controls['Delivery_Area'].setValue('NR')
                   this.coloredToast('danger','Carton Does Not Exist');
                   this.carton.nativeElement.focus();
                 }
                 else{
                 this.valForm_assign.controls['Box_No'].setValue(this.ManualCartonDetails[0].carton_no)
                 this.valForm.controls['p_cartonNumber'].setValue(this.ManualCartonDetails[0].carton_no)
                 this.valForm.controls['p_cartonWeight'].setValue(this.ManualCartonDetails[0].current_weight)
                 this.valForm_assign.controls['Origin_Wgt'].setValue(this.ManualCartonDetails[0].current_weight)
                 this.valForm_assign.controls['Origin'].setValue(this.ManualCartonDetails[0].origin_name)
                 this.valForm_assign.controls['delivery_state_name'].setValue(this.ManualCartonDetails[0].delivery_state_name)
                 this.valForm_assign.controls['Booked_Location'].setValue(this.ManualCartonDetails[0].current_location)
                 // this.valForm.controls['p_itemDetails'].setValue(this.ManualCartonDetails[0].item_name)
                 this.valForm_assign.controls['Item_Details'].setValue(this.ManualCartonDetails[0].item_name)
                 this.valForm_assign.controls['Receiver_Address'].setValue(this.ManualCartonDetails[0].receiver_address)
                 this.valForm.controls['p_packingCondition'].setValue('good Condition')
                 this.valForm.controls['p_barcodeNumber'].setValue(this.ManualCartonDetails[0].barcode_no)
                 this.valForm.controls['p_delivery_area_code'].setValue(this.ManualCartonDetails[0].delivery_area_code_name) 
                 this.valForm.controls['p_delivery_state'].setValue(this.ManualCartonDetails[0].delivery_state_name) 
    
                 
                 
                 this.weight.nativeElement.focus();
                 }
               })
              }
              getsearchbybarcode(value: any)
              {
              //  this.btn='2';
               this.valForm.controls['p_invoiceNumber'].enable();
                console.log(value.p_barcodeNumber)
                this.service.getManualbarcodeDetails('-1',value.p_barcodeNumber,'FWD').subscribe(get_data=>{
                 this.ManualbarcodeDetails=get_data['data'];
                 console.log("ManualbarcodeDetails",this.ManualbarcodeDetails);
                 if(this.ManualbarcodeDetails == "" || this.ManualbarcodeDetails == null){
                   this.valForm_assign.controls['Delivery_Area'].setValue('NR')
                   this.coloredToast('danger','Barcode Does Not Exist');
                   this.barcode.nativeElement.focus();
                 }
                 else{
                   this.valForm.controls['p_r_manifestNumber'].setValue(this.manifest)
                   // this.valForm.controls['p_itemDetails'].setValue(this.ManualbarcodeDetails[0].item_type_id)
                   this.valForm.controls['p_barcodeNumber'].setValue(this.ManualbarcodeDetails[0].barcode_no)
                   this.valForm_assign.controls['Box_No'].setValue(this.ManualbarcodeDetails[0].carton_no)
                   this.valForm.controls['p_cartonNumber'].setValue(this.ManualbarcodeDetails[0].carton_no)
                   this.valForm.controls['p_cartonWeight'].setValue(this.ManualbarcodeDetails[0].current_weight)
                   this.valForm_assign.controls['Origin_Wgt'].setValue(this.ManualbarcodeDetails[0].current_weight)
                  //  this.valForm_assign.controls['Delivery_Area'].setValue(this.ManualbarcodeDetails[0].delivery_area_code_name)
                   this.valForm.controls['p_delivery_area_code'].setValue(this.ManualbarcodeDetails[0].delivery_area_code_name)  
                   this.valForm.controls['p_delivery_state'].setValue(this.ManualbarcodeDetails[0].delivery_state_name)  
                   this.valForm.controls['p_invoiceNumber'].setValue(this.ManualbarcodeDetails[0].invoice_no)  
                   this.valForm_assign.controls['Receiver_Address'].setValue(this.ManualbarcodeDetails[0].receiver_address)
                   this.valForm_assign.controls['Origin'].setValue(this.ManualbarcodeDetails[0].origin_name)
                   this.valForm_assign.controls['delivery_state_name'].setValue(this.ManualbarcodeDetails[0].delivery_state_name)
                   this.valForm_assign.controls['Booked_Location'].setValue(this.ManualbarcodeDetails[0].current_location)
                   this.valForm.controls['p_packingCondition'].setValue('good Condition')
                   this.booked_location=this.ManualbarcodeDetails[0].v_wh_location_name;
    
     
      
                   this.save.nativeElement.focus();
                     }
              })
              }
              checkData:boolean=false;
              barcoderadio(){    
             this.checkData=true;
                if(this.barcode){
                this.barcode.nativeElement.focus();

                }
               }
               invoiceradio(){
                this.checkData=false;

               if(this.invoiceno){
                this.invoiceno.nativeElement.focus();

               }
               }
}
