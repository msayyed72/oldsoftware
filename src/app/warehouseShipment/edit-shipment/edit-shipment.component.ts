import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AwbService } from '../../cfServices/awb.service';
import Swal from 'sweetalert2';
import { concatMap } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ceil } from 'lodash';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxSpinnerService } from 'ngx-spinner';
import { blob } from 'stream/consumers';
@Component({
  selector: 'app-edit-shipment',
  templateUrl: './edit-shipment.component.html',
  styleUrls: ['./edit-shipment.component.css']
})
export class EditShipmentComponent implements OnInit {
  @ViewChild('DELHIVERY') DELHIVERY!: any;
  @ViewChild('insertHAWB') insertHAWB!: any;
  @ViewChild('modal1') modal1!: any;
  @ViewChild('modal3') modal3!: any;
    @ViewChild('modal7') modal7!: any;

  params!: FormGroup;
  params1!: FormGroup;

@ViewChild('paymentStsupdate') paymentStsupdate:any;
@ViewChild('sendImgMail') sendImgMail:any;

  shipmentForm: FormGroup;
  invoice_no: any;
  view_modify: any;
  invoice_id: any;
  print_awb: any;
  packingListForm: any;
  userDetails: any;
  receivedData: any;
  valFormDpWorld: FormGroup;
  frontUploaded: boolean = false;
  backUploaded: boolean = false;
  constructor(private httpClient:HttpClient,private imageCompress: NgxImageCompressService, private _spinner: NgxSpinnerService, private dialog: MatDialog, public service: AwbService, private fb: FormBuilder, public route: ActivatedRoute, public router: Router, public serviceNew: NewApiCloudService) {
    this.route.params.subscribe(datas => {
      this.invoice_no = datas['inv_no'];
      this.view_modify = datas['view_modify'];
      this.invoice_id = datas['inv_id']
      this.print_awb = datas['inv_no']
    });
    // this.serviceNew.data$.subscribe((datas) => {
    //   this.receivedData = datas;
    //   this.invoice_no = datas['inv_no'];
    //   this.view_modify = datas['view_modify'];
    //   this.invoice_id = datas['inv_id']
    //   this.print_awb = datas['inv_no']
    //   console.log('Received Data:', datas);
    // });
    this.userDetails = JSON.parse(localStorage.getItem('log_data'));
    this.getFromValues();
    this.getFormPackingList();
  }
  getFormPackingList() {
    this.packingListForm = this.fb.group({
      carton_id: [''],
      item_type: [''],
      act_wgt: [''],
      chrg_weight: [''],
      length: [''],
      width: [''],
      height: [''],
      item_details: [''],
      vol_weight: [''],
      carton_no: [''],
      invoice_id: [''],
      invoice_no: ['']
      // chrg_weight:['']
    });

    this.calculateWeights();

  }
  volWeight: any;
  chrgWeight: any;
  calculateWeights() {
    const formValues = this.packingListForm.value;
    const length = parseFloat(formValues.length);
    const width = parseFloat(formValues.width);
    const height = parseFloat(formValues.height);
    const act_wgt = Math.ceil(parseFloat(formValues.act_wgt));

    // Calculate volumetric weight
    this.volWeight = (length * width * height) / 5000;
    this.packingListForm.get('vol_weight').setValue(Math.ceil(this.volWeight))
    // Get chargeable weight (greater of actual or volumetric weight)
    this.chrgWeight = Math.max(act_wgt, this.volWeight);
    this.packingListForm.get('chrg_weight').setValue(Math.ceil(this.chrgWeight))
    if (!this.invoice_id) {
      this.router.navigate(['/invoice-view'])
      this.showMessage("Cant Find Invoice Plz Try Again", 'error')
    }
  }
  initForm() {
    this.params = this.fb.group({
      id: [null],
      date:[new Date().toISOString().split('T')[0]],
      selected: false,
      paymentSts:'',
      customPaymentType:'',
      to: ['', Validators.required],
      cc: [''],
      file: [[]],
      description: [''],
      displayDescription: [''],
      sendType: ['false']
    });
  }
  initForm1() {
    this.params1 = this.fb.group({
      id: [null],
      selected: false,
      to: ['', Validators.required],
      cc: [''],
      file: [[]],
      description: [''],
      displayDescription: [''],
      sendType: ['false']
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
  getFromValues() {
    this.shipmentForm = this.fb.group({
      invoiceId: [''],
      invoice_no: [''],
      sender_name: ['', Validators.required],
      sender_address: ['', Validators.required],
      sender_pincode: ['', Validators.required],
      sender_mobile: ['', Validators.required],
      senderEmail: ['', [Validators.required, Validators.email]],
      senderCity: ['', Validators.required],
      receiver_id: [''],
      receiver_name: ['', Validators.required],
      receiver_address: ['', Validators.required],
      receiver_taluk_name: ['', Validators.required],
      receiver_district_name: ['', Validators.required],
      receiver_postoffice: ['', Validators.required],
      receiver_state: ['', Validators.required],
      receiver_pincode: ['', Validators.required],
      receiver_mobile: ['', Validators.required],
      receiver_phone: ['', Validators.required],
      receiverEmaild: [''],
      total_carton: [''],
      total_weight: [''],
      aadhar_no: ['', Validators.required],
      created_by: [this.userDetails['v_user_id']],
      aadhar_front_url: [''],
      aashar_back_url: [''],
      aadhar_details: ['', Validators.required],
      aadhar_name: [''],


    });
    this.valFormDpWorld = this.fb.group({
      "consignment": {
        "consolidate": "",
        "shipper_company_code": "",
        "consignment_number": "",
        "is_draft": "",
        "from_challan_id": "",
        "consignor_company_id": "",
        "consignor_company_name": "",
        "consignor_company_code": "",
        "consignor_facility_name": "",
        "consignor_facility_code": "",
        "consignor_address_line1": "",
        "consignor_address_line2": "",
        "consignor_city": "",
        "consignor_state": "",
        "consignor_pin": "",
        "consignor_contact_name": "",
        "consignor_phone": "",
        "consignee_company_id": "",
        "consignee_company_name": "",
        "consignee_company_code": "",
        "consignee_facility_name": "",
        "consignee_facility_code": "",
        "consignee_address_line1": "",
        "consignee_address_line2": "",
        "consignee_city": "",
        "consignee_state": "",
        "consignee_pin": "",
        "consignee_contact_name": "",
        "consignee_phone": "",
        "reference_number_1": "",
        "reference_number_2": "",
        "service_option": "",
        "truck_category": "",
        "service_provider_company_code": "",
        "vehicle_number": "",
        "driver1_id": "",
        "volume": "",
        "volume_measure": "",
        "ready_for_pickup_at": "",
        "payment_mode": "",
        "slot_date": "",
        "slot_name": "",
        "slot_company_code": "",
        "weight": "100",
        "billable_weight": "",
        "weight_measure": "",
        "consignment_contents": {
          "consignment_content": [
            {
              "reference_number": "",
              "delivery_number": "",
              "product_id": "",
              "product_name": "",
              "product_display_name": "",
              "units": "",
              "unit_type": "",
              "weight": "",
              "billable_weight": "",
              "weight_measure": "",
              "length": "",
              "width": "",
              "height": "",
              "uom": ""
            }
          ]
        },
        "consignment_invoices": {
          "consignment_invoice": [
            {
              "invoice_number": "",
              "delivery_number": "",
              "invoice_value": "",
              "invoice_date": "",
              "cod_amount": "",
              "weight": "",
              "billable_weight": "",
              "weight_measure": "",
              "pickable_units": "",
              "eway_bill_number": "",
              "eway_bill_expiry_date": "",
              "HSN_code": ""
            }
          ]
        },
        "service_provider_id": "",
        "service_provider_name": "",
        "service_provider_code": "",
        "consignment_type": ""
      }
    })
  }
  ngOnInit() {
    this.shipmentForm.get('created_by').setValue(this.userDetails['v_user_id']);
    this.PackingListDetails = []

    if (this.invoice_id) {
      this.getInvoiceDetails();
      this.getPackingListDetails()
    }
    this.initForm1()
    this.initForm()
        this.selectPaymentDate = new Date().toISOString().split('T')[0];
        this.params.get('date').setValue(this.selectPaymentDate);
    // this.Get_NextPickupDate_After14Days_freeagent(this.selectPaymentDate)
    this.getParticular()
  }
  PerticularHawbUniqueData:any=[]
  getParticular() {
       this.serviceNew.get_invoice_list(this.userDetails['v_point_id'], this.userDetails['v_location_id'], this.invoice_no, -1).subscribe(data => {
      if (data['data'] && data['data'].length) {
      const PerticularHawbUniqueData = data['data'].map(r=>({
          ...r,
          typeOfConsignment: r['type_of_shipment'] == '1' ? 'Normal' : 'Commercial'
        }))
        this.PerticularHawbUniqueData = PerticularHawbUniqueData[0];
      }})
  }
  
  receivedHawbData: any;
  getInvoiceDetails() {
    this.service.get_Hawb_Details(this.invoice_id).subscribe(data => {
      if (data['data'].length > 0) {
        const receivedHawbData = data['data'].map(r=>({
          ...r,
          mailSentStatus : r['mail_status'] == '1' ? 'Sent' : 'Not Sent'
        }));
         this.receivedHawbData =receivedHawbData[0]
        this.shipmentForm.patchValue({
          sender_name: this.receivedHawbData.sender_name || '',
          sender_address: this.receivedHawbData.sender_address || '',
          sender_pincode: this.receivedHawbData.sender_pincode || '',
          sender_mobile: this.receivedHawbData.sender_mobile || '',
          senderEmail: this.receivedHawbData.senderEmail || '',
          senderCity: this.receivedHawbData.senderCity || '',
          receiver_id: this.receivedHawbData.receiver_id || '',
          receiver_name: this.receivedHawbData.receiver_name || '',
          receiver_address: this.receivedHawbData.receiver_address || '',
          receiver_taluk_name: this.receivedHawbData.receiver_taluk_name || '',
          receiver_district_name: this.receivedHawbData.receiver_district_name || '',
          receiver_postoffice: this.receivedHawbData.receiver_postoffice || '',
          receiver_state: this.receivedHawbData.receiver_state || '',
          receiver_pincode: this.receivedHawbData.receiver_pincode || '',
          receiver_mobile: this.receivedHawbData.receiver_mobile || '',
          receiver_phone: this.receivedHawbData.receiver_phone || '',
          receiverEmaild: this.receivedHawbData.receiverEmaild || '',
          total_carton: this.receivedHawbData.total_carton || '',
          total_weight: this.receivedHawbData.total_weight || '',
          aadhar_no: this.receivedHawbData.aadhar_no || '',
          invoiceId: this.receivedHawbData.hawb_id || '',
          invoice_no: this.receivedHawbData.hawb_no || '',
          aadhar_front_url: this.receivedHawbData.aadhar_front_img || '',
          aashar_back_url: this.receivedHawbData.aadhar_back_img || '',
          aadhar_details: this.receivedHawbData.aadhar_address || '',
          aadhar_name: this.receivedHawbData.aadhar_name || '',
          // aadhar_name

        });
      }
    });
  }
  PackingListDetails: any[] = [];
  getPackingListDetails() {
    this.service.get_carton_by_invoice(this.invoice_id).subscribe(data => {
      if (data['data'].length > 0) {
        this.PackingListDetails = data['data']
      }
    })
  }
  calculateTatalWt(): number {
    const d = this.PackingListDetails.reduce((sum, d) =>
      sum = sum + Number(d['chrg_weight'])
      , 0)
    return ceil(d);
  }
  PactchIndexValue(data) {
    console.log(data)
    if (data) {
      this.packingListForm.patchValue({
        carton_id: data.carton_id,
        item_type: data.item_type,
        act_wgt: Math.ceil(Number(data.act_wgt)),
        chrg_weight: Math.ceil(Number(data.chrg_weight)),
        length: data.length,
        width: data.width,
        height: data.height,
        item_details: data.item_details,
        vol_weight: data.vol_weight,
        carton_no: data.carton_no,
        invoice_id: data.hawb_id,
        invoice_no: data.hawb_no
      })
      this.OpenDelhivery()

    } else {
      this.OpenDelhivery1()
    }

  }
  PactchIndexValuenew() {
    this.packingListForm.reset()
    // console.log(data)
    // if(data){
    //   this.packingListForm.patchValue({
    //     carton_id: data.carton_id,
    //     item_type:  data.item_type,
    //     act_wgt:  data.act_wgt,
    //     chrg_weight:  data.chrg_weight,
    //     length:  data.length,
    //     width:  data.width,
    //     height:  data.height,
    //     item_details:  data.item_details,
    //     vol_weight: data.vol_weight,
    //     carton_no: data.carton_no,
    //     invoice_id: data.hawb_id,
    //     invoice_no: data.hawb_no
    //   })
    //   this.OpenDelhivery()

    // }else{
    this.OpenDelhivery1()
    // }

  }
  OpenDelhivery() {
    this.modal1.open();
  }
  OpenDelhivery1() {
    this.modal3.open();

  }
  hasError(controlName: string, errorName: string): boolean {
    const control = this.shipmentForm.get(controlName);
    return control.hasError(errorName) && (control.touched || control.dirty);
  }
  isLoading: boolean = false;

  UpdateInvoice(data) {
    if (this.shipmentForm.valid) {
      this.isLoading = true;  // Show spinner
      this.service.sp_v1_ds_history_log_events_insert(this.shipmentForm.value.invoice_no, this.userDetails['v_user_id'], 'Customer Details Has Been Modified After Receiving').toPromise()

      this.serviceNew.v1_SP_Ds_hawb_Update_new(this.shipmentForm.value).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.showMessage("Updated Successfully");
          } else {
            this.showMessage("Update Failed", 'error');

          }
          this.isLoading = false; // Hide spinner
        },
        (error) => {
          this.showMessage("Update Failed", 'error');
          this.isLoading = false; // Hide spinner in case of error
        }
      );
    } else {
      this.showMessage("Plz Fill All Mandatory Fields", 'warning');
    }
  }
  loading: boolean = false;

