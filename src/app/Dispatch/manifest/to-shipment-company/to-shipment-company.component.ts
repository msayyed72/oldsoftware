import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { AwbService } from '../../../cfServices/awb.service';
import { ExcelService } from '../../../cfServices/excel.service';
import { NewApiCloudService } from '../../..//cfServices/new-api-cloud.service';
import { MasterService } from '../../../services/master-service.service';
import Swal from 'sweetalert2';
import { NgxTippyContent } from 'ngx-tippy-wrapper';
import { ExcelExportService } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-to-shipment-company',
  templateUrl: './to-shipment-company.component.html',
  styleUrls: ['./to-shipment-company.component.css']
})
export class ToShipmentCompanyComponent implements OnInit {
  @ViewChild('classicModal') classicModal: any;

  @ViewChild('DES') DES: any;
  @ViewChild('SHM') SHM: any;
  @ViewChild('SHC') SHC: any;
  @ViewChild('finalWeightChangeTable') finalWeightChangeTable: any;
  @ViewChild('viewShipmentTracking') viewShipmentTracking: any;
  @ViewChild('HistoryOfTracking') HistoryOfTracking: NgxTippyContent;
  valForm: FormGroup;
  dispatchForm: FormGroup;
  MAWBUPDATEFORM: FormGroup;
  DelivarynoteUPDATEFORM: FormGroup;
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
  btn3
  shi_veh
  rowClicked: any;
  manifest: any;
  stock_B_To_B: any;
  selected = []
  stock_non_booking_B_To_B: any;
  ptp: any;
  stock_booking_B_To_B: any;
  btn2
  ctn_weight: any;
  shipment_link: any;
  country: any;
  StockDetailsgodown_b_to_b = []
  dispatchStatus: any;
  start_sr: number = 10;
  nxt_action: number = 2;
  loadBtn: boolean;
  supplierList: any;
  scanningList: any;
  awbList: any;
  btn_load: string = '2';
  updateBtn: string = "1";
  saveBtn: string = "2";
  constructor(public dialog: MatDialog, public http: HttpClientModule, public service: MasterService, fb: FormBuilder, private cdr: ChangeDetectorRef,
    public router: Router,
    private datep: DatePipe,
    public excelService: ExcelService, public awbser: AwbService, public serviceNew: NewApiCloudService, private _spinner: NgxSpinnerService,) {
    this.date2 = this.datep.transform(this.today, 'yyyy-MM-dd')
    this.valForm = fb.group({
      'country': [null,],
      'booking_id': [null,],
      'destination': [null, Validators.required],
      'booking_date': [null, Validators.required],
      'Shipment_mode': [null, Validators.required],
      'Shipment_company': [null, Validators.required],
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
      'manifest_date': [null]
    })

    this.dispatchForm = fb.group({
      'b_id': [null,],
      'clr_org': [null, Validators.required],
      'awb_pices': [null, Validators.required],
      'mawb_code': [null],
      'mawb': [null,],
      'mawb2': ["", Validators.required],
      'supplier': [null],
      'scanning': [null],
      'shipmentNo': [null],
      'shipperName': [null],
      'shiper_passport': [null],
      'shipperAddress': [null],
      'shiper_phone': [null],
      'recName': ['CARGO FORCE'],
      'rec_Passport': [null],
      'recAddress': [null],
      'recPhone': [null],
      'handlingInfo': [null],
      'flight_no': [null],
      'flight_date': [null],
      'shipment_total_wt': [null],
      'total_bags': [null],
      'sub_contractor_number': [null],
      'manifest_date': [null]
    })




    this.MAWBUPDATEFORM = fb.group({
      'issused_by': [null],
      'issusing_carrier_name': [null],
      'issusing_carrier_address': [null],
      'requested_flight_date_1': [null],
      'requested_flight_date_2': [null],
      'rate_charge': [null],
      'weight_charge1': [null],
      'weight_charge2': [null],
      'valuationcharge_1': [null],
      'valuationcharge_2': [null],
      'total_other_charge_due_agent_1': [null],
      'total_other_charge_due_agent_2': [null],
      'Executed_on_date': [null],
      'mawb_details_updated_by': [null],
      'total_other_charge_due_carrier_1': [null],
      'total_other_charge_due_carrier_2': [null],
      'ptp_mf_no': [null],
      'airlines_id': [null],
      'acounting_information': [null],
      'handling_changes': [null],
      'iata_code': [null]
    })


    this.DelivarynoteUPDATEFORM = fb.group({
      'ptp_mf_no': [null],
      'delivery_note_date': [null],
      'created_by': [null],
      'delivery_address': [null]
    })
  }
  v1_sp_ds_consignment_master_airway_bill_get(list) {
    console.log(list.ptp_mf_no, 'ptp_np')
    this.serviceNew.v1_sp_ds_consignment_master_airway_bill_get(list.ptp_mf_no).subscribe((data: any) => {
      console.log(data, "mawb get")

      this.mawbupdate(data['data']['0'])
    })
  }
  convertToYMD(dateStr: string): string {
    // Example: "16-SEP-2025"
    const months: { [key: string]: string } = {
      JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
      JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12'
    };

    const parts = dateStr.trim().split('-'); // ["16", "SEP", "2025"]
    if (parts.length !== 3) return '';

    const day = parts[0].padStart(2, '0');
    const month = months[parts[1].toUpperCase()];
    const year = parts[2];

    return `${year}-${month}-${day}`;
  }

