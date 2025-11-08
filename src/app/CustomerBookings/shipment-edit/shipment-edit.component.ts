import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';
import { AwbService } from '../../cfServices/awb.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-shipment-edit',
  templateUrl: './shipment-edit.component.html',
  styleUrls: ['./shipment-edit.component.css']
})
export class ShipmentEditComponent implements OnInit {
  @ViewChild('modal16') modal16: any;
  @ViewChild('modal1') modal1: any;
  @ViewChild('modal3') modal3: any;
  @ViewChild('pickupTimeModal') pickupTimeModal: any;
  @ViewChild('successConnectedOfShipment') successConnectedOfShipment: any;
  @ViewChild('pickupDateTimeModal') pickupDateTimeModal: any;
  @ViewChild('salesRep') salesRep: any;
  @ViewChild('modal7') modal7!: any;
  
  fromTime: string = '';
    availableTimes: string[] = [];

  toTime: string = '';
  receivedData: any;
  shipmentForm: FormGroup;
  userDetails: any;
  packingListForm: FormGroup;
  assignForm!: FormGroup;
  assignForm1!: FormGroup;
  totalReceivedData: any[] = [];
entryMethod: 'api' | 'manual' | null = null;

  shipmentType = '';
  collectionType = ''
  selectedDetails = '0'
  constructor(private router: Router,private route: ActivatedRoute, private fb: FormBuilder, public serviceNew: NewApiCloudService, public service: AwbService, private _spinner: NgxSpinnerService, private imageCompress: NgxImageCompressService,) {
    this.userDetails = JSON.parse(localStorage.getItem('log_data'));
    this.getFromValues();
    this.getFormPackingList()
    this.assignFormValues()
        this.get_CO_Loader();
        this.generateTimeSlots()

  }
  Order_id = '';
  assignData: any;

  frontUploaded: boolean = false;
  backUploaded: boolean = false;
  ngOnInit(): void {
 
    this.frontUploaded = false;
    this.backUploaded = false;
    this.route.queryParams.subscribe(params => {
      const encodedData = params['data'];
      if (encodedData) {
        // Decode the data and parse it back to an object
        const decodedData = decodeURIComponent(encodedData);
        const receivedData = JSON.parse(decodedData);
        this.Order_id = receivedData.order_no;
        this.apicall(receivedData.order_no);
        console.log(this.receivedData)

      }
    });
    this.v1_m_mail_events_get()
  }
 generateTimeSlots() {
    let startHour = 9;
    let startMinute = 30;
    let endHour = 18;

    while (startHour < endHour || (startHour === endHour && startMinute === 0)) {
      let formattedTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
      this.availableTimes.push(formattedTime);

      startMinute += 30;
      if (startMinute === 60) {
        startMinute = 0;
        startHour++;
      }
    }
  }
  assignFormValues() {
    this.assignForm = this.fb.group({
      'orderNo': [''],
      'type': ["-1",],
      'employeId': [null],
      'cretedBy': [this.userDetails.v_user_id],
      'remarks': [''],
      'coLoder': [null],
      'ship_ref_no': [null],
      'local_trasfer': [null],
      'parcelData': [null],
      'coloaderName': [null],
      'invoice_no': [null],
      'collectionRef': [null]
    });
    this.assignForm1 = this.fb.group({
      'orderNo': [''],
      'type': ["-1",],
      'employeId': [null],
      'cretedBy': [this.userDetails.v_user_id],
      'remarks': [''],
      'coLoder': [null],
      'ship_ref_no': [null],
      'local_trasfer': [null],
      'parcelData': [null],
      'coloaderName': [null],
      'invoice_no': [null]
    })
  }
  pickuptypevalue = 'Co_Loader';
  pickupTime: any;
  pickupDateForPF: any