  submitForm() {
    console.log(this.packingListForm.value)

    console.log(this.packingListForm.value)

    this.loading = true; // Show spinner
    this.serviceNew.v1_SP_Ds_Carton_Update(this.packingListForm.value).subscribe({
      next: (data) => {
        this.getPackingListDetails();

        this.showMessage("Inserted Successfully")
        this.loading = false; // Hide spinner after success
      },
      error: (err) => {
        this.showMessage('Error updating packing list:' + JSON.stringify(err) + 'error');
        this.loading = false; // Hide spinner after error
      }
    });
  }
  v1_SP_Ds_hawb_order_Insert_by_hawb_id() {
    if (!this.packingListForm.value.carton_no) {
      this.packingListForm.get('carton_no').setValue(this.PackingListDetails.length + 1);
    }

    console.log(this.userDetails);

    const CartonData = [{
      invoice_no: this.shipmentForm.value.invoice_no,
      box_no: this.PackingListDetails.length + 1,
      weight: Math.ceil(Number(this.packingListForm.value.act_wgt)),
      length: this.packingListForm.value.length,
      height: this.packingListForm.value.height,
      width: this.packingListForm.value.width,
      item_details: this.packingListForm.value.item_details, // fixed assignment
      vol_wgt: Math.ceil(Number(this.packingListForm.value.vol_weight)),
      chargeable_wt: Math.ceil(Number(this.packingListForm.value.chrg_weight)),
    }];

    const Payload = {
      hawb_no: this.shipmentForm.value.invoice_no,
      created_by: this.userDetails['v_user_id'],
      cartonData: CartonData
    };

    console.log(Payload);
    this.service.sp_v1_ds_history_log_events_insert(this.shipmentForm.value.invoice_no, this.userDetails['v_user_id'], 'Customer Packing List Has Been Added After Receiving').toPromise()

    this.serviceNew.v1_SP_Ds_hawb_order_Insert_by_hawb_id(Payload).subscribe(
      data => {
        if (data['code'] == 200) {
          this.packingListForm.reset()

          this.getPackingListDetails();

          this.showMessage("Inserted Successfully");
        } else {
          this.showMessage("Insertion Failed", 'error');
          console.error('Error:', data);
        }
      },
      error => {
        this.showMessage("Something went wrong", 'error');
        console.error('API Error:', error);
      }
    );
  }
  ConnectDpWorld() {
    const hawb = this.receivedHawbData;
    const cartons = this.PackingListDetails || [];

    this.valFormDpWorld.patchValue({
      consignment: {
        // General consignment details
        shipper_company_code: "", // Not available in current data
        consignment_number: hawb.hawb_no || "",
        consignor_company_name: hawb.sender_name || "",
        consignor_address_line1: hawb.sender_address || "",
        consignor_city: hawb.senderCity || "",
        consignor_state: hawb.receiver_state || "", // use proper mapping if needed
        consignor_pin: hawb.sender_pincode || "",
        consignor_contact_name: "", // Not available
        consignor_phone: hawb.sender_mobile || "",

        consignee_company_name: hawb.receiver_name || "",
        consignee_address_line1: hawb.receiver_address || "",
        consignee_city: hawb.receiver_district_name || "",
        consignee_state: hawb.receiver_state || "",
        consignee_pin: hawb.receiver_pincode || "",
        consignee_contact_name: "", // Not available
        consignee_phone: hawb.receiver_mobile || "",
        reference_number_1: hawb.reference_no || "",
        weight: hawb.total_weight || "",
        payment_mode: String(hawb.payment_mode).trim() || "",

        // Multiple cartons mapping
        consignment_contents: {
          consignment_content: cartons.map(c => ({
            reference_number: c.carton_id || "",
            length: c.length || "",
            width: c.width || "",
            height: c.height || "",
            uom: "CM", // assuming centimeters
            weight: c.carton_weight || "",
            units: "1", // or c.units if available
            product_display_name: c.item_type || "",
            product_name: c.item_type || "",
          })),
        },

        // No invoice data used here – empty array
        consignment_invoices: {
          consignment_invoice: [{
            "invoice_number": hawb.hawb_no,
            "invoice_value": "49000",
            "invoice_date": "",
            "eway_bill_number": "",
            "eway_bill_expiry_date": "",
            "HSN_code": ""
          }],
        },

        service_provider_name: "", // optional
        consignment_type: hawb.service_type_name || "AIR CARGO",
      },
    });

    this.serviceNew.DpWorld(this.valFormDpWorld.value).subscribe(data => {
      if (data['code'] === "200" && data['data'].consignment.status === 'Created') {
        this.showMessage("API Connected Successfully");
        this.dpConsignmentNumber = data['data'].consignment.number;

        // this.service.update_awb_no(this.dpConsignmentNumber, hawb.hawb_no).subscribe(
        //   res => console.log("AWB updated", res),
        //   err => console.error("AWB update error", err)
        // );
      } else if (data['data'].exception.message) {
        this.showMessage(data['data'].exception.message, 'error');
      } else {
        this.showMessage("API request failed or unexpected response", 'error');
      }
      console.log(data);
    });

    console.log(this.valFormDpWorld.value);
    console.log(hawb);
    console.log(cartons);
    console.log(this.dpConsignmentNumber)
  }