  mawbno123: any
  //  mawb_no
  mawbupdate(list) {
    this.mawbno123 = list.mawb_no
    this.MAWBUPDATEFORM.patchValue({
      'issused_by': list.issused_by,
      'issusing_carrier_name': String(list.issusing_carrier_name_address) ? String(list.issusing_carrier_name_address).split('$')[0] : '',
      'issusing_carrier_address': String(list.issusing_carrier_name_address) ? String(list.issusing_carrier_name_address).split('$')[1] : '',
      'requested_flight_date_1': list.flight_date_1 ? list.flight_date_1 : '',
      'requested_flight_date_2': list.flight_date_2 ? list.flight_date_2 : '',
      'rate_charge': list.rate_charge ? list.rate_charge : 2,
      'weight_charge1': list.weight_charge_1 ? list.weight_charge_1 : 0,
      'weight_charge2': list.weight_charge_2 ? list.weight_charge_2 : 0,
      'valuationcharge_1': list.valuationcharge_1 ? list.valuationcharge_1 : 0,
      'valuationcharge_2': list.total_other_charge_due_agent_2 ? list.total_other_charge_due_agent_2 : 0,
      'total_other_charge_due_agent_1': list.total_other_charge_due_agent_1 ? list.total_other_charge_due_agent_1 : 0,
      'total_other_charge_due_agent_2': list.total_other_charge_due_agent_2 ? list.total_other_charge_due_agent_2 : 0,
      'Executed_on_date': list.Executed_on_date ? this.convertToYMD(list.Executed_on_date) : this.datep.transform(this.today, 'yyyy-MM-dd'),
      'mawb_details_updated_by': this.userid.v_user_id,
      'total_other_charge_due_carrier_1': list.total_carrier_charge_1 ? list.total_carrier_charge_1 : 0,
      'total_other_charge_due_carrier_2': list.total_carrier_charge_2 ? list.total_carrier_charge_2 : 0,
      'ptp_mf_no': list.ptp_mf_no,
      'airlines_id': list.airline_id,
      'acounting_information': list.ACCOUNTING_INFORMATION ? list.ACCOUNTING_INFORMATION : '',
      'handling_changes': list.Handling_information ? list.Handling_information : '',
      'iata_code': list.Agent_IATA_CODE ? list.Agent_IATA_CODE : ''
    })
  }
  updatemawb() {
    console.log(this.MAWBUPDATEFORM.value);
    this.serviceNew.v1_sp_ds_consignment_MAWB_update(this.MAWBUPDATEFORM.value).subscribe((data: any) => {
      // this.toastr.successToastr("Updated Succefully");
      this.showMessage('success', 'Updated Succefully')

      const manifestNo = this.MAWBUPDATEFORM.value.ptp_mf_no;
      this.serviceNew.getManifestPdf(manifestNo).subscribe((data: any) => {
        console.log(data)
        if (data && data.PdfUrl) {
          window.open(data.PdfUrl, '_blank');
        }
      })
      // const pdfUrl = `https://api.cargoforce.com/Origin_v2/airlines/index.php/getManifestPdf?manifest_no=${manifestNo}`;

      //  window.open(pdfUrl, '_blank');
    })
  }
  Delivarynote(list) {
    this.DelivarynoteUPDATEFORM.patchValue({
      'ptp_mf_no': list.ptp_mf_no,
      'delivery_note_date': this.datep.transform(this.today, 'yyyy-MM-dd'),
      'created_by': this.userid.v_user_id,
      'delivery_address': ''
    })
  }
  updateDelivarynote() {
    this.serviceNew.v1_sp_ds_consignment_master_delivery_note_detail_update(this.DelivarynoteUPDATEFORM.value).subscribe((data: any) => {
      // this.toastr.successToastr("Updated Successfully")
      this.showMessage('success', 'Updated Successfully')

      const manifestNo = this.DelivarynoteUPDATEFORM.value.ptp_mf_no;
      this.serviceNew.delivarynotepdf(manifestNo).subscribe((data: any) => {
        console.log(data)
        if (data && data.PdfUrl) {
          window.open(data.PdfUrl, '_blank');
        }
      })
    })
  }
  Downloadmawb() {
    this.serviceNew.getManifestPdf(this.MAWBUPDATEFORM.value.ptp_mf_no).subscribe((data: any) => {
      console.log(data)
      if (data && data.PdfUrl) {
        window.open(data.PdfUrl, '_blank');
      }
    })
  }
  DownloadDelivary() {
    this.serviceNew.delivarynotepdf(this.DelivarynoteUPDATEFORM.value.ptp_mf_no).subscribe((data: any) => {
      console.log(data)
      if (data && data.PdfUrl) {
        window.open(data.PdfUrl, '_blank');
      }
    })
  }
  selectedDate: any;
  edit(list) {
    list = list['data']
    console.log(list)

    console.log('list')
    this.selectedDate = list;
    this.dispatchStatus = list.dispatch_status
    this.ctn_weight = list.carton_count
    var id = {
      country: list.country_id
    }
    this.getDestination(id)
    this.dispatchForm.controls['awb_pices'].setValue(this.ctn_weight);
    if (list.dispatch_status == "UNDISPATCHED") {
      this.btn = "1"
      this.btn2 = "2"
    }
    else {
      this.btn = "2"
      this.btn2 = "1"
    }
    this.updateBtn = "2"
    this.saveBtn = "2"
    // this.btn = "2"
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
      for (let i = 0; i < this.S_mode_List.length; i++) {

        if (this.S_mode_List[i].transit_type_id == list.transit_type) {
          this.shipment_link = this.S_mode_List[i].serviceTransitLinkId
        }

      }
      const filterDate = this.S_company_List.filter(d => d.s_company_name == list.shipment_name)
      // for (let index = 0; index < this.S_company_List.length; index++) {
      //   // console.log('shnafo',list.shipment_name, this.S_company_List[index].s_company_name)
      //   if (list.shipment_name == this.S_company_List[index].s_company_name)
      //     // console.log('shna',list.shipment_name, this.S_company_List[index].s_company_name)
      //     // this.dispatchForm.controls['awb_pices'].setValue(this.ctn_weight);
      //     var c = this.S_company_List[index].s_company_code
      //   this.dispatchForm.controls['mawb_code'].setValue(c);
      // }
      console.log(filterDate)
      this.dispatchForm.controls['mawb_code'].setValue(filterDate[0].s_company_code);


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
    this.v1_sp_ds_consignment_master_airway_bill_get(list);

    this.Delivarynote(list)
  }
  gotobooking() {
    this.router.navigate(['/Manifest/to-go-package', this.ptf_no]);
  }

  getDestination(value) {
    this.service.getDestination_dispatch(value.country).subscribe(res => {
      this.DestinationList = res['data'];
    })
  }

  get_ClrOrg() {
    this.service.getClrorg().subscribe(res => {
      this.OrganizationList = res['data'];
    })
  }

  getshipmentMode() {
    this.service.getShipmentMode().subscribe(res => {
      this.S_mode_List = res['data'];
    })
  }

  getshipmentCompany(value) {
    for (let i = 0; i < this.S_mode_List.length; i++) {
      if (this.S_mode_List[i].transit_type_id == this.valForm.value.Shipment_mode) {
        this.shipment_link = this.S_mode_List[i].serviceTransitLinkId
      }

    }
    this.service.getShipmentCompany(this.shipment_link).subscribe(res => {
      this.S_company_List = res['data'];
    })
  }
  loading: boolean = false; // Add this flag to track loading state

