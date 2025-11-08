import { Component, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
// import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AwbServiceService } from '../../services/awb-service.service';
import { CustomerServiceService } from '../../services/customer-service.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: './list.html',
})
export class InvoiceListComponent {
    @ViewChild('carton') carton: any;
    @ViewChild('receiverp') receiverp: any;
    @ViewChild('pincodep') pincodep: any;
    @ViewChild('searpop') searpop: any;
    @ViewChild('searrecpop') searrecpop: any;
    @ViewChild('imagep') imagep: any;
    @ViewChild('holidayp') holidayp: any;
    @ViewChild("awbAllocationPopup") _awbAllocation: any;
    @ViewChild('F_REF') F_REF: any;
    @ViewChild('F_DCO') F_DCO: any;
    @ViewChild('F_DLO') F_DLO: any;
    @ViewChild('F_REG') F_REG: any;
    @ViewChild('F_AGE') F_AGE: any;
    @ViewChild('F_CID') F_CID: any;
    @ViewChild('F_ITE') F_ITE: any;
    @ViewChild('F_TPC') F_TPC: any;
    @ViewChild('F_CIN') F_CIN: any;
    @ViewChild('F_REC') F_REC: any;
    @ViewChild('F_WEI') F_WEI: any;
    @ViewChild('F_VAL') F_VAL: any;
    @ViewChild('F_TRA') F_TRA: any;
    @ViewChild('F_REM') F_REM: any;
    @ViewChild('F_SCA') F_SCA: any;
    @ViewChild('F_BIL') F_BIL: any;
    @ViewChild('F_PAC') F_PAC: any;
    @ViewChild('F_DIS') F_DIS: any;
    @ViewChild('F_VAT') F_VAT: any;
    @ViewChild('F_BIA') F_BIA: any;
    @ViewChild('F_NET') F_NET: any;
    @ViewChild('F_BAL') F_BAL: any;
    @ViewChild('F_EXT') F_EXT: any;
    @ViewChild('F_REA') F_REA: any;
    @ViewChild('F_TWT') F_TWT: any;
    @ViewChild('F_PCA') F_PCA: any;
    @ViewChild('F_SEN') F_SEN: any;
    @ViewChild('F_SEA') F_SEA: any;
    @ViewChild('F_SCI') F_SCI: any;
    @ViewChild('F_SEM') F_SEM: any;
    @ViewChild('F_SEI') F_SEI: any;
    @ViewChild('F_SEE') F_SEE: any;
    @ViewChild('F_SEP') F_SEP: any;
    @ViewChild('F_REN') F_REN: any;
    @ViewChild('F_RST') F_RST: any;
    @ViewChild('F_RAD') F_RAD: any;
    @ViewChild('F_RDI') F_RDI: any;
    @ViewChild('F_REP') F_REP: any;
    @ViewChild('F_RMO') F_RMO: any;
    @ViewChild('F_RAR') F_RAR: any;
    @ViewChild('F_RMA') F_RMA: any;

    @ViewChild('F_CTNN') F_CTNN: any;
    @ViewChild('F_CTWT') F_CTWT: any;
    @ViewChild('F_CTNT') F_CTNT: any;
    @ViewChild('F_RTA') F_RTA: any;
    @ViewChild('F_RPO') F_RPO: any;
    @ViewChild('F_CMO') F_CMO: any;
    @ViewChild('F_STY') F_STY: any;
    @ViewChild('F_RID') F_RID: any;
    @ViewChild('F_OPA') F_OPA: any;
    @ViewChild('DIS_M_F') DIS_M_F: any;
    @ViewChild('send_based_rec_F') send_based_rec_F: any
    @ViewChild('pck_F') pck_F: any
    @ViewChild('PAY_REC') PAY_REC: any
    @ViewChild('F_OPF') F_OPF: any
    @ViewChild('cart_rem') cart_rem: any
    @ViewChild('BILL_F') BILL_F: any
    tab9: string = 'home';
    selectedOption: string = 'ND';
    valForm: FormGroup;
    valForm4: FormGroup;
    PrintForm: FormGroup;
    itemTypeForm: FormGroup;
    dimensionForm: FormGroup;
    userdetails: any;
    userid: any;
    pointid: any;
    point_type_id: any;
    point_code_pefix: any;
    country_id: any;
    v_point_Id_Branch: any;
    v_location_id: any;
    v_point_name: any;
    v_point_id: any;
    v_point_code: any;
    ph_code: any;
    country_name: any;
    invoice_id: any;
    sender_kyc_length: any;
    receiver_kyc_length: any;
    rec_mobilelength: any;
    sen_mobilelength: any;
    country: any;
    currency: any;
    currency_code: any;
    currency_code_inv: any;
    transit: any;
    opfac: any;
    max_op_wgt: any;
    max_op_inv: any;
    type: any;
    shipment: any;
    item: any;
    sender_kyc_type: any;
    region: any = [];
    agent: any;
    receiver_kyc_type: any;
    service_type: any;
    awb_no: any;
    old_no: any;
    destination: any;
    state: any = [];
    holidayslength: any;
    rate: any;
    master_scaning_charge: any;
    master_packing_charge: any;
    master_bill_charge: any;
    bill_charge_view: any;
    packing_charge: any;
    valuepercent: any;
    del_days: any;
    holidays: any;
    pooffice: any;
    pincodetails: any = [];
    district: any;
    rec_btn: any;
    receiver_sec: any;
    taluk: any;
    receiver: any;
    start_sr: number = 0;
    customer_search: any;
    nxt_action: number = 0;
    sender_credit: string = "1";
    customer_search_rec: any;
    sender_sec: any;
    recpopupdata: any;
    recpopupdata_length: any;
    boxAmount: any;
    ctn_load: boolean = true;
    carton_disp: any;
    btn: any;
    print_disp: any;
    step2: boolean = true;
    insert: boolean = true;
    ItemArray: any = [];
    CartonArray: any = [];
    sav_btn: any;
    recevier_active: boolean = true;
    sender_active: boolean = true;
    otp_mobile: any;
    save_dis: any;
    temp_load: boolean = false;
    inv_load: boolean = false;
    new_invoice_no: any;
    awb_id: any;
    otp_name: any;
    item_data_arr: any;
    step4: boolean = true;
    print_awb: any;
    rowClicked_sender: any;
    totItemCount: any = 0;
    carsum: number = 0;
    actWt: number = 0;
    volWt: number = 0;
    cartondetails: any = [];
    step3: boolean = false;
    step6: boolean = false;
    itemtype: any;
    select_wgt: any;
    dimSave: any;
    dimensionList: any;
    rowClicked: any;
    pdf_data: any;
    imagevalue: any;
    imagePath: any;
    printLoad: boolean = false;
    invoice_no: any;
    view_modify: any;
    invItemTypeList: any;
    invoice_list: any;
    agentBranch: any;
    bil_series: any;
    tot_wgt: any;
    tot_ctn: any;
    constructor(private datep: DatePipe, fb: FormBuilder,
        public service: AwbServiceService, public service2: CustomerServiceService,
        private _sanitizer: DomSanitizer, public route: ActivatedRoute,
        private router: Router) {
        this.route.params.subscribe(datas => {
            this.invoice_no = datas['inv_no'];
            this.view_modify = datas['view_modify'];
            this.invoice_id = datas['inv_id']
            this.print_awb = datas['inv_no']
        });
        var user: any = localStorage.getItem("log_data")
        this.userdetails = JSON.parse(user)
        this.userid = this.userdetails.v_user_id;
        this.pointid = this.userdetails.v_point_id
        this.point_type_id = this.userdetails.v_point_type_id
        this.point_code_pefix = this.userdetails.v_origin_prefix
        this.country_id = this.userdetails.V_country_id
        this.v_point_Id_Branch = this.userdetails.v_point_Id_Branch
        this.v_location_id = this.userdetails.v_location_id
        this.v_point_name = this.userdetails.v_point_name
        this.v_point_id = this.userdetails.v_point_id
        this.v_point_code = this.userdetails.v_point_code
        this.ph_code = this.userdetails.v_country_code
        this.country_name = this.userdetails.V_country_name
        this.valForm = fb.group({
            'invoice_id': ["",],
            'awbno': [null, Validators.required],
            'awbno_series': ["",],
            'sender_id': [null, Validators.required],
            'sender_name': [null, Validators.required],
            'sender_phone': ["",],
            'sender_phone_code': ["",],
            'sender_phone_no': ["",],
            'sender_address': [null, Validators.required],
            'sender_kyc_type': [null,],
            'receiver_kyc_type': [null,],
            'sender_city': [null,],
            'sender_mail': [null,],
            // 'sender_person': [null,],
            'sender_mobile': ["",],
            'sender_mobile_no': ["", Validators.required],
            'sender_mobile_code': ["",],
            // 'contact_person': [null,],
            'receiver_id': [null,],
            'receiver_mail': [null,],
            // 'referenceNo': [null,],
            'receiver_name': [null, Validators.required],
            'receiver_phone': ["",],
            'receiver_phone_no': ["",],
            'receiver_mobile': ["",],
            'receiver_mobile_no': ["", Validators.required],
            'receiver_phone_code': ["",],
            'receiver_mobile_code': ["",],
            'receiver_address': [null, Validators.required],
            'receiver_taluk': [null,],
            // 'receiver_postoffice': [null,],
            'invoice_date': [null, Validators.required],
            'invoice_value': [null,],
            'total_carton': [null,],
            'total_weight': ["0.00"],
            'transit_type_name': [null],
            'transit_type': [null],
            'shipment_type': [null, Validators.required],
            'service_type': [null,],
            'created_by': [this.userid],
            'origin_country': [this.country_id],
            'des_country': [null,],
            'delivery_state_id': [""],
            // 'des_country_name': [null],
            // 'manual_wt': [null,],
            'pay_remarks': [" "],
            'ctn_remarks': [" "],
            'receiver_state': [null, Validators.required],
            'sender_pincode': [null,],
            'receiver_pincode': [null,],
            'origin_id': [this.v_location_id],
            'origin_branch_id': [this.v_location_id],
            'belongs_to_point_id': [this.v_point_id],
            'payment_mode': ["CASH"],
            'agent': [null],
            'search_mobile': [null],
            'search_id': [null],
            'point_id': [this.pointid],
            'region_id': [null, Validators.required],
            'sender_iqama_no': [null],
            'receiver_district_name': [null, Validators.required],
            'refernece_no': [null, Validators.required],
            'preperedBy': [this.userid],
            'item_value': ["0.00",],
            'weight_charge': ["0.00"],
            'scaning_charge': ["0.00",],
            'bill_charge': ["0.00",],
            'extra_charge': ["0.00"],
            'discount': ["0.00"],
            'bill_amount': [0.00],
            'net_amount': [0.00,],
            'booking_agent_commision': [0.00,],
            'received_amount': [0.00,],
            'balance_amount': [0.00,],
            'region_rate': [0.00,],
            'opfac_to': [1,],
            'rate': [0.00,],
            'max_wt': [0,],
            'exp_date': [""],
            'packing_charge': ["0.00",],
            'vat_amt': ["0.00"],
            'holidays': ["0.00"],
            'postoffice': [null],
            'weight_amount': [0.00],
            'item_name': [""],
            'qty': [""],
            'item_carton_no': [""],
            'unit_price': [""],
            'itm_per': [""],
            'item_val': [""],
            'carton_no': [""],
            'box_no': [""],
            'ip_item_type': [""],
            'weight': [""],
            'total_pcs': [""],
            'tax': ["0.00"],
            'Master_packing_charge': [""],
            'Master_scanning_charge': [""],
            'Master_bill_charge': [""],
            'TransportationCharge': [""],
            'customDuty': [""],
            'inv_currency': [""],
            'bill_currency': [""],
            'grand_tot': [""],
            'total_tax': ["0.00"],
            'payMode': [""],
            'packMode': ["COMPANY PACKING"]
        });
        this.valForm4 = fb.group({
            'carton_id': [null,],
            'carton_no': [null,],
            'total_pcs': [null,],
            'ip_item_type': [null,],
            'weight': [null,],
            'inv_id': [null,],
            'inv_no': [null,],
            'user_id': [this.userid,]
            // 'passwordGroup': this.passwordForm
        });
        this.itemTypeForm = fb.group({
            'itemId': [null],
            'inv_id': [null,],
            'itemType': [null],
            'wgt': [null],
            'rate': [null]
        });
        this.dimensionForm = fb.group({
            'vol_id': [null],
            'ctnNo': [null, Validators.required],
            'invId': [this.invoice_id],
            'boxAmt': [null],
            'cbm': [null],
            'length': [0, Validators.compose([Validators.required])],
            'width': [0, Validators.compose([Validators.required])],
            'height': [0, Validators.compose([Validators.required])],
            'mawb_total_pcs': [null, Validators.compose([Validators.required])],
            'vol_weight': [null, Validators.compose([Validators.required])],
            'vol_radio': [5000, Validators.compose([Validators.required])],
            // 'passwordGroup': this.passwordForm
        });
        this.PrintForm = fb.group({
            'printing_option': ["Template_Invoice"],
        });

        if (this.view_modify == "view") {
            this.valForm.controls['refernece_no'].disable()
            this.valForm.controls['transit_type_name'].disable()
            this.valForm.controls['service_type'].disable()
            this.valForm.controls['des_country'].disable()
            this.valForm.controls['region_id'].disable()
            this.valForm.controls['shipment_type'].disable()
            this.valForm.controls['agent'].disable()
            this.valForm.controls['opfac_to'].disable()
            this.valForm.controls['sender_kyc_type'].disable()
            this.valForm.controls['search_id'].disable()
            this.valForm.controls['sender_name'].disable()
            this.valForm.controls['sender_mobile_no'].disable()
            this.valForm.controls['sender_phone_no'].disable()
            this.valForm.controls['sender_address'].disable()
            this.valForm.controls['sender_city'].disable()
            this.valForm.controls['sender_mail'].disable()
            this.valForm.controls['receiver_kyc_type'].disable()
            this.valForm.controls['receiver_id'].disable()
            this.valForm.controls['receiver_name'].disable()
            this.valForm.controls['receiver_address'].disable()
            this.valForm.controls['receiver_mobile_no'].disable()
            this.valForm.controls['receiver_phone_no'].disable()
            this.valForm.controls['receiver_pincode'].disable()
            this.valForm.controls['receiver_state'].disable()
            this.valForm.controls['receiver_district_name'].disable()
            this.valForm.controls['receiver_taluk'].disable()
            this.valForm.controls['postoffice'].disable()
            this.valForm.controls['receiver_mail'].disable()
            this.valForm4.controls['carton_no'].disable()
            this.valForm4.controls['weight'].disable()
            this.valForm4.controls['ip_item_type'].disable()
            this.valForm.controls['pay_remarks'].disable()
            this.valForm.controls['ctn_remarks'].disable()
            this.valForm.controls['received_amount'].disable()
            this.valForm.controls['Master_packing_charge'].disable()
            this.valForm.controls['Master_scanning_charge'].disable()
            this.valForm.controls['Master_bill_charge'].disable()
            this.valForm.controls['extra_charge'].disable()
            this.valForm.controls['discount'].disable()
            this.valForm.controls['tax'].disable()
        }
    }