  dpConsignmentNumber

  deleteCartonDetail(data) {
    Swal.fire({
      title: 'Do You Really Want To Delete This Item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      preConfirm: () => {
        const payload = {
          carton_id: data.carton_id,
          created_by: this.userDetails['v_user_id']
        };

        this.service.sp_v1_ds_history_log_events_insert(
          this.shipmentForm.value.invoice_no,
          this.userDetails['v_user_id'],
          'Customer Packing List Has Been Deleted After Receiving'
        ).toPromise();

        return this.serviceNew.v1_sp_ds_hawb_carton_delete(payload).toPromise().then(d => {
          if (d['code'] == '200') {
            this.getFormPackingList();
            this.getPackingListDetails();
          }
        });
      },
    }).then(result => {
      if (!result.isConfirmed) {
        return false;
      }
      return true;
    });
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
  aadhaar_loading: boolean = false; // Fixed variable name spelling
  previewUrlFront: any;
  previewUrlBack: any;
  frontAadhaarData: any = null;
  backAadhaarData: any = null;
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

        // this.serviceNew.imgUpload(formData).subscribe(data => {
        //   if (data['status'] === 'success' && data['url']) {
        //     this.serviceNew.getImage(data['url']).subscribe(response => {
        //       if (response['filename'] && response['base64']) {
        //         const fieldName = isFront ? 'aadharFrontName' : 'aadharBackName';
        //         // this.valForm.get(fieldName).setValue(response['filename']);