  apicall(order_no) {
    this.service.orderViewAssign(order_no).subscribe(d => {
      this.receivedData = d['data'][0];
      console.log(this.receivedData,"ajay")
      this.collectionType = this.receivedData['collection_type']
      this.shipmentType = this.collectionType == 'Drop_At_Warehouse' ? 'Drop_At_Warehouse' : 'pickup'
      if (this.shipmentType == 'pickup') {
        this.newCollectionType = this.receivedData['collection_type']
      } else {
        this.newCollectionType = ''
      }

      this.v1_ds_pickup_order_shipment_details_get();
      this.getPackingListDetails()
      if (d['collection_type'] != 'Drop_At_Warehouse') {
        this.pickuptypevalue = 'Co-Loader'
        this.pickupTime = d['collection_type'] // Splitting dd-mm-yyyy
        this.pickupDateForPF = d['collection_type'] // Splitting dd-mm-yyyy
        // this.pickupTime = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearranging to yyyy-mm-dd

      } else {
        this.pickuptypevalue = 'Drop Off'

      }
      if (d['data'].length > 0) {
        this.totalReceivedData = d['data'].map((item: any) => ({
          ...item,
          chargeable_wt: Math.ceil(this.GreattestOfTwo(item.weight, item.vol_wgt)), // Initializing chargeable_wt to 0
          parcelNumbers: ''
        }));
      } else {
        this.totalReceivedData = []
      }
      console.log(this.totalReceivedData)
      console.log('this.totalReceivedData')
      this.assignData = d['data'][0]
      // this.order_remarks = data['data'][0].remarks;
      // this.viewForm.patchValue({
      //   orderNo: this.assignData.pickup_id,
      //   totCtn: this.assignData.total_pcs,
      //   totWgt: this.assignData.total_wgt,
      //   serviceType: this.assignData.order_date
      // })
      // this.senderName = this.assignData.sender_name
      // this.senderAddress = this.assignData.sender_address
      // this.senderPhone = this.assignData.sender_contact_no
      // this.recName = this.assignData.receiver_name
      // this.recAddress = this.assignData.receiver_address
      // this.recPhone = this.assignData.receiver_contact_no
      // this.remarks - this.assignData.order_assigned_remarks
      this.assignForm.controls['orderNo'].setValue(this.assignData.pickup_id)
      this.assignForm.controls['type'].setValue(this.pickuptypevalue)
      this.assignForm.controls['employeId'].setValue(this.assignData.pickup_staff)
      this.assignForm.controls['coLoder'].setValue(this.assignData.pickup_co_loader)
      this.assignForm.controls['local_trasfer'].setValue(this.assignData.co_loader_tracking_no)
      this.assignForm.controls['ship_ref_no'].setValue(this.assignData.shipper_ref_no)
    })
  }
  GreattestOfTwo(a: any, b: any) {
    return Math.max(a || 0, b || 0);
  }
  newCollectionType = ''
  updateCollectionType() {
    if (!this.receivedData || !this.receivedData['invoice_no']) {
      this.showMessage("Invoice number is missing", 'error');
      return;
    }

    const d = {
      hawb_no: this.receivedData['invoice_no'],
      collection_type: ''
    };

    if (this.shipmentType === 'pickup') {
      if (!this.newCollectionType) {
        this.showMessage("Please select a valid collection type for pickup", 'error');
        return;
      }
      d.collection_type = this.newCollectionType;
    } else if (this.shipmentType === 'Drop_At_Warehouse') {
      d.collection_type = 'Drop_At_Warehouse';
    } else {
      this.showMessage("Please select a valid dispatch type", 'error');
      return;
    }
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Are you sure Has To Update The Collection Type To ' + d.collection_type + ' ?',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      padding: '2em',
      customClass: 'sweet-alerts',
    }).then((result) => {
      if (result.value) {

        this.serviceNew.v1_sp_ds_pickup_order_collection_type_Update(d).subscribe({
          next: (r: any) => {
            this.showMessage("Collection type updated successfully");
            this.modal16.close();
            this.apicall(this.Order_id)
            // this.getHawbListAssignedLoad();
          },
          error: (err: any) => {
            this.showMessage("Failed to update collection type", 'error');
            console.error("Error updating collection type:", err);
          }
        });
      }
    });

  }
  collectionDateForThirdParty: any;
  confirmPickupTime() {
    if (!this.newCollectionType || !this.fromTime || !this.toTime) {
      this.showMessage('Please select date and time slots.','warning');
      return;
    }
    this.collectionDateForThirdParty = this.newCollectionType
    this.fromTime = `${this.newCollectionType}T${this.fromTime}:00`;
    this.toTime = `${this.newCollectionType}T${this.toTime}:00`;

    // console.log("From DateTime:", this.fromDateTime);
    // console.log("To DateTime:", this.toDateTime);

    this.assignToParcelForceForPickup();
    this.pickupDateTimeModal.close();
  }
   assignToParcelForceForPickup() {
    this.isAssignBranchIsProcessing = true; // Start loading

    this.totalReceivedData[0].fromDateTime = this.fromTime;
    this.totalReceivedData[0].collectionDateForThirdParty = this.newCollectionType;
    this.totalReceivedData[0].toDateTime = this.toTime;
    this.totalReceivedData[0].total_pcs = this.totalPcsOfInvoice;
    this.totalReceivedData[0].instruction1 = this.instruction1;
    this.totalReceivedData[0].instruction2 = this.instruction2;
    this.totalReceivedData[0].instruction3 = this.instruction3;
    this.totalReceivedData[0].instruction4 = this.instruction4;
    this.totalReceivedData[0].optinalRef2 = this.optinalRef2;

    this.serviceNew.AssignToParcelForce(this.totalReceivedData[0]).subscribe(
      (response: any) => {
        console.log(response);

        if (response && response.data && response.data.Alerts && response.data.Alerts.Alert) {
          let alerts = response.data.Alerts.Alert;
          alerts = Array.isArray(alerts) ? alerts : [alerts];

          alerts.forEach((alert: any) => {
            if (alert.Type === "ERROR") {
              this.showMessage(alert.Message, "error");
            } else if (alert.Type === "WARNING") {
              this.showMessage(alert.Message, "warning");
            }
          });

          // Stop execution if there are errors
          if (alerts.some((alert: any) => alert.Type === "ERROR")) {
            this.isAssignBranchIsProcessing = false; // Stop loading
            return;
          }
        }

        if (
          response &&
          response.data &&
          response.data.CompletedShipmentInfo &&
          response.data.CompletedShipmentInfo.CompletedShipments &&
          response.data.CompletedShipmentInfo.CompletedShipments.CompletedShipment &&
          response.data.CompletedShipmentInfo.CompletedShipments.CompletedShipment.ShipmentNumber
        ) {
          let shipmentNumber =
            response.data.CompletedShipmentInfo.CompletedShipments.CompletedShipment.ShipmentNumber;

          this.assignForm.get('coloaderName').setValue('Parcel Force');

          // Assign ShipmentNumber to each index of totalReceivedData
          this.totalReceivedData.forEach((item, index) => {
            this.totalReceivedData[index].parcelNumbers = shipmentNumber;
          });
          this.assignForm.get('local_trasfer').setValue(shipmentNumber)

          this.showMessage("Shipment assigned successfully!", "success");
          console.log("Updated totalReceivedData:", this.totalReceivedData);

          this.assignToBranch();
        } else {
          this.showMessage("ShipmentNumber not found in response!", "warning");
        }

        this.isAssignBranchIsProcessing = false; // Stop loading
      },
      (error: any) => {
        this.isAssignBranchIsProcessing = false; // Stop loading
        console.error("API Error:", error);
        this.showMessage("Failed to assign shipment. Please try again!", "error");
      }
    );
  }
  receivedHawbData: any;
  v1_ds_pickup_order_shipment_details_get() {
    this.serviceNew.v1_ds_pickup_order_shipment_details_get(this.receivedData['invoice_no']).subscribe(data => {
      if (data['data'].length > 0) {
        this.receivedHawbData = data['data'][0];
        this.shipmentForm.patchValue({
          sender_name: this.receivedHawbData.sender_name || '',
          sender_address: this.receivedHawbData.sender_address || '',
          sender_pincode: this.receivedHawbData.sender_pincode || '',
          sender_mobile: this.receivedHawbData.sender_contact_no || '',
          senderEmail: this.receivedHawbData.shipper_mail_id || '',
          senderCity: this.receivedHawbData.sender_city || '',
          aadhar_details: this.receivedHawbData.aadhar_details || '',
          receiver_name: this.receivedHawbData.receiver_name || '',
          receiver_address: this.receivedHawbData.receiver_address || '',
          receiver_taluk_name: this.receivedHawbData.receiver_taluk_name || '',
          receiver_district_name: this.receivedHawbData.receiver_district_name || '',
          receiver_postoffice: this.receivedHawbData.receiver_postoffice || '',
          receiver_state: this.receivedHawbData.receiver_state || '',
          receiver_pincode: this.receivedHawbData.receiver_pincode || '',
          receiver_mobile: this.receivedHawbData.receiver_contact_no || '',
          receiver_phone: this.receivedHawbData.receiver_phone || '',
          receiverEmaild: this.receivedHawbData.receiver_mail || '',
          total_carton: this.receivedHawbData.carton || '',
          total_weight: this.receivedHawbData.total_weight || '',
          aadhar_no: this.receivedHawbData.aadhar_no || '',
          aadhar_name: this.receivedHawbData.aadhar_name || '',
          invoice_no: this.receivedHawbData.invoice_no || '',
          aadhar_front_url: this.receivedHawbData.aadhar_front_url || '',
          aashar_back_url: this.receivedHawbData.aashar_back_url || '',
          pickup_id: this.receivedHawbData.pickup_id || ''
        });
      } else {
        this.receivedHawbData = []
      }
    });
  }
  previewImages: any = {};

  previewImage(event: any, imageKey: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImages[imageKey] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  removeAadharImages() {
    // Clear the Aadhar URLs from the form control
    this.shipmentForm.patchValue({
      aadhar_front_url: null,
      aadhar_back_url: null
    });
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
  getFromValues() {
    this.shipmentForm = this.fb.group({
      invoice_no: [''],
      sender_name: ['', Validators.required],
      sender_address: ['', Validators.required],
      sender_pincode: ['', Validators.required],
      sender_mobile: ['', Validators.required],
      senderEmail: ['', [Validators.required, Validators.email]],
      senderCity: ['', Validators.required],
      receiver_name: ['', Validators.required],
      receiver_address: ['', Validators.required],
      receiver_taluk_name: [''],
      receiver_district_name: ['', Validators.required],
      receiver_postoffice: ['', Validators.required],
      receiver_state: ['', Validators.required],
      receiver_pincode: ['', Validators.required],
      receiver_mobile: ['', Validators.required],
      receiver_phone: [''],
      receiverEmaild: ['', [Validators.email]],
      total_carton: [''],
      total_weight: [''],
      aadhar_name: ['', Validators.required],
      aadhar_details: ['', Validators.required],
      aadhar_no: ['', Validators.required],
      created_by: [this.userDetails['v_user_id']],
      pickup_id: [''],
      aadhar_front_url: [''],
      aashar_back_url: ['']
    });
  }

  packages = [{ weight: null }];

  addPackage() {
    this.packages.push({ weight: null });
  }

  editPackage(index: number) {
    // Handle editing logic here
  }

  deletePackage(index: number) {
    this.packages.splice(index, 1);
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
  PackingListDetails: any[] = [];
  getPackingListDetails() {
    this.serviceNew.v1_ds_pickup_order_shipment_carton_details_get(this.receivedData['invoice_no']).subscribe(data => {
      if (data['data']) {
        this.PackingListDetails = data['data']
      } else {
        this.PackingListDetails = []
      }
    })
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
      invoice_no: [''],
      created_by: [this.userDetails['v_user_id']],
      pickup_id: ['']
      // chrg_weight:['']
    });

    this.calculateWeights();
    this.trackFormChanges(this.packingListForm);

  }
  volWeight: any;
  chrgWeight: any;
  changedFormFields: { control: string, value: any }[] = [];

  calculateWeights() {
    const formValues = this.packingListForm.value;
    const length = parseFloat(formValues.length);
    const width = parseFloat(formValues.width);
    const height = parseFloat(formValues.height);
    const act_wgt = parseFloat(formValues.act_wgt);

    // Calculate volumetric weight
    this.volWeight = ((length * width * height) / 500).toFixed(2);
    this.packingListForm.get('vol_weight').setValue(this.volWeight);

    // Get chargeable weight (greater of actual or volumetric weight)
    this.chrgWeight = Math.max(act_wgt, parseFloat(this.volWeight)).toFixed(2);
    this.packingListForm.get('chrg_weight').setValue(this.chrgWeight);
  }

  trackFormChanges(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      formGroup.get(controlName).valueChanges.subscribe(value => {
        const existing = this.changedFormFields.findIndex(f => f.control === controlName);
        if (existing > -1) {
          this.changedFormFields[existing].value = value;
        } else {
          this.changedFormFields.push({ control: controlName, value });
        }
      });
    });
  }
  PactchIndexValue(data) {
    console.log(data)
    if (data) {
      this.packingListForm.patchValue({
        carton_id: data.carton_id,
        item_type: data.item_type,
        act_wgt: data.act_wgt,
        chrg_weight: data.chrg_weight,
        length: data.length,
        width: data.width,
        height: data.height,
        item_details: data.item_details,
        vol_weight: data.vol_weight,
        carton_no: data.carton_no,
        invoice_no: data.invoice_no,
        pickup_id: data.pickup_id
      })
      this.modal1.open()

    } else {
      this.modal1.open()
    }

  }
  loading: boolean = false;

  submitForm() {
    console.log(this.packingListForm.value)

    console.log(this.packingListForm.value)
    if (this.shipmentForm.valid) {
      this.loading = true; // Show spinner
      this.service.sp_v1_ds_history_log_events_insert(this.shipmentForm.value['invoice_no'], this.userDetails['v_user_id'], 'Packing List Is Modified ').toPromise()

      this.serviceNew.v1_ds_pickup_carton_details_consignment_page_update(this.packingListForm.value).subscribe({
        next: (data) => {
          this.v1_ds_pickup_order_shipment_details_get();
          this.getPackingListDetails()
          this.showMessage('Form submitted successfully.');
          this.modal1.close();
          this.packingListForm.reset()
          this.packingListForm.get('created_by').setValue(this.userDetails['v_user_id'])
          this.loading = false; // Hide spinner after success
        },
        error: (err) => {
          this.showMessage('Error updating packing list: ' + JSON.stringify(err), 'error');

          // this.toastr.errorToastr(, );
          this.loading = false; // Hide spinner after error
        }
      });
    } else {
      this.showMessage('Please fill all required fields.', 'error');

    }

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
  deleteCartonDetail(data, i) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Are you sure you want to Delate' + '?',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      padding: '2em',
      customClass: 'sweet-alerts',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.sp_v1_ds_history_log_events_insert(this.shipmentForm.value['invoice_no'], this.userDetails['v_user_id'], 'All Booking Package ' + (i + 1) + ' Has Been Deleted ').subscribe();

        this.serviceNew.v1_ds_pickup_order_shipment_carton_details_delete(data).subscribe(d => {
          if (d['code'] == '200') {
            this.v1_ds_pickup_order_shipment_details_get();
            this.getPackingListDetails();
          }
        });
      }
    });
  }

   generatedTemplates:any;
   generatedTemplates1:any;
  v1_m_mail_events_get(){
  this.serviceNew.v1_m_mail_events_get(3).subscribe(r=>{
    this.generatedTemplates=r?.['data'].map(r=>({
      ...r,
      'mail_status' :(r['mail_status'] == 'false' ? false :true)
    }))
  })

  this.serviceNew.v1_m_mail_events_get(4).subscribe(r=>{
    this.generatedTemplates1=r?.['data'].map(r=>({
      ...r,
      'mail_status' :(r['mail_status'] == 'false' ? false :true)
    }))
  })
}
mailSubject
mailBody
sendmailtocustomer(){
  if(this.receivedData['collection_type'] === 'Drop_At_Warehouse'){
    console.log(this.generatedTemplates,"this.generatedTemplates")

  console.log(this.receivedHawbData,"ajay datails")
   this.mailSubject = String(this.generatedTemplates[0]['mail_subject']).replaceAll('[hawb_no]',this.receivedHawbData['invoice_no']).replaceAll('[sender_name]',this.receivedHawbData['sender_name']).replaceAll('[receiver_name]',this.receivedHawbData['receiver_name'])
    this.mailBody = String(this.generatedTemplates[0]['mail_body']).replaceAll('[hawb_no]',this.receivedHawbData['invoice_no']).replaceAll('[sender_name]',this.receivedHawbData['sender_name']).replaceAll('[receiver_name]',this.receivedHawbData['receiver_name']).replaceAll('[box_no]',this.receivedHawbData['carton'])
     
    console.log(this.mailSubject,"this.mailSubject")
    console.log(this.mailBody,"this.mailBody")
     if (this.generatedTemplates?.[0]?.['mail_status']) {
        //  this.mailBody = this.mailBody.replaceAll('[box_no]',this.receivedHawbData['total_pcs'])
      // if (d['data'].length > 0) {
        // const checkcount = d['data'].filter(r => r['update_status'] == '1');
        if (true) {
          const payload = {
            Subject: this.mailSubject,
            mailTo: 'ajaykittu570@gmail.com',
           // mailTo: 'chowlysaravanan@gmail.com',
            content: this.mailBody
          }
          this.serviceNew.v1_SP_m_mail_event_counter(3).subscribe()
          this.serviceNew.send_mail_to_customer_tracking_shipment(payload).subscribe()
          this.showMessage("Mail sended Successfully");
          console.log('All shipment received');
          console.log(payload)
        } else {
          // console.log(checkcount);
          console.log('All shipment not received');
        }
      }
    }
}
 

  v1_SP_Ds_hawb_order_Insert_by_hawb_id() {
    if (!this.packingListForm.value.carton_no) {
      this.packingListForm.get('carton_no').setValue(this.PackingListDetails.length + 1);
    }

    console.log(this.userDetails);
    // console.log(this.PackingListDetails[this.PackingListDetails.length - 1].carton_no)
    console.log('this.PackingListDetails[this.PackingListDetails.length - 1].box_no')
    const CartonData = [{
      invoice_no: this.shipmentForm.value.invoice_no,
      box_no: this.PackingListDetails.length > 0 && this.PackingListDetails[this.PackingListDetails.length - 1].carton_no
        ? Number(this.PackingListDetails[this.PackingListDetails.length - 1].carton_no) + 1
        : 1,
      box_type: this.packingListForm.value.item_type,
      weight: this.packingListForm.value.act_wgt,
      length: this.packingListForm.value.length,
      height: this.packingListForm.value.height,
      width: this.packingListForm.value.width,
      item_details: this.packingListForm.value.item_details, // fixed assignment
      vol_wgt: this.packingListForm.value.vol_weight,
      chargeable_wt: this.packingListForm.value.chrg_weight,
      pickup_id: this.packingListForm.value.pickup_id
    }];

    const Payload = {
      hawb_no: this.shipmentForm.value.invoice_no,
      created_by: this.userDetails['v_user_id'],
      cartonData: CartonData
    };

    console.log(Payload,"ajay1533");
    
    
    
    
    this.service.sp_v1_ds_history_log_events_insert(this.shipmentForm.value['invoice_no'], this.userDetails['v_user_id'], 'New Packing List Added').toPromise()

    this.serviceNew.insertPickupOrderCartonDetails(Payload).subscribe(
      data => {
        if (data['code'] == 200) {
          this.v1_ds_pickup_order_shipment_details_get();
          this.getPackingListDetails();
          this.showMessage("Inserted Successfully");
          this.modal3.close();
          this.packingListForm.reset()
          this.packingListForm.get('created_by').setValue(this.userDetails['v_user_id'])
        } else {
          this.showMessage("Insertion Failed", 'error');
          console.error('Error:', data);
        }
      },
      error => {
        this.showMessage("Insertion Failed", 'error');
        console.error('API Error:', error);
      }
    );
  }
    resetImg(){
      this.frontAadhaarData = null;
      this.frontUploaded = false;
      this.previewUrlFront = null;
            this.backUploaded = false;
            this.shipmentForm.get('aadhar_front_url').setValue(null);
    this.shipmentForm.get('aashar_back_url').setValue(null);  

  }
  isLoading = false;
  UpdateInvoice() {
    // console.log(this.changedFormFields)
    if (this.shipmentForm.valid) {
      this.isLoading = true;  // Show spinner
      this.service.sp_v1_ds_history_log_events_insert(this.shipmentForm.value['invoice_no'], this.userDetails['v_user_id'], 'All Booking Customer Details HAs Been Modified').toPromise()
      this.serviceNew.v1_ds_pickup_order_view_consignment_page_update(this.shipmentForm.value).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.apicall(this.Order_id)
            this.showMessage("Updated Successfully");
          }
          this.isLoading = false; // Hide spinner
        },
        (error) => {
          this.showMessage("Update Failed", 'error');
          this.isLoading = false; // Hide spinner in case of error
        }
      );
    } else {
      this.showMessage("Plz Fill All Mandatory Fields", 'error');
    }
  }

  //ocr Addahr validation
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

  // previewUrlFront: string | ArrayBuffer | null = null;
  // previewUrlBack: string | ArrayBuffer | null = null;
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
        this.coloredToast('danger', 'Error compressing image. Please try again.');
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
            this.coloredToast('success', 'Your details have been successfully populated. Please take a moment to review and confirm that everything is accurate. If any changes are required, feel free to update them now.');
          } else if (side === 'front' && !this.backUploaded) {
            this.coloredToast('info', 'Aadhaar Front uploaded successfully. Please upload the back side for address verification.');
          } else if (side === 'back' && !this.frontUploaded) {
            this.coloredToast('info', 'Aadhaar Back uploaded successfully. Please upload the front side for personal details verification.');
          }

        } else {
          this.resetAadhaarData(side);
          this.coloredToast('danger', 'Upload correct Aadhaar file!');
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
      this.coloredToast('info', "Plz Upload Aadhar Back");
    }
    if (!this.frontUploaded && this.backUploaded) {
      this.coloredToast('info', "Plz Upload Aadhar Front");
    }
  }