    // -----------------------------------------------------------Focus------------------------------------------


  reffocus() {
    this.F_REF.nativeElement.focus();
  }
  dcofocus() {
    this.F_DCO.nativeElement.focus();
    // this.F_DCO.nativeElement.select();
  }
  dlofocus() {
    this.F_REG.nativeElement.focus();
  }
  ser_regfocus(value: any) {
    if (value.service_type == "" || value.service_type == null || value.service_type == undefined || value.service_type == "-1") {
      this.F_OPA.nativeElement.focus();
      this.coloredToast("warning", 'Select Service Type')
    }
    else {
      this.F_REG.nativeElement.focus();
    }
  }
  serfocus() {
    this.F_OPA.nativeElement.focus();
  }
  receiverIdFocus() {
    this.F_RID.nativeElement.focus()
  }
  agefocus() {
    this.F_AGE.nativeElement.focus();
  }
  sender_active_status() {
    // this.sender_active=false
  }
  cidfocus(value: any) {
    if (value.region_id == "") {
      this.F_REG.nativeElement.focus();
      this.coloredToast("warning", 'Select Region')
    }
    else {
      this.F_CID.nativeElement.focus();
    }
  }
  tpcfocus() {
    this.F_TPC.nativeElement.focus();
  }
  cinfocus() {
    this.F_CIN.nativeElement.focus();
  }
  recfocus() {
    this.F_REC.nativeElement.focus();
  }
  pcsfocus() {
    this.F_WEI.nativeElement.focus();
  }
  weifocus() {
    this.F_TPC.nativeElement.focus();
  }
  ctnNofocus() {
    this.F_CTNN.nativeElement.focus();
  }
  valfocus() {
    this.F_VAL.nativeElement.focus();
  }
  trafocus() {
    this.F_TRA.nativeElement.focus();
    // this.F_TRA.nativeElement.select()
    if (this.valForm.value.refernece_no == "" || this.valForm.value.refernece_no == null || this.valForm.value.refernece_no == undefined) {
      this.coloredToast("warning", "Please enter refference no")
      this.F_REF.nativeElement.focus();
    }
  }
  remfocus() {
    this.F_REM.nativeElement.focus();
  }
  scafocus() {
    this.F_SCA.nativeElement.focus();
    this.F_SCA.nativeElement.select()
  }
  bilfocus() {
    this.F_BIL.nativeElement.focus();
    this.F_BIL.nativeElement.select()
  }
  pacfocus() {
    this.F_PAC.nativeElement.focus();
    this.F_PAC.nativeElement.select()
  }
  extfocus() {
    this.F_EXT.nativeElement.focus();
    this.F_EXT.nativeElement.select()
  }
  disfocus() {
    this.F_DIS.nativeElement.focus();
    this.F_DIS.nativeElement.select()
  }
  vatfocus() {
    this.F_VAT.nativeElement.focus();
    this.F_VAT.nativeElement.select()
  }
  biafocus() {
    this.F_BIA.nativeElement.focus();
    this.F_BIA.nativeElement.select()
  }
  netfocus() {
    this.F_NET.nativeElement.focus();
    this.F_NET.nativeElement.select()
  }
  balfocus() {
    this.F_BAL.nativeElement.focus();
    this.F_BAL.nativeElement.select()
  }
  reafocus() {
    this.F_REA.nativeElement.focus();
    this.F_REA.nativeElement.select()
  }
  rtafocus() {
    this.F_RTA.nativeElement.focus();
    if (this.valForm.value.receiver_district_name == "" || this.valForm.value.receiver_district_name == null || this.valForm.value.receiver_district_name == undefined) {
      this.coloredToast("warning", "Please enter receiver district")
      this.F_RDI.nativeElement.focus();
    }
  }
  rpofocus() {
    this.F_RPO.nativeElement.focus();
  }
  cmofocus() {
    this.F_CMO.nativeElement.focus();
  }
  twtfocus() {
    this.F_TWT.nativeElement.focus();
    this.F_TWT.nativeElement.select()
  }
  senfocus() {
    this.F_SEN.nativeElement.focus();
  }
  seafocus() {
    this.F_SEP.nativeElement.focus();
    if (this.valForm.value.sender_name == "" || this.valForm.value.sender_name == null || this.valForm.value.sender_name == undefined) {
      this.coloredToast("warning", "Please enter sender name")
      this.F_SEN.nativeElement.focus();
    }
  }
  sepfocus() {
    this.F_SCI.nativeElement.focus();
    if (this.valForm.value.sender_address == "" || this.valForm.value.sender_address == null || this.valForm.value.sender_address == undefined) {
      this.coloredToast("warning", "Please enter sender address")
      this.F_SEA.nativeElement.focus();
    }
  }
  resfocus() {
    this.F_RST.nativeElement.focus();
  }
  scifocus() {
    this.F_SCI.nativeElement.focus();
    if (this.valForm.value.sender_mobile_no == "" || this.valForm.value.sender_mobile_no == null || this.valForm.value.sender_mobile_no == undefined) {
      this.coloredToast("warning", "Please enter mobile no")
      this.F_SEP.nativeElement.focus();
    }
  }

  seifocus() {
    if (this.valForm.value.sender_mobile_no == this.valForm.value.sender_phone_no) {
      this.coloredToast("warning", 'Both mobile numbers are same')
    }
    this.F_SEA.nativeElement.focus();
  }
  semailfocus() {
    this.F_SEE.nativeElement.focus()
  }
  seefocus() {
    if (this.valForm.value.search_id == "" || this.valForm.value.search_id == null || this.valForm.value.search_id == undefined) {
      this.coloredToast("warning", "Please enter Iqama no")
      this.F_CID.nativeElement.focus();
    }
    else if (this.valForm.value.search_id.length != this.sender_kyc_length) {
      this.coloredToast("warning", "Enter " + this.sender_kyc_length + " Digit No")
      this.F_CID.nativeElement.focus();
    }
    else {
      this.F_SEN.nativeElement.focus();
    }
  }
  renfocus() {
    this.F_RID.nativeElement.focus();
  }
  radfocus() {
    this.F_RAD.nativeElement.focus();
    if (this.valForm.value.receiver_name == "" || this.valForm.value.receiver_name == null || this.valForm.value.receiver_name == undefined) {
      this.coloredToast("warning", "Please enter receiver name")
      this.F_REN.nativeElement.focus();
    }
  }
  rstfocus() {
    this.F_REP.nativeElement.focus();
    if (this.valForm.value.receiver_address == "" || this.valForm.value.receiver_address == null || this.valForm.value.receiver_address == undefined) {
      this.coloredToast("warning", "Please enter receiver adddress")
      this.F_RAD.nativeElement.focus();
    }
  }
  rdifocus() {
    this.F_RDI.nativeElement.focus();
    if (this.valForm.value.receiver_state == "" || this.valForm.value.receiver_state == null || this.valForm.value.receiver_state == undefined) {
      this.coloredToast("warning", "Please enter receiver state")
      this.F_RST.nativeElement.focus();
    }
  }
  repfocus() {
    this.F_RMA.nativeElement.focus();
  }
  rmofocus() {
    if (this.valForm.value.receiver_mobile_no == "" || this.valForm.value.receiver_mobile_no == null || this.valForm.value.receiver_mobile_no == undefined) {
      this.coloredToast("warning", "Please enter mobile no")
      this.F_REP.nativeElement.focus();
    }
    else if (this.valForm.value.receiver_mobile_no.length != this.rec_mobilelength) {
      this.coloredToast("warning", "Enter " + this.rec_mobilelength + " Digit No")
      this.F_REP.nativeElement.focus();
    }
    else {
      this.F_RMO.nativeElement.focus();
    }
  }
  semfocus() {
    if (this.valForm.value.sender_mobile_no == "" || this.valForm.value.sender_mobile_no == null || this.valForm.value.sender_mobile_no == undefined) {
      this.coloredToast("warning", "Please enter mobile no")
      this.F_SEP.nativeElement.focus();
    }
    else if (this.valForm.value.sender_mobile_no.length != this.sen_mobilelength) {
      this.coloredToast("warning", "Enter " + this.sen_mobilelength + " Digit No")
      this.F_SEP.nativeElement.focus();
    }
    else {
      this.F_RID.nativeElement.focus();
    }
  }
  rarfocus() {
    if (this.valForm.value.receiver_phone_no == this.valForm.value.receiver_mobile_no) {
      this.coloredToast("warning", 'Both mobile numbers are same')
      this.F_RMO.nativeElement.focus()
    }
    else {
      this.F_RAR.nativeElement.focus();
    }
  }
  rmafocus(data: any) {
    if (this.valForm.value.receiver_pincode.length != 6) {
      this.coloredToast("warning", "Invalid Pincode")
      this.F_RST.nativeElement.focus();
    }
    else {
      this.F_RAR.nativeElement.focus();
      this.getDetailsbypin(data)
    }
  }
  
