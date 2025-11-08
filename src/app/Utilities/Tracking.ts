import { Component, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NewApiCloudService } from '../cfServices/new-api-cloud.service';
import { AwbService } from '../cfServices/awb.service';


@Component({
    selector: 'app-tracking',
    templateUrl: './Tracking.html',
})
export class TrackingComponent {
  @ViewChild('addNotes') addNotes: any;
  @ViewChild('saledQuotationModel') saledQuotationModel:any;
  receivedHawbData: any = {};
  PackingListDetails: any[] = [];
  activeTab: string = 'shipment'; // default selected tab
  activeTab1:string='emp'
  invoice_id = 'AB0514';
  headerText: any = [
    { text: "Booked Details", 'iconCss': 'e-twitter' }
  ];
  timelineEvents:any = [];
  eventLogs:any = [];
  ManifestDetails:any = [];
  receivedHawbDatanew: any = [];
  PackingListDetailsnew:any = [];
  panelOpenState:any = false;
  ReceivedColoaderDate = [];
  anyNotUpdated:any = [];
  code: string = '';
  state: string = '';

  constructor(private serviceNew: NewApiCloudService, private service: AwbService, private route: ActivatedRoute,) { 
     this.route.queryParams.subscribe(params => {
      this.code = params['code'] || '';
      this.state = params['state'] || '';

      if (this.code) {
        this.serviceNew.getFreeagentToken(this.code).subscribe(
          (d: any) => {
            if (d.length > 0) {
              // localStorage.clear()
              localStorage.setItem('FreeAgentToken', d[0].access_token);
              // localStorage.setItem('TokenType', d.data.token_type);
              localStorage.setItem('RefreshToken', d[0].refresh_token);
              localStorage.setItem('TokenExpiry', (d[0].token_expires).toString());
              console.log('Token stored successfully');
            } else {
              console.error('Invalid token response:', d);
            }
          },
          (error) => {
            console.error('Error fetching token:', error);
          }
        );
      }

      console.log('Code:', this.code);
      console.log('State:', this.state);
    });
  }



  ngOnInit(): void {
   
     this.route.queryParams.subscribe(params => {
      const searchQuery = params['q'];
      if(String(searchQuery).trim()){
        this.invoice_id=searchQuery;
        this.callShipmentData()
      }
      console.log('Query param value:', searchQuery);
    });
    // You may add initialization logic here if required
  }
  setActiveTab(type: string) {
    this.activeTab = type;
  }