isImage1(url: string): boolean {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].split('#')[0];
  const ext = cleanUrl.split('.').pop()?.toLowerCase();
  return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '');
}

isPdf1(url: string): boolean {
  if (!url) return false;
  return url.toLowerCase().includes('.pdf');
}

isDrive(url: string): boolean {
  return !!url && url.includes('drive.google.com');
}

getDrivePreviewUrl(url: string): string {
  if (!url.includes('drive.google.com')) return url;
  const match = url.match(/\/d\/(.*?)(\/|$)/);
  const fileId = match ? match[1] : null;
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
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
  DriveAadharImgUrl: any;
  DriveAadharImgUrlBack: any;
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

  //3rd party
  calculateChargeableWeight(list: any) {
    // Calculate volumetric weight (length * width * height) / 5000
    list.vol_wgt = Math.ceil(Number(((list.length || 0) * (list.width || 0) * (list.height || 0)) / 5000)).toFixed(2);

    // Determine chargeable weight as the greater of actual weight and volumetric weight
    list.chargeable_wt = Math.ceil(Number(Math.max(list.weight || 0, list.vol_wgt))).toFixed(2);
  }
  manualReference: string = '';

  resetEntryMethod() {
  this.entryMethod = null;
  this.manualReference = '';
  this.assignForm.get('coLoder')?.setValue(null)
  this.assignForm.get('local_trasfer')?.setValue(null)
  this.assignForm.get('ship_ref_no')?.setValue(null)
  // this.assignForm1.reset({ coLoder: '-1' });

}
 CO_Loader:any=[];
  get_CO_Loader() {
    this.service.get_CO_Loader().subscribe(data => {
      this.CO_Loader = data['data']
    })
  }
  
addRow() {
  if (!this.totalReceivedData) {
    console.warn("No selected data available");
    return;
  }

  const newData = {
    pickup_id: '',
    origin_country: '',
    total_pcs: '',
    order_date: '',
    total_wgt: '',
    sender_name: '',
    sender_contact_no: '',
    sender_address: '',
    receiver_name: '',
    receiver_contact_no: '',
    receiver_address: '',
    receiver_state: '',
    receiver_pincode: '',
    order_assigned_to_branch: '',
    branch_ponit_id: '',
    shipper_mail_id: '',
    box_no: this.totalReceivedData.length + 1,
    weight: '',
    length: '',
    width: '',
    height: '',
    item_details: '',
    vol_wgt: '',
    invoice_no: this.receivedData['invoice_no'],
    collection_type: '',
    sender_company: '',
    sender_pincode: '',
    shipper_street: '',
    shipper_city: '',
    chargeable_wt: '',
    sender_address2:'',
    sender_address3:''
};

console.log(newData)
  this.totalReceivedData.push(newData);
}
deleteRow(index: number) {
  this.totalReceivedData.splice(index, 1);
}
copiedRowData: any = null;

copyRowData(index: number) {
  this.copiedRowData = { ...this.totalReceivedData[index] };
  this.copiedRowData.box_no = ''; // Don't copy box number
}

pasteRowData(targetIndex: number) {
  if (this.copiedRowData) {
    const updatedRow = { ...this.copiedRowData };
    updatedRow.box_no = this.totalReceivedData[targetIndex].box_no; // retain target row's box number
    updatedRow.pickup_id = ''; // retain target row's box number
    this.totalReceivedData[targetIndex] = updatedRow;
  }
}

ValidateManualPickup(ref: string) {
  if (this.totalReceivedData.length > 0) {
    // Get form values
    const coLoder = this.assignForm.get('coLoder')?.value;
    const localTrasfer = this.assignForm.get('local_trasfer')?.value;
    const shipRefNo = this.assignForm.get('ship_ref_no')?.value;

    // Check if any of the required fields are empty
    if (!coLoder || coLoder === '-1') {
      this.coloredToast('warning','Type of Co-loader is mandatory.');
      return;
    }
    const doLoaderName= this.CO_Loader.filter((d: { transporter_id: any; }) => d.transporter_id == coLoder)
    if(doLoaderName.length){
      this.assignForm.get('coloaderName')?.setValue(doLoaderName[0]['transporter_name']);

    }else{
      this.coloredToast('warning',"Co Loader Cant Find")
      return;

    }
    
    if (!localTrasfer) {
      this.coloredToast('warning','Co-loader Consignment Number is mandatory.');
      return;
    }
    // if (!shipRefNo) {
    //   this.coloredToast('warning','Co-loader Ref No is mandatory.', 'Validation Error');
    //   return;
    // }

    // Validate if all parcelNumbers are entered
    for (let i = 0; i < this.totalReceivedData.length; i++) {
      if (!this.totalReceivedData[i].parcelNumbers || this.totalReceivedData[i].parcelNumbers.trim() === '') {
        this.coloredToast('warning',`Co-loader Parcel No is mandatory for row ${i + 1}.`);
        return;
      }
    }
  }

this.assignToBranch();
  // Proceed with assignment logic
  console.log('Proceeding with manual assignment:', ref);
}
   isAssignBranchIsProcessing = false;
  _btnAssign:any;

assignToBranch() {
    const findTransporter=this.CO_Loader.filter((f: { [x: string]: any; })=> f['transporter_id'] == this.assignForm.value.coLoder)
    if(findTransporter.length>0){
      this.assignForm.get('coloaderName')?.setValue(findTransporter?.[0]?.transporter_name || '');

    }
    this.assignForm.get('invoice_no')?.setValue(this.receivedData['invoice_no']);
    this.assignForm.get('parcelData')?.setValue(this.totalReceivedData);
    // this.assignForm.get('collectionRef')?.setValue(this.DpdCollectionRefNo);
    
    console.log(this.assignForm.value.type + " viewForm.value.type");
    console.log(this.assignForm.value,"ajay")
    this.isAssignBranchIsProcessing = true; // Start loading
    this.isAssignBranchIsProcessing = false;
  //--ajay
    // this.serviceNew.update_Pickup_allocated_to_staff(this.assignForm.value).subscribe(
    //   (      data: { [x: string]: number; }) => {
    //     if (data['code'] == 200) {
    //       this._btnAssign = true;
    //       // this.assignForm.reset();
    //       // this.getHawbListAssigned();
    //       this.coloredToast('success',"assign Successful")
    //       this.successConnectedOfShipment.open()
          
    //     }else{          
    //       this.coloredToast('warning',"assign Failed")


    //     }
    //     this.isAssignBranchIsProcessing = false; // Stop loading
    //   },
    //   (      error: any) => {
    //     this.coloredToast('warning',"assign Failed")

    //     console.error("Error:", error);
    //     this.isAssignBranchIsProcessing = false; // Stop loading
    //   }
    // );
    //--ajay
  }
  
  AssginTime() {
    this.totalReceivedData[0]['collection_type'] = this.newCollectionType;
  }
   totalPcsOfInvoice:any=0;
  totalWtOfInvoice:any=0;
  typeOfService='1^12';
  optinalRef2='';
    coloaderCode = ''
 instruction1 = ''
  instruction2 = ''
  instruction3 = ''
  instruction4 = ''
    ValidatePickup(data: { coLoder: string; }){
      this.totalPcsOfInvoice = 0;
    this.totalWtOfInvoice = 0
    this.totalPcsOfInvoice = this.totalReceivedData.length;

    const totalWeight = this.totalReceivedData.reduce((sum, item) => sum + Number(item.chargeable_wt), 0);
    this.totalWtOfInvoice = Math.ceil(totalWeight).toFixed(2);


    const filterNotPresentCartonData: any[] = this.totalReceivedData.filter(d => d['pickup_id'] == '')
    if (filterNotPresentCartonData.length > 0) {
      this.insertCartonDataAddedNew(filterNotPresentCartonData);
    }
    this.updateShipperDetails()

    if (this.assignForm.value.type == 'Co-Loader' && (data.coLoder == '1' || data.coLoder == '6')) {
      if (data.coLoder == '6') {
        this.typeOfService = '1^22'
      } else {
        this.typeOfService = '1^12';

      }
      this.coloaderCode = data.coLoder;
      this.pickupTimeModal.open();
    } else if (this.assignForm.value.type == 'Co-Loader' && data.coLoder == '2') {
      this.pickupDateTimeModal.open();

    } else {
      this.assignToBranch();
    }
  }
  insertCartonDataAddedNew(data: any[]) {
    this.serviceNew.v1_ds_insert_pickup_carton_details(data).subscribe(
      (response: any) => {
        this.service.orderViewAssign(this.receivedData['order_no']).subscribe(d=>{
          this.totalReceivedData=d['data']
        })
        console.log("Carton data inserted successfully:", response);
        // this.coloredToast('success',"Carton data added successfully!");
      },
      (error: any) => {
        console.error("Error inserting carton data:", JSON.stringify(error));
        this.coloredToast('warning',"Failed to add carton data. Please try again.");
      }
    );
  }
  updateShipperDetails(){
                const chatwt = this.totalReceivedData.reduce((sum,item)=> sum+item.chargeable_wt ,0)
    const UpdateShipperData = {
      hawb_no: (this.totalReceivedData[0] && this.totalReceivedData[0].hawb_no && this.totalReceivedData[0].hawb_no.trim() !== "") 
          ? this.totalReceivedData[0].hawb_no : "-1",
      
      sender_name: (this.totalReceivedData[0] && this.totalReceivedData[0].sender_name && this.totalReceivedData[0].sender_name.trim() !== "") 
          ? this.totalReceivedData[0].sender_name : "-1",
      
      pincode: (this.totalReceivedData[0] && this.totalReceivedData[0].sender_pincode && this.totalReceivedData[0].sender_pincode.trim() !== "") 
          ? this.totalReceivedData[0].sender_pincode : "-1",
      
      address_1: (this.totalReceivedData[0] && this.totalReceivedData[0].sender_address && this.totalReceivedData[0].sender_address.trim() !== "") 
          ? this.totalReceivedData[0].sender_address : "-1",
      
      address_2: (this.totalReceivedData[0] && this.totalReceivedData[0].sender_address2 && this.totalReceivedData[0].sender_address2.trim() !== "") 
          ? this.totalReceivedData[0].sender_address2 : "-1",
      
      address_3: (this.totalReceivedData[0] && this.totalReceivedData[0].sender_address3 && this.totalReceivedData[0].sender_address3.trim() !== "") 
          ? this.totalReceivedData[0].sender_address3 : "-1",
      
      city: (this.totalReceivedData[0] && this.totalReceivedData[0].shipper_city && this.totalReceivedData[0].shipper_city.trim() !== "") 
          ? this.totalReceivedData[0].shipper_city : "-1",
      
      province: (this.totalReceivedData[0] && this.totalReceivedData[0].receiver_state && this.totalReceivedData[0].receiver_state.trim() !== "") 
          ? this.totalReceivedData[0].receiver_state : "-1",
      
      mobile: (this.totalReceivedData[0] && this.totalReceivedData[0].sender_contact_no && this.totalReceivedData[0].sender_contact_no.trim() !== "") 
          ? this.totalReceivedData[0].sender_contact_no : "-1",
      
      mail_id: (this.totalReceivedData[0] && this.totalReceivedData[0].shipper_mail_id && this.totalReceivedData[0].shipper_mail_id.trim() !== "") 
          ? this.totalReceivedData[0].shipper_mail_id : "-1",
      total_pcs: this.totalReceivedData.length,
      total_wt: chatwt 

      
  };
  this.serviceNew.v1_sp_ds_pickup_order_update(UpdateShipperData).toPromise();

  }
  assignToDpdCourerForPickup() {
    this.isAssignBranchIsProcessing = true; // Start loading
    this.totalReceivedData[0].total_pcs = this.totalPcsOfInvoice;
    this.totalReceivedData[0].total_wgt = this.totalWtOfInvoice;
    this.totalReceivedData[0].typeOfService = this.typeOfService;
    this.totalReceivedData[0].optinalRef2 = this.optinalRef2;
    this.serviceNew.AssignToDpd(this.totalReceivedData[0]).subscribe(
      (data: any) => {
        console.log("Response:", data);
        console.log(this.totalReceivedData);

        if (data.status === "success" && data.code === "200" && data.data && data.data.data) {
          const shipmentData = data.data.data;
          this.assignForm.get('coloaderName').setValue('DPD');

          if (this.assignForm.get('ship_ref_no')) {
            this.assignForm.get('ship_ref_no').setValue(shipmentData.shipmentId);
          }

          if (shipmentData.consignmentDetail && shipmentData.consignmentDetail.length > 0) {
            if (this.assignForm.get('local_trasfer')) {
              this.assignForm.get('local_trasfer').setValue(shipmentData.consignmentDetail[0].consignmentNumber);
            }
          }

          if (shipmentData.consignmentDetail && shipmentData.consignmentDetail.length > 0) {
            const parcelNumbers = shipmentData.consignmentDetail[0].parcelNumbers;
            if (parcelNumbers && parcelNumbers.length > 0) {
              for (let i = 0; i < parcelNumbers.length && i < this.totalReceivedData.length; i++) {
                this.totalReceivedData[i].parcelNumbers = parcelNumbers[i];
              }
            }
          }

          console.log(this.totalReceivedData);
          this.assignToBranch();
        } else {
          this.isAssignBranchIsProcessing = false;
          this.showMessage("Unexpected success response format: "+ JSON.stringify(data),'error');
        }
      },
      (error) => {
        this.isAssignBranchIsProcessing = false;
        console.error("API Error:", error);
          this.showMessage("Unexpected error response format: "+ JSON.stringify(error),'error');
      }
    );
  }
  updateContact() {
  Swal.fire({
    title: 'Customer Contact Confirmation For HAWB NO. ' + this.receivedData['invoice_no'],
    text: 'Have you contacted the customer?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      const ContactDetails = {
        _h: this.receivedData['invoice_no'],
        updated_by: this.userDetails.v_user_id
      };

      this.service.sp_v1_ds_history_log_events_insert(this.receivedData['invoice_no'], this.receivedData['v_user_id'], 'Customer Contact Confirmation').toPromise()
        .then(() => {
          this.serviceNew.v1_sp_ds_pickup_order_call_status_update(ContactDetails).subscribe(
            (data) => {
              if (data['code']) {
 this.apicall(this.Order_id);
      // this.getPackingListDetails()              
      
      this.showMessage('Status updated successfully!');
              } else {
               this.showMessage('Failed to update status.', 'error');
              }
            },
            (error) => {
              this.showMessage('An error occurred. Please try again.', 'error');
              console.error('Error updating status:', error);
            }
          );
        })
        .catch((error) => {
          this.showMessage('An error occurred. Please try again.', 'error');
          console.error('Error logging history event:', error);
        });
    }
  });
}