        //         if (isFront) {
        //           this.aadharFrontBase64Url = response['base64'];
        //         } else {
        //           this.aadharFrontBase64UrlBack = response['base64']; // Fixed incorrect property name
        //         }
        //       }
        //     });
        //   }
        // });

      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  }
  resetImg() {
    this.frontAadhaarData = null;
    this.frontUploaded = false;
    this.previewUrlFront = null;
    this.backUploaded = false;
    this.shipmentForm.get('aadhar_front_url').setValue(null);
    this.shipmentForm.get('aashar_back_url').setValue(null);

  }
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
  async setAadhaarFormValues() {
    console.log(this.frontAadhaarData);

    // Reset both fields before reassigning
    this.shipmentForm.get('aadhar_front_url').setValue(null);
    this.shipmentForm.get('aashar_back_url').setValue(null);

    // Ensure uploadAadharImages returns a Promise
    const aadharLinks: any = await this.uploadAadharImages();

    if (aadharLinks && aadharLinks.length > 0) {
      const aadhar_front = aadharLinks[0] || '';
      const aadhar_back = aadharLinks[1] || '';

      this.shipmentForm.get('aadhar_front_url').setValue(aadhar_front);
      this.shipmentForm.get('aashar_back_url').setValue(aadhar_back);
    }

    // Set Aadhar number and name from front
    if (this.frontAadhaarData) {
      this.shipmentForm.get('aadhar_no').setValue(this.frontAadhaarData.aadhaar_number.value);
      this.shipmentForm.get('aadhar_name').setValue(this.frontAadhaarData.full_name.value);
    }

    // Set address from back
    if (this.backAadhaarData) {
      this.shipmentForm.get('aadhar_details').setValue(this.backAadhaarData.address.value);
    }

    // Validation checks
    if (this.frontUploaded && !this.backUploaded) {
      this.showMessage("Plz Upload Aadhar Back", 'info');
    }
    if (!this.frontUploaded && this.backUploaded) {
      this.showMessage("Plz Upload Aadhar Front", 'info');
    }
  }
  DriveAadharImgUrl: any;
  DriveAadharImgUrlBack: any;
  async uploadAadharImages(): Promise<string[]> {
    const aadharLinks: string[] = [];
    const maxSizeMB = 4 * 1024 * 1024; // 4MB in bytes

    try {
      // Front Aadhar
      let frontImage: File = this.DriveAadharImgUrl;
      if (frontImage.size > maxSizeMB) {
        frontImage = await this.compressImageTo2MB(frontImage);
      }
      const aadharNumber = this.shipmentForm.value.aadhar_no;

      const frontFormData = new FormData();
      frontFormData.append('image', frontImage, `${aadharNumber}.${frontImage.name.split('.').pop()}`);
      const frontData: any = await this.serviceNew.insertDriveImage(frontFormData).toPromise();

      if (!frontData.id) throw new Error("Failed to upload Aadhar front image");

      const frontLink = `https://drive.google.com/file/d/${frontData.id}/view?usp=drive_link`;
      this.shipmentForm.get('aadhar_front_url').setValue(frontLink);
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
        this.shipmentForm.get('aashar_back_url').setValue(backLink);

        // this.valForm.get('aadharBackUploadedUrl').setValue(backLink);
        aadharLinks.push(backLink);
      }

      return aadharLinks;
    } catch (error) {
      console.error("Aadhar upload error:", error);
      throw error;
    }
  }
  convertToPreviewUrl(driveUrl: string): string {
    if (String(driveUrl).trim().length == 0 || !driveUrl) {
      return '';
    }
    const regex = /\/d\/([a-zA-Z0-9_-]+)/;
    const match = driveUrl.match(regex);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return driveUrl; // fallback if no match
  }
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
  displayFileImg: any;

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
  
   quillEditorReady(event: any) {
    // Get the HTML content from the editor
    const htmlContent = event.html;

    // Now, set this HTML content to the form value
    this.params.patchValue({ displayDescription: htmlContent });
}
   quillEditorReady1(event: any) {
    // Get the HTML content from the editor
    const htmlContent = event.html;

    // Now, set this HTML content to the form value
    this.params1.patchValue({ displayDescription: htmlContent });
}
selectSenderName:any;
selectSenderMail:any;
selectInvoiceNo:any;
  emailContent = '';
    selectPaymentDate: string = ''
  after14PaymentDate = '';
  selectPaymentDateNextDAy: string = ''

  formatDate(dateStr) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",  // correct: 'long', 'short', or 'narrow'
      day: "numeric",   // correct: 'numeric' or '2-digit'
      month: "long",    // correct: 'long', 'short', or 'narrow'
      year: "numeric"   // correct: 'numeric' or '2-digit'
    };
    const date = new Date(dateStr);
    // const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }
    paymentStsupdateData: any;

//  Get_NextPickupDate_After14Days_freeagent(data) {
//     const selectedDate = new Date(this.params.value.date); // '2025-05-31'
//     selectedDate.setDate(selectedDate.getDate() + 1); // Tentatively add 1 day

//     // Skip weekends
//     while (selectedDate.getDay() === 6 || selectedDate.getDay() === 0) {
//       selectedDate.setDate(selectedDate.getDate() + 1);
//     }

//     this.selectPaymentDateNextDAy = selectedDate.toISOString().split('T')[0]; // e.g., '2025-06-03' if 1st is weekend

//     // console.log(nextDate); // Output: 2025-06-01
//     this.serviceNew.Get_NextPickupDate_After14Days_freeagent(data).subscribe(d => {
//       this.after14PaymentDate = d['data']
//       this.emailContent = `
//   <p>Dear ${this.selectSenderName},</p>

//   <p>We confirm we have received your payment on <strong>${this.formatDate(this.params.value.date)}</strong> against house air waybill number <strong>${this.selectInvoiceNo}</strong>. Thank you!</p>

//   <p>The transit time for our door-to-door air economy service to India starts from the next working day after your payment. So, your shipment journey begins on <strong>${this.formatDate(this.selectPaymentDateNextDAy)}</strong>.</p>

//   <p>Counting from that date, your delivery is scheduled for the 14th working day, which falls on <strong>${this.after14PaymentDate}</strong>. We aim to deliver on or before this day.</p>

//   <p>For your assurance and protection, we highly recommend that you take videos and pictures of the shipment before accepting the delivery from the courier. This is an important step to document the condition of your package upon arrival and will assist in the unlikely event of a dispute or claim.</p>

//   <p><strong>Just a heads-up:</strong> our service is non-trackable during its initial stages. However, once your shipment has cleared customs, we'll provide you with a link to track the last mile connection to your delivery address in India.</p>

//   <p>Even though tracking might not be available during the entire transit, rest assured, you can request a written proof of delivery once your package arrives.</p>

//   <h4 style="color: red;">IMPORTANT:</h4>
//   <p>There is a lot of fraud and scam going on in the name of Cargo Force and other companies too. Please be very careful, inform the receiver/consignee about this too and:</p>
//   <ul>
//     <li><strong>Do NOT</strong> give any payments to anyone in India for your cargo.</li>
//     <li><strong>Do NOT</strong> share any One Time Password in India for your cargo.</li>
//     <li><strong>Do NOT</strong> make any payments to anyone in India for your cargo.</li>
//   </ul>
//   <p>We do not, and neither will any of our last mile delivery partners, ask for any additional payment in India. Even if it is 1 Indian Rupee, do NOT pay it in cash, especially online.</p>

