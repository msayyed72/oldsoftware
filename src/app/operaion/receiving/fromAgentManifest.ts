import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { includes } from 'lodash';
import { BookingServiceService } from 'src/app/services/booking-service.service';
import { ReportServiceService } from 'src/app/services/report-service.service';
import Swal from 'sweetalert2';
@Component({
    moduleId: module.id,
    templateUrl: './fromAgentManifest.html',
})
export class FromAgentManifestComponent implements OnInit {
   
    PanelExpand:boolean | undefined;
    Toggle(){
        this.PanelExpand=!this.PanelExpand;
    }

    ngOnInit() {
        this.reset()
        this.PanelExpand=false;

      }

    selectedOption: string = 'on';

    selectOption(option: string) {
        this.selectedOption = option;
      }
      
      @ViewChild('availablenonbooking') availablenonbooking: any;
      @ViewChild('deleteModal') deleteModal: any;
      @ViewChild('invoiceno') invoiceno!: ElementRef;
      @ViewChild('save') save!: ElementRef;
      @ViewChild('barcode') barcode!: ElementRef;
      @ViewChild('configuredestination') configuredestination: any;
      @ViewChild('carton') carton!: ElementRef;
      @ViewChild('weight') weight!: ElementRef;
      @ViewChild('mfid') mfid!: ElementRef;
      [x: string]: any;
      isAccOpen2:false | undefined;
      PackingConditionReceivingBranch:any;
      RackReceivingBranch:any;
      PalleteReceivingBranch:any;
      NonClearedCartonDetailsReceivingBranch :any[]=[]
      StopCartonDetailsReceivingBranch:any;
      ReceivedConsignmentNumberReceivingBranch:any;
      ClearedCartonDetailsReceivingBranch:any;
      update_spin:any;
      btn:any;
      Save_spin:any;
      manifest:any;
      valForm: FormGroup;
      valForm_assign:FormGroup;
      userid:any;
      assignbyinvoice_no_receiving_branch:any;
      Origin:any;
      from_branch_reci_available_manifest:any;
      destination_point_id:any;
      source_point_id:any;
      parent_manifest:any;
      WarehouseLocation:any;
      selected :any[]=[];
      selected2:any[] = [];
      c_id:any;
      prodata={
        manifestNumber:"",
        carton_id:" ",
        scanBy:""
      }
      valForm_verification: any;
      rowClicked_view: any;
      rowClicked_non_clr: any;
      rowClicked_rec_cm: any;
      arr:any[]=[]
      non_arr:any[]=[]
      mode:any[]=[]
      country:any[]=[]
      nonbookdata: any;
      bookdata: any;
      bookmode:any[]=[]
      bookcountry:any[]=[]
      checkall=false
      source: any;
      destination: any;
    
