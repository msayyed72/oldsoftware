import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
// import { PopupManager } from 'ng6-popup-boxes';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxSpinnerService } from 'ngx-spinner';
import { NewApiCloudService } from '../../../cfServices/new-api-cloud.service';
import { MasterService } from '../../../services/master-service.service';
import { includes } from 'lodash';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
type PreviewKind = 'drive' | 'pdf' | 'img' | 'html' | 'none' | 'iframe';
interface PreviewModel {
  kind: PreviewKind;
  url?: string;             // raw string for ngx-doc-viewer or <img>
  safeSrc?: SafeResourceUrl; // for <iframe> (Drive preview) or if you insist on sanitizing <img>
  html?: SafeHtml;
}
@Component({
  selector: 'app-to-go-cargo',
  templateUrl: './to-go-cargo.component.html',
  styleUrls: ['./to-go-cargo.component.css']
})
export class ToGoCargoComponent implements OnInit {
  @ViewChild('DELHIVERY') DELHIVERY: TemplateRef<any>;
  @ViewChild('SheetData') SheetData: any;
  @ViewChild('nonBookGrid') nonBookGrid: any;

  @ViewChild('invoiceno') invoiceno: ElementRef;
  @ViewChild('save') save: ElementRef;
  @ViewChild('barcode') barcode: ElementRef;
  @ViewChild('configuredestination') configuredestination: any;
  @ViewChild('deletefuntion') deletefuntion: any;
  @ViewChild('AadharVerifycation') AadharVerifycation: any;

  @ViewChild('updatefuntion') updatefuntion: any;
  @ViewChild('availablenonbooking') availablenonbooking: any;
  @ViewChild('carton') carton: ElementRef;
  @ViewChild('weight') weight: ElementRef;
  @ViewChild('ManifestModel') ManifestModel: any;

  valForm_assign: FormGroup;
  manifest: any;
  currentDateTime: string;
  valForm: FormGroup;
  valForm_config: FormGroup;
  stock_B_To_B: any;
  stockData: any;
  stockZone: any = [];
  stockBr: any = [];
  isChecked: boolean = false;
  selected3: any = [];
  tot_non_clr_wgt: number;
  tot_non_clr_ctn: number;
  selected_cn: any = [];
  selected: any = [];
  selected_wt: any = [];
  nonbookdata: any;
  tot_clr_wgt: number;
  tot_clr_ctn: number;
  ptp: any;
  stock_non_booking_B_To_B: any = [];
  stock_booking_B_To_B: any = [];
  non_arr: any[] = [];
  mode: any = [];
  country: any = [];
  bookdata: any;
  arr: any[];
  bookmode: any = [];
  bookcountry: any = [];
  checkedManifests: any = [];
  delhiveryDialogRef!: MatDialogRef<any>;
  userid: any;
  configure_destination_b_to_b: any;
  selecteddel: any[];
  report: string;
  ReasonCombobox_b_to_b: any;
  ManualCartonDetails: any = [];
  inv_no: any;
  ManualInvoiceDetails: any = [];
  ManualbarcodeDetails: any = [];
  booked_location: any;
  selected2: any = [];
  constructor(private renderer: Renderer2,
    public http: HttpClientModule, public service: MasterService, fb: FormBuilder, private _spinner: NgxSpinnerService,
    public router: Router, private imageCompress: NgxImageCompressService,
    private datep: DatePipe,
    public route: ActivatedRoute, public datepipe: DatePipe, public serviceNew: NewApiCloudService, private sanitizer: DomSanitizer, private dialog: MatDialog
  ) {

    this.route.params.subscribe(data => {
      this.manifest = data['id'];
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
      'p_manifestNumber': [null],
      'carton_id': [null]

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
  isUploaded = false;
  editSettings: any;
  ngOnInit() {
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;
    this.selectedFilter = 'all'
    this.isUploaded = false;
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;
    this.fetchSheetAadhar()
    this.reset()
    this.getstock_B_To_B()
  }
  fetchSystemData = []
  fetchSheetAadhar() {
    this.serviceNew.fetchSheetAadhar().subscribe(r => {
      this.fetchSystemData = r['data']
    })
  }
  getstock_B_To_B() {
    this.serviceNew.getstock_B_To_B(this.manifest).subscribe(get_data => {
      this.stock_B_To_B = get_data['data'];
      this.stockData = this.stock_B_To_B
      if (this.invoiceno) {
        this.invoiceno.nativeElement.focus();

      }

      this.stock_B_To_B.forEach((obj) => {
        if (obj) {
          if (obj.print_title && !includes(this.stockZone, obj.print_title)) {
            this.stockZone.push(obj.print_title)
          }
        }

      });

      this.stock_B_To_B.forEach((obj) => {
        if (obj.deliveryAreaCode && !includes(this.stockBr, obj.deliveryAreaCode)) {
          this.stockBr.push(obj.deliveryAreaCode)
        }
      });

    })
  }
  onChange(checked, stock_B_To_B, c_no, wgt) {
    // console.log(checked)
    // console.log("selected", this.stock_B_To_B)
    if (this.stock_B_To_B.every(val => val.checked == true)) {
      this.isChecked = true
    }
    else {
      this.isChecked = false
    }
    if (checked) {
      this.selected3.push(stock_B_To_B);
      // console.log("selected", this.selected)
    } else {
      this.selected3.splice(this.selected3.indexOf(stock_B_To_B), 1)
      // this.selected = this.selected3
      // console.log("selected2", this.selected3)
    }
    this.tot_non_clr_wgt = 0;
    this.tot_non_clr_ctn = 0;
    if (checked) {
      this.selected.push(stock_B_To_B);
      this.selected_cn.push(c_no);
      this.selected_wt.push(wgt);
      // console.log("if selected2", this.selected)
    } else {
      // console.log("else selected2", this.selected)
      this.selected.splice(this.selected.indexOf(stock_B_To_B), 1)
      this.selected_cn.splice(this.selected.indexOf(c_no), 1)
      this.selected_wt.splice(this.selected.indexOf(wgt), 1)
      // console.log("else selected2", this.selected)
    }
    for (let i = 0; i < this.selected_cn.length; i++) {
      ////console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
      this.tot_non_clr_wgt = Number(1 * this.selected_wt[i]) + this.tot_non_clr_wgt
      this.tot_non_clr_ctn = 1 * Number(this.selected_cn[i]) + this.tot_non_clr_ctn
    }
    var id = {
      ptp_mf_no: this.selected3
    }
    this.BookingAndNonBokking(id)
  }
  sumNumbers(input) {
    const numbers = input.split(',').map(Number);
    const total = numbers.reduce((acc, curr) => acc + curr, 0);
    return total;
  }
  selectedFilter = 'all'
  setFilter(filterType: string): void {
    this.selectedFilter = filterType;
  }
  totalWeightSumRef = 0;
  totalCartonLeft = 0;
  totalCartonRight = 0;
  totalWeightSumRef2 = 0;
  tatalHawb = 0;
  BookingAndNonBokking(id) {
    this.tot_non_clr_wgt = 0;
    this.tot_non_clr_ctn = 0;
    this.tot_clr_wgt = 0;
    this.tot_clr_ctn = 0;
    // console.log(id)
    this.ptp = id.ptp_mf_no;
    this.serviceNew.get_non_booking_b_to_b_new(this.manifest, id.ptp_mf_no).subscribe(get_data => {
      this.stock_non_booking_B_To_B = get_data['data'];
      this.totalWeightSumRef = 0;
      this.totalCartonLeft = 0;
      if (this.stock_non_booking_B_To_B.length > 0) {
        const uniqueInvoices = new Set();

        this.stock_non_booking_B_To_B = this.stock_non_booking_B_To_B.map(r => {
          if (r['invoice_no']) {
            uniqueInvoices.add(r['invoice_no']);
          }
          const total_wt_sum = this.sumNumbers(r['carton_weight']);
          this.totalWeightSumRef += total_wt_sum; // Add to total


          this.totalCartonLeft = uniqueInvoices.size; // Add to total

          return {
            ...r,
            total_wt_sum: total_wt_sum
          };
        });
      }
      if (get_data['data'].length > 0) {
        this.nonbookdata = this.stock_non_booking_B_To_B
        // console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B);
        for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
          // console.log("stock_non_booking_B_To_B", this.stock_non_booking_B_To_B[i]['rcvd_wgt']);  
          this.tot_non_clr_wgt = 1 * this.stock_non_booking_B_To_B[i]['rcvd_wgt'] + this.tot_non_clr_wgt
          this.tot_non_clr_ctn = 1 * this.stock_non_booking_B_To_B[i]['total_carton'] + this.tot_non_clr_ctn
        }
        for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
          for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
            var color = '#'; // <-----------
            var letters = '0123456789ABCDEF';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            if (this.stock_non_booking_B_To_B[i].invoice_no == this.stock_booking_B_To_B[j].invoice_no) {

              this.stock_non_booking_B_To_B[i].color = color
              this.stock_booking_B_To_B[j].color = color
              console.log("1", this.stock_non_booking_B_To_B[i].color, this.stock_booking_B_To_B[j].color)

            }

          }
        }
        if (this.stock_non_booking_B_To_B) {
          this.non_arr = []
          this.stock_non_booking_B_To_B.forEach((obj) => {
            if (obj.invoice_no && !includes(this.non_arr, obj.invoice_no)) {
              // console.log('res', arr)
              this.non_arr.push(obj.invoice_no)
            }
          });
          this.stock_non_booking_B_To_B.forEach((obj) => {
            if (obj.transit_type_name && !includes(this.mode, obj.transit_type_name)) {
              // console.log('res', this.mode)
              this.mode.push(obj.transit_type_name)
            }
          });
          this.stock_non_booking_B_To_B.forEach((obj) => {
            if (obj.print_title && !includes(this.country, obj.print_title)) {
              this.country.push(obj.print_title)
            }
          });
        }
      } else {
        this.stock_non_booking_B_To_B = []
      }
    })
    this.serviceNew.get_booking_B_To_B(this.manifest, id.ptp_mf_no).subscribe(get_data => {
      this.stock_booking_B_To_B = get_data['data'];
      //  if (this.stock_non_booking_B_To_B.length > 0) {
      this.totalWeightSumRef2 = 0;
      this.totalCartonRight = 0;
      const uniqueInvoices = new Set();

      this.stock_booking_B_To_B = this.stock_booking_B_To_B.map(r => {
        if (r['invoice_no']) {
          uniqueInvoices.add(r['invoice_no']);
        }
        const total_wt_sum = this.sumNumbers(r['carton_weight']);
        this.totalWeightSumRef2 += total_wt_sum; // Accumulate the sum
        this.totalCartonRight = uniqueInvoices.size; // Add to total

        return {
          ...r,
          total_wt_sum: total_wt_sum
        };
      });

      // }
      // console.log("stock_booking_B_To_B", this.stock_booking_B_To_B);
      if (get_data['data'].length > 0) {
        this.bookdata = this.stock_booking_B_To_B
        for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {
          // this.tot_clr_wgt = 1 * this.stock_booking_B_To_B[i]['rcvd_wgt'] + this.tot_clr_wgt
          this.tot_clr_wgt = 1 * this.stock_booking_B_To_B[i]['rcvd_wgt'] + this.tot_clr_wgt
          this.tot_clr_ctn = 1 * this.stock_booking_B_To_B[i]['total_carton'] + this.tot_clr_ctn
        }
        for (let i = 0; i < this.stock_non_booking_B_To_B.length; i++) {
          for (let j = 0; j < this.stock_booking_B_To_B.length; j++) {
            var color = '#'; // <-----------
            var letters = '0123456789ABCDEF';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            if (this.stock_non_booking_B_To_B[i].invoice_no == this.stock_booking_B_To_B[j].invoice_no) {

              this.stock_non_booking_B_To_B[i].color = color
              this.stock_booking_B_To_B[j].color = color
              // console.log("1", this.stock_non_booking_B_To_B[i].invoice_no, this.stock_booking_B_To_B[j].invoice_no)

            }

          }
        }
        if (this.stock_booking_B_To_B) {
          this.arr = []
          this.stock_booking_B_To_B.forEach((obj) => {
            if (obj.invoice_no && !includes(this.arr, obj.invoice_no)) {
              // console.log('res', this.arr)
              this.arr.push(obj.invoice_no)
            }
          });
          this.stock_booking_B_To_B.forEach((obj) => {
            if (obj.transit_type_name && !includes(this.bookmode, obj.transit_type_name)) {
              // console.log('res', this.mode)
              this.bookmode.push(obj.transit_type_name)
            }
          });
          this.stock_booking_B_To_B.forEach((obj) => {
            if (obj.print_title && !includes(this.bookcountry, obj.print_title)) {
              // console.log('res', this.mode)
              this.bookcountry.push(obj.print_title)
            }
          });
        }
      } else {
        this.stock_booking_B_To_B = []
      }
    })
  }
  toggleAllSelection(event: any) {
    const isChecked = event.target.checked;
    this.stock_B_To_B.forEach(item => {
      item.checked = isChecked;
      this.onChange(isChecked, item.ptp_mf_no, item.total_carton, item.total_weight);
      this.updateCheckedManifests({ target: { checked: isChecked } }, item.ptp_mf_no);
    });
  }
  updateCheckedManifests(event: any, manifestNo: string): void {
    const isChecked = event.target.checked;

    if (isChecked === true) {
      // Add manifest if checked
      if (!this.checkedManifests.includes(manifestNo)) {
        this.checkedManifests.push(manifestNo);
      }
    } else if (isChecked === false) {
      // Remove manifest if unchecked
      this.checkedManifests = this.checkedManifests.filter(m => m !== manifestNo);
    }

    console.log("Checked Manifests:", this.checkedManifests);
  }
  barcodefocus() {
    this.save.nativeElement.focus();
  }