  bill_pkg_F() {
    setTimeout(() => {
      this.BILL_F.nativeElement.focus()
      this.BILL_F.nativeElement.select()
    }, 500);
  }

  Pay_Rec_F() {
    setTimeout(() => {
      this.PAY_REC.nativeElement.focus()
      this.PAY_REC.nativeElement.select()
    }, 500);
  }

  bill_info_to_pay() {
    setTimeout(() => {
      this.PAY_REC.nativeElement.focus()
      this.PAY_REC.nativeElement.select()
    }, 500);
  }

  bill_focus() {
    setTimeout(() => {
      this.BILL_F.nativeElement.focus()
      this.BILL_F.nativeElement.select()
    }, 500);
  }
  // -----------------------------------------------------------Focus------------------------------------------
  // --------------------------------------------------------Calculation--------------------------------------

  amountCal(value: any) {
    var tBlAmt = 0
    var ntAmt = 0
    var recAmt = 0
    var balAmt = 0
    var GTAmt = 0
    // console.log('va', value)
    if (value.total_weight == undefined) value.total_weight = 0
    var rat = Number(value.rate)
    var totwt = Number(value.total_weight)
    if (this.valForm.value.des_country == 'PH' && this.valForm.value.transit_type_name == 'S') {
      var wtamt = this.boxAmount
    }
    else {
      var wtamt: any = rat * totwt
    }
    if ((value.rate == 0) || (value.total_weight == 0)) {
      this.valForm.controls['weight_amount'].setValue('0.00')
      value.bill_charge = 0
    }
    else {
      this.valForm.controls['weight_amount'].setValue(wtamt.toFixed(2))
    }
    if (this.valForm.value['total_weight'] != 0) {
      this.valForm.controls['bill_charge'].setValue(this.bill_charge_view)
      value.bill_charge = this.bill_charge_view
    }
    var valAmt = Number(value.vat_amt)
    var blAmt = Number(value.bill_charge)
    var pkAmt = Number(value.packing_charge)
    var exAmt = Number(value.extra_charge)
    var disAmt = Number(value.discount)
    // var tax = Number(value.tax)
    var tot_tax = Number(value.total_tax)
    // console.log("AMT",wtamt,blAmt,pkAmt,exAmt,disAmt,valAmt,tot_tax )

    tBlAmt = Number((wtamt + blAmt + pkAmt + exAmt ) - disAmt)
    ntAmt = Number((wtamt + blAmt + pkAmt + exAmt ) - disAmt)
    GTAmt = Number(ntAmt + tot_tax)
    recAmt = Number(value.received_amount)
    balAmt = (GTAmt - recAmt)

    this.valForm.controls['bill_amount'].setValue(tBlAmt.toFixed(2))
    this.valForm.controls['extra_charge'].setValue(exAmt.toFixed(2))
    this.valForm.controls['packing_charge'].setValue(pkAmt.toFixed(2))
    this.valForm.controls['discount'].setValue(disAmt.toFixed(2))
    this.valForm.controls['net_amount'].setValue(ntAmt.toFixed(2))
    this.valForm.controls['balance_amount'].setValue(balAmt.toFixed(2))
    this.valForm.controls['grand_tot'].setValue(GTAmt.toFixed(2))
    // this.valForm.controls['tax'].setValue(Math.round(tot_tax))

    // console.log('va', ntAmt,tBlAmt)
  }

  wtamtcal(rate: any, total_weight: any, scanning_charge: any) {
    // this.amountCal()
    // console.log("rate",rate,total_weight,scanning_charge)
    if ((rate == 0) || (total_weight == 0)) {
      this.valForm.controls['weight_amount'].setValue('0.00')
    }
    else {
      var wtamt = rate * total_weight
      this.valForm.controls['weight_amount'].setValue(wtamt.toFixed(2))
    }
    // this.valForm.controls['scaning_charge'].setValue((this.valForm.value.Master_scanning_charge * this.valForm.value['total_weight']).toFixed(2))
    // this.valForm.controls['packing_charge'].setValue((this.valForm.value['total_carton'] * this.packing_charge).toFixed(2))
  }

  pack_cal(value: any) {
    // console.log('pc', this.valForm.value['total_carton'], value.Master_packing_charge, this.packing_charge)
    // this.valForm.controls['packing_charge'].setValue((this.valForm.value['total_carton'] * value.Master_packing_charge).toFixed(2))
    // console.log('pc', this.valForm.value['packing_charge'])
    this.amountCal(this.valForm.value)
  }

  tax_cal() {
    this.valForm.controls['total_tax'].setValue(Number(this.valForm.value.bill_amount * this.valForm.value.tax / 100).toFixed(2))
    this.valForm.controls['net_amount'].setValue(Number(this.valForm.value.bill_amount) + Number(this.valForm.value.total_tax))
    this.amountCal(this.valForm.value)
  }

  Mul(total: any) {
    // console.log(total)
    this.valForm.controls['vat_amt'].setValue(Number(total.tot_val_amt).toFixed(2))
    this.valForm.controls['invoice_value'].setValue(Number(total.inv_value).toFixed(2))
    this.totItemCount = total.tot_item
    if (total.ins_item_status == "Y") {
      this.ctn_load = false
      //   this.get_carton(this.valForm.value.invoice_id)
    }
  }

  scanningCal(Master_scanning_charge: any, value: any) {
    // console.log(value)
    this.valForm.controls['scaning_charge'].setValue((Number(Master_scanning_charge) * this.valForm.value['total_weight']).toFixed(2))
    this.amountCal(value)
  }

  billCal(Master_bill_charge: any, value: any) {
    this.bill_charge_view = Master_bill_charge
    this.valForm.controls['bill_charge'].setValue(Master_bill_charge)
    this.amountCal(value)
  }

  recAmt(value: any) {
    // console.log(value)
    this.valForm.controls['received_amount'].setValue(value)
  }

  // --------------------------------------------------------Calculation--------------------------------------

  // --------------------------------------------------------Validation--------------------------------------

  get_receiver_kyc_len(value: any) {
    // console.log('kll',value)
    for (let i = 0; i < this.receiver_kyc_type.length; i++) {

      if (this.receiver_kyc_type[i].KYC_id_type == value) {

        this.receiver_kyc_length = this.receiver_kyc_type[i].kyc_id_length
        // console.log('kll', value, this.receiver_kyc_type[i].kyc_id_length)
      }


    }
  }
  sen_mob_val(value: any) {
    if (value.sender_mobile_no != this.sen_mobilelength) {
      this.coloredToast("warning", "Enter " + this.sen_mobilelength + " Digit No")
      this.F_SEP.nativeElement.focus();
    }
  }
  sen_ph_val(value: any) {

    if (value.sender_phone_no != this.sen_mobilelength) {
      this.coloredToast("warning", "Enter " + this.sen_mobilelength + " Digit No")
      this.F_SEM.nativeElement.focus();
    }
  }
  get_sender_kyc_len(value: any) {
    for (let i = 0; i < this.sender_kyc_type.length; i++) {
      if (this.sender_kyc_type[i].KYC_id_type == value) {
        this.sender_kyc_length = this.sender_kyc_type[i].kyc_id_length
      }

    }
  }

  // --------------------------------------------------------Validation--------------------------------------
  // --------------------------------------------------------Get List--------------------------------------

  get_country_list() {
    this.service.get_country().subscribe(data => {
      this.country = data['data']
      this.valForm.controls['origin_country'].setValue(this.country_id);
      this.valForm.controls['des_country'].setValue("IN");

      for (let i = 0; i < this.country.length; i++) {
        if (this.country[i].country_code == "IN") {
          // this.get_reciever(this.country[i].country_code)
          // this.get_opfac(this.country[i].country_code)
          this.get_region(this.country[i].country_code)
          this.get_receiver_kyc_type(this.country[i].country_code)
        }
      }
      for (let i = 0; i < this.country.length; i++) {
        if (this.country[i].country_name == this.country_name) {
          this.valForm.controls['sender_mobile_code'].setValue(this.country[i].phone_isd_code);
          this.valForm.controls['sender_phone_code'].setValue(this.country[i].phone_isd_code);
          this.sen_mobilelength = this.country[i].phone_no_length
        }
      }
      var value = {
        origin_country: this.country_id
      }
    })
  }
  get_currency() {
    this.service.get_currency().subscribe(data => {
      this.currency = data['data']
    })
  }
  forign_currency() {
    this.service.get_forign_currency_by_country_code(this.country_id).subscribe(res => {
      this.currency_code = res['data'][0]['currency_symbol']
      this.currency_code_inv = res['data'][0]['currency_symbol']
      this.valForm.controls['inv_currency'].setValue(res['data'][0]['currency_prefix'])
      this.valForm.controls['bill_currency'].setValue(res['data'][0]['currency_prefix'])
    })
  }
  inv_currency_change(val: any) {
    this.currency_code_inv = val
  }
  bill_currency_change(val: any) {
    this.currency_code = val
  }
  get_transit() {
    this.service.get_transit_type().subscribe(data => {
      this.transit = data['data']
      this.valForm.controls['transit_type'].setValue(this.transit[0].transit_type_code);
      this.valForm.controls['transit_type_name'].setValue(this.transit[0].transit_type_code);
      this.get_service(this.transit[0].transit_type_code)
    })
  }
  get_opfac(value: any) {
    this.service.get_operation_By_Country_Id(value.des_country, value.region_id).subscribe(data => {
      this.opfac = data['data']
      if (data['code'] == 200) {
        this.valForm.controls['opfac_to'].setValue(this.opfac[0].operational_area_id)
        this.max_op_wgt = this.opfac[0].weight_limit_in_kg
        this.max_op_inv = this.opfac[0].item_amount_limit
      }
    })
  }

  opfac_wgt_set(opfac_id: any) {
    for (let i1 = 0; i1 < this.opfac.length; i1++) {
      if (this.opfac[i1].operational_area_id == opfac_id) {
        this.max_op_wgt = this.opfac[i1].weight_limit_in_kg
      }
    }
  }