  get_DP_to_SC(start, end) {
    this.loading = true; // Show spinner when the request starts

    this.service.getManifest_DP_to_SC(this.pointId, start, end).subscribe(res => {
      this.DP_to_SC_List = res['data'].map((d, i) => ({
        ...d,
        pageNo: i + 1
      }));

      // Filter out rows where airline_tracking_id is not empty or null
      const filteredData = this.DP_to_SC_List.filter(item => item.airline_tracking_id && item.airline_tracking_id !== '');

      // Get airline_tracking_id as a comma-separated string for the API call
      const trackingIds = filteredData.map(item => item.airline_tracking_id).join(',');

      // Call the second API using the trackingIds
      this.serviceNew.getShipmentSummaryFromShipsGoBulk(trackingIds).subscribe((response: any) => {
        if (response.status === 'success' && response.data.length) {
          // Limit to the first 50 rows
          const dataToProcess = response.data.slice(0, 10);

          dataToProcess.forEach((shipment, index) => {
            const reference = shipment.summary.reference;
            const shipmentNo = shipment.summary.status; // Assuming this is the correct field for shipment_no

            // Match the ptp_mf_no with the shipment reference and update shipment_no
            const matchedItem = this.DP_to_SC_List.find(item => item.ptp_mf_no === reference);
            if (matchedItem) {
              matchedItem.shipment_no = shipmentNo; // Update the shipment_no field
            }
            this.DP_to_SC_List = [...this.DP_to_SC_List]; // Create a new reference

            console.log(matchedItem);
          });
        }

        this.loading = false; // Hide spinner once the data is loaded
      });

      if (this.DP_to_SC_List.length < 10) {
        this.nxt_action = 1;
      } else {
        this.nxt_action = 2;
      }
    });
  }




  submitForm($ev, value: any) {
    if (this.btn == '1') {
      $ev.preventDefault();
      for (let c in this.valForm.controls) {
        this.valForm.controls[c].markAsTouched();
      }
      if (this.valForm.value.destination == "" || this.valForm.value.destination == null || this.valForm.value.destination == undefined) {
        this.showMessage('Select Destination', 'error')
        this.DES.nativeElement.focus()
      }
      else if (this.valForm.value.Shipment_mode == "" || this.valForm.value.Shipment_mode == null || this.valForm.value.Shipment_mode == undefined) {
        this.showMessage('Select Shipment Mode', 'error')
        this.SHM.nativeElement.focus()
      }
      else if (this.valForm.value.Shipment_company == "" || this.valForm.value.Shipment_company == null || this.valForm.value.Shipment_company == undefined) {
        this.showMessage('Select Shipment Mode', 'error')
        this.SHC.nativeElement.focus()
      } else {
        if (this.valForm.valid) {
          this.Save_spin = '1'
          this.service.InsertManifest_DP_to_SC(value).subscribe(res1 => {
            if (res1['code'] == '200') {
              this.showMessage('Successfully Added.');
              this.reset()
              this.service.getManifest_DP_to_SC(this.pointId, 1, 50).subscribe(res => {
                this.DP_to_SC_List = res['data'];
                this.gobooking_popup(res1['data'][0]['ptpmfno'])
              })
              this.Save_spin = '2'
            }
            else {
              this.showMessage(res1['data'][0]['@p2'], 'error');
              this.Save_spin = '2'
            }
          });
        }
        else {
          this.showMessage('Please Enter Mandatoryfield', 'error');
        }
      }

    }
    else {
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
    console.log(this.S_company_List)
    console.log(value)
    console.log('this.S_company_List')


    // }
    this.dispatchForm.patchValue({
      'clr_org': "",
      'mawb_code': "",
      'mawb': "",
      'mawb2': "",
      'supplier': "",
      'scanning': "",
      'shipmentNo': "",
      'shipperName': "",
      'shiper_passport': "",
      'shipperAddress': "",
      'shiper_phone': "",
      'recName': 'CARGO FORCE',
      'rec_Passport': "",
      'recAddress': "",
      'recPhone': "",
      'handlingInfo': ""
    })
  }
  DispatchForm(value: any, event: Event) {
    event.preventDefault(); // Prevents default form submission
    console.log(value);
    console.log(this.S_company_List);
    console.log(this.selectedDate);
    console.log('this.selectedDate');

    value.mawb = value.mawb2;

    for (let c in this.dispatchForm.controls) {
      this.dispatchForm.controls[c].markAsTouched();
    }

    if (this.dispatchForm.valid) {
      const filterDate = this.S_company_List.filter(d => String(d.s_company_name).toLowerCase() == String(this.selectedDate.shipment_name).toLowerCase());
      console.log(filterDate);
      console.log("filterDate");

      if (filterDate.length > 0) {
        value.mawb_code = filterDate[0].s_company_code;
      }

      // Insert Dispatch
      this.service.insertDispatch(value).subscribe(res1 => {
        if (res1['code'] == '200') {
          this.showMessage('Successfully Dispatched.');
          this.reset();
          this.get_DP_to_SC(0, 50);
          this.Save_spin_1 = '2';
          this.classicModal.close();
        } else {
          this.showMessage(res1['data'][0]['@p2'], 'error');
          this.Save_spin_1 = '2';
        }
      });


      this.Save_spin_1 = '1';

    }
  }

  CheckAllOptions() { }
  update(value: any) {
    // this.valForm.controls['booking_date'].setValue(new Date().toISOString().split('T')[0]);

    if (this.valForm.value.destination == "" || this.valForm.value.destination == null || this.valForm.value.destination == undefined) {
      this.showMessage('Select Destination', 'warning')
      this.DES.nativeElement.focus()
    }
    else if (this.valForm.value.Shipment_mode == "" || this.valForm.value.Shipment_mode == null || this.valForm.value.Shipment_mode == undefined) {
      this.showMessage('Select Shipment Mode', 'warning')
      this.SHM.nativeElement.focus()
    }
    else if (this.valForm.value.Shipment_company == "" || this.valForm.value.Shipment_company == null || this.valForm.value.Shipment_company == undefined) {
      this.showMessage('Select Shipment Mode', 'warning')
      this.SHC.nativeElement.focus()
    } else {
      // $ev.preventDefault();
      for (let c in this.valForm.controls) {
        this.valForm.controls[c].markAsTouched();
      }
      if (this.valForm.invalid) {
        const invalidControls = Object.keys(this.valForm.controls).filter(controlName =>
          this.valForm.controls[controlName].invalid
        );

        console.warn('Invalid Controls:', invalidControls);

        invalidControls.forEach(controlName => {
          const controlErrors = this.valForm.controls[controlName].errors;
          console.warn(`Control: ${controlName}`, controlErrors);
        });
      }


      if (this.valForm.valid) {
        this.update_spin = '1'
        this.service.UpdateManifest_DP_to_SC(value).subscribe(res1 => {
          if (res1['code'] == '200') {
            this.showMessage('Successfully Added.');
            this.reset()
            this.get_DP_to_SC(0, 50);
            this.update_spin = '2'
            this.btn = "1"
            this.btn2 = "1"
          }
          else {
            this.showMessage(res1['data'], 'error');
            this.update_spin = '2'
            this.btn = "2"
            this.btn2 = "2"
          }

        });
      }
    }
  }
  handleArrowKeys(event: KeyboardEvent) {
    const keysToStop = ['ArrowLeft', 'ArrowRight'];
    if (keysToStop.includes(event.key)) {
      event.stopPropagation();
    }
  }

  delete(unit: any, event: Event) {
    // event.preventDefault();
    // event.stopPropagation(); // Stops event from bubbling

    Swal.fire({
      title: 'Delete',
      text: 'Do you really want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn-ok',
        cancelButton: 'btn-cancel'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteManifest_DP_to_SC(unit.ptp_mf_no).subscribe(res => {
          if (res['code'] == '200') {
            this.showMessage('Delete Success');
            this.get_DP_to_SC(0, 50);
          } else {
            this.showMessage('Cannot Delete', 'error');
          }
        });
      }
    });
  }