//   <p>Thank you for your understanding and trust!</p>

//   <p>Warm regards,<br><strong>Cargo Force</strong></p>
// `;
//       this.editedContent = this.emailContent;
//    this.params.get('to').setValue(this.selectSenderMail);
//       this.params.get('displayDescription').setValue(this.emailContent);
//       this.params.get('description').setValue(this.emailContent);
//     })
//   }
isOdiLocation:boolean =false;
Get_NextPickupDate_After14Days_freeagent(data,pincode) {
    const selectedDate = new Date(this.params.value.date); // '2025-05-31'
    selectedDate.setDate(selectedDate.getDate() + 1); // Tentatively add 1 day

    // Skip weekends
    while (selectedDate.getDay() === 6 || selectedDate.getDay() === 0) {
      selectedDate.setDate(selectedDate.getDate() + 1);
    }

    this.selectPaymentDateNextDAy = selectedDate.toISOString().split('T')[0]; // e.g., '2025-06-03' if 1st is weekend

    // console.log(nextDate); // Output: 2025-06-01

    this.serviceNew.sp_ds_pindcode_odi_get(pincode || '').subscribe(r=>{
      this.isOdiLocation =  r['data'][0]['isodi'] == 'yes' ? true : false;
      const noOfDays = this.isOdiLocation ? '21' : '14' ;
        this.serviceNew.Get_NextPickupDate_After14Days_freeagent1( data, r['data'][0]['isodi']).subscribe(d => {
      this.after14PaymentDate = d['data']
     if(this.isOdiLocation){
this.emailContent = `
  <p>Dear ${this.selectSenderName},</p>

  <p>We confirm we have received your payment on <strong>${this.formatDate(this.params.value.date)}</strong> against house air waybill number <strong>${this.selectInvoiceNo}</strong>. Thank you!</p>

  <p>The transit time for our door-to-door air economy service to India starts from the next working day after your payment. So, your shipment journey begins on <strong>${this.formatDate(this.selectPaymentDateNextDAy)}</strong>.</p>

<p>Counting from that date, your delivery is scheduled for the 21st working day, which falls on <strong>${this.after14PaymentDate}</strong>. The delivery location comes under ODA Location (out of delivery area) & Remote areas. We aim to deliver on or before this day.</p>
  <p>For your assurance and protection, we highly recommend that you take videos and pictures of the shipment before accepting the delivery from the courier. This is an important step to document the condition of your package upon arrival and will assist in the unlikely event of a dispute or claim.</p>

  <p><strong>Just a heads-up:</strong> our service is non-trackable during its initial stages. However, once your shipment has cleared customs, we'll provide you with a link to track the last mile connection to your delivery address in India.</p>

  <p>Even though tracking might not be available during the entire transit, rest assured, you can request a written proof of delivery once your package arrives.</p>

  <h4 style="color: red;">IMPORTANT:</h4>
  <p>There is a lot of fraud and scam going on in the name of Cargo Force and other companies too. Please be very careful, inform the receiver/consignee about this too and:</p>
  <ul>
    <li><strong>Do NOT</strong> give any payments to anyone in India for your cargo.</li>
    <li><strong>Do NOT</strong> share any One Time Password in India for your cargo.</li>
    <li><strong>Do NOT</strong> make any payments to anyone in India for your cargo.</li>
  </ul>
  <p>We do not, and neither will any of our last mile delivery partners, ask for any additional payment in India. Even if it is 1 Indian Rupee, do NOT pay it in cash, especially online.</p>

  <p>Thank you for your understanding and trust!</p>

  <p>Warm regards,<br><strong>Cargo Force</strong></p>
`;
      }else{
this.emailContent = `
  <p>Dear ${this.selectSenderName},</p>

  <p>We confirm we have received your payment on <strong>${this.formatDate(this.params.value.date)}</strong> against house air waybill number <strong>${this.selectInvoiceNo}</strong>. Thank you!</p>

  <p>The transit time for our door-to-door air economy service to India starts from the next working day after your payment. So, your shipment journey begins on <strong>${this.formatDate(this.selectPaymentDateNextDAy)}</strong>.</p>

  <p>Counting from that date, your delivery is scheduled for the 14th working day, which falls on <strong>${this.after14PaymentDate}</strong>. We aim to deliver on or before this day.</p>

  <p>For your assurance and protection, we highly recommend that you take videos and pictures of the shipment before accepting the delivery from the courier. This is an important step to document the condition of your package upon arrival and will assist in the unlikely event of a dispute or claim.</p>

  <p><strong>Just a heads-up:</strong> our service is non-trackable during its initial stages. However, once your shipment has cleared customs, we'll provide you with a link to track the last mile connection to your delivery address in India.</p>

  <p>Even though tracking might not be available during the entire transit, rest assured, you can request a written proof of delivery once your package arrives.</p>

  <h4 style="color: red;">IMPORTANT:</h4>
  <p>There is a lot of fraud and scam going on in the name of Cargo Force and other companies too. Please be very careful, inform the receiver/consignee about this too and:</p>
  <ul>
    <li><strong>Do NOT</strong> give any payments to anyone in India for your cargo.</li>
    <li><strong>Do NOT</strong> share any One Time Password in India for your cargo.</li>
    <li><strong>Do NOT</strong> make any payments to anyone in India for your cargo.</li>
  </ul>
  <p>We do not, and neither will any of our last mile delivery partners, ask for any additional payment in India. Even if it is 1 Indian Rupee, do NOT pay it in cash, especially online.</p>

  <p>Thank you for your understanding and trust!</p>

  <p>Warm regards,<br><strong>Cargo Force</strong></p>
`;
      }
      this.editedContent = this.emailContent;
   this.params.get('to').setValue(this.selectSenderMail);
      this.params.get('displayDescription').setValue(this.emailContent);
      this.params.get('description').setValue(this.emailContent);
    })
    })
  
  }
   receiverPincode=''
  async calculateDate(data,sts){
    this.receiverPincode = '';
    this.receiverPincode = data?.receiver_pincode;
     this.selectSenderName = data.sender_name
    this.selectSenderMail = data.senderEmail
    this.selectInvoiceNo = data.hawb_no
   await this.Get_NextPickupDate_After14Days_freeagent(this.selectPaymentDate,data?.receiver_pincode);
   await this.mark_paid_amount(data,sts)
  }
  editedContent:any;
//   mark_paid_amount(data, sts) {
   
//     this.selectSenderName = data.sender_name
//     this.selectSenderMail = data.sender_mail
//     this.selectInvoiceNo = data.hawb_no
//     this.emailContent = `
// <p>Dear ${this.selectSenderName},</p>

// <p>We confirm we have received your payment on <strong>${this.formatDate(this.selectPaymentDate)}</strong> against house air waybill number <strong>${this.selectInvoiceNo}</strong>. Thank you!</p>

// <p>The transit time for our door-to-door air economy service to India starts from the next working day after your payment. So, your shipment journey begins on <strong>${this.formatDate(this.selectPaymentDateNextDAy)}.</p>