  get_type_list() {
    this.service.get_type().subscribe(data => {
      this.type = data['data']
    })
  }
  get_doc_type() {
    this.service.get_doc_type().subscribe(data => {
      this.shipment = data['data']
      this.valForm.controls['shipment_type'].setValue(this.shipment[1].document_type_name);
      for (let i = 0; i < this.shipment.length; i++) {
        if (this.shipment[i].shipment_type_code == 'NON DOCUMENTS') {
          this.valForm.controls['shipment_type'].setValue(this.shipment[i].shipment_type_name)
        }
      }
    })
  }
  get_item_name() {
    this.service.get_Custom_Itemname().subscribe(data => {
      this.item = data['data']
    })
  }
  get_sender_kyc_type() {
    this.service.get_customer_kyc(this.country_id).subscribe(data => {
      this.sender_kyc_type = data['data']
      this.valForm.controls['sender_kyc_type'].setValue(this.sender_kyc_type[0].KYC_id_type)
      this.sender_kyc_length = this.sender_kyc_type[0].kyc_id_length

    })
  }
  get_region(value: any) {
    this.region = [];
    this.service.get_Region_By_Country_Id(value).subscribe(data => {
      this.region = data['data']
      this.valForm.controls['region_id'].setValue("")

      for (let i = 0; i < this.country.length; i++) {
        if (this.country[i].country_code == value) {

          this.valForm.controls['receiver_phone_code'].setValue(this.country[i].phone_isd_code);
          this.valForm.controls['receiver_mobile_code'].setValue(this.country[i].phone_isd_code);
          this.rec_mobilelength = this.country[i].phone_no_length
        }
      }
      this.get_receiver_kyc_type(value)
      this.get_sender_kyc_type()
    })
  }
  get_agent() {
    this.service.SP_M_Ba_Booking_Agent_By_Branch(this.v_location_id).subscribe(data => {
      this.agent = data['data']
      this.valForm.controls['agent'].setValue("");
    })
  }
  get_service(code: any) {
    this.service.get_service_type(code).subscribe(data => {
      this.service_type = data['data']
      if (data['data'].length != 0) {
        // this.get_awb_no(this.service_type[0].service_type_code.substring(0, 2))
        this.valForm.controls['service_type'].setValue('-1');
      }
    })
  }
  get_awb_no(tr: any) {
    this.service.get_awb_no(this.pointid).subscribe(data => {
      if (data['code'] == '200') {
        if (this.invoice_id == "" || this.invoice_id == undefined || this.invoice_id == null) {
          this.awb_no = this.point_code_pefix + data['data'][0].awb_no_series
          this.valForm.controls['awbno'].setValue(this.awb_no);
          this.valForm.controls['awbno_series'].setValue(data['data'][0].awb_no_series);
          this.old_no = data['data'][0].awb_no_series
        }
        else {
          this.awb_no = this.point_code_pefix + this.old_no
          this.valForm.controls['awbno'].setValue(this.awb_no);
        }
      }
      else {
        this._awbAllocation.open()
      }
    })
  }
  get_destination() {
    this.service.get_destination().subscribe(data => {
      this.destination = data['data']
    })
  }
  get_state(value: any) {

    this.service2.get_statebycid(value).subscribe(data => {
      this.state = data['data']
    })
  }
  get_rate(value: any) {
    this.holidayslength = 0

    if (value.transit_type != "" && value.region_id != "") {
      this.get_opfac(value)
      this.service.get_rate_date(this.pointid, value.region_id, value.service_type, value.agent).subscribe(data => {
        if (data['data']) {
          this.rate = data['data'][0]
          this.valForm.controls['invoice_date'].setValue(this.rate['cur_date'].split(" ")[0]);
          this.valForm.controls['exp_date'].setValue(this.rate['exp_date']);
          this.valForm.controls['scaning_charge'].setValue(this.rate['scaning_charge']);
        //   this.master_scaning_charge = this.rate['scaning_charge']
        //   this.master_packing_charge = this.rate['packing_charge']
        //   this.valForm.controls['Master_packing_charge'].setValue(this.rate['packing_charge']);
        //   this.valForm.controls['Master_scanning_charge'].setValue(this.rate['scaning_charge']);

          if (this.valForm.value['total_weight'] != 0) {
            this.valForm.controls['bill_charge'].setValue(this.rate['insurance_charge']);
            this.master_bill_charge = this.rate['insurance_charge']
          }
          this.valForm.controls['Master_bill_charge'].setValue(this.rate['insurance_charge']);
          this.bill_charge_view = this.rate['insurance_charge']
          value.bill_charge = this.rate['insurance_charge']
        //   this.valForm.controls['packing_charge'].setValue(this.rate['packing_charge']);
        //   this.packing_charge = this.rate['packing_charge']
          this.valForm.controls['rate'].setValue(this.rate['rate_per_kg']);
          this.valuepercent = this.rate['value_present']
          value.rate = this.rate['rate_per_kg']
        //   value.packing_charge = this.rate['packing_charge'] * this.valForm.value.total_carton
          value.scaning_charge = this.rate['scaning_charge'] * this.valForm.value.total_weight
          var dat = new Date(this.rate['exp_date'])
          dat.setDate(dat.getDate() + this.holidayslength);
          var dat2 = dat
          this.valForm.controls['exp_date'].setValue(this.datep.transform(dat2, 'dd-MM-yyyy'));
          let currentDate = new Date(this.rate['exp_date']);
          let dateSent = new Date(this.rate['cur_date']);
          this.del_days = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24))
          this.wtamtcal(this.rate['rate_per_kg'], this.valForm.value['total_weight'], this.rate['scaning_charge'])
          this.amountCal(value)
        }
        else {
          this.showAlert()
          this.valForm.controls['invoice_date'].setValue(this.datep.transform(new Date(), 'yyyy-MM-dd'))
          this.valForm.controls['exp_date'].setValue("");
          this.valForm.controls['scaning_charge'].setValue("0.00");
          this.valForm.controls['bill_charge'].setValue("0.00");
          this.valForm.controls['weight_amount'].setValue("0.00");
          this.valForm.controls['bill_amount'].setValue("0.00");
          this.valForm.controls['net_amount'].setValue("0.00");
          this.valForm.controls['balance_amount'].setValue("0.00");
          this.valForm.controls['packing_charge'].setValue("0.00");
          this.valForm.controls['rate'].setValue("0.00");
          this.packing_charge = 0
          this.valuepercent = "0"
          this.del_days = 0
        }

        this.service.get_holiday(this.pointid, value.region_id, value.service_type).subscribe(data => {
          this.holidays = data['data']
          if (data['code'] == "200") {
            this.holidayslength = this.holidays.length
            this.valForm.controls['holidays'].setValue(this.holidayslength);
          }
        })
      },
        error => {
          this.coloredToast("danger", "error")
        })
    }

  }
  transit_id(value: any) {
    for (let i = 0; i < this.service_type.length; i++) {
      if (this.service_type[i].service_type_id == value.service_type) {
        var service_type_code = this.service_type[i].service_type_code
      }
    }
    this.valForm.controls['service_type'].setValue(value.service_type);
    // this.get_awb_no(service_type_code.substring(0, 2))
  }

  //----------------------------------------------------Get Master-----------------------------

  //-----------------------------------------------Network master Details-----------------------------
  get_pin(off: any) {
    for (let i = 0; i < this.pooffice.length; i++) {
      if (this.pooffice[i].officename == off) {
        this.valForm.controls['receiver_pincode'].setValue(this.pooffice[i].pincode)
      }
    }
  }

  getDetailsbypin(value: any) {
    this.pincodetails = []
    if (this.valForm.value.region_id == "" || this.valForm.value.region_id == undefined) {
      this.coloredToast("warning", "Please Select Region")
      this.F_REG.nativeElement.focus();
    }
    else {
      this.service.get_details_by_pincode(value).subscribe(data => {
        this.pincodetails = data['data']
        if (this.pincodetails.length !== 0) {
          var pin_filter = this.region_wise_pin_search(this.pincodetails[0]['delivery_state_id'])
          // if(pin_filter == undefined)
          // {
          //   this.toastr.errorToastr('Pincode Not belongs to Region')
          // }
          // else
          // {
          this.pincodep.open()
          // }
        }
        else {
          this.F_RST.nativeElement.focus()
        }
      })
    }
  }

  region_wise_pin_search(data: any) {
    for (var i = 0; i < this.state.length; i++) {
      if (this.state[i].delivery_state_id == data) {
        return this.state[i].delivery_state_id;
      }
    }
  }

  get_district(value: any) {


    for (let i = 0; i < this.state.length; i++) {
      if (this.state[i].state_name == value) {
        var stateid = this.state[i].delivery_state_id
        this.valForm.controls['delivery_state_id'].setValue(stateid)
      }
    }
    if (stateid == "" && stateid == null) {
      stateid = value
    }
    this.service2.get_district_by_state(stateid).subscribe(data => {
      this.district = data['data']
      if (data['code'] = "200") {
        // this.valForm.controls['receiver_taluk'].setValue("");
        if (this.rec_btn == '1') {
          this.get_taluk(this.receiver_sec[0].customer_city_district)
        }
      }
    })
  }

  get_taluk(value: any) {
    for (let i = 0; i < this.district.length; i++) {
      if (this.district[i].district_name == value) {
        var dis_id = this.district[i].district_id
      }
    }
    if (dis_id == "" || dis_id == null) {
      dis_id = value
    }
    // console.log("dist",value,dis_id,this.receiver_sec[0]['talukName'])
    this.service2.get_taluk(dis_id).subscribe(data => {
      this.taluk = data['data']
      if (data['code'] == "200") {
        // this.valForm.controls['postoffice'].setValue("")
        if (this.rec_btn == '1') {
          this.valForm.controls['receiver_taluk'].setValue(this.receiver_sec[0]['talukName']);
          this.get_po(this.receiver_sec[0].customer_taluk_area)
        }
      }
    })
  }

  get_po(value: any) {
    for (let i = 0; i < this.taluk.length; i++) {
      if (this.taluk[i].taluk_name == value) {
        var tal_id = this.taluk[i].taluk_id
      }
    }
    if (tal_id == "" || tal_id == null) {
      tal_id = value
    }
    // console.log("tal",value,tal_id)
    this.service2.get_PoOffice(tal_id).subscribe(data => {
      this.pooffice = data['data']
      this.rec_btn = '0'
    })
  }

  pincodepopupassign(pincode_details: any) {
    this.F_RMA.nativeElement.focus()

    this.valForm.controls['receiver_state'].setValue(pincode_details['statename']);
    this.valForm.controls['delivery_state_id'].setValue(pincode_details['delivery_state_id']);
    this.service2.get_district_by_state(pincode_details['delivery_state_id']).subscribe(data => {
      this.district = data['data']
      if (data['code'] = "200") {
        this.valForm.controls['receiver_district_name'].setValue(pincode_details['Districtname']);
        // console.log("data['district_id']",data['district_id'])
        this.service2.get_taluk(pincode_details['district_id']).subscribe(data => {
          this.taluk = data['data']
          if (data['code'] == "200") {
            this.valForm.controls['receiver_taluk'].setValue(pincode_details['Taluk']);
            this.service2.get_PoOffice(pincode_details['taluk_id']).subscribe(data => {
              this.pooffice = data['data']
              this.valForm.controls['postoffice'].setValue(pincode_details['officename']);
            })
          }
        })
      }
    })

    this.pincodep.close()
  }
  close_pincodep() {
    this.pincodep.close()
  }

  reset_network_state() {
    this.valForm.controls['receiver_district_name'].setValue("");
    this.valForm.controls['postoffice'].setValue("");
    this.valForm.controls['receiver_taluk'].setValue("");
  }
  reset_network_region() {
    this.valForm.controls['receiver_district_name'].setValue("");
    this.valForm.controls['postoffice'].setValue("");
    this.valForm.controls['receiver_taluk'].setValue("");
    this.valForm.controls['receiver_state'].setValue("");
  }
  //-----------------------------------------------Network master Details-----------------------------

  //-----------------------------------------------search popup Details-----------------------------

  // get_sender(value: any) {
  //   this.service.get_customer_By_Country_Id(value).subscribe(data => {
  //     this.sender = data['data']
  //   })
  // }

  // get_reciever(value: any) {
  //   if (value != '-1') {
  //     for (var i = 0; i < this.country.length; i++) {
  //       if (value == this.country[i].country_name) {
  //         var ans = this.country[i].country_code
  //         this.valForm.controls['des_country'].setValue(ans);
  //       }

  //     }
  //   }
  //   this.service.get_customer_By_Country_Id(value).subscribe(data => {
  //     this.receiver = data['data']
  //   })
  // }

  get_receiver_kyc_type(value: any) {
    this.service.get_customer_kyc(value).subscribe(data => {
      this.receiver_kyc_type = data['data']
      this.valForm.controls['receiver_kyc_type'].setValue(this.receiver_kyc_type[0].KYC_id_type)
      this.receiver_kyc_length = this.receiver_kyc_type[0].kyc_id_length
    })
  }

  close_searpop() {
    this.searpop.close()
  }

  receiver_assign(value: any) {
    for (var i = 0; i < this.receiver.length; i++) {
      if (value.reciever_search_id == this.receiver[i].customer_name) {
        var search_id = this.receiver[i].customer_id
      }
    }
    // console.log('val', value)
    this.service.get_customer_search(search_id, "").subscribe(data => {
      var recieverasign = data['data'][0]
      this.get_district(recieverasign['state_id'])
      this.valForm.controls['receiver_name'].setValue(recieverasign.customer_name)
      this.valForm.controls['receiver_address'].setValue(recieverasign['customer_address']);
      this.valForm.controls['receiver_state'].setValue(recieverasign['state_id']);
      this.valForm.controls['receiver_phone'].setValue(recieverasign['customer_phone_no']);
      this.valForm.controls['receiver_mobile'].setValue(recieverasign['customer_mobile_no']);
      this.valForm.controls['receiver_district'].setValue(recieverasign['customer_district']);
      this.valForm.controls['receiver_district_name'].setValue(recieverasign['districtID']);
      this.valForm.controls['receiver_city'].setValue(recieverasign['customer_city']);
      this.valForm.controls['receiver_mail'].setValue(recieverasign['customer_emailId']);
    })
  }
  close_receiverp() {
    this.receiverp.close();
    this.renfocus()
  }
  sen_id_val(value: any) {
    if (value && value.length != this.sender_kyc_length) {
      this.coloredToast("warning", "Enter " + this.sender_kyc_length + " Digit no")
    }
    else if (value == null) {
      this.F_SEN.nativeElement.focus()
    }
    else {
      this.getCustomerSearch(value, -1, -1, 0, 50)
    }
  }
  next_cus(id: any) {
    if (id == "S") {
      var end = 1 * this.start_sr + 50
      this.getCustomerSearch(-1, -1, -1, this.start_sr, end)
      this.start_sr = end
    }
    else if (id == "R") {
      var end = 1 * this.start_sr + 50
      this.getCustomerSearch_rec(-1, -1, -1, this.start_sr, end)
      this.start_sr = end
    }
  }
  pre_cus(id: any) {
    if (id == "S") {
      this.start_sr = this.start_sr - 100
      var end = this.start_sr + 50
      this.getCustomerSearch(-1, -1, -1, this.start_sr, end)
      this.start_sr += 50
    }
    if (id == "R") {
      this.start_sr = this.start_sr - 100
      var end = this.start_sr + 50
      this.getCustomerSearch_rec(-1, -1, -1, this.start_sr, end)
      this.start_sr += 50
    }
  }
  getCustomerSearch(s_id: any, name: any, mob: any, start: any, end: any) {
    this.service.get_customer_search_new(s_id, name, this.country_id, mob, start, end).subscribe(res => {
      this.customer_search = res['data']
      if (this.customer_search.length < 50) {
        this.nxt_action = 1
      }
      else {
        this.nxt_action = 2
      }
      if (this.customer_search && this.customer_search.length != 0) {
        this.searpop.open()
        // this.changeTableRowColor_sender(0)
      }
      else {
        this.valForm.controls['sender_name'].setValue("");
        this.valForm.controls['sender_address'].setValue(this.v_point_code);
        this.valForm.controls['sender_phone_no'].setValue("");
        this.valForm.controls['sender_mobile_no'].setValue("");
        this.valForm.controls['sender_city'].setValue(this.v_point_name);
        this.valForm.controls['search_id'].setValue(this.valForm.value['search_id']);
        this.valForm.controls['sender_mail'].setValue("");
        this.sender_credit = ""
        this.F_SEN.nativeElement.focus()
      }
    })
  }
  rec_id_val(value: any) {
    if (value && this.receiver_kyc_length != null && value.length != this.receiver_kyc_length) {
      this.coloredToast("warning", "Enter " + this.receiver_kyc_length + " Digit no")
    }
    else if (value == null) {
      this.coloredToast("warning", this.valForm.value.receiver_kyc_type + "is Required")
      this.F_RID.nativeElement.focus()
    }
    else {
      this.getCustomerSearch_rec(value, -1, -1, 0, 50)
    }

  }
  getCustomerSearch_rec(rec_id: any, mob: any, name: any, start: any, end: any) {
    this.rec_btn = '1'
    this.service.get_customer_search_new(rec_id, name, this.valForm.value.des_country, mob, start, end).subscribe(res => {
      this.customer_search_rec = res['data']
      if (this.customer_search_rec.length < 50) {
        this.nxt_action = 1
      }
      else {
        this.nxt_action = 2
      }
      if (this.customer_search_rec && this.customer_search_rec.length != 0) {
        this.searrecpop.open()
      }
      else {
        this.F_REN.nativeElement.focus()
        // console.log('else');
        this.valForm.controls['receiver_name'].setValue("")
        this.valForm.controls['receiver_address'].setValue("");
        this.valForm.controls['receiver_state'].setValue("");
        this.valForm.controls['receiver_district'].setValue("");
        this.valForm.controls['receiver_district_name'].setValue("");
        this.valForm.controls['receiver_pincode'].setValue("");
        this.valForm.controls['receiver_mail'].setValue("");
        this.valForm.controls['receiver_taluk'].setValue("");
        this.valForm.controls['postoffice'].setValue("");
      }

    })
  }
  get_sender_search(value: any) {
    value.search_mobile = "";
    this.service.get_customer_search_id(value.customer_id).subscribe(data => {
      this.sender_sec = data['data']

      if (this.sender_sec != undefined) {
        this.valForm.controls['sender_name'].setValue(this.sender_sec[0]['customer_name']);
        this.valForm.controls['sender_address'].setValue(this.sender_sec[0]['customer_address']);
        this.valForm.controls['sender_mobile_no'].setValue(this.sender_sec[0]['customer_mobile_no']);
        this.valForm.controls['sender_phone_no'].setValue(this.sender_sec[0]['customer_phone_no']);
        this.valForm.controls['sender_city'].setValue(this.sender_sec[0]['customer_city_district']);
        this.valForm.controls['search_id'].setValue(this.sender_sec[0]['customer_id']);
        this.valForm.controls['sender_mail'].setValue(this.sender_sec[0]['customer_emailId']);
        this.sender_credit = this.sender_sec[0]['credit_point']
        this.searpop.close()
        this.send_based_rec_F.nativeElement.focus()
      }
      else {
        this.cmofocus()
        this.valForm.controls['sender_name'].setValue("");
        this.valForm.controls['sender_address'].setValue(this.v_point_code);
        this.valForm.controls['sender_phone_no'].setValue("");
        this.valForm.controls['sender_mobile_no'].setValue("");
        this.valForm.controls['sender_city'].setValue(this.v_point_name);
        this.valForm.controls['search_id'].setValue(this.valForm.value['search_id']);
        this.valForm.controls['sender_mail'].setValue("");
        this.sender_credit = ""
      }
    })
  }
  get_receiver_search(value: any) {
    value.search_mobile = "";
    this.service.get_customer_search_id(value.customer_id).subscribe(data => {
      this.receiver_sec = data.data
      if (this.receiver_sec != undefined) {
        var check = this.region_wise_pin_search(this.receiver_sec[0].state_id)
        if (check) {
          this.get_district(this.receiver_sec[0].state_name)
          this.valForm.controls['receiver_name'].setValue(this.receiver_sec[0]['customer_name'])
          this.valForm.controls['receiver_id'].setValue(this.receiver_sec[0]['customer_id'])
          this.valForm.controls['receiver_address'].setValue(this.receiver_sec[0]['customer_address']);
          this.valForm.controls['receiver_state'].setValue(this.receiver_sec[0]['state_name']);
          this.valForm.controls['receiver_district_name'].setValue(this.receiver_sec[0]['districtName']);
          this.valForm.controls['receiver_pincode'].setValue(this.receiver_sec[0]['customer_pincode']);
          this.valForm.controls['receiver_mail'].setValue(this.receiver_sec[0]['customer_emailId']);
          this.valForm.controls['receiver_taluk'].setValue(this.receiver_sec[0]['customer_taluk_area']);
          this.valForm.controls['postoffice'].setValue(this.receiver_sec[0]['customer_postoffice']);
          this.valForm.controls['receiver_mobile_no'].setValue(this.receiver_sec[0]['customer_mobile_no']);
          this.valForm.controls['receiver_phone_no'].setValue(this.receiver_sec[0]['customer_phone_no']);
        }
        else {
          this.coloredToast("warning", 'Selected customer state is not belongs to the Region')
          this.valForm.controls['receiver_name'].setValue("")
          this.valForm.controls['receiver_address'].setValue("");
          this.valForm.controls['receiver_state'].setValue("");
          this.valForm.controls['receiver_district'].setValue("");
          this.valForm.controls['receiver_district_name'].setValue("");
          this.valForm.controls['receiver_pincode'].setValue("");
          this.valForm.controls['receiver_mail'].setValue("");
          this.valForm.controls['receiver_taluk'].setValue("");
          this.valForm.controls['postoffice'].setValue("");
        }
        this.searrecpop.close()
      }
      else {
        this.valForm.controls['receiver_name'].setValue("")
        this.valForm.controls['receiver_address'].setValue("");
        this.valForm.controls['receiver_state'].setValue("");
        this.valForm.controls['receiver_district'].setValue("");
        this.valForm.controls['receiver_district_name'].setValue("");
        this.valForm.controls['receiver_pincode'].setValue("");
        this.valForm.controls['receiver_mail'].setValue("");
        this.valForm.controls['receiver_taluk'].setValue("");
        this.valForm.controls['postoffice'].setValue("");
      }
    })

  }
  receiverpopup(search_id: any, region_id: any) {
    if (search_id == null || search_id == "") {

    }
    else {
      this.service.get_receiver_popup(search_id, region_id).subscribe(data => {
        this.recpopupdata = data.data
        if (data['code'] == 200) {
          this.recpopupdata_length = this.recpopupdata.length
        }
        else {
          this.recpopupdata_length = 0
        }
      })
    }

  }
  senderBasedRecevierShow() {
    this.receiverp.open();
  }

  receiverpopupassign(recieverasign: any) {
    this.F_RMA.nativeElement.focus()
    this.service2.get_district_by_state(recieverasign['delivery_state_id']).subscribe(data => {
      this.district = data['data']
      if (data['code'] = "200") {
        this.valForm.controls['receiver_district_name'].setValue(recieverasign['receiver_district_name']);
        this.service2.get_taluk(recieverasign['districtID']).subscribe(data => {
          this.taluk = data['data']
          if (data['code'] == "200") {
            this.valForm.controls['receiver_taluk'].setValue(recieverasign['receiver_talk_name']);
            this.service2.get_PoOffice(recieverasign['receiver_talk_id']).subscribe(data => {
              this.pooffice = data['data']
              this.valForm.controls['postoffice'].setValue(recieverasign['receiver_post_office']);
            })
          }
        })
      }
    })

    if (recieverasign['receiver_phone'].indexOf(',') > -1) {
      var ph = recieverasign['receiver_phone'].split(',')
      this.valForm.controls['receiver_phone_code'].setValue(ph[0]);
      this.valForm.controls['receiver_phone_no'].setValue(ph[1]);
    }
    else {
      this.valForm.controls['receiver_phone_no'].setValue(recieverasign['receiver_phone']);
    }
    if (recieverasign['receiver_mobile'].indexOf(',') > -1) {
      var mo = recieverasign['receiver_mobile'].split(',')
      this.valForm.controls['receiver_mobile_code'].setValue(mo[0]);
      this.valForm.controls['receiver_mobile_no'].setValue(mo[1]);
    }
    else {
      this.valForm.controls['receiver_mobile_no'].setValue(recieverasign['receiver_mobile']);

    }
    this.valForm.controls['receiver_name'].setValue(recieverasign.receiver_name)
    this.valForm.controls['receiver_id'].setValue(recieverasign.receiver_id)
    this.valForm.controls['receiver_address'].setValue(recieverasign['receiver_address']);
    this.valForm.controls['receiver_state'].setValue(recieverasign['deleivery_sate_name']);
    this.valForm.controls['delivery_state_id'].setValue(recieverasign['delivery_state_id']);
    this.valForm.controls['receiver_district_name'].setValue(recieverasign['receiver_district_name']);
    this.valForm.controls['receiver_pincode'].setValue(recieverasign['receiver_pincode']);
    this.valForm.controls['receiver_mail'].setValue(recieverasign['receiver_email']);

    this.valForm.controls['receiver_taluk'].setValue(recieverasign['receiver_talk_name']);
    this.valForm.controls['postoffice'].setValue(recieverasign['receiver_post_office']);
    // this.valForm.controls['receiver_mail'].setValue(recieverasign['receiver_email']);
    this.close_receiverp()
    // this.itefocus()
    this.F_RMA.nativeElement.focus()
  }

  close_recpop() {
    this.searrecpop.close()
  }

  //-----------------------------------------------search popup Details-----------------------------