  CheckAllOptions(isChecked: boolean): void {
    this.selected3 = [];

    if (!isChecked) {
      this.stock_B_To_B.forEach(val => val.checked = false);
      this.checkedManifests = [];
      this.BookingAndNonBokking({ ptp_mf_no: [] });
    } else {
      this.stock_B_To_B.forEach(val => {
        val.checked = true;
        this.selected3.push(val.ptp_mf_no);
      });
      this.checkedManifests = [...this.selected3];
      this.BookingAndNonBokking({ ptp_mf_no: this.selected3 });
    }
  }


  bindHeaderCheckboxEvent(): void {
    setTimeout(() => {
      const headerCheckbox = document.querySelector('.e-headercell .e-checkbox-wrapper') as HTMLElement;

      if (headerCheckbox) {
        headerCheckbox.addEventListener('click', () => {
          if (!this.headerCheckboxClicked) {
            this.headerCheckboxClicked = true;

            // Delay to allow checkbox state to update in the DOM
            setTimeout(() => {
              const input = headerCheckbox.querySelector('input[type="checkbox"]') as HTMLInputElement;
              const isChecked = input.checked;

              this.onHeaderCheckboxClick(isChecked);  // ✅ Now reflects actual post-click state

              this.headerCheckboxClicked = false;
            }, 50); // Small delay (50ms) is enough
          }
        });
      }
    }, 0);
  }



  onHeaderCheckboxClick(isChecked: boolean): void {
    this.CheckAllOptions(isChecked);
    console.log('✅ Header checkbox clicked. Checked:', isChecked);
  }

  private headerCheckboxClicked = false;


  // Called when a row checkbox is selected
  onRowSelected(event: any): void {
    // Prevent running logic when not interacted directly
    if (!event.isInteracted) return;

    const rowData = event.data;

    // Simulate the logic for a single checkbox row selection
    const isChecked = true; // because this is "rowSelected", it's already selected

    // Update that particular row's checked property
    rowData.checked = isChecked;

    this.onChange(isChecked, rowData.ptp_mf_no, rowData.total_carton, rowData.total_weight);
    this.updateCheckedManifests({ target: { checked: isChecked } }, rowData.ptp_mf_no);
  }