// <p>Counting from that date, your delivery is scheduled for the 14th working day, which falls on <strong>${this.after14PaymentDate}</strong>. We aim to deliver on or before this day.</p>

// <p>For your assurance and protection, we highly recommend that you take videos and pictures of the shipment before accepting the delivery from the courier. This is an important step to document the condition of your package upon arrival and will assist in the unlikely event of a dispute or claim.</p>

// <p><strong>Just a heads-up:</strong> our service is non-trackable during its initial stages. However, once your shipment has cleared customs, we'll provide you with a link to track the last mile connection to your delivery address in India.</p>

// <p>Even though tracking might not be available during the entire transit, rest assured, you can request a written proof of delivery once your package arrives.</p>

// <h4 style="color: red;">IMPORTANT:</h4>
// <p>There is a lot of fraud and scam going on in the name of Cargo Force and other companies too. Please be very careful, inform the receiver/consignee about this too and:</p>
// <ul>
//   <li><strong>Do NOT</strong> give any payments to anyone in India for your cargo.</li>
//   <li><strong>Do NOT</strong> share any One Time Password in India for your cargo.</li>
//   <li><strong>Do NOT</strong> make any payments to anyone in India for your cargo.</li>
// </ul>
// <p>We do not, and neither will any of our last mile delivery partners, ask for any additional payment in India. Even if it is 1 Indian Rupee, do NOT pay it in cash, especially online.</p>

// <p><strong>Ground Floor Delivery:</strong><br> Our service ensures delivery to the ground floor only. Any extra assistance by the driver is purely voluntary.</p>

// <p>If you are giving money to the delivery guy, it is entirely at your discretion, and we do not instruct anyone to request payment. Please be aware that Cargo Force or our partners will never ask for money during delivery.</p>

// <p>Thank you for your understanding and trust!</p>

// <p>Warm regards,<br><strong>Cargo Force</strong></p>


// `;
//     this.editedContent = this.emailContent;

//     this.paymentStsupdateData = { data, sts };
//     if (sts == 'yes') {
//       this.params.get('to').setValue(this.shipmentForm.value.senderEmail);
//       this.params.get('displayDescription').setValue(this.emailContent);
//       this.params.get('description').setValue(this.emailContent);
//       this.paymentStsupdate.open()

//     } else {
//       this.afterConformationPAyment(false)
//     }

//   }

mark_paid_amount(data, sts) {
   
   
//     this.emailContent = `
// <p>Dear ${this.selectSenderName},</p>

// <p>We confirm we have received your payment on <strong>${this.formatDate(this.selectPaymentDate)}</strong> against house air waybill number <strong>${this.selectInvoiceNo}</strong>. Thank you!</p>

// <p>The transit time for our door-to-door air economy service to India starts from the next working day after your payment. So, your shipment journey begins on <strong>${this.formatDate(this.selectPaymentDateNextDAy)}.</p>

// <p>Counting from that date, your delivery is scheduled for the 14th working day, which falls on <strong>${this.after14PaymentDate}</strong>. We aim to deliver on or before this day.</p>

// <p>For your assurance and protection, we highly recommend that you take videos and pictures of the shipment before accepting the delivery from the courier. This is an important step to document the condition of your package upon arrival and will assist in the unlikely event of a dispute or claim.</p>

// <p><strong>Just a heads-up:</strong> our service is non-trackable during its initial stages. However, once your shipment has cleared customs, we'll provide you with a link to track the last mile connection to your delivery address in India.</p>

// <p>Even though tracking might not be available during the entire transit, rest assured, you can request a written proof of delivery once your package arrives.</p>

// <h4 style="color: red;">IMPORTANT:</h4>
// <p>There is a lot of fraud and scam going on in the name of Cargo Force and other companies too. Please be very careful, inform the receiver/consignee about this too and:</p>
// <ul>
//   <li><strong>Do NOT</strong> give any payments to anyone in India for your cargo.</li>
//   <li><strong>Do NOT</strong> share any One Time Password in India for your cargo.</li>
//   <li><strong>Do NOT</strong> make any payments to anyone in India for your cargo.</li>
// </ul>
// <p>We do not, and neither will any of our last mile delivery partners, ask for any additional payment in India. Even if it is 1 Indian Rupee, do NOT pay it in cash, especially online.</p>

// <p><strong>Ground Floor Delivery:</strong><br> Our service ensures delivery to the ground floor only. Any extra assistance by the driver is purely voluntary.</p>

// <p>If you are giving money to the delivery guy, it is entirely at your discretion, and we do not instruct anyone to request payment. Please be aware that Cargo Force or our partners will never ask for money during delivery.</p>

// <p>Thank you for your understanding and trust!</p>

// <p>Warm regards,<br><strong>Cargo Force</strong></p>


// `;
    // this.editedContent = this.emailContent;

    this.paymentStsupdateData = { data, sts };
    if (sts == 'yes') {
      this.params.get('to').setValue(this.selectSenderMail);
      this.params.get('displayDescription').setValue(this.emailContent);
      this.params.get('description').setValue(this.emailContent);
      this.paymentStsupdate.open()

    } else {
      this.afterConformationPAyment(false)
    }

  }
  selectedPaymentType: string = ''
  customPaymentType: string = ''
  sendMailChecked: boolean = false
   editorOptions = {
        toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
    };
afterConformationPAyment(isValidType) {
  if (isValidType) {
    if (this.params.value.paymentSts == '') {
      this.showMessage("Plz Select the payment type",'warning');
      return;
    }
    if (this.params.value.paymentSts== 'Other' && this.params.value.customPaymentType.trim() == '') {
      this.showMessage("Plz Fill Payment Type To Continue ",'warning');
      return;
    }
  }
  // else{
  //   if (this.params.value.paymentSts == '') {
  //     this.showMessage("Plz Select the payment type",'warning');
  //     return;
  //   }
  //   if (this.params.value.paymentSts== 'Other' && this.params.value.customPaymentType.trim() == '') {
  //     this.showMessage("Plz Fill Payment Type To Continue ",'warning');
  //     return;
  //   }
  // }

  const payload: any = {
    mail: this.params.value.to,
    content: this.params.value.displayDescription,
    inv_no: this.receivedHawbData['hawb_no'],
    isPaymentMail: true
  };

  const { data, sts } = this.paymentStsupdateData;

  let content = sts == 'yes' ? 'Are you sure to update the payment status as paid?' :
                sts == 'npd' ? 'Are you sure to undo the payment status as Unpaid But Departed?' :
                'Are you sure to undo the payment status as unpaid?';

  // Replace the popup manager with SweetAlert
  Swal.fire({
    title: 'Confirm',
    text: content,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed) {
      const d = {
        hawb_no: this.receivedHawbData['hawb_no'],
        created_by: this.userDetails.v_user_id,
        status: sts,
        mode: this.params.value.paymentSts,
        remarks: this.params.value.customPaymentType,
        paymentDate: this.params.value.date
      };
      this.service.sp_v1_ds_history_log_events_insert(data.hawb_no, this.userDetails['v_user_id'], 'Payment Status Update as ' + sts).toPromise();

      this.serviceNew.v1_SP_ds_payment_api_status_update(d).subscribe(
        (r: any) => {
          if (r.code == 200) {
      this.getInvoiceDetails();
            this.paymentStsupdate.close();
            this.showMessage('Payment marked as paid successfully');

            // Call sendCollectionEMail after 1 second if checkbox is checked
            if (this.sendMailChecked) {
              setTimeout(() => {
                this.serviceNew.sendCollectionEMail(payload).toPromise();
              }, 1000); // 1000ms = 1 second
            }
          } else {
            this.showMessage('Failed to mark payment as paid', 'error');
          }
        },
        (error) => {
          this.showMessage('An error occurred while updating payment status', 'error');
        }
      );
    }
  });
}