//-----------------------------------------------HAWB Insert & Update-----------------------------

update_hawb() {
    if (this.view_modify == "modify") {
      for (let c in this.valForm.controls) {
        this.valForm.controls[c].markAsTouched();
      }
      if (this.awb_no) {
        this.print_awb = this.awb_no
      }

      // console.log("ok", this.valForm)
    //   if (this.valForm.value.refernece_no == "" || this.valForm.value.refernece_no == null || this.valForm.value.refernece_no == undefined) {
    //     this.toastr.warningToastr("Please enter refference no")
    //     this.F_REF.nativeElement.focus();
    //   }
      if (this.valForm.value.region_id == "" || this.valForm.value.region_id == null || this.valForm.value.region_id == undefined) {
        this.coloredToast("warning", "Please enter region")
        this.F_REG.nativeElement.focus();
      }
      else if (this.valForm.value.sender_name == "" || this.valForm.value.sender_name == null || this.valForm.value.sender_name == undefined) {
        this.coloredToast("warning", "Please enter sender name")
        this.F_SEN.nativeElement.focus();
      }
      else if (this.valForm.value.sender_address == "" || this.valForm.value.sender_address == null || this.valForm.value.sender_address == undefined) {
        this.coloredToast("warning", "Please enter sender address")
        this.F_SEA.nativeElement.focus();
      }
      else if (this.valForm.value.sender_mobile_no == "" || this.valForm.value.sender_mobile_no == null || this.valForm.value.sender_mobile_no == undefined) {
        this.coloredToast("warning", "Please enter Sender Mobile No")
        this.F_SEP.nativeElement.focus();
      }
      else if (this.valForm.value.receiver_name == "" || this.valForm.value.receiver_name == null || this.valForm.value.receiver_name == undefined) {
        this.coloredToast("warning", "Please enter receiver name")
        this.F_REN.nativeElement.focus();
      }
      else if (this.valForm.value.receiver_address == "" || this.valForm.value.receiver_address == null || this.valForm.value.receiver_address == undefined) {
        this.coloredToast("warning", "Please enter receiver adddress")
        this.F_RAD.nativeElement.focus();
      }
      else if (this.valForm.value.receiver_state == "" || this.valForm.value.receiver_state == null || this.valForm.value.receiver_state == undefined) {
        this.coloredToast("warning","Please enter receiver state")
        this.F_RST.nativeElement.focus();
      }
      else if (this.valForm.value.receiver_district_name == "" || this.valForm.value.receiver_district_name == null || this.valForm.value.receiver_district_name == undefined) {
        this.coloredToast("warning","Please enter receiver district")
        this.F_RDI.nativeElement.focus();
      }
      else if (this.valForm.value.receiver_mobile_no == "" || this.valForm.value.receiver_mobile_no == null || this.valForm.value.receiver_mobile_no == undefined) {
        this.coloredToast("warning","Please enter receiver mobile")
        this.F_REP.nativeElement.focus();
      }
      else if (this.valForm.value.opfac_to == "" || this.valForm.value.opfac_to == null || this.valForm.value.opfac_to == undefined) {
        this.coloredToast("warning","Please Select Opfac")
        // this.F_REP.nativeElement.focus();
      }
      else if (this.valForm.value.service_type == "" || this.valForm.value.service_type == null || this.valForm.value.service_type == undefined) {
        this.coloredToast("warning","Please Select Service Type")
        // this.F_REP.nativeElement.focus();
      }
      else if (this.valForm.value.shipment_type == "" || this.valForm.value.shipment_type == null || this.valForm.value.shipment_type == undefined) {
        this.coloredToast("warning","Please Select Shipment Type")
        // this.F_REP.nativeElement.focus();
      }
      else if (this.valForm.value.shipment_type == "" || this.valForm.value.shipment_type == null || this.valForm.value.shipment_type == undefined) {
        this.coloredToast("warning","Please Select Shipment Type")
        // this.F_REP.nativeElement.focus();
      }
      else {
        if (this.valForm.valid) {
          this.service.updatehawb(this.valForm.value).subscribe(res => {
            if (res['code'] == '200') {
              this.coloredToast("success",res['data'][0]['SUCCESS'])
              this.clickMe("status")
            }
            else {
              this.coloredToast("danger",res['data'][0]['@p2'])
            }
          })
        }
      }
    }
  }

  //-----------------------------------------------HAWB Insert & Update-----------------------------

  //-----------------------------------------------Carton Insert & Update-----------------------------

  add(data: string | any[]) {
    // console.log("add", data)
    this.carsum = 0;
    var value = data
    if (data) {
      for (let j = 0; j < data.length; j++) {
        this.carsum += Number(data[j].carton_weight);
      }
      this.valForm.controls['total_weight'].setValue((this.carsum).toFixed(2))
      this.valForm.controls['total_carton'].setValue(data.length)
      this.wtamtcal(this.valForm.value.rate, this.valForm.value['total_weight'], this.valForm.value.scaning_charge);
      this.amountCal(this.valForm.value)
    }
  }

  get_carton(value: any) {
    this.cartondetails = []
    if (this.carton_disp == '2') {
      if (this.view_modify == "modify") {
      this.service.get_carton_by_invoice(value).subscribe(data => {
        this.cartondetails = data['data']
        var carlen = this.cartondetails.length
        for (let index = 0; index < carlen; index++) {
          if (this.cartondetails[index]['carton_weight'] == 0 || this.cartondetails[index]['carton_weight'] == null) {
            // console.log("index", this.cartondetails[index].carton_no, this.cartondetails[index]['carton_weight'])
            this.valForm4.controls['carton_no'].setValue(this.cartondetails[index].carton_no);
            this.valForm4.controls['carton_id'].setValue(this.cartondetails[index].carton_id);
            index = carlen + 1
          }
          else
          {
            // this.tab9 = 'bill'
            // setTimeout(() => {
            //   this.BILL_F.nativeElement.focus()
            //   this.BILL_F.nativeElement.select()
            // }, 500);
          }
        }
        // console.log("this.valForm.controls['packing_charge']",this.valForm.value.packing_charge/this.valForm.value['total_carton'])
        this.packing_charge = Number(this.valForm.value.packing_charge/this.valForm.value['total_carton'])
        this.add(this.cartondetails)
        // this.F_CTWT.nativeElement.focus();
        var count = 0;
        for (let i = 0; i < this.cartondetails.length; i++) {
          if (this.cartondetails[i]['carton_weight'] > 0) {
            count += 1;
          }
        }
        if (count == this.cartondetails.length) {
          this.print_disp = '2'
        }
      })
    }
    else if(this.view_modify == "view")
    {
      this.service.get_carton_by_invoice(value).subscribe(data => {
        this.cartondetails = data['data']        
      })
    }
    }
    else {
      this.coloredToast("warning",'Please Fill HAWB Details')
    }
  }
  getItemType() {
    this.service.get_item_type().subscribe(data => {
      this.itemtype = data['data']
      this.valForm4.controls['ip_item_type'].setValue(this.itemtype[1].name)
    })
  }
  edit_car(value: { carton_weight: any; carton_no: any; carton_id: any; item_type: any; }) {
    this.select_wgt=value.carton_weight
    // console.log('va', value)
    this.valForm4.controls['carton_no'].setValue(value.carton_no)
    this.valForm4.controls['carton_id'].setValue(value.carton_id)
    this.valForm4.controls['weight'].setValue(value.carton_weight)
    this.valForm4.controls['ip_item_type'].setValue(value.item_type)
    this.F_PCA.nativeElement.focus();

  }

  submitForm4($ev: { preventDefault: () => void; }, value: any, value2: any) {
    if (this.view_modify == "modify") {
      $ev.preventDefault();
      for (let c in this.valForm4.controls) {
        this.valForm4.controls[c].markAsTouched();
      }
      if (this.valForm4.valid) {
        // console.log('Valid!', value ,this.carsum,this.select_wgt ,value.weight + (this.carsum - this.select_wgt),this.max_op_wgt);
        // if(value.weight + (this.carsum - this.select_wgt) <= this.max_op_wgt)
        // {
          this.service.insert_carton(value).subscribe(res => {
            if (res['code'] == "200") {
              this.get_carton(this.invoice_id)
              if (this.rate) {
                if (this.rate['scaning_charge']) this.valForm.controls['scaning_charge'].setValue(this.rate['scaning_charge']);
              }

              this.valForm4.controls['weight'].setValue("")
              this.valForm4.controls['ip_item_type'].setValue(this.itemtype[0].name)
              this.amountCal(this.valForm.value)
              this.F_CTWT.nativeElement.focus();
            }
          })
        // }
        // else{
        //   this.toastr.errorToastr('Carton Weight limit exceed','Change OPFAC or Carton Weight')
        // }
      }
      else {
        if(this.valForm.value.carton_no == "")
          {
            setTimeout(() => {
              this.cart_rem.nativeElement.focus()
              this.cart_rem.nativeElement.select()
            }, 500);
          }
        this.coloredToast("warning","Carton Weight Empty!")
      }
    }
  }
  get_cno(value: any) {
    // console.log('cn', value.carton_id)
    for (let index = 0; index < this.cartondetails.length; index++) {
      if (value.carton_id == this.cartondetails[index].carton_id) {
        value.carton_no = this.cartondetails[index].carton_no
      }
    }
    // console.log('cn', value.carton_id, value.carton_no)
  }
  delete_car(data: { carton_id: string; }) {
    // if (this.view_modify == "modify") {
    //   this.popupManager.open('Delete', 'Do you really want to this item?',
    //     {
    //       width: '300px',
    //       closeOnOverlay: false,
    //       animate: 'scale',
    //       actionButtons:
    //         [
    //           {
    //             text: 'Yes',
    //             buttonClasses: 'btn-ok',
    //             onAction: () => {
    //               this.service.delete_carton(data.carton_id).subscribe(res => {
    //                 if (res['code'] == '200') {
    //                   this.toastr.successToastr('Delete Success', 'Success');
    //                   this.get_carton(this.invoice_id);
    //                 }
    //                 else {
    //                   this.toastr.errorToastr('Carton Have Items Please delete Item', 'Failed');
    //                 }
    //               })
    //               return true;
    //             }
    //           },
    //           {
    //             text: 'No',
    //             buttonClasses: 'btn-cancel',
    //             onAction: () => {
    //               return false;
    //             }
    //           }
    //         ],
    //     });
    // }
  }
  carton_clear() {
    this.valForm4.value['weight'].setValue("")
  }
  //-----------------------------------------------Carton Insert & Update-----------------------------

  //-----------------------------------------------------Item Type------------------------------------

  getInvoiceWithItem()
  {
    this.service.get_InvItem_By_Inv(this.invoice_id).subscribe(data=>
      {
        this.invItemTypeList = data['data']
      })
  }