  onRowDeselected(event: any): void {
    if (!event.isInteracted) return;

    const rowData = event.data;
    const isChecked = false;

    rowData.checked = isChecked;

    this.onChange(isChecked, rowData.ptp_mf_no, rowData.total_carton, rowData.total_weight);
    this.updateCheckedManifests({ target: { checked: isChecked } }, rowData.ptp_mf_no);
  }
  sendData(data) {
    const sampleData = {
      inv_no: data.invoice_no,
      view_modify: 'modify',
      inv_id: data.invoice_id
    };
    this.serviceNew.sendData(sampleData);
  }
  allAadharReceivedUrls: any = { files: [] };
  name: any = '';
  aadharNo: any = '';
  aadharAddress: any = ''
  HawbNo: any = ''
  allDate: any = {}
  frontAadhaarData: any = null;
  backAadhaarData: any = null;
  frontUploaded: boolean = false;
  backUploaded: boolean = false;
  // previewUrlFront: string | ArrayBuffer | null = null;
  // previewUrlBack: string | ArrayBuffer | null = null;
  aadhaar_loading: boolean = false; // Fixed variable name spelling
  previewUrlFront: any;
  previewUrlBack: any;
  frontaddharIngFile = ''
  BackaddharIngFile = ''
  finalWeight = 0

  validateChangeAadhar = false;
  invocieBagNo: any;
  async viewAadharVerifycation(data) {
    this.validateChangeAadhar = false;
    this.previewUrlFront = ''
    this.previewUrlBack = ''
    this.frontUploaded = false;
    this.backUploaded = false;
    this.frontaddharIngFile = ''
    this.BackaddharIngFile = ''

    if (data) {
      if (String(data.bag_no).length == 7 && String(data.bag_no).charAt(6).toUpperCase() != 'A') {
        this.validateChangeAadhar = true;
      }
      // data.aadhar_url_front= this.convertToPreviewUrl(data.aadhar_url_front),
      // data.aadhar_url_back= this.convertToPreviewUrl(data.aadhar_url_front),

      this.allDate = data

      if (this.allDate.final_weight_image && !(String(this.allDate.final_weight_image).includes('https://api.cargoforce.com/origin_v2/api_php_booking/finalImg'))) {
        this.allDate.final_weight_image = "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + this.allDate.final_weight_image
      }


      this.name = data.aadhar_name ? data.aadhar_name : '';
      // this.aadharNo=data.aadhar_no ? data.aadhar_no : '';
      this.formatAadhar(data.aadhar_no ? data.aadhar_no : '')
      this.aadharAddress = data.aadhar_address ? data.aadhar_address : '';
      this.HawbNo = data.invoice_no ? data.invoice_no : '';
      this.invocieBagNo = data.bag_no ? data.bag_no : '';
      this.finalWeight = data.manifest_final_wt ? data.manifest_final_wt : 0;
      const inputElement = document.getElementById('aadhaarBack') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
      const aadhaarFront = document.getElementById('aadhaarFront') as HTMLInputElement;
      if (aadhaarFront) {
        aadhaarFront.value = '';
      }
    }
    //  this.getDriveAadhar(data.aadhar_no)
  }
  closeDialog(): void {
    // this.dialogRef.close();
  }
  OpenDelhivery() {
    // //console.log('mawb');
    // const dialogConfig1 = new MatDialogConfig();
    // dialogConfig1.backdropClass = 'custom-backdrop';
    // dialogConfig1.panelClass = 'custom-dialog-container';
    // dialogConfig1.disableClose = true;
    // dialogConfig1.width = '95%';
    // dialogConfig1.height = 'fit-content';
    // dialogConfig1.position = { top: '3%' }; // Set position to top 7%

    // this.delhiveryDialogRef = this.dialog.open(this.DELHIVERY, dialogConfig1);

    // this.delhiveryDialogRef.afterClosed().subscribe((result) => {
    //   console.log('The dialog was closed');
    // });
  }
  OpenSheetData() {
    // //console.log('mawb');
    // const dialogConfig1 = new MatDialogConfig();
    // dialogConfig1.backdropClass = 'custom-backdrop';
    // dialogConfig1.panelClass = 'custom-dialog-container';
    // dialogConfig1.disableClose = true;
    // dialogConfig1.width = '95%';
    // dialogConfig1.height = 'fit-content';
    // dialogConfig1.position = { top: '3%' }; // Set position to top 7%
    this.SheetData.open()
    // this.delhiveryDialogRef = this.dialog.open(this.SheetData, dialogConfig1);

    // this.delhiveryDialogRef.afterClosed().subscribe((result) => {
    //   console.log('The dialog was closed');
    // });
  }
  formatAadhar(value: string) {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '').substring(0, 12);