verifyColoaderPickup(data, sts, type) {
  let actionText = '';

  // Determine action text based on type and status
  if (type === 'call') {
    actionText = sts === '1' ? 'Assign' : 'Redo';
  } else if (type === 'pickup') {
    if (sts === '1') {
      actionText = 'Mark as Collected';
    } else if (sts === '0') {
      actionText = 'Reset';
    } else if (sts === '2') {
      actionText = 'Mark as Nothing to Collect';
    }
  } else if (type === 'con_img') {
    actionText = 'Confirm';
  } else if (type === 'verified') {
    actionText = 'Verify';
  }

  let eventLogText = '';

  if (type === 'call') {
    eventLogText = sts === '1' ? 'Call Assigned' : 'Call Redo';
  } else if (type === 'pickup') {
    if (sts === '1') {
      eventLogText = 'Marked as Collected';
    } else if (sts === '0') {
      eventLogText = 'Pickup Reset';
    } else if (sts === '2') {
      eventLogText = 'Marked as Nothing to Collect';
    }
  } else if (type === 'con_img') {
    eventLogText = sts === '1' ? 'Collection Image Marked as Received' : 'Collection Image Marked as Not Received';
  } else if (type === 'verified') {
    eventLogText = sts === '1' ? 'Shipment Verified' : 'Verification Reverted';
  }

  this.service.sp_v1_ds_history_log_events_insert(data.invoice_no, this.userDetails['v_user_id'], eventLogText).toPromise();

  // Define confirmation message
  let message = '';
  if (type === 'call') {
    message = `Are you sure you want to ${actionText.toLowerCase()} the call status?`;
  } else if (type === 'pickup') {
    message = `Are you sure you want to ${actionText.toLowerCase()}?`;
  } else if (type === 'con_img') {
    message = `Are you sure the collection image has been received?`;
  } else if (type === 'verified') {
    message = `Are you sure the shipment details are verified?`;
  }

  // SweetAlert Confirmation Popup
  Swal.fire({
    title: 'Confirm',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: actionText,
    cancelButtonText: 'Cancel',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      const d = {
        hawb_no: data.invoice_no,
        status: sts,
        created_by: this.userDetails.v_user_id,
        type: type
      };

      this.serviceNew.v1_SP_ds_Pickup_order_status_update(d).subscribe({
        next: (response) => {
          let successType =
            type === 'call' ? 'Call' :
            type === 'pickup' ? 'Pickup' :
            type === 'con_img' ? 'Collection image' :
            type === 'verified' ? 'Shipment details' : 'Status';

          this.showMessage(`${successType} ${actionText.toLowerCase()} successfully`);
          this.apicall(this.Order_id)
        },
        error: (error) => {
          let errorType =
            type === 'call' ? 'call' :
            type === 'pickup' ? 'pickup' :
            type === 'con_img' ? 'collection image' :
            type === 'verified' ? 'shipment details' : 'status';

           this.showMessage(`Failed to ${actionText.toLowerCase()} ${errorType}. Please try again.`);
        }
      });
    }
  });
}
salesRepId:any='';
  v1_ds_pickup_order_sales_repersent_update(num) {
    const p = {
      hawb_no: this.receivedData.invoice_no,
      sales_rep: this.salesRepId,
      flag: num
    }
        this.service.sp_v1_ds_history_log_events_insert(this.receivedData['invoice_no'],this.userDetails['v_user_id'],'Sales Rep Assigned').toPromise()

    this.serviceNew.v1_ds_pickup_order_sales_repersent_update(p).subscribe(d => {
      this.apicall(this.Order_id);
      this.showMessage('Sales Rep Assigned')
      this.salesRep.close()
      // this.salesLabelForNonAllocation.hide()
      this.salesRepId = ''
      // this.PaymentPaidAmt = 0

    })
  }
  employees:any=[]
  allUsers:any=[]
    getEmployee() {
    this.service.getemployeeBasedOnBranch(this.userDetails.v_point_id).subscribe(data => {
      this.employees = data['data'];
      this.allUsers = data['data']
    })
  }