   setActiveTab1(type: string) {
    this.activeTab1 = type;
  }
  resetAll(): void {
    this.receivedHawbData = {};
    this.receivedHawbDatanew = [];
    this.PackingListDetails = [];
    this.PackingListDetailsnew = [];
    this.timelineEvents = [];
    this.eventLogs = [];
    this.ReceivedColoaderDate = [];
    this.ManifestDetails = [];
    this.invoice_id = '';
    this.BoxGroups = [];
    this.BookedCustomerDetails = []
    this.receivedInvoiceImages = []
      this.notesData=[]
      this.freeagentDetails={}
      this.freeagentDetailsFinal={}

    this.headerText = [
      { text: "Booked Details", 'iconCss': 'e-twitter' }
    ];
  }
  openImage(url) {
    window.open(url)
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
  callShipmentData(): void {
    const value = this.invoice_id.trim().toUpperCase();
    if (value.length !== 6) {
      this.showMessage('Not A Valid HAWB','warning');
      return;
    }
      this.selectedCartonNo=''

    this.resetAll();
    this.invoice_id = value;
    this.getShipmentDetails(1);
   
  }
  BookedCustomerDetails:any = []
  v1_SP_ds_sales_quotation_booker_detail_get(data) {
    console.log(data['data'])
    console.log("data['data']")
      if (data['data'] && data['data']) {
        this.BookedCustomerDetails = data['data']
      } else {
        this.BookedCustomerDetails = []
      }
    
  }
isOdaLoction:boolean =false;

  getShipmentDetails(carton_no): void {
    if (!this.invoice_id || String(this.invoice_id) .trim() === '') {
      this.resetAll();
      return;
    }

    this.serviceNew.getShipmentDetailsTraingFull(this.invoice_id,carton_no).subscribe(data => {
      if (data['data'] && data['data']) {
        this.receivedHawbData = data['data']['shipmentDetails']['data'][0];
        console.log(data['data']['shipmentDetails']['data'][0])
        console.log('data.data.salesQuotation')
      this.v1_SP_ds_sales_quotation_booker_detail_get(data.data.salesQuotation)
        if (true) {
          this.isOdaLoction = data['data']['isOdaLoc'] == 'yes' ? true : false;

          this.getInvoiceDetails(data.data.hawbDetails);
          this.loadData(data.data.weightList);
          this.getTrackingHistory(data.data.trackingHistory);
          this.getPackingListDetails(data.data.cartonDetails);
          this.getHawbTrackingStatusFinal(data.data.hawbTracking);
          this.v1_SP_get_consignment_detail_based_on_hawb_carton_details(data.data.consignmentDetails);
          this.getImages(data.data.invoiceImages)
          this.getBoxNo(data.data.cartonByInvoice)
          this.notesGet(data.data.Notes)
          this.getTrackingHistoryCustomer(data.data.trackingHistoryForCustomer)
        }
        else {
          //  this.headerText =[]
          this.PackingListDetailsnew = [];
          this.ManifestDetails = [];
          this.ReceivedColoaderDate = []
          this.receivedHawbDatanew = [];

          // this.resetAll(); // Reset if no data found
        }
      } else {
        this.resetAll(); // Reset if no data found
      }
    });
  }
  isImageFile(fileName: string): boolean {
    return fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif');
  }
  notesData:any=[]
notesGet(data) {
  if (data['data'] && data['data'].length > 0) {
    this.notesData = data['data'].map(note => {
      if (note.notes.startsWith('$a-z/')) {
        note.notes = 'https://api.cargoforce.com/Origin_v2/api_php_booking/chatImages/' + note.notes.substring(5);
      }
      return note;
    });
    console.log(this.notesData)
  }
}

  getTrackingHistory(data): void {
      if (data['data'] && data['data']) {
        this.eventLogs = data['data'];
      } else {
        this.eventLogs = [];
      }
  }
  eventCustLogs:any=[]
    getTrackingHistoryCustomer(data): void {
      if (data['data'] && data['data']) {
        this.eventCustLogs = data['data'];
      } else {
        this.eventCustLogs = [];
      }
  }
  totalPieces = 0;
       totalActualWeight = 0;
       totalVolumetricWeight = 0;
       totalChargeableWeight = 0;

 getPackingListDetails(data): void {
    if (data['data'] && data['data']) {
      this.PackingListDetails = data['data'];
      this.totalPieces = 0;
      this.totalActualWeight = 0;
      this.totalVolumetricWeight = 0;
      this.totalChargeableWeight = 0;
      // Initialize variables for calculations
     
      // Loop through each carton and calculate total values
      this.PackingListDetails.forEach(carton => {
        this.totalPieces += 1; // Increment total pieces
        this.totalActualWeight += Math.ceil(parseFloat(carton.act_wgt || '0')); // Round up actual weight
        
        // Calculate volumetric weight (length * width * height / 5000)
        const volumetricWeight = (parseFloat(carton.length || '0') * parseFloat(carton.width || '0') * parseFloat(carton.height || '0')) / 5000;
        this.totalVolumetricWeight += Math.ceil(volumetricWeight); // Round up volumetric weight
        
        // Calculate the chargeable weight (max of actual and volumetric)
        this.totalChargeableWeight += Math.ceil(Math.max(parseFloat(carton.act_wgt || '0'), volumetricWeight)); // Round up chargeable weight
      });

      // Log the results or use them in your application
    
    } else {
      this.PackingListDetails = [];
    }
}



  getInvoiceDetails(data): void {
      if (data['data'] && data['data']) {
        this.receivedHawbDatanew = data['data'][0];
        this.headerText = [
          { text: "Booked Details", 'iconCss': 'e-twitter' },
          { text: "After Receiving Warehouse", 'iconCss': 'e-facebook' }
        ];
      } else {
        this.headerText = [
          { text: "Booked Details", 'iconCss': 'e-twitter' }
        ];
        this.receivedHawbDatanew = [];
      }
  }

  v1_SP_get_consignment_detail_based_on_hawb_carton_details(r): void {
    if(r['data']){
      this.ManifestDetails = r['data'][0];

    }
  }
   totalReceivedPieces: number = 0;
  totalNotReceivedPieces: number = 0;
  totalReceivedWeight: number = 0;
  totalNotReceivedWeight: number = 0;
  totalReceivedVolWeight: number = 0;
  totalNotReceivedVolWeight: number = 0;
  totalReceivedChargeableWeight: number = 0;
  totalNotReceivedChargeableWeight: number = 0;
  loadData(d): void {
   
      
          if (d && d.status === "success" && d.data && d.data.length > 0) {
            this.processData(d);
          } else {
            this.ReceivedColoaderDate = [];
          }
        
  
  }

  private processData(d: any): void {
    // Reset the totals before processing the data
    this.totalReceivedPieces = 0;
    this.totalNotReceivedPieces = 0;
    this.totalReceivedWeight = 0;
    this.totalNotReceivedWeight = 0;
    this.totalReceivedVolWeight = 0;
    this.totalNotReceivedVolWeight = 0;
    this.totalReceivedChargeableWeight = 0;
    this.totalNotReceivedChargeableWeight = 0;

    // Process the data
    this.ReceivedColoaderDate = d['data'].map(item => {
      const length = Math.ceil(parseFloat(item.length));
      const width = Math.ceil(parseFloat(item.width));
      const height = Math.ceil(parseFloat(item.height));
      const act_wgt = Math.ceil(parseFloat(item.act_wgt));
      const volWeight = this.calculateVolumetricWeight(item);
      const chargeableWeight = this.calculateChargeableWeight(item);

      // Calculate totals based on the update status
      if (item.update_status === "1") { // Received
        this.totalReceivedPieces += 1;
        this.totalReceivedWeight += act_wgt;
        this.totalReceivedVolWeight += volWeight;
        this.totalReceivedChargeableWeight += chargeableWeight;
      } else { // Not received
        this.totalNotReceivedPieces += 1;
        this.totalNotReceivedWeight += act_wgt;
        this.totalNotReceivedVolWeight += volWeight;
        this.totalNotReceivedChargeableWeight += chargeableWeight;
      }

      // Return the processed item
      return {
        ...item,
        length,
        width,
        height,
        act_wgt,
        vol_weight: volWeight,
        chrg_weight: chargeableWeight,
        created_by: '',
      };
    });

    // Log or update the values based on received vs not received
    console.log('Total Received Pieces:', this.totalReceivedPieces);
    console.log('Total Received Weight:', this.totalReceivedWeight);
    console.log('Total Received Volumetric Weight:', this.totalReceivedVolWeight);
    console.log('Total Received Chargeable Weight:', this.totalReceivedChargeableWeight);
    console.log('Total Not Received Pieces:', this.totalNotReceivedPieces);
    console.log('Total Not Received Weight:', this.totalNotReceivedWeight);
    console.log('Total Not Received Volumetric Weight:', this.totalNotReceivedVolWeight);
    console.log('Total Not Received Chargeable Weight:', this.totalNotReceivedChargeableWeight);
  }

  private calculateChargeableWeight(item: any): number {
    const volWeight = this.calculateVolumetricWeight(item);
    return Math.ceil(Math.max(volWeight, item.act_wgt));
  }

  private calculateVolumetricWeight(item: any): number {
    return Math.ceil((item.length * item.width * item.height) / 5000);
  }


  getHawbTrackingStatusFinal(data): void {
    if(data['data']){
       this.timelineEvents = data['data'].map(item => ({
        tag: 'Shipment - ' + this.invoice_id + this.selected_box_no,
        title: item.sts,
        details: item.description,
        timestamp: this.formatTimestamp(item.date_time)
      }));
    }
     
  }

  formatTimestamp(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  }

  convertToPreviewUrl(driveUrl: string): string {
    if (String(driveUrl).trim().length === 0) {
      return '';
    }
    const regex = /\/d\/([a-zA-Z0-9_-]+)/;
    const match = driveUrl.match(regex);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return driveUrl;
  }
  BoxGroups: any[] = [];
  selectedCartonNo: string = '';

getBoxNo(res) {
  this.selected_box_no = 'A';
  if (res && res['data'] && Array.isArray(res['data']) && res['data'].length > 0) {
    const data = res['data'];
    const grouped: any = {};

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const bag = item.bag_no && item.bag_no.trim() !== '' ? item.bag_no : 'A';

      if (!grouped[bag]) {
        grouped[bag] = {
          bag_no: bag,
          total_weight: 0,
          carton_no: [], // store as array first
          payment_date_count: item.payment_date_count
        };
      }

      grouped[bag].total_weight += parseFloat(item.chrg_weight || '0');
      grouped[bag].carton_no.push(item.carton_no); // push each carton number
    }

    // Add a new mergedCartonNo field to each item where carton_no is merged
    for (const key in grouped) {
      grouped[key].carton_no = grouped[key].carton_no.join(',');
      grouped[key].mergedCartonNo = grouped[key].carton_no; // This is the new reference
    }

    this.BoxGroups = Object.values(grouped).sort((a: any, b: any) => {
      return a.bag_no.localeCompare(b.bag_no); // sort by bag letter
    });

  } else {
    this.BoxGroups = [];
    this.selectedCartonNo = '';
  }
}