uploadedFiles:{ file: File; preview: string; type: string; dataUrl?: string }[] = [];
// Use blob URLs for both images and PDFs
handleFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  Array.from(input.files).forEach(file => {
    const fileType = file.type || '';

    // Sanitize file name by removing invalid characters
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_'); // Allow only alphanumeric characters, dots, hyphens, and underscores

    // Create a new File object with sanitized name
    const sanitizedFile = new File([file], sanitizedFileName, { type: file.type });

    // Allow only image and PDF files
    if (fileType.startsWith('image/') || fileType === 'application/pdf' || fileType.endsWith('/pdf')) {
      const blobURL = URL.createObjectURL(sanitizedFile);

      if (fileType.startsWith('image/')) {
        // If the file is an image, read as Data URL for preview
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          this.uploadedFiles.push({ file: sanitizedFile, preview: blobURL, type: fileType, dataUrl });
        };
        reader.readAsDataURL(sanitizedFile);
      } else if (fileType === 'application/pdf' || fileType.endsWith('/pdf')) {
        // If the file is a PDF
        this.uploadedFiles.push({ file: sanitizedFile, preview: blobURL, type: fileType });
      }
    } else {
      // Reject files that are not image or PDF
      this.showMessage('Only images and PDFs are allowed.', 'error');
    }
  });

  input.value = ''; // Reset the input field to allow the same file to be selected again
}



private mimeOf(item: { file: File; type: string }): string {
  return item.type || item.file?.type || '';
}

isImage(item: { file: File; type: string }): boolean {
  return this.mimeOf(item).startsWith('image/');
}

isPdf(item: { file: File; type: string }): boolean {
  const t = this.mimeOf(item);
  return t === 'application/pdf' || t.endsWith('/pdf');
}

getName(item: { file: File }): string {
  return item.file?.name || 'Unnamed file';
}