      ManualInvoiceDetails: any;
      ManualCartonDetails: any;
      inv_no: any;
      ManualbarcodeDetails: any;
      booked_location: any;
      mf_id: any;
      tex: any;
      selecteddel:any[]=[]
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
      constructor(public http:HttpClientModule,private excelService:ReportServiceService, public service : BookingServiceService,fb: FormBuilder,
        public router:Router,
        private datep:DatePipe, private route:ActivatedRoute) {
          this.route.params.subscribe(data=>{
            this.manifest=data['id'];
            this.source_point_id=data['id2'];
            this.destination_point_id=data['id3'];
            console.log('manifest',this.manifest)
          })
          this.valForm = fb.group({
            'p_r_manifestNumber':[null],
            // 'p_b_manifestNumber':[null],
            'p_barcodeNumber':[null],
            'p_invoiceNumber':[null],
            'p_cartonNumber':[null],
            'p_delivery_area_code':[null],
            'p_packingCondition':[null, Validators.required],
            'p_itemDetails':[null],
            'p_operationReasonId':[null],
            'p_cartonWeight':[null],
            'p_markedBy':[null],
            'p_scanBy':[null],
            'p_scanTime':[null],
            'p_createdBy':[null],
            'p_oprMode':[null],
            'p_mf_details_id':[null],
            'p_rack_id':[null],
            'p_pallete_id':[null],
            'p_manifestNumber':[null],
            'p_updatedBy':[null]
          })
          this.valForm_assign =fb.group({
            'weight':[null],
            'v_wh_location_name':[null],
            'box_no':[null],
            'item_name':[null],
            'delivery_state_name':[null],
            'receiver_address':[null],
            'delivery_area_code_name':[null]
          })
          
         }
    
    
      availablemanifest(id:any){
    console.log(id.ptp_mf_no);
    this.parent_manifest=id.ptp_mf_no;
    this.getNonClearedCartonDetailsReceivingBranch();
        this.getStopCartonDetailsReceivingBranch();
        this.getClearedCartonDetailsReceivingBranch();
      }
      availablemanifestact(id:any){
        console.log(this.mf_id);
        this.parent_manifest=this.mf_id;
        this.getNonClearedCartonDetailsReceivingBranch();
        this.getStopCartonDetailsReceivingBranch();
        this.getClearedCartonDetailsReceivingBranch();
          }
      getNonClearedCartonAssign(id:any){
        console.log(id);
        this.btn='1';
        this.valForm.controls['p_invoiceNumber'].setValue(id.invoice_no);
        this.valForm.controls['p_cartonNumber'].setValue(id.carton_no);
        this.valForm.controls['p_cartonWeight'].setValue(id.weight);
        this.valForm.controls['p_barcodeNumber'].setValue(id.barcode_no);
        this.valForm_assign.controls['weight'].setValue(id.weight);
        this.valForm_assign.controls['item_name'].setValue(id.item_name);
        this.valForm_assign.controls['delivery_state_name'].setValue(id.delivery_state_name);
        this.valForm_assign.controls['receiver_address'].setValue(id.receiver_address);
        this.valForm_assign.controls['delivery_area_code_name'].setValue(id.delivery_area_code_name);
        this.valForm_assign.controls['box_no'].setValue(id.box_no);
        this.Origin=id.origin_name;
        this.valForm.controls['p_delivery_area_code'].setValue(id.delivery_area_code_name);
        this.valForm.controls['p_itemDetails'].setValue(id.item_name);
      }
      getClearedCartonAssign(id:any){
        console.log(id);
        this.btn='2';
        this.valForm.controls['p_invoiceNumber'].setValue(id.invoice_no);
        this.valForm.controls['p_cartonNumber'].setValue(id.carton_no);
        this.valForm.controls['p_cartonWeight'].setValue(id.weight);
        this.valForm.controls['p_barcodeNumber'].setValue(id.barcode_no);
        this.valForm_assign.controls['weight'].setValue(id.weight);
        this.valForm_assign.controls['item_name'].setValue(id.item_name);
        this.valForm_assign.controls['delivery_state_name'].setValue(id.delivery_state_name);
        this.valForm_assign.controls['receiver_address'].setValue(id.receiver_address);
        this.valForm_assign.controls['delivery_area_code_name'].setValue(id.delivery_area_code_name);
        this.valForm_assign.controls['box_no'].setValue(id.box_no);
        this.valForm.controls['p_packingCondition'].setValue(id.packing_condition);
        this.Origin=id.point_name;  
        this.valForm.controls['p_delivery_area_code'].setValue(id.delivery_area_code_name);
        this.valForm.controls['p_itemDetails'].setValue(id.item_name);
        this.WarehouseLocation=id.wh_location;
        this.valForm.controls['p_mf_details_id'].setValue(id.mf_details_id);
      }
      getPackingConditionReceivingBranch(){
        this.service.getPackingConditionReceivingBranch().subscribe(get_data=>{
          this.PackingConditionReceivingBranch=get_data['data'];
          this.valForm.controls['p_packingCondition'].setValue(this.PackingConditionReceivingBranch[0].pack_condition)
        })
      }
      getRackReceivingBranch(){
        this.service.getRackReceivingBranch(this.userid.v_point_id).subscribe(get_data=>{
          this.RackReceivingBranch=get_data['data'];
          console.log("RackReceivingBranch",this.RackReceivingBranch);
        })
      } 
      getPalleteReceivingBranch(value: any){
        console.log(value.p_rack_id)
        this.service.getPalleteReceivingBranch(value.p_rack_id).subscribe(get_data=>{
          this.PalleteReceivingBranch=get_data['data'];
          console.log("PalleteReceivingBranch",this.PalleteReceivingBranch);
        })
      }
      getNonClearedCartonDetailsReceivingBranch(){
        this['tot_non_clr_wgt']=0
        this['tot_non_clr_ctn']=0
        this['tot_non_clr_inv']=0
        this.service.getNonClearedCartonDetailsReceivingBranch(this.manifest,this.parent_manifest).subscribe(get_data=>{
          this.NonClearedCartonDetailsReceivingBranch=get_data['data'];
          this.nonbookdata =this.NonClearedCartonDetailsReceivingBranch
          console.log("NonClearedCartonDetailsReceivingBranch",this.NonClearedCartonDetailsReceivingBranch);
         for (let i = 0; i < this.NonClearedCartonDetailsReceivingBranch.length; i++) {
            console.log("aa", this.NonClearedCartonDetailsReceivingBranch[i]['carton_no']);  
            this['tot_non_clr_wgt'] = 1*this.NonClearedCartonDetailsReceivingBranch[i]['carton_no']+this['tot_non_clr_wgt']  
            this['tot_non_clr_ctn'] = 1*this.NonClearedCartonDetailsReceivingBranch[i]['weight']+this['tot_non_clr_ctn']  
            this['tot_non_clr_inv'] = 1*this.NonClearedCartonDetailsReceivingBranch[i]['invoice_no']+this['tot_non_clr_inv']
          }
          for (let i = 0; i < this.NonClearedCartonDetailsReceivingBranch.length; i++) {
            for (let j = 0; j < this.ClearedCartonDetailsReceivingBranch.length; j++) {
              var color = '#'; // <-----------
                var letters = '0123456789ABCDEF';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                 }
              if(this.NonClearedCartonDetailsReceivingBranch[i].invoice_no == this.ClearedCartonDetailsReceivingBranch[j].invoice_no)
              {
      
                this.NonClearedCartonDetailsReceivingBranch[i].color = color
                this.ClearedCartonDetailsReceivingBranch[j].color = color
                console.log("1", this.NonClearedCartonDetailsReceivingBranch[i].invoice_no,this.ClearedCartonDetailsReceivingBranch[j].invoice_no)
                      
            }
            
          }
        }
        if(this.NonClearedCartonDetailsReceivingBranch){
          this.NonClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
            if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
              console.log('res', this.non_arr)
              this.non_arr.push(obj.invoice_no)
            }
          });
          this.NonClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
            if (obj.transit_type_name && !includes(this.mode, obj.transit_type_name)) {
              console.log('res', this.mode)
              this.mode.push(obj.transit_type_name)
            }
          });
          this.NonClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
            if (obj.country_name && !includes(this.country, obj.country_name)) {
              // console.log('res', this.mode)
              this.country.push(obj.country_name)
            }
          });
        
        } 
          console.log("1", this.NonClearedCartonDetailsReceivingBranch ,this.ClearedCartonDetailsReceivingBranch)
        })
      }
      getStopCartonDetailsReceivingBranch(){
        this.service.getStopCartonDetailsReceivingBranch(this.manifest,this.parent_manifest).subscribe(get_data=>{
          this.StopCartonDetailsReceivingBranch=get_data['data'];
          console.log("StopCartonDetailsReceivingBranch",this.StopCartonDetailsReceivingBranch);
        })
      } 
      getReceivedConsignmentNumberReceivingBranch(){
        this.service.getReceivedConsignmentNumberReceivingBranch(this.manifest).subscribe(get_data=>{
          this.ReceivedConsignmentNumberReceivingBranch=get_data['data'];
          console.log("ReceivedConsignmentNumberReceivingBranch",this.ReceivedConsignmentNumberReceivingBranch);
        })
      }
       countUnique(iterable:any) {
        return new Set(iterable).size;
      }
      getClearedCartonDetailsReceivingBranch(){
        this['tot_clr_wgt']=0
        this['tot_clr_ctn'] =0
        this['tot_clr_inv'] =0
        this.service.getClearedCartonDetailsReceivingBranch(this.manifest,this.parent_manifest).subscribe(get_data=>{
          this.ClearedCartonDetailsReceivingBranch=get_data['data'];
          this.bookdata =this.ClearedCartonDetailsReceivingBranch
          console.log("ClearedCartonDetailsReceivingBranch",this.ClearedCartonDetailsReceivingBranch);
          for (let i = 0; i < this.ClearedCartonDetailsReceivingBranch.length; i++) {
            console.log("aa", this.ClearedCartonDetailsReceivingBranch[i]['invoice_no']);  
            // this.tot_clr_wgt = 1*this.ClearedCartonDetailsReceivingBranch[i]['carton_no']+this.tot_non_clr_wgt  
            // this.tot_clr_wgt = 1*this.ClearedCartonDetailsReceivingBranch[i]['carton_no']+this.tot_non_clr_wgt  
              this['tot_clr_wgt'] = 1*this.ClearedCartonDetailsReceivingBranch[i]['weight']+this['tot_clr_wgt']  
            // this.tot_clr_inv = this.ClearedCartonDetailsReceivingBranch[i]['invoice_no']+","+this.tot_non_clr_inv
            console.log("122",this['tot_clr_inv'])
    
          }
         
          for (let i = 0; i < this.ClearedCartonDetailsReceivingBranch.length; i++) {
            for (let j = 0; j < this.NonClearedCartonDetailsReceivingBranch.length; j++) {
              var color = '#'; // <-----------
                var letters = '0123456789ABCDEF';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                 }
              if(this.ClearedCartonDetailsReceivingBranch[i].invoice_no == this.NonClearedCartonDetailsReceivingBranch[j].invoice_no)
              {
      
                this.ClearedCartonDetailsReceivingBranch[i].color = color
                this.NonClearedCartonDetailsReceivingBranch[j].color = color
                console.log("1", this.ClearedCartonDetailsReceivingBranch[i].invoice_no,this.NonClearedCartonDetailsReceivingBranch[j].invoice_no)
                      
            }
            
          }
        }
        if(this.ClearedCartonDetailsReceivingBranch){
          this.ClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
            if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
              console.log('res', this.arr)
              this.arr.push(obj.invoice_no)
            }
          });
          this.ClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
            if (obj.transit_type_name && !includes(this.bookmode, obj.transit_type_name)) {
              console.log('bookmode', this.bookmode)
              this.bookmode.push(obj.transit_type_name)
            }
          });
          this.ClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
            if (obj.country_name && !includes(this.bookcountry, obj.country_name)) {
              // console.log('res', this.mode)
              this.bookcountry.push(obj.country_name)
            }
          });
        } 
        })
        console.log('res', this.arr)
      }
      getfrom_branch_reci_available_manifest(){
        this.service.getfrom_branch_reci_available_manifest(this.source_point_id,this.destination_point_id).subscribe(get_data=>{
          this.from_branch_reci_available_manifest=get_data['data'];
          console.log("from_branch_reci_available_manifest",this.from_branch_reci_available_manifest);
      //  this.receiving_id=this.from_branch_reci_available_manifest[0]['']
          this.source=this.from_branch_reci_available_manifest[0]['source_name']
          this.destination=this.from_branch_reci_available_manifest[0]['destination_name']
        })
      }
      getassignbyinvoice_no_receiving_branch(value: any){
        console.log(value.p_invoiceNumber)
        this.service.getassignbyinvoice_no_receiving_branch(value.p_invoiceNumber).subscribe(get_data=>{
          this.assignbyinvoice_no_receiving_branch=get_data['data'];
          console.log("assignbyinvoice_no_receiving_branch",this.assignbyinvoice_no_receiving_branch);
          this.valForm_assign.controls['delivery_area_code_name'].setValue(this.assignbyinvoice_no_receiving_branch[0].delivery_area_code_name)
           this.valForm_assign.controls['delivery_state_name'].setValue(this.assignbyinvoice_no_receiving_branch[0].delivery_state_name)
           this.valForm_assign.controls['receiver_address'].setValue(this.assignbyinvoice_no_receiving_branch[0].receiver_address)
          this.valForm.controls['p_cartonNumber'].setValue(this.assignbyinvoice_no_receiving_branch[0].total_ctn)
          this.Origin=this.assignbyinvoice_no_receiving_branch[0].origin_name;
        })
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
          // if(value.p_total_cartonNumber == "" || value.p_total_cartonNumber == null)
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
            console.log('value', value)
            this.service.InsertReceivingBranch(value).subscribe(res1=>{ 
            console.log('res1', res1) 
            if(res1['code'] == '200'){
              this.rowClicked_non_clr=null
              this['rowClicked_clr_ctn']=null
     console.log('data',  res1['code'])
     this.coloredToast('success','Successfully Added.');
     this.reset()
     this.getClearedCartonDetailsReceivingBranch();
     this.getNonClearedCartonDetailsReceivingBranch();
     this.Save_spin = '2'
    } 
    else{
      this.coloredToast('danger',res1['data']);
    this.Save_spin = '2'
    }           
    
    });  
          }
               
    }
      }
      tempunitdelete:any;
      data(data:any)
      {
        this.tempunitdelete=data;
      }
    delete()
    {
   
                  if(this.btn == '4')
                  {
    
                    this.service.deleteClearedCartonReceivingBranchall(this.selecteddel).subscribe(res=>{
                      if (res['code'] == '200') {
                       this.coloredToast( 'success','Delete Success');
                        this.getClearedCartonDetailsReceivingBranch();
                        this.getNonClearedCartonDetailsReceivingBranch();
                        this.reset()
                        this.deleteModal.close()
                      }
                      else{
                        this.coloredToast( 'danger',res['data'][0]['ERROR CARTON NOT AVAILABLE']);
                      }
                      })
                  }
                  else
                  {
                    this.service.deleteClearedCartonReceivingBranch(this.tempunitdelete.mf_details_id).subscribe(res=>{
                      if (res['code'] == '200') {
                        this.coloredToast( 'success','Delete Success');
                        this.getClearedCartonDetailsReceivingBranch();
                        this.getNonClearedCartonDetailsReceivingBranch();
                        this.reset()
                        this.deleteModal.close()

                      }
                      else{
                        this.coloredToast( 'danger',res['data']);
                      }
                      })
                  }
          
            return true;
          }
             
    reset()
    {
    this.btn='3';
    this.tex='1'
    this.valForm.reset();
    this.changeTableRowColor_non_clr('-1')
    this.changeTableRowColor_stop_clr('-1') 
    this.changeTableRowColor_rec_cm('-1')
    this.changeTableRowColor_clr_ctn('-1') 
    this.changeTableRowColor_view('-1')
    const data:any=localStorage.getItem("log_data");
    this.userid = JSON.parse(data)
    if(this.userid)
    {}
    else
    {
      this.router.navigate(['login/0']);
    }
        console.log("usid",this.userid.v_user_id);
        this.getPackingConditionReceivingBranch();
        this.getRackReceivingBranch();
        this.getNonClearedCartonDetailsReceivingBranch();
        this.getStopCartonDetailsReceivingBranch();
        this.getReceivedConsignmentNumberReceivingBranch();
        this.getClearedCartonDetailsReceivingBranch();
        this.getfrom_branch_reci_available_manifest();
        this.valForm.controls['p_createdBy'].setValue(this.userid.v_user_id);
        this.valForm.controls['p_scanBy'].setValue(this.userid.v_user_id);
        this.valForm.controls['p_markedBy'].setValue(this.userid.v_user_id);
        this.valForm.controls['p_r_manifestNumber'].setValue(this.manifest);
        this.valForm.controls['p_manifestNumber'].setValue(this.manifest);
        this.valForm.controls['p_updatedBy'].setValue(this.userid.v_user_id);
    } 
    viewtobereceived1()
    {
      this.getfrom_branch_reci_available_manifest();
      
    }
    update($ev:any,value:any)
    {
      this.update_spin='1'
    console.log('valueupdate', value)
              this.service.UpdateReceivingBranch(value).subscribe(res2=>{ 
              console.log('res', res2) 
              if(res2['code'] == '200'){
       console.log('data',  res2['code'])
       this.coloredToast( 'success','Successfully Updated.');
       this.reset()
       this.getClearedCartonDetailsReceivingBranch();
       this.getNonClearedCartonDetailsReceivingBranch();
       this.update_spin='2'
    } 
    else{
      this.coloredToast( 'danger',res2['data']);
     this.update_spin='2'
    }
    
    });
    }       
    AvailableNonBookedCarton(checked:any,stock_non_booking_B_To_B:any){
      if(this.checkall == true)
      {
        this.checkall = false 
      }
      if(checked){
        
        this.selected2.push(stock_non_booking_B_To_B);
        // console.log("selected",this.selected2);
        
        } else {
          this.selected2.splice(this.selected2.indexOf(stock_non_booking_B_To_B), 1)
          
    
        }
    }
    CheckAllOptions() {
      if (this.NonClearedCartonDetailsReceivingBranch.every(val => val.checked == true)){
        this.NonClearedCartonDetailsReceivingBranch.forEach(val => { val.checked = false });
        for (let i = 0; i < this.NonClearedCartonDetailsReceivingBranch.length; i++) {
          this.selected2.splice(this.selected.indexOf(this.NonClearedCartonDetailsReceivingBranch[i].carton_id), 1)
        }
        console.log('1',this.selected2);
      }
      else{
        this.NonClearedCartonDetailsReceivingBranch.forEach(val => { val.checked = true });
        for (let i = 0; i < this.NonClearedCartonDetailsReceivingBranch.length; i++) {
          this.selected2.push(this.NonClearedCartonDetailsReceivingBranch[i].carton_id);
        }
        console.log('2',this.selected2);
      }
    }
    save2(){ 
      this.c_id=""
      console.log("selected2",this.selected2);
      for (let i = 0; i < this.selected2.length; i++) {
        var a =this.selected2[i]
        if(this.c_id == undefined)
        {
          this.c_id=a
          console.log("b1",this.c_id);
        }
        else{
          this.c_id = a+','+this.c_id;
          console.log("b",this.c_id);
        }
        
        }
      this.prodata.manifestNumber=this.manifest;
      this.prodata.scanBy=this.userid.v_user_id;
      this.c_id = this.c_id.replace(/,\s*$/, "");
      this.prodata.carton_id=this.c_id;
      this.service.InsertNonbookToBookBulk(this.prodata).subscribe(res1=>{ 
        this.availablenonbooking.hide()
        this.checkall=false
          this.prodata=
          {
            manifestNumber: "",
            carton_id: "",
            scanBy: ""
          }
          this.c_id=""
          this.selected2=[]
        console.log('res1', res1) 
        if(res1['code'] == '200'){
    console.log('data',  res1['code'])
    this.coloredToast( 'success','Successfully Added.');
      this.service.getNonClearedCartonDetailsReceivingBranch(this.manifest,this.parent_manifest).subscribe(get_data=>{
        this.NonClearedCartonDetailsReceivingBranch=get_data['data'];
        console.log("NonClearedCartonDetailsReceivingBranch",this.NonClearedCartonDetailsReceivingBranch);
        for (let i = 0; i < this.NonClearedCartonDetailsReceivingBranch.length; i++) {
          console.log("aa", this.NonClearedCartonDetailsReceivingBranch[i]['carton_no']);  
          this['tot_non_clr_wgt'] = 1*this.NonClearedCartonDetailsReceivingBranch[i]['carton_no']+this['tot_non_clr_wgt']  
          this['tot_non_clr_ctn'] = 1*this.NonClearedCartonDetailsReceivingBranch[i]['weight']+this['tot_non_clr_ctn']  
          this['tot_non_clr_inv'] = 1*this.NonClearedCartonDetailsReceivingBranch[i]['invoice_no']+this['tot_non_clr_inv']
        }
        for (let i = 0; i < this.NonClearedCartonDetailsReceivingBranch.length; i++) {
          for (let j = 0; j < this.ClearedCartonDetailsReceivingBranch.length; j++) {
            var color = '#'; // <-----------
              var letters = '0123456789ABCDEF';
              for (let i = 0; i < 6; i++) {
                  color += letters[Math.floor(Math.random() * 16)];
               }
            if(this.NonClearedCartonDetailsReceivingBranch[i].invoice_no == this.ClearedCartonDetailsReceivingBranch[j].invoice_no)
            {
    
              this.NonClearedCartonDetailsReceivingBranch[i].color = color
              this.ClearedCartonDetailsReceivingBranch[j].color = color
              console.log("1", this.NonClearedCartonDetailsReceivingBranch[i].invoice_no,this.ClearedCartonDetailsReceivingBranch[j].invoice_no)
                    
          }
          
        }
      }
      if(this.NonClearedCartonDetailsReceivingBranch){
        this.NonClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
          if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
            console.log('res', this.non_arr)
            this.non_arr.push(obj.invoice_no)
          }
        });
        this.NonClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
          if (obj.transit_type_name && !includes(this.mode, obj.transit_type_name)) {
            // console.log('res', this.mode)
            this.mode.push(obj.transit_type_name)
          }
        });
        this.NonClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
          if (obj.country_name && !includes(this.country, obj.country_name)) {
            // console.log('res', this.mode)
            this.country.push(obj.country_name)
          }
        });
      
      } 
      })
      this.service.getClearedCartonDetailsReceivingBranch(this.manifest,this.parent_manifest).subscribe(get_data=>{
        this.ClearedCartonDetailsReceivingBranch=get_data['data'];
        console.log("ClearedCartonDetailsReceivingBranch",this.ClearedCartonDetailsReceivingBranch);
        for (let i = 0; i < this.ClearedCartonDetailsReceivingBranch.length; i++) {
          console.log("aa", this.ClearedCartonDetailsReceivingBranch[i]['invoice_no']);  
          // this.tot_clr_wgt = 1*this.ClearedCartonDetailsReceivingBranch[i]['carton_no']+this.tot_non_clr_wgt  
          // this.tot_clr_wgt = 1*this.ClearedCartonDetailsReceivingBranch[i]['carton_no']+this.tot_non_clr_wgt  
            this['tot_clr_wgt'] = 1*this.ClearedCartonDetailsReceivingBranch[i]['weight']+this['tot_clr_wgt']  
          // this.tot_clr_inv = this.ClearedCartonDetailsReceivingBranch[i]['invoice_no']+","+this.tot_non_clr_inv
          console.log("122",this['tot_clr_inv'])
    
        }
       
        for (let i = 0; i < this.ClearedCartonDetailsReceivingBranch.length; i++) {
          for (let j = 0; j < this.NonClearedCartonDetailsReceivingBranch.length; j++) {
            var color = '#'; // <-----------
              var letters = '0123456789ABCDEF';
              for (let i = 0; i < 6; i++) {
                  color += letters[Math.floor(Math.random() * 16)];
               }
            if(this.ClearedCartonDetailsReceivingBranch[i].invoice_no == this.NonClearedCartonDetailsReceivingBranch[j].invoice_no)
            {
    
              this.ClearedCartonDetailsReceivingBranch[i].color = color
              this.NonClearedCartonDetailsReceivingBranch[j].color = color
              console.log("1", this.ClearedCartonDetailsReceivingBranch[i].invoice_no,this.NonClearedCartonDetailsReceivingBranch[j].invoice_no)
                    
          }
          
        }
      }
      if(this.ClearedCartonDetailsReceivingBranch){
        this.ClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
          if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
            console.log('res', this.arr)
            this.arr.push(obj.invoice_no)
          }
        });
        this.ClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
          if (obj.transit_type_name && !includes(this.mode, obj.transit_type_name)) {
            // console.log('res', this.mode)
            this.mode.push(obj.transit_type_name)
          }
        });
        this.ClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
          if (obj.country_name && !includes(this.country, obj.country_name)) {
            // console.log('res', this.mode)
            this.country.push(obj.country_name)
          }
        });
      } 
      })
        }
        else{
          console.log(res1['data'][0])
          this.coloredToast( 'danger',res1['data'][0])
        }
      })
      
    }
    changeTableRowColor_view(idx: any) { 
      this.rowClicked_view = idx;
    }
    
    changeTableRowColor_non_clr(idx: any) { 
      this.rowClicked_non_clr = idx;
      this['rowClicked_stop_clr'] = null;
      this.rowClicked_rec_cm = null;
      this['rowClicked_clr_ctn'] = null;
    }
    changeTableRowColor_stop_clr(idx: any) { 
      this['rowClicked_stop_clr'] = idx;
      this.rowClicked_non_clr = null;
      this.rowClicked_rec_cm = null;
      this['rowClicked_clr_ctn'] = null;
    }
    changeTableRowColor_rec_cm(idx: any) { 
      this.rowClicked_rec_cm = idx;
      this.rowClicked_non_clr = null;
      this['rowClicked_stop_clr'] = null;
      this['rowClicked_clr_ctn'] = null;
    }
    changeTableRowColor_clr_ctn(idx: any) { 
      this['rowClicked_clr_ctn'] = idx;
      this.rowClicked_non_clr = null;
      this['rowClicked_stop_clr'] = null;
      this
      .rowClicked_rec_cm = null;
    }updateFilter(event:any) {
      // this.searchh()
      this.NonClearedCartonDetailsReceivingBranch =this.nonbookdata
      console.log(event)
           const val = event.target.value.toLowerCase();
    // console.log(event.target.value)
           // filter our data
    
           const temp = this.NonClearedCartonDetailsReceivingBranch.filter(function(data2) {
               return data2.transit_type_name.toLowerCase().indexOf(val) !== -1 || !val;
           });
    
           // update the rows
           this.NonClearedCartonDetailsReceivingBranch = temp;
           // this.data2=this.rowsFilter;
    
           // this.table.offset = 0;
           this.non_arr=[]
            console.log(this.NonClearedCartonDetailsReceivingBranch)
            this.NonClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
              if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
                // console.log('res', arr)
                this.non_arr.push(obj.invoice_no)
              }
            });
              console.log('res', this.non_arr)
            this['tot_non_clr_wgt'] =0
              this['tot_non_clr_ctn'] =0 
            for (let i = 0; i < this.NonClearedCartonDetailsReceivingBranch.length; i++) {
              //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
              //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
                this['tot_non_clr_wgt'] = 1*this.NonClearedCartonDetailsReceivingBranch[i]['carton_weight']+this['tot_non_clr_wgt']  
              this['tot_non_clr_ctn'] = 1*this.NonClearedCartonDetailsReceivingBranch[i]['total_carton']+this['tot_non_clr_ctn']  
            }
       }
       updateFiltercountry(event:any) {
        // this.searchh()
        this.NonClearedCartonDetailsReceivingBranch =this.nonbookdata 
        console.log(event)
             const val = event.target.value.toLowerCase();
     // console.log(event.target.value)
             // filter our data
     
             const temp = this.NonClearedCartonDetailsReceivingBranch.filter(function(data2) {
                 return data2.country_name.toLowerCase().indexOf(val) !== -1 || !val;
             });
     
             // update the rows
             this.NonClearedCartonDetailsReceivingBranch = temp;
             // this.data2=this.rowsFilter;
     
             // this.table.offset = 0;
             this.non_arr=[]
              console.log(this.NonClearedCartonDetailsReceivingBranch)
              this.NonClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
                if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
                  // console.log('res', arr)
                  this.non_arr.push(obj.invoice_no)
                }
              });
              this['tot_non_clr_wgt'] =0
              this['tot_non_clr_ctn'] =0 
              for (let i = 0; i < this.NonClearedCartonDetailsReceivingBranch.length; i++) {
                //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
                //console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
                  this['tot_non_clr_wgt'] = 1*this.NonClearedCartonDetailsReceivingBranch[i]['carton_weight']+this['tot_non_clr_wgt']  
                this['tot_non_clr_ctn'] = 1*this.NonClearedCartonDetailsReceivingBranch[i]['total_carton']+this['tot_non_clr_ctn']  
              }
         }
         updateFilterbookmode(event:any) {
          // this.searchh()
          this.ClearedCartonDetailsReceivingBranch =this.bookdata
          console.log(event)
               const val = event.target.value.toLowerCase();
       // console.log(event.target.value)
               // filter our data
       
               const temp = this.ClearedCartonDetailsReceivingBranch.filter(function(data2:any) {
                   return data2.transit_type_name.toLowerCase().indexOf(val) !== -1 || !val;
               });
       
               // update the rows
               this.ClearedCartonDetailsReceivingBranch = temp;
               // this.data2=this.rowsFilter;
       
               // this.table.offset = 0;
               this.arr=[]
                console.log(this.ClearedCartonDetailsReceivingBranch)
                this.ClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
                  if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
                    // console.log('res', arr)
                    this.arr.push(obj.invoice_no)
                  }
                });
                this['tot_clr_wgt']=0
                this['tot_clr_ctn']=0
                for (let i = 0; i < this.ClearedCartonDetailsReceivingBranch.length; i++) {  
                  this['tot_clr_wgt'] = 1*this.ClearedCartonDetailsReceivingBranch[i]['carton_weight']+this['tot_clr_wgt']  
                  this['tot_clr_ctn'] = 1*this.ClearedCartonDetailsReceivingBranch[i]['total_carton']+this['tot_clr_ctn']  
                }
           }
           updateFilterbookcountry(event:any) {
            // this.searchh()
            this.ClearedCartonDetailsReceivingBranch =this.bookdata 
            console.log(event)
                 const val = event.target.value.toLowerCase();
         // console.log(event.target.value)
                 // filter our data
         
                 const temp = this.ClearedCartonDetailsReceivingBranch.filter(function(data2:any) {
                     return data2.country_name.toLowerCase().indexOf(val) !== -1 || !val;
                 });
         
                 // update the rows
                 this.ClearedCartonDetailsReceivingBranch = temp;
                 // this.data2=this.rowsFilter;
         
                 // this.table.offset = 0;
                 this.arr=[]
                  console.log(this.ClearedCartonDetailsReceivingBranch)
                  this.ClearedCartonDetailsReceivingBranch.forEach((obj:any) => {
                    if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
                      // console.log('res', arr)
                      this.arr.push(obj.invoice_no)
                    }
                  });
                  this['tot_clr_wgt']=0
                  this['tot_clr_ctn']=0
                  for (let i = 0; i < this.ClearedCartonDetailsReceivingBranch.length; i++) {  
                    this['tot_clr_wgt'] = 1*this.ClearedCartonDetailsReceivingBranch[i]['carton_weight']+this['tot_clr_wgt']  
                    this['tot_clr_ctn'] = 1*this.ClearedCartonDetailsReceivingBranch[i]['total_carton']+this['tot_clr_ctn']  
                  }
             }
             addall()
              {
                console.log('sss',this['NonClearedCartonDetailsreceiving_warehouse'])
                this['NonClearedCartonDetailsreceiving_warehouse']=this['NonClearedCartonDetailsreceiving_warehouse']
                this.selected2=[]
               
                  this['NonClearedCartonDetailsreceiving_warehouse'].forEach((val: { checked: boolean; }) => { val.checked = false });
                  this.checkall=false
                  for (let i = 0; i < this['NonClearedCartonDetailsreceiving_warehouse'].length; i++) {
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
                 this.ManualInvoiceDetails=get_data['data'];
                 console.log("ManualInvoiceDetails",this.ManualInvoiceDetails);
                 if(this.ManualInvoiceDetails==null || this.ManualInvoiceDetails=="" || this.ManualInvoiceDetails==undefined){
                  this.coloredToast( 'danger','Invoice Does Not Exist');
                  //  this.reset()
                  this.invoiceno.nativeElement.focus();
                 }
                 else{
                //  this.valForm_assign.controls['Delivery_Area'].setValue(this.ManualInvoiceDetails[0].delivery_area_code_name)
                //  this.valForm_assign.controls['Delivery_State'].setValue(this.ManualInvoiceDetails[0].delivery_state_name)
                 this.valForm_assign.controls['receiver_address'].setValue(this.ManualInvoiceDetails[0].receiver_address)
                //  this.valForm.controls['p_total_cartonNumber'].setValue(this.ManualInvoiceDetails[0].total_ctn)
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
                   //  this.valForm_assign.controls['Delivery_Area'].setValue('NR')
                   this.coloredToast( 'danger','Carton Does Not Exist');
                   this.carton.nativeElement.focus();
                 }
                 else{
                this.weight.nativeElement.focus();
                 this.valForm_assign.controls['box_no'].setValue(this.ManualCartonDetails[0].carton_no)
                 this.valForm.controls['p_cartonNumber'].setValue(this.ManualCartonDetails[0].carton_no)
                 this.valForm.controls['p_cartonWeight'].setValue(this.ManualCartonDetails[0].current_weight)
                 this.valForm_assign.controls['weight'].setValue(this.ManualCartonDetails[0].current_weight)
                //  this.valForm_assign.controls['Origin'].setValue(this.ManualCartonDetails[0].origin_name)
                 this.valForm_assign.controls['delivery_state_name'].setValue(this.ManualCartonDetails[0].delivery_state_name)
                //  this.valForm_assign.controls['Booked_Location'].setValue(this.ManualCartonDetails[0].current_location)
                 // this.valForm.controls['p_itemDetails'].setValue(this.ManualCartonDetails[0].item_name)
                //  this.valForm_assign.controls['Item_Details'].setValue(this.ManualCartonDetails[0].item_name)
                 this.valForm_assign.controls['receiver_address'].setValue(this.ManualCartonDetails[0].receiver_address)
                 this.valForm.controls['p_packingCondition'].setValue('good Condition')
                 this.valForm.controls['p_barcodeNumber'].setValue(this.ManualCartonDetails[0].barcode_no)
                 this.valForm.controls['p_delivery_area_code'].setValue(this.ManualCartonDetails[0].delivery_area_code_name) 
                 this.valForm.controls['p_delivery_state'].setValue(this.ManualCartonDetails[0].delivery_state_name) 
                 
                 
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
                  //  this.valForm_assign.controls['Delivery_Area'].setValue('NR')
                   //  this.valForm_assign.controls['Delivery_Area'].setValue('NR')
                   this.coloredToast( 'danger','Barcode Does Not Exist');
                   this.barcode.nativeElement.focus();
                 }
                 else{
                  this.weight.nativeElement.focus();
                   this.valForm.controls['p_r_manifestNumber'].setValue(this.manifest)
                   // this.valForm.controls['p_itemDetails'].setValue(this.ManualbarcodeDetails[0].item_type_id)
                  // this.valForm_assign.controls['Booked_Location'].setValue(this.ManualbarcodeDetails[0].current_location)
                   this.valForm.controls['p_packingCondition'].setValue('good Condition')
                   
    
                   this.valForm_assign.controls['box_no'].setValue(this.ManualbarcodeDetails[0].carton_no)
                   this.valForm.controls['p_cartonNumber'].setValue(this.ManualbarcodeDetails[0].carton_no)
                   this.valForm.controls['p_cartonWeight'].setValue(this.ManualbarcodeDetails[0].current_weight)
                   this.valForm_assign.controls['weight'].setValue(this.ManualbarcodeDetails[0].current_weight)
                  //  this.valForm_assign.controls['Origin'].setValue(this.ManualCartonDetails[0].origin_name)
                   this.valForm_assign.controls['delivery_state_name'].setValue(this.ManualbarcodeDetails[0].delivery_state_name)
                  //  this.valForm_assign.controls['Booked_Location'].setValue(this.ManualCartonDetails[0].current_location)
                   // this.valForm.controls['p_itemDetails'].setValue(this.ManualCartonDetails[0].item_name)
                  //  this.valForm_assign.controls['Item_Details'].setValue(this.ManualCartonDetails[0].item_name)
                   this.valForm_assign.controls['receiver_address'].setValue(this.ManualbarcodeDetails[0].receiver_address)
                   this.valForm.controls['p_packingCondition'].setValue('good Condition')
                   this.valForm.controls['p_barcodeNumber'].setValue(this.ManualbarcodeDetails[0].barcode_no)
                   this.valForm.controls['p_delivery_area_code'].setValue(this.ManualbarcodeDetails[0].delivery_area_code_name) 
                   this.valForm.controls['p_invoiceNumber'].setValue(this.ManualbarcodeDetails[0].invoice_no) 
      
                   this.booked_location=this.ManualbarcodeDetails[0].v_wh_location_name;
    
                     }
              })
              }
    
              getsearchbybarcodeandinsert(value: any)
              {
              //  this.btn='2';
               this.valForm.controls['p_invoiceNumber'].enable();
                console.log(value.p_barcodeNumber)
                this.service.getManualbarcodeDetails('-1',value.p_barcodeNumber,'FWD').subscribe(get_data=>{
                 this.ManualbarcodeDetails=get_data['data'];
                 console.log("ManualbarcodeDetails",this.ManualbarcodeDetails);
                 if(this.ManualbarcodeDetails == "" || this.ManualbarcodeDetails == null){
                  //  this.valForm_assign.controls['Delivery_Area'].setValue('NR')
                   //  this.valForm_assign.controls['Delivery_Area'].setValue('NR')
                   this.coloredToast( 'danger','Barcode Does Not Exist');
                   this.barcode.nativeElement.focus();
                 }
                 else{
                   this.valForm.controls['p_r_manifestNumber'].setValue(this.manifest)
                   // this.valForm.controls['p_itemDetails'].setValue(this.ManualbarcodeDetails[0].item_type_id)
                  // this.valForm_assign.controls['Booked_Location'].setValue(this.ManualbarcodeDetails[0].current_location)
                   this.valForm.controls['p_packingCondition'].setValue('good Condition')
                   
    
                   this.valForm_assign.controls['box_no'].setValue(this.ManualbarcodeDetails[0].carton_no)
                   this.valForm.controls['p_cartonNumber'].setValue(this.ManualbarcodeDetails[0].carton_no)
                   this.valForm.controls['p_cartonWeight'].setValue(this.ManualbarcodeDetails[0].current_weight)
                   this.valForm_assign.controls['weight'].setValue(this.ManualbarcodeDetails[0].current_weight)
                  //  this.valForm_assign.controls['Origin'].setValue(this.ManualCartonDetails[0].origin_name)
                   this.valForm_assign.controls['delivery_state_name'].setValue(this.ManualbarcodeDetails[0].delivery_state_name)
                  //  this.valForm_assign.controls['Booked_Location'].setValue(this.ManualCartonDetails[0].current_location)
                   // this.valForm.controls['p_itemDetails'].setValue(this.ManualCartonDetails[0].item_name)
                  //  this.valForm_assign.controls['Item_Details'].setValue(this.ManualCartonDetails[0].item_name)
                   this.valForm_assign.controls['receiver_address'].setValue(this.ManualbarcodeDetails[0].receiver_address)
                   this.valForm.controls['p_packingCondition'].setValue('good Condition')
                   this.valForm.controls['p_barcodeNumber'].setValue(this.ManualbarcodeDetails[0].barcode_no)
                   this.valForm.controls['p_delivery_area_code'].setValue(this.ManualbarcodeDetails[0].delivery_area_code_name) 
                   this.valForm.controls['p_invoiceNumber'].setValue(this.ManualbarcodeDetails[0].invoice_no) 
      
                   this.booked_location=this.ManualbarcodeDetails[0].v_wh_location_name;
    
     
      
                   this.save.nativeElement.focus();
                   this.submitForm(event, this.valForm.value)
                   this.valForm.controls['p_barcodeNumber'].setValue("");
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
               actradio(){    
              this.tex='2'
              this.mfid.nativeElement.focus();
               }
               anyradio(){
                this.tex='1'
                // this.invoiceno.nativeElement.focus();
              
               }
               CheckAlldelete() {
                this.btn='4'
                if (this.ClearedCartonDetailsReceivingBranch.every((val: { checked: boolean; }) => val.checked == true)) {
                  this.ClearedCartonDetailsReceivingBranch.forEach((val: { checked: boolean; }) => { val.checked = false });
                  for (let i = 0; i < this.ClearedCartonDetailsReceivingBranch.length; i++) {
                    this.selecteddel.splice(this.selected.indexOf(this.ClearedCartonDetailsReceivingBranch[i].mf_details_id), 1)
                  }
                  ////console.log('1', this.selected2);
                }
                else {
                  this.ClearedCartonDetailsReceivingBranch.forEach((val: { checked: boolean; }) => { val.checked = true });
                  for (let i = 0; i < this.ClearedCartonDetailsReceivingBranch.length; i++) {
                    this.selecteddel.push(this.ClearedCartonDetailsReceivingBranch[i].mf_details_id);
                  }
                  console.log('2', this.selecteddel);
                }
              }
              onChangedelete(checked:any, ClearedCartonDetailsReceivingBranch:any) {
                this.btn='4'
                if (checked) {
            
                  this.selecteddel.push(ClearedCartonDetailsReceivingBranch);
                  // ////console.log("selected",this.selected2);
            
                } else {
                  this.selecteddel.splice(this.selecteddel.indexOf(ClearedCartonDetailsReceivingBranch), 1)
            
            
                }
                console.log("selected",this.selecteddel);
              }
    
}