  receivedInvoiceImages = []
  getImages(r) {
      if (r['data'].length > 0) {
        this.receivedInvoiceImages = r['data'].map(r => ({
          ...r,
          hawb_img: r['hawb_img'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['hawb_img'] : '',
          ashawb_final_img1: r['ashawb_final_img1'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['ashawb_final_img1'] : '',
          ashawb_final_img2: r['ashawb_final_img2'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['ashawb_final_img2'] : ''
        }))
      } 

  }
  selected_box_no = '';

  selectCarton(cartonNo: string, bag_no) {
    this.selectedCartonNo = cartonNo;
    this.selected_box_no = bag_no;
    console.log(cartonNo)
    if(cartonNo.includes(',')){
      const catonnoArr= cartonNo.split(',')[0];
          this.getShipmentDetails(catonnoArr);

    }else{
    this.getShipmentDetails(cartonNo);

    }
    // this.v1_SP_get_consignment_detail_based_on_hawb_carton_details(this.invoice_id, cartonNo);
    // this.getBoxNo(this.receivedHawbData['hawb_id'])
  }
  callNotesFile() {
    if (String(this.invoice_id).trim().length != 6) {
      this.showMessage('Not A Valid HAWB No.','warning');
      return;
    }
    const payload = {
      invoice_no: this.invoice_id
    }
    // data.invoice_no = data.hawb_no
    // this.selectedDetails = data
    this.serviceNew.sendChatData(payload)
    this.addNotes.open()
  }
openInvoice(url){
  const payload={
    "inv_url": url,
    "invoice_no":this.invoice_id
}
this.serviceNew.openFreeAgneInv(payload).subscribe(r=>{
    window.open('https://api.cargoforce.com/operation/nodeNew/invoice_pdf/invoice-'+r['data']['f_name'])
})
}
freeagentDetails:any;
freeagentDetailsFinal:any;

getDetialsOfInvoices(){
  
    const requestData = {
      url: this.receivedHawbData.deposit_inv_url
    };
      this.serviceNew.createInvoice_freeAgent(requestData, 'SI').subscribe((response: any) => {
      let invoice = null;
      let items = [];

      // Determine if it's an invoice or credit note
      if (response && response.data && response.data.list) {
        if (response.data.list.invoice) {
          this.freeagentDetails = response.data.list.invoice;
          items = invoice.invoice_items || [];
        } else if (response.data.list.credit_note) {
          this.freeagentDetails = response.data.list.credit_note;
          items = invoice.credit_note_items || [];
        }
      }
      console.log(this.freeagentDetails)
      // Extract reference if available
  
    });
}
getDetialsOfInvoices1(){
  
    const requestData = {
      url: this.receivedHawbDatanew.free_agent_invoice_url
    };
      this.serviceNew.createInvoice_freeAgent(requestData, 'SI').subscribe((response: any) => {
      let invoice = null;
      let items = [];

      // Determine if it's an invoice or credit note
      if (response && response.data && response.data.list) {
        if (response.data.list.invoice) {
          this.freeagentDetailsFinal = response.data.list.invoice;
          items = invoice.invoice_items || [];
        } else if (response.data.list.credit_note) {
          this.freeagentDetailsFinal = response.data.list.credit_note;
          items = invoice.credit_note_items || [];
        }
      }
      console.log(this.freeagentDetailsFinal)
      // Extract reference if available
  
    });
}
}