    // Group into XXXX XXXX XXXX
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }

    this.aadharNo = parts.join(' ');
  }

  UpdateAadharDetails() {
    console.log("Checked Manifests:", this.checkedManifests);

    const information = {
      carton_id: this.allDate.carton_id,
      aadhar_no: this.aadharNo,
      address: this.aadharAddress,
      name: this.name,
      aadhar_front: this.allDate.aadhar_url_front ? this.allDate.aadhar_url_front : '',
      aadhar_back: this.allDate.aadhar_url_back ? this.allDate.aadhar_url_back : ''
    };

    const Ad = {
      name: this.name,
      aadhar_no: this.aadharNo,
      address: this.aadharAddress,
      hawb_no: this.HawbNo,
      created_by: this.userid.v_user_id,
      manifest_final_wt: this.finalWeight,
      bag_no: this.invocieBagNo
    };

    const cartonUpdate$ = this.serviceNew.v1_SP_ds_carton_aadhar_Update(information);
    const hawbUpdate$ = this.serviceNew.v1_sp_ds_hawb_aadhar_details_Update(Ad);

    forkJoin([cartonUpdate$, hawbUpdate$]).subscribe({
      next: ([cartonRes, hawbRes]) => {
        console.log('Carton Aadhar updated:', cartonRes);
        console.log('HAWB Aadhar updated:', hawbRes);

        const id = {
          ptp_mf_no: this.checkedManifests.join(',')
        };
        this.BookingAndNonBokking(id);

        this.allAadharReceivedUrls = { files: [] };
        this.validateChangeAadhar = false;
        this.frontUploaded = false;
        this.backUploaded = false;
        // this.isUploaded = false;

        if (hawbRes['code']) {
          this.showMessage("Updated Successfully");
          this.AadharVerifycation.close();
        }
      },
      error: (err) => {
        console.error('Error updating Aadhar details:', err);
        // this.isUploaded = false;
      }
    });
  }
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
  btn3

  rowClicked_booked: any;
  rowClicked: any;
  PackingConditionReceivingBranch: any;

  changeTableRowColor(idx: any) {
    this.rowClicked_booked = null;
    this.rowClicked = idx;
  }
  changeTableRowColor_booked(idx: any) {
    this.rowClicked_booked = idx;
    this.rowClicked = null;
  }
  getPackingConditionReceivingBranch() {
    this.service.getPackingConditionReceivingBranch().subscribe(get_data => {
      this.PackingConditionReceivingBranch = get_data['data'];
    })
  }

  BookingAndNonBokkingautostart() {
    var id = {
      ptp_mf_no: '1'
    }
    this.BookingAndNonBokking(id)


  }
  windowOpen(url: string): void {
    window.open(url, '_blank');
  }

  openModelForEdit(data) {
    this.preparePreview(data.aadhar_url_front, 'front');
    this.preparePreview(data.aadhar_url_back, 'back');
    this.preparePreviewnew(data.final_weight_image, 'finalWeight')
    this.ManifestModel.open()
  }

  submitForm($ev, value: any) {
    console.log(this.checkedManifests)
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (value.p_invoiceNumber == "" || value.p_invoiceNumber == null) {
      this.showMessage('Please Enter HAWB No.', 'warning');
    }
    else if (value.p_cartonNumber == "" || value.p_cartonNumber == null) {
      this.showMessage('Please Enter Carton No', 'warning');
    }
    // else if(value.p_total_cartonNumber == "" || value.p_total_cartonNumber == null)
    // {
    //   this.toastr.warningToastr('Failed', 'Please Enter Total Package');
    // }
    else if (value.p_cartonWeight == "" || value.p_cartonWeight == null) {
      this.showMessage('Please Enter Weight', 'warning');
    }
    // else if(value.p_delivery_state == "" || value.p_delivery_state == null)
    // {
    //   this.toastr.warningToastr('Failed', 'Please Enter Delivery State');
    // }
    else if (value.p_packingCondition == "" || value.p_packingCondition == null) {
      this.showMessage('Please Enter Packing Condition', 'warning');
    }
    else if (value.p_cartonWeight == 0 || value.p_cartonWeight == 0.00) {
      this.showMessage('Weight cannot be 0', 'warning');
    }
    else {
      if (this.valForm.valid) {
        console.log(value)
        this.prodata.manifestNumber = this.manifest;
        this.prodata.scanBy = this.userid.v_user_id;
        // this.c_id = 
        this.prodata.carton_id = value.carton_id;
        this.serviceNew.InsertNonbookToBookBulk(this.prodata).subscribe(res1 => {
          // console.log('res1', res1)
          if (res1['code'] == '200') {
            this.tot_non_clr_wgt = 0;
            this.tot_non_clr_ctn = 0;
            this.getstock_B_To_B();
            this.rowClicked = -1;
            // console.log('data', res1['code'])
            this.showMessage('Successfully Added.');
            this.ManifestModel.close()
            this.checkall = false
            this.prodata =
            {
              manifestNumber: "",
              carton_id: "",
              scanBy: ""
            }
            this.c_id = ""
            this.selected2 = []
            var id = {
              ptp_mf_no: this.checkedManifests
            }
            this.BookingAndNonBokking(id)
          }
          else {
            console.log(res1['data'][0])
            this.showMessage(res1['data'][0], 'error')
          }
        })
        // console.log('value', value)
        // if (this.assign_destination == "" || this.assign_destination == null) {
        //   this.toastr.errorToastr('Failed', 'Please Select Destination');
        // }
        // else
        // this.service.InsertToGoCargo(value).subscribe(res1 => {
        //   // console.log('res1', res1)
        //   if (res1['code'] == '200') {
        //     this.rowClicked = null;
        //     this.getstock_B_To_B();
        //     if (this.delhiveryDialogRef)
        //       this.delhiveryDialogRef.close()
        //     // console.log('data', res1['code'])
        //     this.toastr.successToastr('Successfully Added.', 'Success!');
        //     this.reset()
        //     var id = {
        //       ptp_mf_no: this.checkedManifests.join(',')
        //     }
        //     this.BookingAndNonBokking(id)
        //   }
        //   else {
        //     this.toastr.errorToastr('Failed', res1['data']);
        //   }

        // });
      } else {
        if (!this.valForm.valid) {
          Object.keys(this.valForm.controls).forEach(field => {
            const control = this.valForm.get(field);
            if (control && control.invalid) {
              console.log(`Invalid field: ${field}`, control.errors);
            }
          });
          this.showMessage('Please fill all required fields correctly.', 'error');
          return;
        }

      }
    }

  }
  btn = '1'
  reset() {


    this.btn = '3';
    this.selecteddel = []
    this.frontUploaded = false;
    this.backUploaded = false;
    this.valForm.reset();
    this.valForm_assign.reset();
    this.changeTableRowColor(-1)
    this.changeTableRowColor_booked(-1)

    this.userid = JSON.parse(localStorage.getItem("log_data"))
    // console.log("usid", this.userid.v_user_id);
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
  getconfigure_destination_b_to_b() {
    this.service.getconfigure_destination_b_to_b().subscribe(get_data => {
      this.configure_destination_b_to_b = get_data['data'];
    })
  }
  getReasonCombobox_b_to_b() {
    this.service.getReasonCombobox_b_to_b('12').subscribe(get_data => {
      this.ReasonCombobox_b_to_b = get_data['data'];
      // console.log("ReasonCombobox_b_to_b", this.ReasonCombobox_b_to_b);
    })
  }

  // convertToPreviewUrl(driveUrl: string): string {
  //   if (String(driveUrl).trim().length == 0) {
  //     return '';
  //   }
  //   const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  //   const match = driveUrl.match(regex);
  //   if (match && match[1]) {
  //     const fileId = match[1];
  //     return `https://drive.google.com/file/d/${fileId}/preview`;
  //   }
  //   return driveUrl; // fallback if no match
  // }
  private isDriveUrl(u: string) {
    return /https?:\/\/(drive|docs)\.google\.com\/file\/d\//i.test(u);
  }
  private toDrivePreview(u: string) {
    const m = u.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return m && m[1]
      ? `https://drive.google.com/file/d/${m[1]}/preview`
      : u;
  }
  private isPdf(u: string) {
    return /\.pdf(\?|#|$)/i.test(u);
  }
  private isImage(u: string) {
    return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(u);
  }
  private lastSegment(u: string) {
    try {
      const url = new URL(u);
      const p = url.pathname.split('/').filter(Boolean);
      return p[p.length - 1] || u;
    } catch {
      const p = u.split('?')[0].split('/').filter(Boolean);
      return p[p.length - 1] || u;
    }
  }
  front: PreviewModel = { kind: 'none' };
  back: PreviewModel = { kind: 'none' };
  weighturl: PreviewModel = { kind: 'none' };
  /**
   * Main decide-and-prepare method
   */
  preparePreview(rawUrl: string | null | undefined, slot: 'front' | 'back') {
    const set = (pm: PreviewModel) => {
      if (slot === 'front') this.front = pm; else this.back = pm;
    };

    const inputUrl = String(rawUrl || '').trim();
    if (!inputUrl) return set({ kind: 'none' });

    // 1) Google Drive -> iframe with /preview
    if (this.isDriveUrl(inputUrl)) {
      const preview = this.toDrivePreview(inputUrl);
      return set({
        kind: 'drive',
        url: preview,
        safeSrc: this.sanitizer.bypassSecurityTrustResourceUrl(preview)
      });
    }

    // 2) Direct PDF -> ngx-doc-viewer
    if (this.isPdf(inputUrl)) {
      return set({ kind: 'pdf', url: inputUrl });
    }

    // 3) For everything else, hit your preview API (returns HTML page or JSON)
    const key = this.lastSegment(inputUrl);

    // IMPORTANT: ensure the service returns TEXT when server responds with HTML.
    // If your current method doesn't, add overload or pass options like { responseType: 'text' }.
    // We'll handle both cases (string or object).
    this.serviceNew.getimgpreview(key, 'aadhar', { responseType: 'text' as 'json' }).subscribe({
      next: (res: any) => {
        // Case A: API responded with a full HTML document as string
        if (typeof res === 'string' && /<html[\s\S]*>[\s\S]*<\/html>/i.test(res) && !String(inputUrl).includes('.pdf')) {
          const blob = new Blob([res], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          return set({
            kind: 'iframe',
            safeSrc: this.sanitizer.bypassSecurityTrustResourceUrl(url)
          });
        }

        // Case B: API returned JSON (try to parse if res is string JSON)
        let json: any = res;
        if (typeof res === 'string') {
          try { json = JSON.parse(res); } catch { /* not JSON, fall through */ }
        }

        // { html: string } -> show as iframe via Blob (so scripts/styles execute)
        if (json && typeof json.html === 'string' && !String(inputUrl).includes('.pdf')) {
          const blob = new Blob([json.html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          return set({
            kind: 'iframe',
            safeSrc: this.sanitizer.bypassSecurityTrustResourceUrl(url)
          });
        }

        // { url: string } -> decide by extension
        if (json && typeof json.url === 'string') {
          const candidate = json.url;
          if (this.isPdf(candidate)) {
            return set({ kind: 'pdf', url: candidate });
          }
          if (this.isImage(candidate)) {
            return set({ kind: 'img', url: candidate });
          }
          // Unknown -> try doc-viewer anyway
          return set({ kind: 'pdf', url: candidate });
        }

        // Fallbacks if API returns unexpected content
        if (this.isImage(inputUrl)) {
          return set({ kind: 'img', url: inputUrl });
        }
        return set({ kind: 'pdf', url: inputUrl });
      },

      error: () => {
        // Network/proxy error -> fallback based on original URL
        if (this.isImage(inputUrl)) {
          return set({ kind: 'img', url: inputUrl });
        }
        return set({ kind: 'pdf', url: inputUrl });
      }
    });
  }

  preparePreviewnew(rawUrl: string | null | undefined, slot: 'finalWeight') {
    const set = (pm: PreviewModel) => {
      this.weighturl = pm;
    };

    const inputUrl = String(rawUrl || '').trim();
    if (!inputUrl) return set({ kind: 'none' });

    // 1) Google Drive -> iframe with /preview
    if (this.isDriveUrl(inputUrl)) {
      const preview = this.toDrivePreview(inputUrl);
      return set({
        kind: 'drive',
        url: preview,
        safeSrc: this.sanitizer.bypassSecurityTrustResourceUrl(preview)
      });
    }

    // 2) Direct PDF -> ngx-doc-viewer
    if (this.isPdf(inputUrl)) {
      return set({ kind: 'pdf', url: inputUrl });
    }

    // 3) For everything else, hit your preview API (returns HTML page or JSON)
    const key = this.lastSegment(inputUrl);

    // IMPORTANT: ensure the service returns TEXT when server responds with HTML.
    // If your current method doesn't, add overload or pass options like { responseType: 'text' }.
    // We'll handle both cases (string or object).
    this.serviceNew.getimgpreview(key, 'final', { responseType: 'text' as 'json' }).subscribe({
      next: (res: any) => {
        // Case A: API responded with a full HTML document as string
        if (typeof res === 'string' && /<html[\s\S]*>[\s\S]*<\/html>/i.test(res)) {
          const blob = new Blob([res], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          return set({
            kind: 'iframe',
            safeSrc: this.sanitizer.bypassSecurityTrustResourceUrl(url)
          });
        }

        // Case B: API returned JSON (try to parse if res is string JSON)
        let json: any = res;
        if (typeof res === 'string') {
          try { json = JSON.parse(res); } catch { /* not JSON, fall through */ }
        }

        // { html: string } -> show as iframe via Blob (so scripts/styles execute)
        if (json && typeof json.html === 'string') {
          const blob = new Blob([json.html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          return set({
            kind: 'iframe',
            safeSrc: this.sanitizer.bypassSecurityTrustResourceUrl(url)
          });
        }

        // { url: string } -> decide by extension
        if (json && typeof json.url === 'string') {
          const candidate = json.url;
          if (this.isPdf(candidate)) {
            return set({ kind: 'pdf', url: candidate });
          }
          if (this.isImage(candidate)) {
            return set({ kind: 'img', url: candidate });
          }
          // Unknown -> try doc-viewer anyway
          return set({ kind: 'pdf', url: candidate });
        }

        // Fallbacks if API returns unexpected content
        if (this.isImage(inputUrl)) {
          return set({ kind: 'img', url: inputUrl });
        }
        return set({ kind: 'pdf', url: inputUrl });
      },

      error: () => {
        // Network/proxy error -> fallback based on original URL
        if (this.isImage(inputUrl)) {
          return set({ kind: 'img', url: inputUrl });
        }
        return set({ kind: 'pdf', url: inputUrl });
      }
    });
  }
  reUploadAadhar() {
    if (this.allDate.aadhar_no != this.aadharNo) {
      // this.getDriveAadhar(this.allDate.aadhar_no)

    }
    this.name = this.allDate.aadhar_name ? this.allDate.aadhar_name : '';
    this.aadharNo = this.allDate.aadhar_no ? this.allDate.aadhar_no : '';
    this.aadharAddress = this.allDate.aadhar_address ? this.allDate.aadhar_address : '';
    this.HawbNo = this.allDate.invoice_no ? this.allDate.invoice_no : '';
    this.previewUrlFront = ''
    this.previewUrlBack = ''
    this.frontUploaded = false;
    this.backUploaded = false;
    this.validateChangeAadhar = true;
    this.frontaddharIngFile = ''
    this.BackaddharIngFile = ''


  }
  assignnonbook(id) {
    // id=id.data
    console.log(id)
    this.btn = '1'
    // console.log(id);
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
    this.valForm.controls['carton_id'].setValue(id.carton_id);
    this.valForm_assign.controls['Box_No'].setValue(id.box_no);
  }
  ptp_id: any;

  assignbook(id) {
    this.btn = '2'
    // console.log(id);
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
  getsearchbyinvoice(value: any) {
    this.valForm_assign.reset();
    // console.log(value.p_invoiceNumber)
    this.inv_no = value.p_invoiceNumber;
    this.service.getManualInvoiceDetails(value.p_invoiceNumber).subscribe(get_data => {
      this.ManualInvoiceDetails = get_data['data'];
      // console.log("ManualInvoiceDetails", this.ManualInvoiceDetails);
      if (this.ManualInvoiceDetails == null || this.ManualInvoiceDetails == "" || this.ManualInvoiceDetails == undefined) {
        this.showMessage('Invoice Does Not Exist', 'error');
        //  this.reset()
        this.invoiceno.nativeElement.focus();
      }
      else {
        //  this.valForm_assign.controls['Delivery_Area'].setValue(this.ManualInvoiceDetails[0].delivery_area_code_name)
        //  this.valForm_assign.controls['Delivery_State'].setValue(this.ManualInvoiceDetails[0].delivery_state_name)
        this.valForm_assign.controls['Receiver_Address'].setValue(this.ManualInvoiceDetails[0].receiver_address)
        this.valForm.controls['p_total_cartonNumber'].setValue(this.ManualInvoiceDetails[0].total_ctn)
        this.carton.nativeElement.focus();
      }
    })
  }
  getsearchbycarton(value: any) {
    //  this.btn='2';
    // console.log(value.p_cartonNumber)
    this.service.getManualCartonDetails(value.p_cartonNumber, '-1', this.inv_no, 'FWD').subscribe(get_data => {
      this.ManualCartonDetails = get_data['data'];
      // console.log("ManualCartonDetails", this.ManualCartonDetails);
      if (this.ManualCartonDetails == "" || this.ManualCartonDetails == null) {
        //  this.valForm_assign.controls['Delivery_Area'].setValue('NR')
        this.showMessage('Carton Does Not Exist', 'error');
        this.carton.nativeElement.focus();
      }
      else {
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
  getsearchbybarcode(value: any) {
    //  this.btn='2';
    this.valForm.controls['p_invoiceNumber'].enable();
    // console.log(value.p_barcodeNumber)
    this.service.getManualbarcodeDetails('-1', value.p_barcodeNumber, 'FWD').subscribe(get_data => {
      this.ManualbarcodeDetails = get_data['data'];
      // console.log("ManualbarcodeDetails", this.ManualbarcodeDetails);
      if (this.ManualbarcodeDetails == "" || this.ManualbarcodeDetails == null) {
        this.valForm_assign.controls['Delivery_Area'].setValue('NR')
        this.showMessage('Barcode Does Not Exist', 'error');
        this.barcode.nativeElement.focus();
      }
      else {
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
        this.booked_location = this.ManualbarcodeDetails[0].v_wh_location_name;

        this.save.nativeElement.focus();
      }
    })
  }
  barcoderadio() {
    this.valForm.controls['p_invoiceNumber'].disable();
    this.valForm.controls['p_barcodeNumber'].enable();
    this.barcode.nativeElement.focus();
  }
  invoiceradio() {
    this.valForm.controls['p_barcodeNumber'].disable();
    this.valForm.controls['p_invoiceNumber'].enable();
    this.invoiceno.nativeElement.focus();
  }

  onToolbarClick(args: any): void {
    if (args.item.id.includes('add')) {
      const selectedRecords = this.nonBookGrid.getSelectedRecords();
      const selectedCount = selectedRecords.length;

      if (selectedCount > 0) {
        Swal.fire({
          title: 'Add',
          text: `Do you really want to add ${selectedCount} item(s)?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          reverseButtons: true,
          width: '300px',
          customClass: {
            confirmButton: 'btn-ok',
            cancelButton: 'btn-cancel'
          },
          preConfirm: () => {
            this.save2();
          }
        });
      } else {
        this.showMessage("No item selected to add.", 'error');
      }
    }
  }
  c_id = "";
  prodata = {
    manifestNumber: "",
    carton_id: " ",
    scanBy: ""
  }
  checkall = false;
  save2() {
    this.c_id = ""
    // console.log("selected2", this.selected2);
    for (let i = 0; i < this.selected2.length; i++) {
      var a = this.selected2[i]
      if (this.c_id == undefined) {
        this.c_id = a
        // console.log("b1", this.c_id);
      }
      else {
        this.c_id = a + ',' + this.c_id;
        // console.log("b", this.c_id);
      }
    }
    this.prodata.manifestNumber = this.manifest;
    this.prodata.scanBy = this.userid.v_user_id;
    this.c_id = this.c_id.replace(/,\s*$/, "");
    this.prodata.carton_id = this.c_id;
    this.serviceNew.InsertNonbookToBookBulk(this.prodata).subscribe(res1 => {
      // console.log('res1', res1)
      if (res1['code'] == '200') {
        this.tot_non_clr_wgt = 0;
        this.tot_non_clr_ctn = 0;
        this.getstock_B_To_B()
        // console.log('data', res1['code'])
        this.showMessage('Successfully Added.', 'success');
        this.availablenonbooking.close()
        this.checkall = false
        this.prodata =
        {
          manifestNumber: "",
          carton_id: "",
          scanBy: ""
        }
        this.c_id = ""
        this.selected2 = []
        var id = {
          ptp_mf_no: this.checkedManifests
        }
        this.BookingAndNonBokking(id)
      }
      else {
        console.log(res1['data'][0])
        this.showMessage(res1['data'][0], 'error')
      }
    })
  }
  selected2_inv = []
  selected2_wt = []
  arrall = []
  tot_clr_wgt_add_all: number;
  tot_clr_ctn_add_all: number;
  setCartonId() {
    const selectedRecords = this.nonBookGrid.getSelectedRecords();
    const totalRows = this.stock_non_booking_B_To_B.length;

    // Reset values
    this.selected2 = [];
    this.selected2_inv = [];
    this.selected2_wt = [];
    this.arrall = [];
    this.tot_clr_wgt_add_all = 0;
    this.tot_clr_ctn_add_all = 0;

    if (selectedRecords.length === totalRows) {
      this.checkall = true;
    } else {
      this.checkall = false;
    }

    selectedRecords.forEach(row => {
      this.selected2.push(row.carton_id);
      this.selected2_inv.push(row.invoice_no);
      this.selected2_wt.push(row.rcvd_wgt);

      this.tot_clr_wgt_add_all += Number(row.rcvd_wgt);
      this.tot_clr_ctn_add_all += Number(row.total_carton);
    });

    this.arrall = Array.from(new Set(this.selected2_inv));
  }
  delete() {
    this.selected;
    // console.log('sel', this.selected);

    Swal.fire({
      title: 'Delete',
      text: 'Do you really want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      width: '300px',
      customClass: {
        confirmButton: 'btn-ok',
        cancelButton: 'btn-cancel'
      },
      preConfirm: () => {
        if (this.btn == '4') {
          this.ptp_id = this.selecteddel;
          this.serviceNew.deleteForwardingBranchBookingall(this.ptp_id).subscribe(res => {
            if (res['code'] == '200') {
              this.getstock_B_To_B();
              this.showMessage('Delete Success');
              this.reset();
              var id = { ptp_mf_no: this.selected };
              this.BookingAndNonBokking(id);
            } else {
              this.showMessage(res['data'], 'error');
            }
          });
        } else {
          this.service.deleteForwardingBranchBooking(this.ptp_id).subscribe(res => {
            if (res['code'] == '200') {
              this.getstock_B_To_B();
              this.showMessage('Delete Success');
              this.reset();
              var id = { ptp_mf_no: this.selected };
              this.BookingAndNonBokking(id);
            } else {
              this.showMessage(res['data'], 'error');
            }
          });
        }
      }
    });
  }
  CheckAlldelete() {
    this.btn = '4';

    if (this.stock_booking_B_To_B.every(val => val.checked === true)) {
      // UNCHECK all
      this.stock_booking_B_To_B.forEach(val => { val.checked = false });
      for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {
        const ids = String(this.stock_booking_B_To_B[i].mf_details_id).split(',');
        ids.forEach(id => {
          const index = this.selecteddel.indexOf(id);
          if (index > -1) {
            this.selecteddel.splice(index, 1);
          }
        });
      }
    } else {
      // CHECK all
      this.stock_booking_B_To_B.forEach(val => { val.checked = true });
      for (let i = 0; i < this.stock_booking_B_To_B.length; i++) {
        const ids = String(this.stock_booking_B_To_B[i].mf_details_id).split(',');
        ids.forEach(id => {
          if (!this.selecteddel.includes(id)) {
            this.selecteddel.push(id);
          }
        });
      }
    }
  }
  trackByFn(index: number, item: any): number {
    return item.invoice_no;  // or any unique identifier
  }

  onChangedelete(event: Event, stock_non_booking_B_To_B: any) {
    this.btn = '4';

    const checked = (event.target as HTMLInputElement).checked; // Cast here
    const ids = String(stock_non_booking_B_To_B).split(',');

    if (checked) {
      ids.forEach(id => {
        if (!this.selecteddel.includes(id)) {
          this.selecteddel.push(id);
        }
      });
    } else {
      ids.forEach(id => {
        const index = this.selecteddel.indexOf(id);
        if (index > -1) {
          this.selecteddel.splice(index, 1);
        }
      });
    }

    // console.log("selecteddel", this.selecteddel);
  }


  SetData(data) {
    console.log(this.checkedManifests)
    this.aadharNo = data['Receiver_ID_ No']
    this.aadharAddress = data['Receiver_Address']
    this.name = data['Receiver_name']
    this.allDate.aadhar_url_front = data['Aadhaar_Link_1']
    this.allDate.aadhar_url_back = data['Aadhaar_Link_2']
    console.log(data)
    const information = {
      carton_id: this.allDate.carton_id,
      aadhar_no: this.aadharNo,
      address: this.aadharAddress,
      name: this.name,
      aadhar_front: data['Aadhaar_Link_1'],
      aadhar_back: data['Aadhaar_Link_2']
    };
    const pay = {
      sheetId: '16xsWmGzr0qgBefv_QcHOAT5qgufCDxrX7h7nMi9FfTc',
      sheetName: 'Adhar_Card',
      rowNumber: data['_row'],
      newData: [
        String(data.sr_no || ''),
        String(data.Receiver_name || ''),
        String(data.Receiver_Address || ''),
        String(data['Receiver_ID_ No'] || ''),
        String(data['Aadhaar_Link_1'] || ''),
        String(data['Aadhaar_Link_2'] || ''),
        Number(data.Count) ? Number(data.Count) + 1 : 1
      ]
    };
    this.serviceNew.updateSheetData(pay).toPromise()

    // Now, after uploading images, call the API to update Aadhar details
    this.serviceNew.v1_SP_ds_carton_aadhar_Update(information).subscribe(
      (response) => {
        this.preparePreview(data['Aadhaar_Link_1'], 'front');
        this.preparePreview(data['Aadhaar_Link_2'], 'back');
        // Successfully updated Aadhar details
        console.log('Aadhar details updated successfully:', response);
        var id = {
          ptp_mf_no: this.checkedManifests.join(',')
        }
        this.fetchSheetAadhar()

        // if (this.delhiveryDialogRef) {
        this.SheetData.close()

        // }

        this.BookingAndNonBokking(id);
        this.allAadharReceivedUrls = { files: [] };
        setTimeout(() => {
          // this.getDriveAadhar(this.aadharNo)
          this.fetchSheetAadhar()

        }, 0);

        // Update local state variables to enable "Update Details" button
        this.validateChangeAadhar = false;  // Enable Update Details button after successful update
        this.frontUploaded = true;
        this.backUploaded = true;
        this.isUploaded = true;

      },
      (error) => {
        this.isUploaded = false;

        console.error('Error updating Aadhar details:', error);
      }
    );
  }
  frontAadhaarCard(evt: any) {
    if (evt.target.files && evt.target.files.length > 0) {
      this.handleAadhaarUpload(evt, 'front');
    }
  }

  backAadhaarCard(evt: any) {
    if (evt.target.files && evt.target.files.length > 0) {
      this.handleAadhaarUpload(evt, 'back');
    }
  }


  get frontLabel() {
    return this.backUploaded && !this.frontUploaded
      ? 'Please upload Aadhaar Front'
      : 'Upload Aadhaar Front';
  }

  get backLabel() {
    return this.frontUploaded && !this.backUploaded
      ? 'Please upload Aadhaar Back'
      : 'Upload Aadhaar Back';
  }

  async handleAadhaarUpload(evt: any, side: 'front' | 'back') {
    this._spinner.show()

    const files = evt.target.files;
    if (!files || files.length === 0) return;

    let image = files[0];

    // Compression logic
    if (image.size > 3 * 1024 * 1024) {
      try {
        image = await this.compressImageTo2MB(image);
      } catch (error) {
        console.error('Error compressing image:', error);
        this.showMessage('Error compressing image. Please try again.', 'error');
        return;
      }
    }

    this.aadhaar_loading = true;

    // File preview
    const reader = new FileReader();
    reader.onload = () => {
      if (side === 'front') {
        this.previewUrlFront = reader.result;
      } else {
        this.previewUrlBack = reader.result;
      }
    };
    reader.readAsDataURL(image);

    // Update file name display
    const container = evt.target.closest('.upload-container');
    // const fileNameDiv = container.querySelector('.file-name');
    // fileNameDiv.textContent = image.name;
    // Service call with compressed/original image
    this.serviceNew.aadhaar_validation_upload(image).subscribe(
      (res) => {
        this._spinner.hide()

        this.aadhaar_loading = false;
        if (res['data']['status_code'] == "200") {
          const ocrFields = res['data']['data']['ocr_fields'];
          let hasFront = false;
          let hasBack = false;

          ocrFields.forEach((field) => {
            if (field['document_type'] === 'aadhaar_front_bottom') {
              if (field['full_name'].value || field['aadhaar_number'].value) {
                hasFront = true;
                this.onImageUploadAadhar(evt, 'aadharFrontName', true)
                this.frontAadhaarData = field;
                this.frontUploaded = true;
              }
            }

            if (field['document_type'] === 'aadhaar_back' || field['document_type'] === 'aadhaar_front_top') {
              if (field['address'].value) {
                hasBack = true;
                this.onImageUploadAadhar(evt, 'aadharBackName', false)

                this.backAadhaarData = field;
                this.backUploaded = true;
              }
            }
          });

          if (hasBack) this.backUploaded = true;
          if (hasFront) this.frontUploaded = true;

          this.setAadhaarFormValues();

          if (this.frontUploaded && this.backUploaded) {
            this.showMessage('Your details have been successfully populated. Please take a moment to review and confirm that everything is accurate. If any changes are required, feel free to update them now.');
          } else if (side === 'front' && !this.backUploaded) {
            this.showMessage('Aadhaar Front uploaded successfully. Please upload the back side for address verification.', 'info');
          } else if (side === 'back' && !this.frontUploaded) {
            this.showMessage('Aadhaar Back uploaded successfully. Please upload the front side for personal details verification.', 'info');
          }

        } else {
          this.resetAadhaarData(side);
          this.showMessage('Upload correct Aadhaar file!', 'error');
        }
      },
      (error) => {
        this._spinner.hide()

        this.aadhaar_loading = false;
        this.resetAadhaarData(side);
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'File Not Found!',
        //   text: 'Please save the file to your gallery or photos for easier uploading. Once saved, kindly open your gallery and upload the file from there. Thank you!',
        //   confirmButtonText: 'OK'
        // });
      }
    );
  }
  // onImageUploadAadharFront(data,data1){

  // }

  private resetAadhaarData(side: 'front' | 'back') {
    if (side === 'front') {
      this.frontAadhaarData = null;
      this.frontUploaded = false;
      this.previewUrlFront = null;
    } else {
      this.backAadhaarData = null;
      this.backUploaded = false;
      this.previewUrlBack = null;
    }
    this.setAadhaarFormValues(); // Clear form fields if upload fails
  }

  setAadhaarFormValues() {
    if (this.frontAadhaarData) {
      this.name = this.frontAadhaarData.full_name.value
      // this.valForm.controls['aadhar_fullname'].setValue(this.frontAadhaarData.full_name.value);
      // this.valForm.controls['receiver_name'].setValue(this.frontAadhaarData.full_name.value);
      this.aadharNo = this.frontAadhaarData.aadhaar_number.value
      // this.valForm.controls['aadhar_number'].setValue(this.frontAadhaarData.aadhaar_number.value);
    }

    if (this.backAadhaarData) {
      this.aadharAddress = this.backAadhaarData.address.value;
      // this.valForm.controls['aadhar_details'].setValue(this.backAadhaarData.address.value);
    }
    if (this.frontUploaded && !this.backUploaded) {
      this.showMessage("Plz Upload Aadhar Back", "info")
    }
    if (!this.frontUploaded && this.backUploaded) {
      this.showMessage("Plz Upload Aadhar Front", 'info')
    }
    // Final check for both sides uploaded
    // if (this.frontUploaded && this.backUploaded) {
    //   this.toastr.successToastr('Your details have been successfully populated. Please take a moment to review and confirm that everything is accurate. If any changes are required, feel free to update them now.');
    // }
  }
  DriveAadharImgUrl
  displayFileImg
  async onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {  // If file > 4MB, compress it
        try {
          const compressedFile = await this.compressImageTo2MB(file);
          this.DriveAadharImgUrl = compressedFile;
          this.displayFileImg = file.name;
          // console.log(this.uploadAadharImages())
        } catch (error) {
          console.error('Error compressing image:', error);
        }
      } else {
        this.DriveAadharImgUrl = file;
        this.displayFileImg = file.name;
      }
    }
  }
  DriveAadharImgUrlBack
  async onFileSelected1(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {  // If file > 4MB, compress it
        try {
          const compressedFile = await this.compressImageTo2MB(file);
          this.DriveAadharImgUrlBack = compressedFile;
        } catch (error) {
          console.error('Error compressing image:', error);
        }
      } else {
        this.DriveAadharImgUrlBack = file;
      }
    }
  }

  async compressImageTo2MB(image: File): Promise<File> {
    console.log("Compressing image to ≤2MB...");

    if (!image || !(image instanceof File)) {
      return Promise.reject('Invalid image file provided');
    }

    return new Promise<File>((resolve, reject) => { // Add <File> here
      const reader = new FileReader();
      reader.readAsDataURL(image);

      reader.onload = async () => {
        try {
          let quality = 90;
          let compressedBase64: string = reader.result as string;

          while (true) {
            const newCompressed = await this.imageCompress.compressFile(compressedBase64, -1, quality, quality);
            const blob = await fetch(newCompressed).then(res => res.blob());

            if (blob.size <= 2 * 1024 * 1024 || quality <= 10) {
              const compressedFile = new File([blob], image.name, { type: image.type });
              resolve(compressedFile);
              return;
            }

            quality -= 10;
            compressedBase64 = newCompressed;
          }
        } catch (error) {
          reject(`Image compression failed: ${error}`);
        }
      };

      reader.onerror = () => reject('Error reading the image file');
    });
  }


  aadharFrontBase64UrlBack = '';
  aadharFrontBase64Url = '';
  async onImageUploadAadhar(event: Event, name: string, isFront: boolean) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0]; // Removed optional chaining
      let compressedFile: File;
      try {
        if (file) {
          compressedFile = await this.compressImageTo2MB(file); // Compress image

        }

        const formData = new FormData();
        formData.append('avatar', compressedFile);

        this.serviceNew.imgUpload(formData).subscribe(data => {
          if (data['status'] === 'success' && data['url']) {
            this.serviceNew.getImage(data['url']).subscribe(response => {
              if (response['filename'] && response['base64']) {
                const fieldName = isFront ? 'aadharFrontName' : 'aadharBackName';
                // this.valForm.get(fieldName).setValue(response['filename']);

                if (isFront) {
                  this.frontaddharIngFile = 'https://api.cargoforce.com/Origin_v2/api_php_booking/upload/' + response['url']
                  this.aadharFrontBase64Url = response['base64'];
                } else {
                  this.BackaddharIngFile = 'https://api.cargoforce.com/Origin_v2/api_php_booking/upload/' + response['url']

                  this.aadharFrontBase64UrlBack = response['base64']; // Fixed incorrect property name
                }
              }
            });
          }
        });

      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  }
  async UpdateAadharDetailsImages() {
    this.isUploaded = true;
    try {
      // Upload Aadhar images first
      const aadharLinks = await this.uploadAadharImages();
      console.log(aadharLinks)
      // Prepare the information to be updated
      const information = {
        carton_id: this.allDate.carton_id,
        aadhar_no: this.aadharNo,
        address: this.aadharAddress,
        name: this.name,
        aadhar_front: aadharLinks.length > 0 ? aadharLinks[0] : '',
        aadhar_back: aadharLinks.length > 1 ? aadharLinks[1] : ''
      };

      if (!aadharLinks) {
        this.allDate.aadhar_url_front = '';
        this.allDate.aadhar_url_back = ''
      }
      if (aadharLinks.length <= 1) {
        this.allDate.aadhar_url_back = ''

      }

      if (aadharLinks.length > 0) {
        this.preparePreview(aadharLinks[0], 'front');
      }
      if (aadharLinks.length > 1) {
        this.preparePreview(aadharLinks[1], 'back');

      }
      // Now, after uploading images, call the API to update Aadhar details
      this.serviceNew.v1_SP_ds_carton_aadhar_Update(information).subscribe(
        (response) => {

          // Successfully updated Aadhar details
          console.log('Aadhar details updated successfully:', response);
          var id = {
            ptp_mf_no: this.checkedManifests.join(',')
          }
          this.BookingAndNonBokking(id);
          this.allAadharReceivedUrls = { files: [] };
          setTimeout(() => {
            // this.getDriveAadhar(this.aadharNo)

          }, 0);

          // Update local state variables to enable "Update Details" button
          this.validateChangeAadhar = false;  // Enable Update Details button after successful update
          this.frontUploaded = true;
          this.backUploaded = true;
          this.isUploaded = false;

        },
        (error) => {
          this.isUploaded = false;

          console.error('Error updating Aadhar details:', error);
        }
      );
    } catch (error) {
      this.isUploaded = false;

      console.error('Error in UpdateAadharDetailsImages:', error);
    }
  }

  async uploadAadharImages(): Promise<string[]> {
    const aadharLinks: string[] = [];
    const maxSizeMB = 4 * 1024 * 1024; // 4MB in bytes

    try {
      // Front Aadhar
      let frontImage: File = this.DriveAadharImgUrl;
      if (frontImage.size > maxSizeMB) {
        frontImage = await this.compressImageTo2MB(frontImage);
      }
      const aadharNumber = this.aadharNo;

      const frontFormData = new FormData();
      frontFormData.append('image', frontImage, `${aadharNumber}.${frontImage.name.split('.').pop()}`);
      const frontData: any = await this.serviceNew.insertDriveImage(frontFormData).toPromise();

      if (!frontData.id) throw new Error("Failed to upload Aadhar front image");

      const frontLink = `https://drive.google.com/file/d/${frontData.id}/view?usp=drive_link`;
      this.allDate.aadhar_url_front = frontLink;
      // this.valForm.get('aadharFrontUploadedUrl').setValue(frontLink);
      aadharLinks.push(frontLink);

      // Back Aadhar (if exists)
      if (this.DriveAadharImgUrlBack) {
        let backImage = this.DriveAadharImgUrlBack;
        if (backImage.size > maxSizeMB) {
          backImage = await this.compressImageTo2MB(backImage);
        }

        const backFormData = new FormData();
        backFormData.append('image', backImage, `${aadharNumber}.${backImage.name.split('.').pop()}`);
        const backData: any = await this.serviceNew.insertDriveImage(backFormData).toPromise();

        if (!backData.id) throw new Error("Failed to upload Aadhar back image");

        const backLink = `https://drive.google.com/file/d/${backData.id}/view?usp=drive_link`;
        // this.valForm.get('aadharBackUploadedUrl').setValue(backLink);
        this.allDate.aadhar_url_back = backLink;

        aadharLinks.push(backLink);
      }

      return aadharLinks;
    } catch (error) {
      console.error("Aadhar upload error:", error);
      throw error;
    }
  }

  zoom: number = 1; // Initial zoom level (100%)
  minZoom: number = 0.5; // Minimum zoom
  maxZoom: number = 3;  // Maximum zoom

  offsetX: number = 0; // Initial horizontal offset for image dragging
  offsetY: number = 0; // Initial vertical offset for image dragging

  startX: number = 0; // Starting X position of the mouse for dragging
  startY: number = 0; // Starting Y position of the mouse for dragging
  isDragging: boolean = false; // Flag to track dragging state

  // Handle Mouse Wheel zoom
  onWheel(event: WheelEvent) {
    event.preventDefault(); // Prevent page scroll
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  // Zoom In Method
  zoomIn() {
    if (this.zoom < this.maxZoom) {
      this.zoom += 0.1; // Increase zoom
    }
  }

  // Zoom Out Method
  zoomOut() {
    if (this.zoom > this.minZoom) {
      this.zoom -= 0.1; // Decrease zoom
    }
  }

  // Reset Zoom Method
  resetZoom() {
    this.zoom = 1; // Reset to original zoom (100%)
    this.offsetX = 0; // Reset horizontal offset
    this.offsetY = 0; // Reset vertical offset
  }

  // Mouse down event to start dragging
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX - this.offsetX;
    this.startY = event.clientY - this.offsetY;
    event.preventDefault(); // Prevent default behavior while dragging
    document.body.style.cursor = 'grabbing'; // Change cursor when dragging starts
  }

  // Mouse move event to drag image
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      // Calculate new offset based on mouse movement
      const dx = (event.clientX - this.startX);
      const dy = (event.clientY - this.startY);

      // Adjust for zoom level
      const scaledDx = dx / this.zoom;
      const scaledDy = dy / this.zoom;

      // Use requestAnimationFrame for smoother dragging
      requestAnimationFrame(() => {
        this.offsetX = scaledDx;
        this.offsetY = scaledDy;
      });
    }
  }

  // Mouse up event to stop dragging
  onMouseUp() {
    this.isDragging = false;
    document.body.style.cursor = 'grab'; // Reset cursor
  }
  isInvoiceActive = true;
  isBarcodeActive = false;

  onInvoiceClick() {
    console.log('Invoice button clicked!');
    this.isInvoiceActive = true;
    this.isBarcodeActive = false;
    this.valForm.controls['p_barcodeNumber'].disable();
    this.valForm.controls['p_invoiceNumber'].enable();
    this.invoiceno.nativeElement.focus();
  }

  onBarcodeClick() {
    console.log('Barcode button clicked!');
    this.isBarcodeActive = true;
    this.isInvoiceActive = false;
    this.valForm.controls['p_invoiceNumber'].disable();
    this.valForm.controls['p_barcodeNumber'].enable();
    this.barcode.nativeElement.focus();
  }



  // Handle row selection to highlight the clicked row
  rowSelected(event: any) {
    console.log('Row selected: ', event);
    // Add your logic here for row selection if needed
  }

  // Dynamically apply styles to rows
  rowDataBound(args: any) {
    if (args.data.packed_unpacked_status === 1) {
      args.row.classList.add('red-row');
    } else {
      args.row.classList.add('normal-row');
    }
  }
  
}