cancelShipment() {
  Swal.fire({
    title: 'Cancel Shipment Confirmation for HAWB NO. ' + this.receivedData['invoice_no'],
    text: 'Are you sure you want to cancel this shipment?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    customClass: {
      confirmButton: 'btn-ok',
      cancelButton: 'btn-cancel',
    },
    preConfirm: () => {
      const cancelDetails = {
        invoice_no: this.receivedData['invoice_no'],
        // updated_by: this.userdetails.v_user_id
      };

      return this.service.sp_v1_ds_history_log_events_insert(this.receivedData['invoice_no'], this.receivedData['v_user_id'], 'Collection Cancelled').toPromise().then(() => {
        return this.serviceNew.update_Pickup_nonassignToBranch(cancelDetails).toPromise();
      }).then((data) => {
        if (data['code']) {
         this.router.navigate(['/customer/newBookings'], {
      queryParams: { data: encodeURIComponent(JSON.stringify(data)) }
    });
          Swal.fire('Success', 'Shipment cancelled successfully!', 'success');
        } else {
          Swal.fire('Error', 'Failed to cancel shipment.', 'error');
        }
      }).catch((error) => {
        Swal.fire('Error', 'An error occurred. Please try again.', 'error');
        console.error('Error cancelling shipment:', error);
      });
    },
  });
}
  callNotesFile() {
    if (String(this.receivedData['invoice_no']).trim().length != 6) {
      this.showMessage('Not A Valid HAWB No.','warning');
      return;
    }
    const payload = {
      invoice_no: String(this.receivedData['invoice_no'])
    }
    // data.invoice_no = data.hawb_no
    // this.selectedDetails = data
    this.serviceNew.sendChatData(payload)
    this.modal7.open()
  }
  
}