//   edit_ItemInv(list: { item_type: any; weight: any; hawb_item_id: any; hawb_id: any; })
//   {
//     this.invBtnSave = '1'
//     this.itemTypeForm.patchValue({
//       itemType:list.item_type,
//       wgt:list.weight,
//       itemId:list.hawb_item_id,
//       inv_id:list.hawb_id
//     })
//   }
//   insertItemType($ev: { preventDefault: () => void; },value: any)
//   {
//     $ev.preventDefault();
//       for (let c in this.itemTypeForm.controls) {
//         this.itemTypeForm.controls[c].markAsTouched();
//       }
//       if(this.itemTypeForm.value.itemType && this.itemTypeForm.value.wgt && this.itemTypeForm.value.rate)
//       {
//         this.service.insert_InvItem_By_Inv(value).subscribe(data=>{
//           if(data['code'] == '200')
//           {
//             this.getInvoiceWithItem()
//             this.itemTypeForm.patchValue({
//               wgt:"",
//               itemType:"",
//               itemId:""
//             })
//             this.invBtnSave = '2'
//             this.toastr.successToastr('Success')
//           }
//         })
//       }
//       else
//       {
//         this.toastr.errorToastr('Enter Mandadory Feilds')
//       }
//   }
//   cal(val: any){}
//   update_InvItem_By_Inv($ev: { preventDefault: () => void; },value: any)
//   {
//     $ev.preventDefault();
//       for (let c in this.itemTypeForm.controls) {
//         this.itemTypeForm.controls[c].markAsTouched();
//       }
//       if(this.itemTypeForm.value.itemType && this.itemTypeForm.value.wgt && this.itemTypeForm.value.rate)
//       {
//         this.service.update_InvItem_By_Inv(value).subscribe(data=>{
//           if(data['code'] == '200')
//           {
//             this.getInvoiceWithItem()
//             this.itemTypeForm.patchValue({
//               wgt:"",
//               itemType:"",
//               itemId:""
//             })
//             this.invBtnSave = '2'
//             this.toastr.successToastr('Success')
//           }
//         })
//       }
//       else
//       {
//         this.toastr.errorToastr('Enter Mandadory Feilds')
//       }
//   }
//   delete_ItemInv(data: { hawb_item_id: string; }) {
//     if (this.view_modify == "modify") {
//       this.popupManager.open('Delete', 'Do you really want to this item?',
//         {
//           width: '300px',
//           closeOnOverlay: false,
//           animate: 'scale',
//           actionButtons:
//             [
//               {
//                 text: 'Yes',
//                 buttonClasses: 'btn-ok',
//                 onAction: () => {
//                   this.service.delete_InvItem_By_Inv(data.hawb_item_id).subscribe(res => {
//                     if (res['code'] == '200') {
//                       this.getInvoiceWithItem()
//                         this.itemTypeForm.patchValue({
//                           wgt:"",
//                           itemType:"",
//                           itemId:""
//                         })
//                         this.invBtnSave = '2'
//                         this.toastr.successToastr('Success')
//                     }
//                     else {
//                       this.toastr.errorToastr('Failed');
//                     }
//                   })
//                   return true;
//                 }
//               },
//               {
//                 text: 'No',
//                 buttonClasses: 'btn-cancel',
//                 onAction: () => {
//                   return false;
//                 }
//               }
//             ],
//         });
//     }
//   }
  //-----------------------------------------------------Item Type------------------------------------

  //-----------------------------------------------------Dimension------------------------------------
  getDimension()
  {
    this.dimSave = '1'
    this.service.get_Dimension_By_Inv(this.invoice_no).subscribe(data=>
      {
        this.dimensionList = data['data']
      })
  }
  getcbmCal(l: number, w: number, h: number) {
    console.log(l, h, w)
    if (l > 0 && h > 0 && w > 0) {
      console.log(l, h, w)
      var cbmAmt: any = Number(l / 100) * Number(w / 100) * Number(h / 100)
    }
    this.dimensionForm.controls['cbm'].setValue(Number(cbmAmt).toFixed(3))
  }
  insertDimension($ev: { preventDefault: () => void; },value: any)
  {
    $ev.preventDefault();
      for (let c in this.dimensionForm.controls) {
        this.dimensionForm.controls[c].markAsTouched();
      }
      if(this.dimensionForm.valid)
      {
        this.service.insert_Dimension_By_Inv(value).subscribe(data=>{
          if(data['code'] == '200')
          {
            this.getDimension()
            this.dimSave = '1'
            this.coloredToast("warning",'Success')
          }
        })
      }
      else
      {
        this.coloredToast("warning",'Enter Mandadory Feilds')
      }
  }

  updateDimension($ev: { preventDefault: () => void; },value: any)
  {
    $ev.preventDefault();
      for (let c in this.dimensionForm.controls) {
        this.dimensionForm.controls[c].markAsTouched();
      }
      if(this.dimensionForm.valid)
      {
        this.service.update_Dimension_By_Inv(value).subscribe(data=>{
          if(data['code'] == '200')
          {
            this.getDimension()
            this.refresh()
            this.dimSave = '1'
            this.coloredToast("success",'Success')
          }
        })
      }
      else
      {
        this.coloredToast("warning",'Enter Mandadory Feilds')
      }
  }

  editDimension(data: { length: any; width: any; height: any; mawb_total_pcs: any; vol_weight: any; volumetric_id: any; carton_no: any; })
  {
    this.dimSave = '2'
    this.dimensionForm.patchValue({
      length:data.length,
      width:data.width,
      height:data.height,
      mawb_total_pcs:data.mawb_total_pcs,
      vol_radio:data.vol_weight,
      vol_id:data.volumetric_id,
      vol_weight:data.vol_weight,
      ctnNo:data.carton_no

    })
  }

  getBoxwiseWeight($ev: any, dim: any) {
    this.service.getBox_Amt(dim.length, dim.width, dim.height, this.valForm.value.region_id, this.valForm.value.service_type).subscribe(params => {
      if (params['code'] == 200) {
        var boxWgt = params['data'][0]
        this.dimensionForm.controls['boxAmt'].setValue(boxWgt.rate_per_kg)
        this.insertDimension($ev, dim)
      }
      else {
        this.insertDimension($ev, dim)
        this.dimensionForm.controls['boxAmt'].setValue(this.dimensionForm.value.boxAmt)
      }
    })
  }

  deleteDimension(data: { volumetric_id: string; }) {
    // if (this.view_modify == "modify") {
    //   this.popupManager.open('Delete', 'Do you really want to this item?',
    //     {
    //       width: '300px',
    //       closeOnOverlay: false,
    //       animate: 'scale',
    //       actionButtons:
    //         [
    //           {
    //             text: 'Yes',
    //             buttonClasses: 'btn-ok',
    //             onAction: () => {
    //               this.service.delete_Dimension_By_Inv(data.volumetric_id).subscribe(res => {
    //                 if (res['code'] == '200') {
    //                   this.getDimension()
    //                     this.dimSave = '1'
    //                     this.toastr.successToastr('Success')
    //                 }
    //                 else {
    //                   this.toastr.errorToastr('Failed');
    //                 }
    //               })
    //               return true;
    //             }
    //           },
    //           {
    //             text: 'No',
    //             buttonClasses: 'btn-cancel',
    //             onAction: () => {
    //               return false;
    //             }
    //           }
    //         ],
    //     });
    // }
  }
  refresh()
  {
    this.dimSave = '1'
    this.dimensionForm.patchValue({
      length:"",
      width:"",
      height:"",
      mawb_total_pcs:"",
      vol_radio:"",
      vol_id:"",
      vol_weight:"",
      ctnNo:""

    })
  }
  
  //-----------------------------------------------------Dimension------------------------------------
  
  imagepopup(value: any) {
    this.imagep.show();
  }
  imageview(value: string) {
    this.imagevalue = value
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + value);
  }

  resetandget() {
    this.dimSave = '1'
    this.valForm.reset();
    this.dimensionForm.reset();
    this.valForm4.reset()
    this.sender_active = true;
    this.recevier_active = false
    this.btn = '1'
    this.carton_disp = '1'
    this.print_disp = '1'
    this.valForm.controls['item_value'].setValue("0.00");
    this.valForm.controls['weight_charge'].setValue("0.00");
    this.valForm.controls['weight_amount'].setValue("0.00");
    this.valForm.controls['scaning_charge'].setValue("0.00");
    this.valForm.controls['bill_charge'].setValue("0.00");
    this.valForm.controls['extra_charge'].setValue("0.00");
    this.valForm.controls['discount'].setValue("0.00");
    this.valForm.controls['bill_amount'].setValue(0.00);
    this.valForm.controls['net_amount'].setValue("0.00");
    this.valForm.controls['booking_agent_commision'].setValue("0.00");
    this.valForm.controls['received_amount'].setValue("0.00");
    this.valForm.controls['balance_amount'].setValue("0.00");
    this.valForm.controls['region_rate'].setValue("0.00");
    this.valForm.controls['packing_charge'].setValue("0.00");
    this.valForm.controls['vat_amt'].setValue("0.00");
    this.valForm.controls['total_weight'].setValue("0.00");
    this.valForm.controls['preperedBy'].setValue(this.userid);
    this.valForm.controls['origin_id'].setValue(this.v_location_id);
    this.valForm.controls['origin_branch_id'].setValue(this.v_location_id);
    this.valForm.controls['belongs_to_point_id'].setValue(this.v_point_id);
    this.valForm.controls['created_by'].setValue(this.userid);
    this.valForm4.controls['user_id'].setValue(this.userid);
    this.valForm.controls['origin_country'].setValue(this.country_id);
    this.valForm.controls['point_id'].setValue(this.pointid);
    this.valForm.controls['sender_address'].setValue(this.v_point_code);
    this.valForm.controls['sender_city'].setValue(this.v_point_name);
    this.valForm.controls['sender_phone_code'].setValue(this.ph_code);
    this.valForm.controls['sender_mobile_code'].setValue(this.ph_code);
    this.valForm.controls['payment_mode'].setValue("CREDIT")
    // this.valForm.controls['autoawb'].setValue("auto")
    this.valForm.controls['des_country'].setValue("")
    // this.valForm.controls['destination_loc'].setValue("")
    this.valForm.controls['opfac_to'].setValue("")
    this.valForm.controls['region_id'].setValue("")

    this.valForm.controls['holidays'].setValue("0");
    this.valForm.controls['rate'].setValue("0.00");
    this.valForm.controls['max_wt'].setValue("0.00");
    this.valForm.controls['invoice_value'].setValue("0.00");
    this.valForm.controls['total_pcs'].setValue(0);
    this.valForm.controls['total_carton'].setValue(0);

    this.get_country_list()
    this.get_transit()
    this.getItemType()
    // this.get_currency()
    this.get_agent();
    this.get_doc_type()
    // this.get_destination()
    // this.get_sender('-1')
    // this.get_reciever('-1')
    this.sender_credit = ""
    localStorage.removeItem('item')
    localStorage.removeItem('carton')
    this.ItemArray = [];
    this.CartonArray = [];
    this.sav_btn = '1'
    this.ctn_load = true
  }
  
  ngOnInit() {
    this.btn = '2'
    this.carton_disp = '2'
    this.print_disp = '2'
    this.get_country_list()
    this.get_transit()
    this.get_agent()
    this.get_doc_type()
    this.getItemType()
    this.get_currency()
    this.get_invoice()
    // this.F_REF.nativeElement.focus();

  }
  clickMe(status: string) {
    if (this.view_modify == "modify") {
      if (this.valuepercent) { }
      else {
        this.valuepercent = 0.00
      }
      var data = {
        act_status: status,
        invoice_id: this.invoice_id,
        new_invoice_no: this.print_awb,
        valuepercent: this.valuepercent,
        mode: this.view_modify
      }
      this.service.sendClickEvent(data);
      if (status == 'carton') {
        setTimeout(() => {
          this.get_carton(this.valForm.value.invoice_id)
        }, 700);

      }
    }
    else if(this.view_modify == "view")
    {
      var data = {
        act_status: status,
        invoice_id: this.invoice_id,
        new_invoice_no: this.print_awb,
        valuepercent: this.valuepercent,
        mode: this.view_modify
      }
      this.service.sendClickEvent(data);
    }
  }


  get_invoice() {
    this.service.get_Hawb_Details(this.invoice_id).subscribe(data => {
      this.invoice_list = data['data'][0]
      // console.log("list", this.invoice_list)
      this.valForm.controls['total_carton'].setValue(this.invoice_list['total_carton']);
      this.valForm.controls['total_weight'].setValue(this.invoice_list['total_weight']);
      this.pointid = this.invoice_list['belongs_to_point_id']
      if (data['code'] == 200) {
        if(this.userdetails.v_user_type == "ADMIN")
        {
          this.agentBranch = this.invoice_list['origin_branch_id']
          this.valForm.controls['origin_branch_id'].setValue(this.invoice_list['origin_branch_id'])
          this.valForm.controls['origin_id'].setValue(this.invoice_list['origin_branch_id'])
          this.valForm.controls['belongs_to_point_id'].setValue(this.invoice_list['belongs_to_point_id'])
          this.get_agent()
        }
        this.bil_series = this.invoice_list['hawb_no'].slice(3)
        this.service.get_Invoice_Amount_Details(this.invoice_id).subscribe(bill_data => {
          if (bill_data['code'] == 200) {
            var amtList = bill_data['data'][0]
            this.valForm.controls['refernece_no'].setValue(this.invoice_list['reference_no']);
            this.service.get_Region_By_Country_Id(this.invoice_list['destination_country']).subscribe(data => {
              this.region = data['data']
              if (data['data']) {
                this.valForm.controls['region_id'].setValue(this.invoice_list['destination_region_id']);
                if (amtList['weight_charge'] == '' || amtList['weight_charge'] == "0.00") 
                {
                  setTimeout(() => {
                    this.get_rate(this.valForm.value)
                  }, 500);
                }
                else {
                  if (this.tot_wgt) {
                    var wgt_rate = Number(amtList['weight_charge']) / this.tot_wgt
                    this.valForm.controls['rate'].setValue(wgt_rate.toFixed(2));
                    this.valForm.controls['Master_scanning_charge'].setValue(Number(amtList['scaning_charge']) / Number(this.tot_wgt));
                    this.master_scaning_charge = (Number(amtList['scaning_charge']) / Number(this.tot_wgt)).toFixed(2)
                  }
                  if (this.tot_ctn) {
                    this.valForm.controls['Master_packing_charge'].setValue(Number(amtList['packing_charge']) / Number(this.tot_ctn));
                    this.master_bill_charge = (Number(amtList['bill_charge'])).toFixed(2)
                  }
                  
                  this.valForm.controls['vat_amt'].setValue(amtList['item_value']);
                  this.valForm.controls['weight_amount'].setValue(amtList['weight_charge']);
                  this.valForm.controls['scaning_charge'].setValue(amtList['scaning_charge']);
                  this.valForm.controls['Master_bill_charge'].setValue(amtList['bill_charge']);
                  this.valForm.controls['bill_charge'].setValue(amtList['bill_charge']);
                  this.valForm.controls['packing_charge'].setValue(amtList['packing_charge']);
                  this.packing_charge=Number(amtList['packing_charge']) / Number(this.tot_ctn)
                  this.valForm.controls['extra_charge'].setValue(amtList['extra_charge']);
                  this.valForm.controls['discount'].setValue(amtList['discount']);
                  this.valForm.controls['net_amount'].setValue(amtList['net_amount']);
                  this.valForm.controls['received_amount'].setValue(amtList['received_amount']);
                  this.valForm.controls['balance_amount'].setValue(Number(amtList['balance_amount']).toFixed(2));
                  this.valForm.controls['bill_amount'].setValue(amtList['bill_amount']);
                  this.valForm.controls['tax'].setValue(Number(amtList['total_tax_percentage']).toFixed(2));
                  this.valForm.controls['total_tax'].setValue(Number(amtList['total_tax_amount']).toFixed(2));
                  // console.log("ok",amtList['bill_charge'],this.valForm.value.bill_charge)
                  if(amtList['bill_charge'] == "0.00")
                  {
                    // console.log(amtList['bill_charge'],this.valForm.value.bill_charge)
                    this.valForm.controls['Master_bill_charge'].setValue(this.valForm.value.bill_charge);
                  }
                }
              }
            })
            this.valForm.controls['transit_type_name'].setValue(this.invoice_list['transit_type_id']);
            this.service.get_service_type(this.invoice_list['transit_type_id']).subscribe(data => {
              this.service_type = data['data']
              if (data['data']) {
                this.valForm.controls['service_type'].setValue(this.invoice_list['service_type']);
              }
            })
            this.service.get_operation_By_Country_Id(this.invoice_list['destination_country'], this.invoice_list['destination_region_id']).subscribe(data => {
              this.opfac = data['data']
              if (data['data']) {
                this.valForm.controls['opfac_to'].setValue(this.invoice_list['operational_facility_id']);
                this.opfac_wgt_set(this.invoice_list['operational_facility_id'])
              }
            })
            this.get_state(this.invoice_list['destination_region_id'])
            this.service2.get_district_by_state(this.invoice_list['delivery_state_id']).subscribe(data => {
              this.district = data['data']
              if (data['code'] = "200") {
                for (let i = 0; i < this.district.length; i++) {
                  if (this.district[i].district_name == this.invoice_list['receiver_district_name']) {
                    var dis_id = this.district[i].district_id
                  }
                }
                this.valForm.controls['receiver_district_name'].setValue(this.invoice_list['receiver_district_name']);
                this.service2.get_taluk(dis_id).subscribe(data => {
                  this.taluk = data['data']
                  if (data['code'] == "200") {
                    for (let i = 0; i < this.taluk.length; i++) {
                      if (this.taluk[i].taluk_name == this.invoice_list['receiver_taluk_name']) {
                        var tal_id = this.taluk[i].taluk_id
                      }
                    }
                    this.valForm.controls['receiver_taluk'].setValue(this.invoice_list['receiver_taluk_name']);
                    this.service2.get_PoOffice(tal_id).subscribe(data => {
                      this.pooffice = data['data']
                      this.valForm.controls['postoffice'].setValue(this.invoice_list['receiver_postoffice']);
                    })
                  }
                })
              }
            })
            this.valForm.controls['invoice_id'].setValue(this.invoice_list['hawb_id']);
            this.valForm.controls['awbno'].setValue(this.invoice_list['hawb_no']);
            this.valForm.controls['sender_name'].setValue(this.invoice_list['sender_name']);
            this.valForm.controls['sender_address'].setValue(this.invoice_list['sender_address']);
            this.valForm.controls['sender_phone_no'].setValue(this.invoice_list['sender_mobile_2']);
            this.valForm.controls['sender_mobile_no'].setValue(this.invoice_list['sender_mobile']);
            this.valForm.controls['delivery_state_id'].setValue(this.invoice_list['delivery_state_id']);
            this.valForm.controls['sender_city'].setValue(this.invoice_list['senderCity']);
            this.valForm.controls['search_id'].setValue(this.invoice_list['sender_id']);
            this.valForm.controls['sender_id'].setValue(this.invoice_list['sender_id']);
            this.valForm.controls['sender_mail'].setValue(this.invoice_list['sender_email']);
            this.valForm.controls['sender_pincode'].setValue(this.invoice_list['customer_pincode']);
            this.valForm.controls['sender_iqama_no'].setValue(this.invoice_list['sender_id']);
            this.valForm.controls['receiver_name'].setValue(this.invoice_list['receiver_name'])
            this.valForm.controls['receiver_address'].setValue(this.invoice_list['receiver_address']);
            this.valForm.controls['receiver_state'].setValue(this.invoice_list['receiver_state']);
            this.valForm.controls['receiver_phone_no'].setValue(this.invoice_list['receiver_phone']);
            this.valForm.controls['receiver_mobile_no'].setValue(this.invoice_list['receiver_mobile']);
            this.valForm.controls['receiver_pincode'].setValue(this.invoice_list['receiver_pincode']);
            this.valForm.controls['receiver_mail'].setValue(this.invoice_list['receiver_email']);
            this.valForm.controls['receiver_id'].setValue(this.invoice_list['receiver_id']);
            this.valForm.controls['des_country'].setValue(this.invoice_list['destination_country']);
            this.valForm.controls['invoice_date'].setValue(this.invoice_list['hawb_date']);
            // var dat = new Date(this.invoice_list['exp_date_of_delivery'])
            this.valForm.controls['exp_date'].setValue(this.invoice_list['exp_date_of_delivery']);
            this.valForm.controls['max_wt'].setValue(this.invoice_list['weight_limit_in_kg'])
            this.valForm.controls['agent'].setValue(this.invoice_list['booking_agent_id']);
            this.valForm.controls['invoice_value'].setValue(this.invoice_list['invoice_value']);
            this.valForm.controls['shipment_type'].setValue(this.invoice_list['document_type']);
            // var remark = this.invoice_list['invoice_remarks'].split(',')
            this.valForm.controls['pay_remarks'].setValue(this.invoice_list['invoice_remarks']);
            // this.valForm.controls['ctn_remarks'].setValue(remark[1]);
            this.valForm.controls['inv_currency'].setValue(this.invoice_list['invoice_currency']);
            this.currency_code_inv=this.invoice_list['invoice_currency']
            this.valForm.controls['bill_currency'].setValue(this.invoice_list['freight bill_currency']);
            this.tot_wgt = Number(this.invoice_list['total_weight'])
            this.tot_ctn = this.invoice_list['total_carton']
            for (let i = 0; i < this.country.length; i++) {
              if (this.country[i].country_code == this.invoice_list['destination_country']) {
                this.valForm.controls['receiver_mobile_code'].setValue(this.country[i].phone_isd_code);
                this.rec_mobilelength = this.country[i].phone_no_length
              }
            }
          }
        })
      }
    })

  }






  print(value: any) {
    this.printLoad=true
    this.update_hawb()
    this.service.update_Invoice_Amount_Details(this.valForm.value).subscribe(res => {
      if (res['code'] == 200) {
        if (this.valForm.value.total_weight > 0) {
          this.service.get_print(this.new_invoice_no, value, this.invoice_id).subscribe(data => {
            this.printLoad=false
            this.pdf_data = data
            window.open(data.file_url)
            this.print_awb = undefined
          },
          error=>
          {
            this.printLoad=false
          })
        }
        else {
          this.printLoad=false
          this.coloredToast('success', 'Carton Weight is empty')
        }
      }
    })
  }

  goBack(val:any)
  {
    if(val == 'Y')
    {
      this.clickMe("carton")
          this.update_hawb()
          setTimeout(() => {
            this.router.navigate(['apps/invoice/preview']);
            }, 1000);
    }
    else
    {
      this.router.navigate(['apps/invoice/preview']);
    }
  }

  selectOption(option: string) {
    this.selectedOption = option;
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

  async showAlert() {
    Swal.fire({
      icon: 'question',
      // title: 'The Internet?',
      text: 'Branch Rate is Empty!',
      padding: '2em',
      customClass: 'sweet-alerts',
    });
  }

  save_hawb_all() {
    this.service.update_Invoice_Amount_Details(this.valForm.value).subscribe(res => {
      if (res['code'] == 200) {
        this.coloredToast('success', res['data'][0]['SUCCESS'])
      }
    })
  }
  changeTableRowColor_sender(idx: any) {
    this.rowClicked_sender = idx;
  }

  changeTableRowColor(idx: any) {
    this.rowClicked = idx;
  }

}