getSize(item: { file: File }): string {
  const bytes = item.file?.size ?? 0;
  if (bytes === 0) return '0 B';
  const k = 1024, units = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

// Robust image preview: write an HTML page with <img> so it never renders blank
openImagePreview(url: string, title = 'Preview Image') {
  const w = window.open('', '_blank');
  if (!w) return; // popup blocked
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          html,body{margin:0;height:100%}
          body{display:flex;align-items:center;justify-content:center;background:#111}
          img{max-width:100%;max-height:100%;display:block}
        </style>
      </head>
      <body>
        <img src="${url}" alt="preview"/>
      </body>
    </html>`;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

// PDFs can still open directly
openBlobPDF(url: string) {
  window.open(url, '_blank');
}

downloadFile(item: { file: File; preview: string; type: string; dataUrl?: string }) {
  const a = document.createElement('a');
  a.href = item.preview;            // blob URL
  a.download = item.file?.name || 'download';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

removeFile(fileToRemove: { file: File; preview: string; type: string; dataUrl?: string }): void {
  // Revoke blob URL to prevent memory leaks
  try { if (fileToRemove.preview?.startsWith('blob:')) URL.revokeObjectURL(fileToRemove.preview); } catch {}

  // Remove from preview list
  this.uploadedFiles = this.uploadedFiles.filter(f => f !== fileToRemove);

  // If you inserted the image into an editor using dataUrl, remove it from there
  if (fileToRemove.type.startsWith('image/')) {
    const editor = document.querySelector('.email-content-display') as HTMLElement | null;
    if (editor) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(editor.innerHTML, 'text/html');
      doc.querySelectorAll('img').forEach(img => {
        if (img.src === (fileToRemove.dataUrl || fileToRemove.preview)) img.remove();
      });
      editor.innerHTML = doc.body.innerHTML;
      // @ts-ignore – if you maintain emailContent somewhere
      this.emailContent = editor.innerHTML;
    }
  }
}

// Optional: cleanup on component destroy
ngOnDestroy(): void {
  this.uploadedFiles.forEach(f => {
    try { if (f.preview?.startsWith('blob:')) URL.revokeObjectURL(f.preview); } catch {}
  });
}

  async sendEmail(): Promise<void> {
    // const editor = document.querySelector('.email-content-display') as HTMLElement;
    // const emailHtmlContent = editor.innerHTML || '';

    // Extract files from local state
    const allFiles = this.uploadedFiles.map(file => file.file);

    try {
      // Upload all files
      const uploadUrls: string[] = await Promise.all(
        allFiles.map(file => this.onImageUploadAadhar1(file))
      );

      console.log('✅ Uploaded URLs:', uploadUrls);

      // Prepare payload for API
      const payload: any = {
        mail: this.params1.value.to,
        content: this.params1.value.displayDescription,
        inv_no: this.receivedHawbData.hawb_no,
        imgurl: uploadUrls,
        created_by: this.userDetails['v_user_id']
      };

      // Send email + data to backend
      this.service.sp_v1_ds_history_log_events_insert(this.receivedHawbData.hawb_no, this.userDetails['v_user_id'], 'Final Img Sended To Customer').toPromise()

      await this.serviceNew.send_final_images(payload).toPromise();

      // ✅ After success: reset files and refresh UI
      this.uploadedFiles = [];
      this.getInvoiceDetails();
      this.sendImgMail.close()
    } catch (err) {
      console.error('❌ Error during sendEmail():', err);
    }
  }
    pendingUploadFiles: File[] = []; // holds files dropped but not yet uploaded
  uploadedImageUrls: string[] = []; // holds URLs after upload
  async onImageUploadAadhar1(file: File): Promise<string> {
    let processedFile = file;

    try {
      if (file.type.startsWith('image/')) {
        processedFile = await this.compressImageTo2MB(file);
      }

      const formData = new FormData();
      formData.append('avatar', processedFile);

      return new Promise<string>((resolve, reject) => {
        this.serviceNew.imgUploadnew(formData).subscribe({
          next: (res) => {
            console.log('Upload response:', res);
            if (res.status === 'success' && typeof res.url === 'string') {
              const url = `$a-z/${res.url}`;
              this.saveNotes('Final Img Sended In Mail'); // Save to your NotesReceivedForInvoice array

              this.saveNotes(url);
              resolve(url); // ✅ resolve with string
            } else {
              reject(new Error('Upload succeeded but no valid URL returned'));
            }
          },
          error: (err) => {
            console.error('Upload failed:', err);
            reject(err);
          }
        });
      });
    } catch (err) {
      console.error('Processing failed:', err);
      return Promise.reject(err);
    }
  }



  saveNotes(EnteredNotes) {
    const Notes = {
      invoice_no: this.receivedHawbData.hawb_no,
      notes: EnteredNotes,
      created_by: this.userDetails.v_user_id,
    };

    this.serviceNew.v1_sp_ds_pickup_order_note_insert(Notes).subscribe(
      (data) => {
        // this.NotesForInvoices.hide()

        if (data['code'] == 200) {
          // this.toastr.successToastr('Notes inserted successfully.');
          // this.getHawbListAssigned();
          if (this.receivedHawbData.hawb_no) {
            // const msg = {
            //   sender: this.userdetails['v_user_name'],
            //   content: this.EnteredNotes,
            //   timestamp: new Date().toISOString()
            // };
            // const msg = { from: 'Dharun', message: 'Hello Server!' };

            // this._chat.send({
            //   source: 'notes',
            //   event: 'notes',
            //   payload: { message: this.userdetails['v_employee_name'] + " Sended message:- " + this.EnteredNotes }
            // }); this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no'])
            // this.EnteredNotes = ''; // Clear input after success

          }

        } else {
          this.showMessage('Failed to insert notes. Please try again.','error');
        }
      },
      (error) => {
        // this.NotesForInvoices.hide()
        this.showMessage('An error occurred. Please check your connection.','error');
        console.error('Error inserting notes:', error);
      }
    );
  }
  

  sendImgMailSend(data) {
    this.v1_sp_ds_hawb_final_invoice_image_get(data.hawb_no)
    this.sendImgMail.open();
    this.emailContent = `
  <p>Dear ${data['sender_name']},</p>

  <p>Please see the final image(s) of your package(s) attached. The items have been securely packed, and two additional layers of taping have been applied to ensure extra protection during transit.</p>

  <p>Let us know if you require any further details.</p>

  <p>Best Regards,<br>${this.userDetails['v_user_name']}</p>
`;
    this.editedContent = this.emailContent;
    this.params1.get('description').setValue(this.emailContent)
    this.params1.get('displayDescription').setValue(this.emailContent)
    this.params1.get('to').setValue(this.shipmentForm.value.senderEmail)
  }
v1_sp_ds_hawb_final_invoice_image_get(invoiceFilter) {
  if (!invoiceFilter || invoiceFilter.trim() === '') return;

  const filterValue = String(invoiceFilter).trim();
  if (filterValue.length === 6) {
    this.serviceNew.v1_sp_ds_hawb_final_invoice_image_get(invoiceFilter).subscribe(r => {
      if (r['data'].length > 0) {
        // Processing only relevant image fields
        r['data'].forEach(imageData => {
          // Check if ashawb_final_img1 exists and is not empty
          if (imageData['ashawb_final_img1']) {
            const imgUrl1 = "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + imageData['ashawb_final_img1'];
            this.convertImageToFile(imageData['ashawb_final_img1'], imageData['ashawb_final_img1']);
          }

          // Check if ashawb_final_img2 exists and is not empty
          if (imageData['ashawb_final_img2']) {
            const imgUrl2 = "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + imageData['ashawb_final_img2'];
            this.convertImageToFile(imageData['ashawb_final_img2'], imageData['ashawb_final_img2']);
          }
        });
      } else {
        this.showMessage('error', 'Shipment Not Found');
      }
    });
  } else {
    this.uploadedFiles = [];
  }
}
convertImageToFile(url: string, fileName: string) {
  // Call the API to get the image from the server
  this.httpClient.get('https://api.cargoforce.com:8080/api/billing/getImages?imageName=' + url, { responseType: 'blob' }).subscribe(blob => {
    // Log the Blob object to inspect the received data
    console.log('Received Blob data:', blob);

    // Create a File object from the Blob data
    const file = new File([blob], fileName, { type: blob.type });

    // Log the file object
    console.log('Created file:', file);

    // Create a preview URL for the file (optional, if you need to show a preview)
    const previewUrl = URL.createObjectURL(file);

    // Push the file and its preview into the uploadedFiles array
    this.uploadedFiles.push({ file, preview: previewUrl, type: file.type });

    // Optionally, you can log the uploadedFiles array to inspect the added files
    console.log('Uploaded files:', this.uploadedFiles);
  }, error => {
    console.error('Error fetching image:', error);
  });
}




callNotesFile() {
    if (String(this.receivedHawbData['hawb_no']).trim().length != 6) {
      this.showMessage('Not A Valid HAWB No.','warning');
      return;
    }
    const payload = {
      invoice_no: String(this.receivedHawbData['hawb_no'])
    }
    // data.invoice_no = data.hawb_no
    // this.selectedDetails = data
    this.serviceNew.sendChatData(payload)
    this.modal7.open()
  }

update_type_of_shipment(type: any) {
  const mode = type.type_of_shipment;

  let title = '';
  let message = '';

  if (mode == 1) {
    title = 'Convert to Commercial Shipment';
    message = `Are you sure you want to convert HAWB NO. ${type.invoice_no} to a Commercial Shipment?`;
  } else if (mode == 2) {
    title = 'Revert to Normal Shipment';
    message = `Are you sure you want to revert HAWB NO. ${type.invoice_no} back to a Normal Shipment?`;
  } else {
    this.showMessage('Invalid Type','warning');
    return;
  }

  Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const payload = {
        hawb_no: type.hawb_no,
        created_by: this.userDetails['v_user_id'],
        status: this.PerticularHawbUniqueData['typeOfConsignment'] == '1' ? '2' : '1'
       };
      this.service.sp_v1_ds_history_log_events_insert(type.hawb_no, this.userDetails['v_user_id'], title).toPromise();

      this.serviceNew.v1_SP_ds_pickup_order_type_of_shipment(payload).subscribe(r => {
        this.showMessage('Updated Type Of Shipment');
      this.getParticular();
        // this.get_Pickup_allocatedListByCoLoader('1', '4');
      });
    }
  });
}
  salesRepId: any = '';

  employees: any = []
  allUsers: any = []
  getEmployee() {
    this.service.getemployeeBasedOnBranch(this.userDetails.v_point_id).subscribe(data => {
      this.employees = data['data'];
      this.allUsers = data['data']
    })
  }
  v1_ds_pickup_order_sales_repersent_update(num) {
    const p = {
      hawb_no: this.receivedHawbData.hawb_no,
      sales_rep: this.salesRepId,
      flag: num
    }
    this.service.sp_v1_ds_history_log_events_insert(this.receivedHawbData.hawb_no, this.userDetails['v_user_id'], 'Sales Rep Assigned').toPromise()

    this.serviceNew.v1_ds_pickup_order_sales_repersent_update(p).subscribe(d => {
      this.getInvoiceDetails();
      this.showMessage('Sales Rep Assigned')
      this.salesRep.close()
      // this.salesLabelForNonAllocation.hide()
      this.salesRepId = ''
      // this.PaymentPaidAmt = 0

    })
  }
  @ViewChild('salesRep') salesRep:any;
}
  