  dispatch(value: any) {
    this.service.insertDispatch(value).subscribe(res => { })
  }
  undispatch(value: any) {
    this.service.insertunDispatch(value.booking_id).subscribe(res => {
      if (res['code'] == '200') {
        this.showMessage('Successfully Updated.');
        this.get_DP_to_SC(0, 50)
        this.btn = '1'
      }
      else {
        this.showMessage(res['data'][0]['Manifest has not been dispatched'], 'error');
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

  export(path) {
    // if(this.dispatchStatus == "DISPATCHED")
    // {
    this.btn_load = '1'
    this.service.export_dispatch_manifest(this.valForm.value.booking_id, path).subscribe(res => {
      if (res['message'] == null || res['message'] == undefined) {
        this.btn_load = '2'
        this.showMessage('No Booking details here!', 'error')
      } else {
        this.btn_load = '2'
        window.open('http://45.118.160.218:8080/ExportFiles/' + res['message'][0])
      }
    })
    // }
    // else{
    //   this.toastr.warningToastr("Manifest Does not dispatched")
    // }
  }
  v1_SP_Report_Dispatch_Manifest_Wise_delivery() {
    this.btn_load = '1';


    this.serviceNew.getDeliveryReportExcel(this.valForm.value.booking_id).subscribe(r => {
      if (r['status'] == 'success') {
        this.btn_load = '2'

        window.open('https://api.cargoforce.com/operation/nodeNew' + r['downloadUrl'])
      } else {
        this.btn_load = '2'

        this.showMessage('Failed', 'error')
      }
    }, error => {
      this.btn_load = '2'

    })


  }





  exportClearanceExcel() {
    this.btn_load = '1';
    this.serviceNew.export_dispatch_manifest(this.valForm.value.booking_id).subscribe(res => {
      if (res['status'] == null || res['status'] == 'failed') {
        this.btn_load = '2';
        this.showMessage('No Booking details here!', 'error');
      } else {
        this.btn_load = '2';

        // Clean all newline characters in the data
        const cleanedData = res['data'].map((row: any) => {
          const newRow: any = {};
          for (const key in row) {
            if (row.hasOwnProperty(key)) {
              newRow[key] = typeof row[key] === 'string' ? row[key].replace(/\n/g, '') : row[key];
            }
          }
          return newRow;
        });

        this.excelService.exportAsExcelFile(cleanedData, 'ClearanceManifest');
      }
    });
  }

  downloadPackingList() {
    // this.btn_load = '1';

    // this.serviceNew.v1_SP_Report_Dispatch_Manifest_Wise_packing_list(this.valForm.value.booking_id).subscribe(res => {
    //   if (res['status'] == null || res['status'] === 'failed') {
    //     this.btn_load = '2';
    //     this.showMessage('No Booking details here!','error');
    //   } else {
    //     this.btn_load = '2';

    //     const excelData = res['data'].map((r, i) => ({
    //       S_no: i + 1,
    //       ...r
    //     }));

    //     const ws_data: any[][] = [];

    //     // Styles
    //     const greyStyle = {
    //       fill: { fgColor: { rgb: 'D3D3D3' } },
    //       font: { bold: true },
    //       alignment: { horizontal: 'left' }
    //     };

    //     const greenStyle = {
    //       fill: { fgColor: { rgb: '00FF00' } },
    //       font: { bold: true },
    //       alignment: { horizontal: 'center', vertical: 'center' }
    //     };

    //     const infoStyle = {
    //       fill: { fgColor: { rgb: '00FFFF' } },
    //       font: { bold: true },
    //       alignment: { horizontal: 'center', vertical: 'center' }
    //     };

    //     const beigeStyle = {
    //       fill: { fgColor: { rgb: 'FFE4B5' } },
    //       font: { bold: true },
    //       alignment: { horizontal: 'left' }
    //     };

    //     const headerStyleLeft = {
    //       fill: { fgColor: { rgb: 'FFE4B5' } },
    //       font: { bold: true },
    //       alignment: { horizontal: 'left' }
    //     };

    //     // Row 0: MAWB + Info in D
    //     ws_data.push([
    //       { v: '', s: greyStyle },
    //       { v: 'MAWB-123', s: greenStyle },
    //       { v: '', s: greenStyle },
    //       { v: '', s: infoStyle }
    //     ]);

    //     // Row 1: ITEMS and FLIGHT DATE
    //     ws_data.push([
    //       { v: '', s: greyStyle },
    //       { v: 'ITEMS', s: beigeStyle },
    //       { v: `FLIGHT DATE : ${new Date().toLocaleDateString('en-GB')}`, s: beigeStyle },
    //       { v: '', s: beigeStyle }
    //     ]);

    //     // Row 2: Spacer
    //     ws_data.push([
    //       { v: '', s: greyStyle },
    //       { v: '', s: beigeStyle },
    //       { v: '', s: beigeStyle },
    //       { v: '', s: beigeStyle }
    //     ]);

    //     // Row 3: Headers
    //     ws_data.push([
    //       { v: 'S.No', s: greyStyle },
    //       { v: 'E', s: headerStyleLeft },
    //       { v: 'DESCRIPTION', s: headerStyleLeft },
    //       { v: 'PCS', s: headerStyleLeft }
    //     ]);

    //     // Data rows
    //     let totalPCS = 0;
    //     excelData.forEach(row => {
    //       const pcsValue = parseInt(row.PCS) || 0;
    //       totalPCS += pcsValue;

    //       ws_data.push([
    //         { v: row.S_no },
    //         { v: row.E },
    //         { v: row.DESCRIPTION },
    //         { v: row.PCS }
    //       ]);
    //     });

    //     // Total PCS row
    //     ws_data.push([
    //       { v: '', s: {} },
    //       { v: '', s: {} },
    //       { v: 'TOTAL PCS', s: { font: { bold: true }, alignment: { horizontal: 'right' } } },
    //       { v: totalPCS, s: { font: { bold: true }, alignment: { horizontal: 'left' } } }
    //     ]);

    //     const ws = XLSX.utils.aoa_to_sheet(ws_data);

    //     // Merge MAWB cell (B1 to C1)
    //     ws['!merges'] = [
    //       { s: { r: 0, c: 1 }, e: { r: 0, c: 2 } }
    //     ];

    //     // Row height adjustments
    //     ws['!rows'] = [
    //       { hpt: 60 }, // Row 0
    //       { hpt: 20 }, // Row 1
    //       { hpt: 20 }, // Row 2
    //       { hpt: 20 }  // Row 3 (header)
    //       // Other rows can follow default or be customized too
    //     ];

    //     // Column widths
    //     ws['!cols'] = [
    //       { wch: 5 },  // S.No
    //       { wch: 12 },  // E
    //       { wch: 35 },  // Description
    //       { wch: 5 }   // PCS
    //     ];

    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Packing List');
    //     XLSX.writeFile(wb, 'Packing_List.xlsx');
    //   }
    // });
  }





  export2() {
    this.service.v1_SP_Report_Dispatch_Manifest_Wise_clearance_excel(this.valForm.value.booking_id).subscribe(res => {
      if (res['data'] == null || res['data'] == undefined) {
        this.showMessage('No Booking details here!', 'error')
      } else {
        this.excelService.exportAsExcelFile(res['data'], 'Manifest');
      }
    })
  }

  reset() {
    this.userid = JSON.parse(localStorage.getItem("log_data"))

    this.Save_spin = '2'
    this.Save_spin_1 = '2'
    this.update_spin = '2'
    this.btn = "1"
    this.btn2 = "1"
    this.saveBtn = "1"
    this.updateBtn = "1"
    this.changeTableRowColor(-1)
    this.valForm.reset();
    this.valForm.patchValue({
      user_id: this.userid.v_user_id,
      point_id: this.userid.v_point_id
    })
    this.valForm.controls['booking_date'].setValue(this.date2);
    this.pointId = this.userid.v_point_id
    // this.getDestination()
    this.getshipmentMode()
    this.get_DP_to_SC(0, 10)
    this.get_ClrOrg()
    this.get_country_list()
    this.getSupplierList()
    this.getScanningList()
  }

  getSupplierList() {
    this.service.getSupplier('AIRLINE').subscribe(res => {
      this.supplierList = res['data'];
    })
  }

  getScanningList() {
    this.service.getSupplier('SCANNING CENTRE').subscribe(res => {
      this.scanningList = res['data'];
    })
  }

  getAwbList(supplier) {
    var airList = this.S_company_List.filter(d => d.s_company_name == this.valForm.value.Shipment_company)
    // console.log(airList)
    this.service.get_o_ac_airway_bill_purchase_dispatch(airList[0]['shipment_company_id'], supplier, this.userid.v_point_id).subscribe(res => {
      this.awbList = res['data'];
    })
  }

  get_country_list() {
    this.awbser.get_country().subscribe(data => {
      this.country = data['data']
    })
  }
  getstock_B_To_B() {
    this.manifest = this.DP_to_SC_List[0].ptp_mf_no
    this.service.getstock_B_To_B(this.manifest).subscribe(get_data => {
      this.stock_B_To_B = get_data['data'].map((d, i) => ({
        ...d,
        PageNo: i
      }));

    })


  }
  getstock() {
    this.service.getStockDetailsgodown_b_to_b(this.userid.v_point_id).subscribe(get_data => {
      this.StockDetailsgodown_b_to_b = get_data['data'];
    })
  }
  onChange(checked, stock_B_To_B) {
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
  BookingAndNonBokking(id) {

    this.ptp = id.ptp_mf_no;
    this.service.get_non_booking_B_To_B(this.manifest, id.ptp_mf_no).subscribe(get_data => {
      this.stock_non_booking_B_To_B = get_data['data'];
    })
    this.service.get_booking_B_To_B(this.manifest, id.ptp_mf_no).subscribe(get_data => {
      this.stock_booking_B_To_B = get_data['data'];

    })
  }
  filterSettings
  editSettings: any;
  public toolbarOptions: ToolbarItems[] = ['Search'];
  ngOnInit() {
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;

    // this.getBaggedCartonData();
    this.filterSettings = { ignoreAccent: true, hierarchyMode: 'None', type: 'Excel' };
    this.toolbarOptions = ['Search'];
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

  gobooking_popup(mfNo) {
    Swal.fire({
      title: 'Booking',
      text: 'Do you want to Go Booking?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn-ok',
        cancelButton: 'btn-cancel'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ptf_no = mfNo;
        this.router.navigate(['/Manifest/to-go-package', this.ptf_no]);
      }
    });
  }




  pre_cus(id) {
    this.start_sr = this.start_sr - 20
    var end = this.start_sr + 10
    this.get_DP_to_SC(this.start_sr, end)
    this.start_sr += 10
  }
  next_cus(id) {
    var end = 1 * this.start_sr + 10
    this.get_DP_to_SC(this.start_sr, end)
    this.start_sr = end
  }
  DownloadAllAadharFiles() {
    this._spinner.show(); // Show spinner at the start

    this.serviceNew.createFolder(this.selectedDate['ptp_mf_no']).subscribe(
      (folderResponse: any) => {
        if (folderResponse && folderResponse.status === "success" && folderResponse.data) {
          const folderId = folderResponse.data; // Extract folderId
          this.showMessage("Folder created successfully.");

          this.service.get_booking_B_To_B(this.selectedDate['ptp_mf_no'], '1').subscribe(
            (get_data: any) => {
              if (get_data && get_data.data && Array.isArray(get_data.data)) {
                const processedInvoices = new Set<string>();
                console.log(get_data)
                // Filter unique invoice_no and map to required format
                const allAadharNumberArray = get_data.data.reduce((acc, d) => {
                  const key: string = d.invoice_no + (d.box_no ? d.box_no : '');

                  if (!processedInvoices.has(key)) {
                    processedInvoices.add(d.invoice_no);
                    acc.push({ invoice_no: d.invoice_no, aadhar_no: d.aadhar_no, aadhar_url_back: d.aadhar_url_back, aadhar_url_front: d.aadhar_url_front, box_no: d.box_no });
                  }
                  return acc;
                }, []);

                if (allAadharNumberArray.length > 0) {
                  this.showMessage("Downloading Aadhar files, please wait...", 'info');

                  // Chunk the data into batches of 5
                  const chunkSize = 5;
                  const chunks = allAadharNumberArray.reduce((resultArray, item, index) => {
                    const chunkIndex = Math.floor(index / chunkSize);
                    if (!resultArray[chunkIndex]) {
                      resultArray[chunkIndex] = []; // Start a new chunk
                    }
                    resultArray[chunkIndex].push(item);
                    return resultArray;
                  }, []);

                  // Send all chunks in parallel using forkJoin
                  const requests = chunks.map(chunk =>
                    this.serviceNew.DownloadAllAadharFiles({ folderId: folderId, data: chunk }).pipe(
                      catchError(error => {
                        console.error("Error in Aadhar file download", error);
                        this.showMessage("Some files failed to download.", 'error');
                        return of(null); // Return null to avoid breaking forkJoin
                      })
                    )
                  );

                  forkJoin(requests)
                    .pipe(finalize(() => this._spinner.hide())) // Hide spinner once all requests are done
                    .subscribe(results => {
                      this.showMessage("All files downloaded successfully.");
                      console.log("All download requests completed successfully", results);

                      // Open the Google Drive folder
                      window.open(`https://drive.google.com/drive/folders/${folderId}`, "_blank");
                    });

                } else {
                  this.showMessage("No Aadhar numbers found to download.", 'error');
                  this._spinner.hide(); // Hide spinner if no data is found
                }
              } else {
                this.showMessage("Invalid response format from API.", 'error');
                this._spinner.hide(); // Hide spinner on API error
              }
            },
            error => {
              console.error("Error fetching booking data", error);
              this.showMessage("Error fetching booking data.", 'error');
              this._spinner.hide(); // Hide spinner on error
            }
          );
        } else {
          this.showMessage("Failed to create folder.", 'error');
          this._spinner.hide(); // Hide spinner if folder creation fails
        }
      },
      error => {
        console.error("Error creating folder", error);
        this.showMessage("Error creating folder.", 'error');
        this._spinner.hide(); // Hide spinner on error
      }
    );
  }
  onRowDrop(args: any) {
    console.log('Row Dropped:', args);
    //    this.gotAllManifestDetails = this.gotAllManifestDetails.map((d,i) => ({
    //   ...d,
    //   label_print_status: 0
    // }));
    //  this.gotAllManifestDetails = this.gotAllManifestDetails.map((d,i) => ({
    //   ...d,
    //   label_print_status: i+1
    // }));
    // Optional: you can update row order here if needed
  }
  downloadLabel() {
    if (!this.selectedDate) {
      this.showMessage('PTP MF No not found.', 'error');
      return;
    }
    const ptpMfNo = this.selectedDate['ptp_mf_no'];

    this.serviceNew.DownloadLabelBulk(ptpMfNo).subscribe({
      next: (res: any) => {
        if (res.status === 'success' && res.file_url) {
          window.open(res.file_url, '_blank');
        } else {
          console.error('File URL not found in response:', res);
        }
      },
      error: (err) => {
        console.error('Error downloading label:', err);
      }
    });
  }
  readyForManifestDetails: any[] = [];
  v1_sp_ds_check_wt_ready_manifest() {
    this.serviceNew.v1_sp_ds_check_wt_ready_manifest(this.pointId).subscribe(r => {
      if (r['data'].length > 0) {
        this.readyForManifestDetails = r['data'].map(data => ({
          ...data,
          status: data.status == 0 ? 'Status Not Available' :
            data.status == 1 ? 'UN_PACKED' :
              data.status == 2 ? 'PACKED' : 'Invalid Status'
        }));
        this.calculateTotalCartonWeight()
      } else {
        this.readyForManifestDetails = []
      }

    })

  }
  onRowDataBound(args: any): void {
    if (args.data.status === 'UN_PACKED') {
      args.row.style.backgroundColor = '#f8d7da'; // light red
      args.row.style.color = '#721c24'; // dark red text
    }
  }

  totalCartonWeight: number = 0;

  calculateTotalCartonWeight() {
    this.totalCartonWeight = this.readyForManifestDetails.reduce((sum, item) => {
      const weight = parseFloat(item.carton_weight) || 0;
      return sum + weight;
    }, 0);
  }
  toolbarClick(args: any) {
    console.log(args)
    // this.mainGridnew.excelExport({ fileName: 'CustomerBooking.xlsx' });

    switch (args.item.text) {
      case 'PDF Export':
        this.mainGridnew.pdfExport({
          fileName: 'Custom_File_Name.pdf',
          pageOrientation: 'Landscape'
        });
        break;
      case 'Excel Export':
        this.mainGridnew.excelExport({ fileName: 'CustomerBooking.xlsx' });
        break;
      case 'CSV Export':
        this.mainGridnew.csvExport({ fileName: 'Custom_File_Name.csv' });
        break;
      case 'Print':
        this.mainGridnew.print();
        break;
      case 'Add':  // Handle Add button click
        console.log('Add button clicked');
        this.mainGridnew.addRecord(); // This adds a new row in the grid
        break;
      default:
        console.log('No matching toolbar action found:', args.item.text);
    }
  }
  toolbarClickNew(args: any) {
    console.log(args)
    // this.mainGridnew.excelExport({ fileName: 'CustomerBooking.xlsx' });

    switch (args.item.text) {
      case 'PDF Export':
        this.mainGrid.pdfExport({
          fileName: 'Custom_File_Name.pdf',
          pageOrientation: 'Landscape'
        });
        break;
      case 'Excel Export':
        this.mainGridnew.excelExport({ fileName: 'CustomerBooking.xlsx' });
        break;
      case 'CSV Export':
        this.mainGridnew.csvExport({ fileName: 'Custom_File_Name.csv' });
        break;
      case 'Print':
        this.mainGridnew.print();
        break;
      case 'Add':  // Handle Add button click
        console.log('Add button clicked');
        this.mainGridnew.addRecord(); // This adds a new row in the grid
        break;
      default:
        console.log('No matching toolbar action found:', args.item.text);
    }
  }
  nextStatus: number = 0;
  gotAllManifestDetails: any = [];

  updateBatch() {
    console.log(this.gotAllManifestDetails)

    const nextSts = this.gotAllManifestDetails.filter((a: any) => a['label_print_status'] == null || String(a['label_print_status']).trim() == '')
    // let updateNextSts = nextSts.map((d,i)=>({
    //   ...d,
    //   label_print_status: i+1
    // }))
    this.serviceNew.bulkUploadFinalWeightDetailsLoad(this.gotAllManifestDetails).subscribe(() => {
      this.getAllFinalWtBasedOnManifestNo();
    });
    console.log(this.gotAllManifestDetails)
  }
  calculateTotalFinalWt(): number {
    if (!Array.isArray(this.gotAllManifestDetails)) {
      return 0;
    }

    let num = this.gotAllManifestDetails.reduce((sum, item) => {
      const weight = parseFloat(item.final_wt) || 0;
      return sum + weight;
    }, 0);

    return Number(num.toFixed(2)); // Return as number
  }

  updateFinalWeights() {
    const Res = this.gotAllManifestDetails
    this.serviceNew.bulkUploadFinalWeightDetails(Res).subscribe(r => {
      this.getAllFinalWtBasedOnManifestNo()
    })

  }
  onFinalWeightUpdate(data: any) {
    data.sender_name = data.sender_name.replace(/\n/g, ' ');

    console.log(data.final_wt)
    if (String(data.final_wt).length > 0 && !isNaN(Number(data.final_wt))) {
      // Call backend to update final weight for the row
      this.serviceNew.bulkUploadFinalWeightDetails([data]).subscribe(() => {
        // Find and update only the modified row in the local array
        const index = this.gotAllManifestDetails.findIndex(d => d.invoice_no === data.invoice_no);
        if (index !== -1) {
          this.gotAllManifestDetails[index] = {
            ...this.gotAllManifestDetails[index],
            final_wt: data.final_wt
          };
        }

        // ❌ Do NOT call this.getAllFinalWtBasedOnManifestNo(); unless needed
      });
    } else {
      this.getAllFinalWtBasedOnManifestNo();

      // this.gotAllManifestDetails =this.gotAllManifestDetails;
      this.showMessage("Plz Enter Valid Numebr", 'error')
    }

  }
  v1_sp_ds_final_manifest_export_get() {
    if (!this.selectedDate) {
      this.showMessage("Plz Select Manifest No.", 'error');
      return;
    }
    this.serviceNew.v1_sp_ds_final_manifest_export_get(this.selectedDate['ptp_mf_no']).subscribe(d => {
      const fetchData = d['data'].map((d, i) => ({
        'SR NO': i + 1,

        ...d

      }))
      this.excelService.exportAsExcelFile(fetchData, 'finalManifest')
    })
  }
  v1_SP_Report_customs_manifest() {
    if (!this.selectedDate) {
      this.showMessage("Plz Select Manifest No.", 'error');
      return;
    }

    this.serviceNew.v1_SP_Report_customs_manifest(this.selectedDate['ptp_mf_no']).subscribe(d => {
      const fetchData = d['data'].map((item, i) => {
        // Convert weight to number
        item.Weight = parseFloat(item.Weight || 0);

        // Helper: Split address if > 50 chars
        const splitAddress = (addr: string) => {
          if (!addr) return ['', ''];
          if (addr.length <= 50) return [addr, ''];
          const splitIndex = addr.lastIndexOf(' ', 50);
          if (splitIndex === -1) return [addr, '']; // No space, can't split
          return [addr.slice(0, splitIndex), addr.slice(splitIndex + 1)];
        };

        // Handle Consignor Address
        const [consignorLine1, consignorLine2] = splitAddress(item.Consignor_Address_1);
        item.Consignor_Address_1 = consignorLine1;
        item.Consignor_Address_2 = consignorLine2;

        // Handle Consignee Address
        const [consigneeLine1, consigneeLine2] = splitAddress(item.Consignee_Address_1);
        item.Consignee_Address_1 = consigneeLine1;
        item.Consignee_Address_2 = consigneeLine2;

        return {
          'SR NO': i + 1,
          ...item
        };
      });
      setTimeout(() => {
        this.serviceNew.getCustomesExcelForDispatch(this.selectedDate['ptp_mf_no'], fetchData).subscribe(r => {
          if (r['fileUrl']) {
            window.open(r['fileUrl'])
          } else {
            this.showMessage('Failed', 'error')
          }

        })
      }, 0);

      // this.excelService.exportAsExcelFile(fetchData, 'customsManifest');
    });
  }

  manifest_pdf() {
    if (!this.selectedDate) {
      this.showMessage("Plz Select Manifest No.", 'error');
      return;
    }
    this.serviceNew.manifest_pdf(this.selectedDate['ptp_mf_no']).subscribe({
      next: (d) => {
        window.open(d['file_url']);
      },
      error: (err) => {
        this.showMessage("Failed to load manifest PDF. Please try again later.", 'error');
        console.error('Manifest PDF error:', err);
      }
    });
  }
  onToolbarClick(args: any): void {


    switch (args.item.text) {
      case 'PDF Export':
        this.finalWeightChangeTable.pdfExport({
          fileName: 'Custom_File_Name.pdf',
          pageOrientation: 'Landscape'
        });
        break;
      case 'Excel Export':
        this.finalWeightChangeTable.excelExport({ fileName: 'FinalWeight.xlsx' });
        break;
      case 'CSV Export':
        this.finalWeightChangeTable.csvExport({ fileName: 'Custom_File_Name.csv' });
        break;
      case 'Print':
        this.finalWeightChangeTable.print();
        break;
      case 'Add':  // Handle Add button click
        console.log('Add button clicked');
        this.finalWeightChangeTable.addRecord(); // This adds a new row in the grid
        break;
      default:
        console.log('No matching toolbar action found:', args.item.text);
    }
  }
  getHighlightStyle(name1: string, name2: string): any {
    const words1 = name1.toLowerCase().split(/\s+/);
    const words2 = name2.toLowerCase().split(/\s+/);
    const hasCommonWord = words1.some(word => words2.includes(word));
    return { color: hasCommonWord ? 'red' : 'black' };
  }

  getHighlightStylenew(name1: string, name2: string, data: any[]): string {
    if (!name1 || !name2) return 'black';

    // Check if the sender_name appears more than once in the data
    const senderCount = data.filter(item => item.sender_name.toLowerCase() === name1.toLowerCase()).length;

    // If sender_name appears twice, return blue
    if (senderCount > 1) return 'Repeated More than 1 time  ';

    // Check for common words between sender_name and receiver_name
    const words1 = name1.toLowerCase().split(/\s+/);
    const words2 = name2.toLowerCase().split(/\s+/);
    const hasCommonWord = words1.some(word => words2.includes(word));

    // Return color based on matching words
    return hasCommonWord ? 'red' : 'black';
  }

  getHighlightStyleValue(name1: string): any {

    return { color: Number(name1) <= 0 ? 'red' : 'black' };
  }

  getAllFinalWtBasedOnManifestNo() {
    this.gotAllManifestDetails = []
    if (!this.selectedDate) {
      this.showMessage("Plz Select Manifest No.", 'error');
      return;
    }
    this.openDialog()

    this.serviceNew.v1_sp_ds_manifest_invoice_final_wt_get(this.selectedDate['ptp_mf_no']).subscribe(r => {
      const data = r['data'] || [];

      // Convert null final_wt to "0"
      const cleanedData = data.map(d => ({
        ...d,
        final_img: d.weight_img ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + d.weight_img : '',
        final_wt: d.final_wt == null ? "0" : d.final_wt,
        created_by: this.userid.v_user_id,
        colorForName: this.getHighlightStylenew(d['sender_name'], d['receiver_name'], data)
      }));

      // Extract all numeric label_print_status values
      const numericStatuses = cleanedData
        .map(d => Number(d.label_print_status))
        .filter(val => !isNaN(val)); // remove nulls and non-numbers

      this.nextStatus = numericStatuses.length === 0 ? 1 : Math.max(...numericStatuses) + 1;

      // Add ref.next_sts based on calculated value
      this.gotAllManifestDetails = cleanedData.map((d, i) => ({
        ...d,
        mergeHawb: d.invoice_no + (d.bag_no ? d.bag_no : ''),

        // label_print_status: i+1
      }));
    });

  }
  gotAllManifestDetailsMail = []
  getAllFinalWtBasedOnManifestNoForMail() {
    this.gotAllManifestDetailsMail = []
    if (!this.selectedDate) {
      this.showMessage("Plz Select Manifest No.", 'error');
      return;
    }
    this.classicModal.open()

    this.serviceNew.v1_sp_ds_manifest_invoice_final_wt_get(this.selectedDate['ptp_mf_no']).subscribe(r => {
      const data = r['data'] || [];

      // Convert null final_wt to "0"

      // Extract all numeric label_print_status values


      // Add ref.next_sts based on calculated value
      this.gotAllManifestDetailsMail = data.map((d, i) => ({
        ...d,
        mergeHawb: d.invoice_no + (d.bag_no ? d.bag_no : ''),

        // label_print_status: i+1
      }));
    });

  }
  fetchMode = false;

  fetchSeqId() {
    if (!this.fetchMode) {
      // this.gotAllManifestDetails = this.gotAllManifestDetails
      //   .sort((a, b) => a.invoice_no.localeCompare(b.invoice_no));

      this.gotAllManifestDetails = this.finalWeightChangeTable.getCurrentViewRecords().map((item, index) => ({
        ...item,
        label_print_status: index + 1
      }));
    } else {
      this.gotAllManifestDetails = this.gotAllManifestDetails.map((item, index) => ({
        ...item,
        label_print_status: 0
      }));
    }

    this.fetchMode = !this.fetchMode;
  }
  // @HostListener('document:keydown.escape', ['$event'])
  // onEscPress(event: any) {
  //   event.preventDefault();  // Prevent modal from closing
  // }
  showModal = false;
  selectedImage: string = '';

  openModal(imgUrl: string) {
    this.selectedImage = imgUrl;
    this.showModal = true;
  }
  isZoomed = false;

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
  }
  closeModal() {
    this.showModal = false;
    this.selectedImage = '';
  }
  zoomLevel: number = 1;
  zoomStyle: string = 'scale(1)';

  zoomIn() {
    this.zoomLevel += 0.1;
    this.updateZoom();
  }

  zoomOut() {
    if (this.zoomLevel > 0.2) {
      this.zoomLevel -= 0.1;
      this.updateZoom();
    }
  }

  resetZoom() {
    this.zoomLevel = 1;
    this.updateZoom();
  }

  updateZoom() {
    this.zoomStyle = `scale(${this.zoomLevel})`;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKeyHandler(event: KeyboardEvent) {

    if (this.showModal) {
      this.closeModal();

      // setTimeout(() => {
      // this.finalWeight.open()

      // }, 100);
    }
  }
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();  // Prevent closing on Escape
    }
  }
  isDuplicateReceiver(name: string): boolean {
    if (!name) return false;

    const trimmedName = name.trim().toLowerCase();
    const count = this.gotAllManifestDetails.filter(item =>
      item.receiver_name.trim().toLowerCase() === trimmedName
    ).length;

    return count > 1;
  }
  getReceiverStyle(name: string): any {
    const isDuplicate = this.isDuplicateReceiver(name);
    return {
      color: isDuplicate ? 'red' : 'black'
    };
  }
  duplicateSortComparer = (a: string, b: string, dir: string): number => {
    const isDupA = this.isDuplicateReceiver(a) ? 1 : 0;
    const isDupB = this.isDuplicateReceiver(b) ? 1 : 0;

    if (dir === 'Ascending') {
      return isDupA - isDupB;
    } else {
      return isDupB - isDupA;
    }
  };
  shipmentData: any = []

  openTrackingDetial(id: string): void {
    if (!id) {
      alert('No ID Found');
    } else {
      this.serviceNew.getShipmentSummaryFromShipsGo(id).subscribe(response => {
        if (response && response.status === 'success') {
          this.shipmentData = response.data;
          this.viewShipmentTracking.open()
        } else {
          alert('Error fetching shipment details');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'BOOKED':
        return 'booked';
      case 'EN_ROUTE':
        return 'en-route';
      default:
        return 'default-status';
    }
  }

  openTrackingLink(): void {
    if (this.shipmentData && this.shipmentData.summary && this.shipmentData.summary.map_url) {
      window.open(this.shipmentData.summary.map_url, '_blank');
    }
  }
  deleteShipGo() {
    Swal.fire({
      title: 'Delete',
      text: 'Do you really want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn-ok',
        cancelButton: 'btn-cancel'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceNew.deleteShipmentFromShipsGo(this.selectedDate.airline_tracking_id).subscribe(res => {
          if (res['code'] == '200') {
            const payload = {
              consignment_no: this.selectedDate['ptp_mf_no'],
              p_airlines_id: ''
            };

            this.serviceNew.v1_SP_ds_consignment_airlines_update(payload).toPromise();
            this.showMessage('Delete Success');
            this.get_DP_to_SC(0, 50);
          } else {
            this.showMessage('Cannot Delete', 'error');
          }
        });
      }
    });
  }

  bookShipGo(value) {
    Swal.fire({
      title: 'Book',
      text: 'Do you really want to Book this item?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn-ok',
        cancelButton: 'btn-cancel'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const payl = {
          reference: this.selectedDate['ptp_mf_no'],
          awb_number: this.selectedDate['seal_no'],
        };

        this.serviceNew.createShipmentForShipsGO(payl).subscribe(r => {
          if (r['code'] == 200) {
            const shipmentId = r['data']['shipment']['id'];
            const payload = {
              consignment_no: this.selectedDate['ptp_mf_no'],
              p_airlines_id: shipmentId
            };

            this.serviceNew.v1_SP_ds_consignment_airlines_update(payload).toPromise();
            this.get_DP_to_SC(0, 50);
          } else {
            this.showMessage('Failed', 'error');
          }
        });
      }
    });
  }

  isLastAct(index: number): boolean {
    const actEvents = this.shipmentData.tracking_events.filter(event => event.status === 'ACT');
    const lastActIndex = actEvents.length - 1;
    return index === this.shipmentData.tracking_events.indexOf(actEvents[lastActIndex]);
  }

  @ViewChild('mainGridnew') mainGridnew: any;
  @ViewChild('finalWeight') finalWeight: any;
  @ViewChild('mainGrid') mainGrid: any;


  showMessage(msg = '', type = 'success') {
    const toast: any = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: 'toast' },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: '10px 20px',
    });
  }
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;

  openDialog() {
    this.dialog.open(this.modalTemplate, {
      disableClose: true, // This prevents closing on Esc key and outside clicks
      // height:"80vh",

    });

  }
  iataTyoeOfData: any = []
  getDataForTypeOfIATA() {
    return this.serviceNew.getDataForTypeOfIATA().subscribe(r => {
      this.iataTyoeOfData = r['data']
    })
  }
  ChangesData(event: any): void {
    const selectedValue = event.target.value;
    const selectedObject = this.iataTyoeOfData.find(item => item.name == selectedValue);

    if (selectedObject) {
      this.MAWBUPDATEFORM.get('issusing_carrier_name').setValue(selectedObject?.company)
      this.MAWBUPDATEFORM.get('issusing_carrier_address').setValue(selectedObject?.country)
      this.MAWBUPDATEFORM.get('iata_code').setValue(selectedObject?.Iatacode)
      console.log('Selected JSON Object:', selectedObject);
    } else {
      console.log('No object found');
    }
  }
}
