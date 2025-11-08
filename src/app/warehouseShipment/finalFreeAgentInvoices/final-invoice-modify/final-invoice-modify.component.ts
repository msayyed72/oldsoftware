import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent, RowDataBoundEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { NewApiCloudService } from '../../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';
import { DatePipe } from '@angular/common';
import { AwbService } from '../../../cfServices/awb.service';
import { concatMap, timer } from 'rxjs';

@Component({
  selector: 'app-final-invoice-modify',
  templateUrl: './final-invoice-modify.component.html',
  styleUrls: ['./final-invoice-modify.component.css']
})
export class FinalInvoiceModifyComponent implements OnInit {
  @ViewChild('editItemModal') editItemModal:any;
  @ViewChild('modal7') modal7:any;
  
userdetails:any;
userid
  v_point_Id_Branch;
  GotInvoiceNoToGenerate=''
  v_location_id
  pointid
  point_type_id
  country_id
  invoice_no
  pdf_data
  date
  point_code_pefix
  v_designation_id
    today = new Date();
  btn3: any;
  invoice_list: any=[];
  editItem: any = {};
  selectedDetails:any={};
    params!: FormGroup;

  editingIndex: number | null = null;
code:any;
state:any;
 constructor(public http: HttpClientModule,
    public serviceNew: NewApiCloudService,
   public fb: FormBuilder, private imageCompress: NgxImageCompressService,
   public router: Router,
    private datep: DatePipe, 
    public service: AwbService, private route: ActivatedRoute,
   ){
        this.userdetails = JSON.parse(localStorage.getItem("log_data"))
        this.userid = this.userdetails.v_user_id;
    this.pointid = this.userdetails.v_point_id
    this.point_type_id = this.userdetails.v_point_type_id
    this.point_code_pefix = this.userdetails.v_origin_prefix
    this.country_id = this.userdetails.V_country_id
    this.v_point_Id_Branch = this.userdetails.v_point_Id_Branch
    this.v_location_id = this.userdetails.v_location_id
    this.v_designation_id = this.userdetails.v_designation_id
    this.date = this.datep.transform(this.today, 'yyyy-MM-dd');
      // this.getFreeAgentAutoComplete()
       this.route.queryParams.subscribe(params => {
      this.code = params['code'] || '';
      this.state = params['state'] || '';

      if (this.code) {
      this.serviceNew.getFreeagentToken(this.code).subscribe({
  next: (d: any) => {
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
  error: (error) => {
    console.error('Error fetching token:', error);
  },
  complete: () => {
    console.log('Token fetch process completed');
  }
});

      }

      // console.log('Code:', this.code);
      // console.log('State:', this.state);
    });
    }
    filterSettings:any;
receivedData:any;
  ngOnInit(): void {
     if (!localStorage.getItem('FreeAgentToken') && !localStorage.getItem('RefreshToken') && !localStorage.getItem('TokenExpiry')) {
    this.verifyFreeagentCall();
    return;
  }
      this.route.params.subscribe(datas => {
      this.GotInvoiceNoToGenerate = datas['id']
          this.callApi(this.GotInvoiceNoToGenerate);
    });
     this.route.queryParams.subscribe(params => {

      const encodedData = params['data'];
        //     console.log("params")
        //     console.log(params)

        //  this.filterSettings = JSON.parse(params['filterSettings']);
   
      if (encodedData) {
        // Decode the data and parse it back to an object
        const decodedData = decodeURIComponent(encodedData);
        const receivedData = JSON.parse(decodedData);
        this.receivedData=receivedData;
        if(receivedData.invoice_api_status == "0"){
      this.getPackingListDetails(receivedData);
              this.loadData(receivedData)

      

        }else{
      this.editInvoice(receivedData)

        }

      }
    });
    this.initForm()
     this.selectPaymentDate = new Date().toISOString().split('T')[0];

    // this.Get_NextPickupDate_After14Days_freeagent(this.selectPaymentDate)

  }
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
  editInvoice(HaebData: any) {
    this.selectedDetails={}
    this.selectedDetails = HaebData;

    const requestData = {
      url: HaebData['invoice_url']
    };

    this.serviceNew.createInvoice_freeAgent(requestData, 'SI').subscribe((response: any) => {
      let invoice = null;
      let items = [];

      // Determine if it's an invoice or credit note
      if (response && response.data && response.data.list) {
        if (response.data.list.invoice) {
          invoice = response.data.list.invoice;
          items = invoice.invoice_items || [];
        } else if (response.data.list.credit_note) {
          invoice = response.data.list.credit_note;
          items = invoice.credit_note_items || [];
        }
      }

      // Extract reference if available
      if (invoice && invoice.reference) {
        this.selectedDetails['freeAgentRef'] = invoice.reference;
      }

      // Map items
      this.editingData = items.map((item: any) => ({
        quantity: parseFloat(item.quantity),
        description: item.description,
        id:String(item.url).split('/').pop(),
        url: item.url,
        categogy: item.category,
        isPresent: true,
        unit_price: parseFloat(item.price),
        VAT: 0 // Because sales_tax_status is OUT_OF_SCOPE
      }));

      // this.editItemModal.open();
    });
  }
  callApi(searchText: string) {
    this.invoice_list=[]
      this.selectedDetails={};

    this.btn3 = true;
    this.serviceNew.get_invoice_list(this.pointid, this.v_location_id, searchText, -1).subscribe(data => {
      if (data['data'] && data['data'].length) {

      let newInvoices = data['data'].map((d, i) => {
  const [day, month, year] = d['hawb_date'].split('-'); // Assuming the date is in 'dd-mm-yyyy' format
  const formattedDate = `${year}-${month}-${day}`; // Converting to 'yyyy-mm-dd'

  return {
    ...d,
    pageNo: this.invoice_list.length + 1,
    invCurrentSts: d['invoice_api_status'] == 0 ? 'Not Generated' :
      d['invoice_api_status'] == 1 ? 'Generated' :
        d['invoice_api_status'] == 2 ? 'Marked as Sent' :
          d['invoice_api_status'] == 3 ? 'Sent to Customer' :
            'Status Not Found',
    hawb_date: formattedDate // Setting the formatted date
  };
});


        // ✅ **Filter to keep only unique `hawb_no` values**
        let allInvoices = [...this.invoice_list, ...newInvoices];
        this.invoice_list = allInvoices.filter((v, i, self) =>
          i === self.findIndex(t => t.hawb_no === v.hawb_no) // Keep only the first occurrence of each `hawb_no`
        );
                        this.selectedDetails = this.invoice_list[0]
            this.selectedDetails.freeAgentRef = this.invoice_list[0].hawb_no;

        this.receivedData.invoice_url = this.invoice_list[0].invoice_url;
        if(this.receivedData.invoice_url){
        this.editInvoice(this.receivedData)

        }
this.router.navigate([], {
            queryParams: { data: encodeURIComponent(JSON.stringify(this.receivedData)) }
  });
        console.log(this.invoice_list)
        // this.getPackingListDetails(this.invoice_list[0])
      } else {
        console.log("No new invoices found.");
      }

      // this.rowsFilter = this.invoice_list;

      // if (data['code'] == 200) {
      //   this.tot_inv = this.invoice_list.length;
      //   this.tot_ctn = 0;
      //   this.tot_wgt = 0;
      //   this.tot_net_Amt = 0;
      //   this.tot_Rec_Amt = 0;point
      //   this.tot_Blc_Amt = 0;

      //   for (let i = 0; i < this.tot_inv; i++) {
      //     this.tot_ctn += Number(this.invoice_list[i]['total_carton']);
      //     this.tot_wgt += Number(this.invoice_list[i]['total_weight']);
      //     this.tot_net_Amt += Number(this.invoice_list[i]['net_amount']);
      //     this.tot_Rec_Amt += Number(this.invoice_list[i]['received_amount']);
      //     this.tot_Blc_Amt += Number(this.invoice_list[i]['balance_amount']);
      //   }
      // }

      this.btn3 = false;
    });
  }
    accountNoControl = new FormControl('');
  editingData: any = [];
  activeRowIndex: number | null = null;
  selectedPrefix: string = '';
    autoCompleteList: any[] = [];
  autoCompleteData: any[] = [];
  suggestionData: any[] = [];

    openEditPopup(index: number) {
    this.editingIndex = index;
    this.accountNoControl.reset()
    this.editItem = { ...this.editingData[index] }; // clone item
    this.editItemModal.open(); // show modal
  }
   selectSuggestion(suggestion: any) {

    console.log(suggestion)
    this.editItem.description = `${suggestion.value} ${this.editItem.description}`;
    this.selectedPrefix = ''; // Clear the selected prefix after selection
    this.autoCompleteList = []; // Clear suggestions
    this.editItem.unit_price = suggestion.unit
    this.editItem.VAT = suggestion.isVAT
  }
    getFreeAgentAutoComplete() {
    this.serviceNew.getFreeAgentAutoComplete().subscribe(d => {
      this.autoCompleteData = d['data'];
      this.suggestionData = d['data']
    });
  }
  saveEdit() {
    console.log(this.editItem)
    // Check if editingIndex is not null and editItem is valid
    if (this.editingIndex !== null) {

      // Validate required fields
      if (!this.editItem.quantity || this.editItem.quantity <= 0) {
        this.showMessage("Please enter a valid quantity.",'error');
        return; // Exit the function if validation fails  
      }

      if (!this.editItem.unit_price) {
        this.showMessage("Please enter a valid unit price.",'error');
        return; // Exit the function if validation fails
      }

      // if (!this.editItem.VAT ) {
      //   this.toastr.warningToastr("Please enter a valid VAT percentage.");
      //   return; // Exit the function if validation fails
      // }

      // Calculate VAT amount if all inputs are valid
      this.editItem.VATAMT = this.editItem.VAT !== 0
        ? ((this.editItem.quantity * this.editItem.unit_price) * this.editItem.VAT * 0.01)
        : 0;

      this.editItem.sub_total = this.editItem.quantity * this.editItem.unit_price;

      // Update the data
      this.editingData[this.editingIndex] = { ...this.editItem };
      
        this.receivedData.invoice_api_status = this.invoice_list[0].invoice_api_status;

this.router.navigate([], {
            queryParams: { data: encodeURIComponent(JSON.stringify(this.receivedData)) }
  });
      // Hide the modal
      this.editItemModal.close();
    }
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
    
  // Calculate the total amount dynamically
  getNetTotal(): number {
    return this.editingData.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }
  // getNetTotalMod(): number {
  //   return this.editingDataModufy.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  // }
  // Convert Net Total to GBP Total (assuming same value for now, modify if needed)
  getGBPAmount(): number {
    return this.getNetTotal(); // If there's a conversion, apply it here
  }
  // getGBPAmountMod(): number {
  //   return this.getNetTotalMod(); // If there's a conversion, apply it here
  // }

  getVATAMt(): number {
    const Amt = this.editingData.reduce((sum, item) => sum + (item.VATAMT || 0), 0);
    // const 
    return Amt ? Amt : 0;
  }

  // getVATAMtMod(): number {
  //   const Amt = this.editingDataModufy.reduce((sum, item) => sum + (item.VATAMT || 0), 0);
  //   // const 
  //   return Amt ? Amt : 0;
  // }
  isBillingClientFound: boolean = false;

  createInvoice_freeAgent() {
    // console.log(this.editingData)
    const invoiceItems = this.editingData.map(item => ({
        id:item.url ? String(item.url).split('/').pop() : '',
      description: item.description ? item.description.trim() : "",
      item_type: "", // Add logic here if required
      price: item.unit_price.toString(),
      quantity: item.quantity || 0,
      sales_tax_rate: parseFloat(item.VAT) || 0 // Ensures it becomes a float like 20.0

    }));


    this.serviceNew.createInvoice_freeAgent({}, 'C').pipe(
      concatMap((res: any) => {
        let contacts = [];
        let contactUrl = '';

        if (res && res.data && res.data.list && res.data.list.contacts) {
          contacts = res.data.list.contacts;
        }

        const senderMail = this.selectedDetails.sender_mail;
        this.isBillingClientFound = false;

        for (let i = 0; i < contacts.length; i++) {
          const contact = contacts[i];
          if (
            (contact.billing_email && contact.billing_email === senderMail) ||
            (contact.email && contact.email === senderMail)
          ) {
            // console.log('Matching mail f/ound:', senderMail);
            this.isBillingClientFound = true;
            contactUrl = contact.url;
            break;
          }
        }

        const data: any = {
          invoice_no: this.selectedDetails.hawb_no,
          freeAgentRef: this.selectedDetails.freeAgentRef,
          net_amount: this.getGBPAmount(),
          total_value: this.getGBPAmount() + this.getVATAMt(),
          invoice_items: invoiceItems,
          created_by: this.userdetails['v_user_id'],
          firstName: '',
          lastName: '',
          senderMail: '',
          senderPhone: '',
          sender_address: '',
          sender_address2: '',
          sender_address3: '',
          sender_pincode: '',
          shipper_city: '',
          contactUrl: '',
          invoiceUrl: this.receivedData.invoice_url ? this.receivedData.invoice_url :'https://api.freeagent.com/v2/invoices'
        };
        const fullName = this.selectedDetails['sender_name'];
        const nameParts = this.splitName(fullName);

        data.firstName = nameParts.firstName;
        data.lastName = nameParts.lastName;
        data.senderMail = this.selectedDetails['sender_mail'];
        data.senderPhone = this.selectedDetails['sender_mobile'];
        data.sender_address = this.selectedDetails['sender_address'];
        data.sender_address2 = this.selectedDetails['sender_address2'];
        data.sender_address3 = this.selectedDetails['sender_address3'];
        data.shipper_city = this.selectedDetails['shipper_city'];
        data.sender_pincode = this.selectedDetails['sender_pincode'];
        data.type = 'final_invoice';

        if (!this.isBillingClientFound) {
          // Adding a delay (0 or 1 sec) before the second API call
          return timer(10).pipe(  // You can change the 1000ms to 0 for immediate delay or 1000 for 1 second delay
            concatMap(() => this.serviceNew.createInvoice_freeAgent(data, 'CC')),
            concatMap((resCC: any) => {
              if (
                resCC &&
                resCC.status === 'success' &&
                resCC.data &&
                resCC.data.invoice &&
                resCC.data.invoice.contact &&
                resCC.data.invoice.contact.url
              ) {
                data.contactUrl = resCC.data.invoice.contact.url;
              }
 return timer(20).pipe(
        concatMap(() => this.serviceNew.createInvoice_freeAgent(data, 'I'))
      );            })
          );
        } else {
          data.contactUrl = contactUrl;
 return timer(20).pipe(
        concatMap(() => this.serviceNew.createInvoice_freeAgent(data, 'I'))
      );        }
      })
    ).subscribe(
      (r: any) => {
        if (
          r &&
          r.status === 'success' &&
          r.data &&
          r.data.f_name
        ) {
          this.showMessage("Invoice created successfully!");
          this.callApi(this.GotInvoiceNoToGenerate);
          // this.sendFreeAgentInvPdf.hide();
          window.open("https://api.cargoforce.com/operation/nodeNew/invoice_pdf/invoice-" + r.data.f_name, "_blank");
          
        this.receivedData.invoice_api_status = '1';

this.router.navigate([], {
            queryParams: { data: encodeURIComponent(JSON.stringify(this.receivedData)) }
  });
        } else if (
          r &&
          r.data &&
          r.data.invoice &&
          r.data.invoice.errors &&
          r.data.invoice.errors.length > 0
        ) {
          for (let i = 0; i < r.data.invoice.errors.length; i++) {
            this.showMessage(r.data.invoice.errors[i].message,'error');
          }
        } else {
          this.showMessage("Unexpected error occurred while creating the invoice.",'error');
        }
      },
      (error: any) => {
        this.showMessage("API request failed. Please try again.",'error');
      }
    );
  }
    splitName(fullName: string): { firstName: string, lastName: string } {
    const nameParts = fullName.trim().split(/\s+/);
    const lastName = nameParts.pop() || ''; // Get last word
    const firstName = nameParts.join(' ');  // Join the rest as first name

    return { firstName, lastName };
  }
  createInvoice_freeAgent_CreditNote() {
    console.log(this.editingData)
    const invoiceItems = this.editingData.map(item => ({
              id:item.url ? String(item.url).split('/').pop() : '',

      description: item.description ? item.description.trim() : "",
      item_type: "", // Add logic here if required
      price: item.unit_price.toString(),
      quantity: item.quantity || 0,
    }));

    this.serviceNew.createInvoice_freeAgent({}, 'C').pipe(
      concatMap((res: any) => {
        let contacts = [];
        let contactUrl = '';

        if (res && res.data && res.data.list && res.data.list.contacts) {
          contacts = res.data.list.contacts;
        }

        const senderMail = this.selectedDetails.sender_mail;
        this.isBillingClientFound = false;

        for (let i = 0; i < contacts.length; i++) {
          const contact = contacts[i];
          if (
            (contact.billing_email && contact.billing_email === senderMail) ||
            (contact.email && contact.email === senderMail)
          ) {
            console.log('Matching mail found:', senderMail);
            this.isBillingClientFound = true;
            contactUrl = contact.url;
            break;
          }
        }

        const data: any = {
          invoice_no: this.selectedDetails.hawb_no,
          freeAgentRef: this.selectedDetails.freeAgentRef,
          net_amount: this.getGBPAmount(),
          invoice_items: invoiceItems,
          created_by: this.userdetails['v_user_id'],
          firstName: '',
          lastName: '',
          senderMail: '',
          senderPhone: '',
          sender_address: '',
          sender_address2: '',
          sender_address3: '',
          sender_pincode: '',
          shipper_city: '',
          contactUrl: '',
         invoiceUrl: this.receivedData.invoice_url ? String(this.receivedData.invoice_url).replace('invoices','credit_notes') : 'https://api.freeagent.com/v2/credit_notes'
        };
        const fullName = this.selectedDetails['sender_name'];
        const nameParts = this.splitName(fullName);

        data.firstName = nameParts.firstName;
        data.lastName = nameParts.lastName;
        data.senderMail = this.selectedDetails['sender_mail'];
        data.senderPhone = this.selectedDetails['sender_mobile'];
        data.sender_address = this.selectedDetails['sender_address'];
        data.sender_address2 = this.selectedDetails['sender_address2'];
        data.sender_address3 = this.selectedDetails['sender_address3'];
        data.shipper_city = this.selectedDetails['shipper_city'];
        data.sender_pincode = this.selectedDetails['sender_pincode'];
        data.type = 'final_invoice';

        if (!this.isBillingClientFound) {
          // Adding a delay (0 or 1 sec) before the second API call
          return timer(10).pipe(  // You can change the 1000ms to 0 for immediate delay or 1000 for 1 second delay
            concatMap(() => this.serviceNew.createInvoice_freeAgent(data, 'CC')),
            concatMap((resCC: any) => {
              if (
                resCC &&
                resCC.status === 'success' &&
                resCC.data &&
                resCC.data.invoice &&
                resCC.data.invoice.contact &&
                resCC.data.invoice.contact.url
              ) {
                data.contactUrl = resCC.data.invoice.contact.url;
              }
              return this.serviceNew.createInvoice_freeAgent(data, 'CN');
            })
          );
        } else {
          data.contactUrl = contactUrl;
          return this.serviceNew.createInvoice_freeAgent(data, 'CN');
        }
      })
    ).subscribe(
      (r: any) => {
        if (
          r &&
          r.status === 'success' &&
          r.data &&
          r.data.f_name
        ) {
          this.service.sp_v1_ds_history_log_events_insert(this.selectedDetails.hawb_no, this.userdetails['v_user_id'], 'FreeAgent Final InvoiceCredit Note Has Been Generated').toPromise()

          this.showMessage("Invoice created successfully!");
          this.callApi(this.GotInvoiceNoToGenerate);
          // this.sendFreeAgentInvPdf.hide();
          window.open("https://api.cargoforce.com/operation/nodeNew/invoice_pdf/invoice-" + r.data.f_name, "_blank");
              
        this.receivedData.invoice_api_status = '1';

this.router.navigate([], {
            queryParams: { data: encodeURIComponent(JSON.stringify(this.receivedData)) }
  });
        } else if (
          r &&
          r.data &&
          r.data.invoice &&
          r.data.invoice.errors &&
          r.data.invoice.errors.length > 0
        ) {
          for (let i = 0; i < r.data.invoice.errors.length; i++) {
            this.showMessage(r.data.invoice.errors[i].message,'error');
          }
        } else {
          this.showMessage("Unexpected error occurred while creating the invoice.",'error');
        }
      },
      (error: any) => {
        this.showMessage("API request failed. Please try again.",'error');
      }
    );
  }
    removeRow(index: number) {
    this.editingData.splice(index, 1);
  }
  verifyFreeagentCall() {
    this.serviceNew.verifyFreeagent()
  }
    addRow() {
    console.log(this.selectedDetails)
    if (this.selectedDetails['agent_customer'] == 'bookingAgent') {
      let CollectionType = ''
      if (this.selectedDetails['collection_type'] == 'Drop_At_Warehouse') {
        CollectionType = 'drop'
      } else {
        CollectionType = 'pickup'

      }
      const payload = {
        user_id: this.selectedDetails['agent_customer_user_id'] ? this.selectedDetails['agent_customer_user_id'] : null,
        shipment_wt: 1,
        service_type: CollectionType || 'pickup',
        shipment_mode: 'ND',
        payment_mode: 'prepaid'
      };

      this.serviceNew.getAgentRatePerKg(payload).subscribe(
        (r: any) => {
          if (
            r &&
            r.status === 'success' &&
            r.code === '200' &&
            r.data &&
            r.data.length > 0 &&
            r.data[0].final_amount !== undefined &&
            r.data[0].final_amount !== null &&
            r.data[0].final_amount !== ''
          ) {
            const parsed = parseFloat(r.data[0].final_amount);
            this.editingData.push({
              description: '',
              quantity: 1, // Default quantity
              unit_price: parsed, // Default price
              sub_total: parsed // Initial subtotal
            });
          }
        })
    } else {
      this.editingData.push({
        description: '',
        quantity: 1, // Default quantity
        unit_price: 4, // Default price
        sub_total: 4 // Initial subtotal
      });
    }


  }
  mark_invoice_payment_read(data, type) {
  if (!localStorage.getItem('FreeAgentToken') && !localStorage.getItem('RefreshToken') && !localStorage.getItem('TokenExpiry')) {
    this.verifyFreeagentCall();
    return;
  }

  Swal.fire({
    title: 'Are you sure to mark this invoice as sent?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    customClass: {
      confirmButton: 'btn-ok',
      cancelButton: 'btn-cancel'
    },
    preConfirm: () => {
      const content = {
        url: data.invoice_url,
        invoice_no: data.hawb_no,
        type: 'final_invoice',
        created_by: this.userdetails['v_user_id']
      };

      this.service.sp_v1_ds_history_log_events_insert(data.hawb_no, this.userdetails['v_user_id'], 'FreeAgent Final Invoice Mark As Sent').toPromise();

      return this.serviceNew.createInvoice_freeAgent(content, type).toPromise();
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.showMessage('Invoice marked as read successfully!', 'success');
      this.callApi(this.GotInvoiceNoToGenerate);
          
        this.receivedData.invoice_api_status = '1';

this.router.navigate([], {
            queryParams: { data: encodeURIComponent(JSON.stringify(this.receivedData)) }
  });
    }
  }).catch((error) => {
    console.error(error);
    this.showMessage('An error occurred while processing the request.', 'error');
  });
}
  deleteInvoice(HaebData) {
    this.selectedDetails = HaebData;
    const requestData = {
      invoice_no: HaebData['hawb_no'],
      url: HaebData['invoice_url'],

      created_by: this.userdetails.v_user_id,
      type: 'final_invoice',
    };
    this.service.sp_v1_ds_history_log_events_insert(HaebData['hawb_no'], this.userdetails['v_user_id'], 'Freeagent Final Invoice Deleted').toPromise()

    this.serviceNew.createInvoice_freeAgent(requestData, 'DI').subscribe((response: any) => {
      if (response.status === 'success') {
        this.showMessage("deleted Successfully");
      this.callApi(this.GotInvoiceNoToGenerate);
          
        this.receivedData.invoice_api_status = '0';

this.router.navigate([], {
            queryParams: { data: encodeURIComponent(JSON.stringify(this.receivedData)) }
  });
      }
      // this.sendFreeAgentInvPdfModify.show()
    });
  }
    anyNotUpdated: boolean = false;
  ReceivedColoaderDate = []

   loadData(data) {
    const filterValue = String(data.hawb_no).trim();

    if (
      filterValue.length === 6 &&
      /^[a-zA-Z]{2}\d{4}$/.test(filterValue)
    ) {
      this.service.sp_v1_ds_history_log_events_insert(filterValue, this.userdetails['v_user_id'], 'View And Modify Hawb Search').toPromise()

      this.serviceNew.v1_SP_ds_Pickup_order_pickedup_check_weight_list(filterValue)
        .subscribe((d: any) => {
          if (d && d.status === "success" && d.data && d.data.length > 0) {
            const firstItem = d.data[0];
            const messageKey = Object.keys(firstItem)[0];
            const messageValue = firstItem[messageKey];

            if (typeof messageValue === "string" && Object.keys(firstItem).length === 1) {
              this.showMessage(messageValue, "warning");
              this.ReceivedColoaderDate = [];
              return;
            }

            this.ReceivedColoaderDate = d.data;

            // ✅ Check if any item's update_status is not "1"
            this.anyNotUpdated = d.data.some((item: any) => item.update_status !== "1");

            // If all are "1", then anyNotUpdated will be false
            // You can use this.anyNotUpdated wherever needed
          } else {
            this.ReceivedColoaderDate = [];
          }

          this.processData(d);
        });
    } else {
      this.ReceivedColoaderDate = [];
    }
  }

  private processData(d: any) {
    this.ReceivedColoaderDate = d['data'].map(item => ({
      ...item,
      length: Math.ceil(parseFloat(item.length)),
      width: Math.ceil(parseFloat(item.width)),
      height: Math.ceil(parseFloat(item.height)),
      act_wgt: Math.ceil(parseFloat(item.act_wgt)),
      vol_weight: this.calculateVolumetricWeight(item),
      chrg_weight: this.calculateChargeableWeight(item),
      created_by: this.userdetails['v_user_id']
    }));
  }
  private calculateChargeableWeight(item: any): number {
    const volWeight = this.calculateVolumetricWeight(item);
    return Math.ceil(Math.max(volWeight, item.act_wgt));
  }

  private calculateVolumetricWeight(item: any): number {
    return Math.ceil((item.length * item.width * item.height) / 5000);
  }
goBack(){
    this.router.navigate(['/wareHouseShipment/FinalInvoice'])
}
send_final_invoice(data) {
  if (!localStorage.getItem('FreeAgentToken') && !localStorage.getItem('RefreshToken') && !localStorage.getItem('TokenExpiry')) {
    this.verifyFreeagentCall();
    return;
  }

  Swal.fire({
    title: 'Are you sure you want to send the final invoice?',
    text: 'This action will send the invoice to the recipient.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    customClass: {
      confirmButton: 'btn-ok',
      cancelButton: 'btn-cancel'
    },
    preConfirm: () => {
      const content = {
        invoice_no: data.hawb_no,
        url: data.invoice_url,
        created_by: this.userdetails['v_user_id'],
        email: String(data.sender_mail).trim(),
        sender_name: data['sender_name']
      };

      this.service.sp_v1_ds_history_log_events_insert(data.hawb_no, this.userdetails['v_user_id'], 'FreeAgent Email Sent').toPromise();

      return this.serviceNew.createInvoice_freeAgent(content, 'E').toPromise();
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.showMessage('Invoice sent successfully!', 'success');
      this.callApi(this.GotInvoiceNoToGenerate);
        this.receivedData.invoice_api_status = '1';

this.router.navigate([], {
            queryParams: { data: encodeURIComponent(JSON.stringify(this.receivedData)) }
  });
    }
        this.router.navigate(['/wareHouseShipment/FinalInvoice'])

  }).catch((error) => {
    console.error(error);
    this.showMessage('An error occurred while processing the request.', 'error');
  });
}
  PackingListDetails: any[] = [];
  quoteAmount: any;

  getPackingListDetails(id) {

    if (id['agent_customer'] != 'bookingAgent') {
      this.service.get_carton_by_invoice(id.hawb_id).subscribe((data) => {
        if (data.data.length > 0) {
          this.PackingListDetails = data.data.map((item) => ({
            ...item,
            quantity: 1,
            unit_price: 4,
            VAT: 0,
            VATAMT: 0
          }));

          this.editingData = [{
            description: this.PackingListDetails.map(item =>
              `HAWB: ${item.hawb_no} - Box: ${item.carton_no} - Weight: ${item.chrg_weight}Kg`
            ).join('\n'),
            quantity: Number(Math.max(10, this.PackingListDetails.reduce((sum, item) => sum + Number(item.chrg_weight), 0))),
            unit_price: 4,
            VAT: 0,
            sub_total: (Number(Math.max(10, this.PackingListDetails.reduce((sum, item) => sum + Number(item.chrg_weight), 0))) * 4)
          }];

          // Add deposit adjustment if applicable
          if (id.deposit_payment_amt > 0 && id.getPackingListDetails != 'Drop_At_Warehouse') {
            this.editingData.push({
              description: 'Deposit Amount Adjusted',
              quantity: 1,
              VAT: 0,
              unit_price: -Math.abs(Number(id.deposit_payment_amt)),
              sub_total: -Math.abs(Number(id.deposit_payment_amt))
            });
          }

          // Apply surcharges
          this.PackingListDetails.forEach(item => {
            // Heavy Weight
            if (Number(item.act_wgt) > 30.26 && item.getPackingListDetails != 'Drop_At_Warehouse') {
              this.editingData.push({
                description: "Carrier Heavy Weight Surcharge",
                quantity: 1,
                unit_price: 60,
                VAT: 0,
                sub_total: 60
              });
            }

            // Long Length
            let longSurchargeCount = 0;
            if (Number(item.length) > 80 && item.getPackingListDetails != 'Drop_At_Warehouse') longSurchargeCount++;
            if (Number(item.width) > 80 && item.getPackingListDetails != 'Drop_At_Warehouse') longSurchargeCount++;
            if (Number(item.height) > 80 && item.getPackingListDetails != 'Drop_At_Warehouse') longSurchargeCount++;

            for (let i = 0; i < longSurchargeCount; i++) {
              this.editingData.push({
                description: "Carrier Long Length Surcharge",
                quantity: 1,
                unit_price: 60,
                VAT: 0,
                sub_total: 60
              });
            }
          });

        } else {
          this.editingData = [];
        }
      });
    } else {
      let CollectionType = ''
      if (id['collection_type'] == 'Drop_At_Warehouse') {
        CollectionType = 'drop'
      } else {
        CollectionType = 'pickup'

      }
      this.service.get_carton_by_invoice(id.hawb_id).subscribe((res) => {
        if (!res || !res.data || res.data.length === 0) {
          this.PackingListDetails = [];
          this.editingData = [];
          return;
        }

        this.PackingListDetails = res.data.map((item: any) => ({
          ...item,
          quantity: 1,
          unit_price: 4,
          VAT: 0,
          VATAMT: 0
        }));

        const totalWeight = this.PackingListDetails.reduce((sum: number, item: any) => {
          const w = Number(Math.ceil(parseFloat(item.act_wgt)).toFixed(2)) ;
          return sum + (isNaN(w) ? 0 : w);
        }, 0);

        const chargeableWeight = Number(Math.ceil(Math.max(10, totalWeight)).toFixed(2)) ;
        const fallbackAmount = chargeableWeight * 4;

        const payload = {
          user_id: id['agent_customer_user_id'] ? id['agent_customer_user_id'] : null,
          shipment_wt: chargeableWeight,
          service_type: CollectionType || 'pickup',
          shipment_mode: 'ND',
          payment_mode: 'prepaid'
        };

        this.serviceNew.getAgentRate(payload).subscribe(
          (r: any) => {
            let apiAmount: number | null = null;
            if (
              r &&
              r.status === 'success' &&
              r.code === '200' &&
              r.data &&
              r.data.length > 0 &&
              r.data[0].final_amount !== undefined &&
              r.data[0].final_amount !== null &&
              r.data[0].final_amount !== ''
            ) {
              const parsed = parseFloat(r.data[0].final_amount);
              if (isFinite(parsed)) apiAmount = parsed;
            }

            this.quoteAmount = apiAmount !== null ? apiAmount : fallbackAmount;

            const descriptionText = this.PackingListDetails
              .map((item: any) => `HAWB: ${item.hawb_no} - Box: ${item.carton_no} - Weight: ${Math.ceil(item.act_wgt)}Kg`)
              .join('\n');

            const derivedUnitPrice = Math.round((this.quoteAmount / chargeableWeight) * 100) / 100;

            this.editingData = [{
              description: descriptionText,
              quantity: Number(chargeableWeight),
              unit_price: derivedUnitPrice,
              VAT: 0,
              sub_total: this.quoteAmount
            }];

            if (id.deposit_payment_amt > 0 && id.getPackingListDetails !== 'Drop_At_Warehouse') {
              const dep = Math.abs(Number(id.deposit_payment_amt));
              this.editingData.push({
                description: 'Deposit Amount Adjusted',
                quantity: 1,
                VAT: 0,
                unit_price: -dep,
                sub_total: -dep
              });
            }

            this.PackingListDetails.forEach((item: any) => {
              if (id.getPackingListDetails === 'Drop_At_Warehouse') return;

              const aw = parseFloat(item.act_wgt);
              if (!isNaN(aw) && aw > 30.26) {
                this.editingData.push({
                  description: 'Carrier Heavy Weight Surcharge',
                  quantity: 1,
                  unit_price: 60,
                  VAT: 0,
                  sub_total: 60
                });
              }

              let count = 0;
              const L = parseFloat(item.length), W = parseFloat(item.width), H = parseFloat(item.height);
              if (!isNaN(L) && L > 80) count++;
              if (!isNaN(W) && W > 80) count++;
              if (!isNaN(H) && H > 80) count++;

              for (let i = 0; i < count; i++) {
                this.editingData.push({
                  description: 'Carrier Long Length Surcharge',
                  quantity: 1,
                  unit_price: 60,
                  VAT: 0,
                  sub_total: 60
                });
              }
            });
          },
          () => {
            this.quoteAmount = fallbackAmount;

            const descriptionText = this.PackingListDetails
              .map((item: any) => `HAWB: ${item.hawb_no} - Box: ${item.carton_no} - Weight: ${item.chrg_weight}Kg`)
              .join('\n');

            const derivedUnitPrice = Math.round((this.quoteAmount / chargeableWeight) * 100) / 100;

            this.editingData = [{
              description: descriptionText,
              quantity: Number(chargeableWeight),
              unit_price: derivedUnitPrice,
              VAT: 0,
              sub_total: this.quoteAmount
            }];
          }
        );
      });
    }


  }
  deleteCartonDetail(data: any) {
  console.log(data);

  Swal.fire({
    title: 'Do You Really Want To Delete This Item?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Log history
      this.service.sp_v1_ds_history_log_events_insert(
        this.selectedDetails['hawb_no'],
        this.userdetails['v_user_id'],
        'All Bookings Packing List Has Been Deleted In View And Modify'
      ).toPromise();

      // Delete carton detail
      this.serviceNew.v1_ds_pickup_order_shipment_carton_details_delete(data)
        .subscribe(d => {
          if (d['code'] === '200') {
            const r = { hawb_no: data.invoice_no };
            this.loadData(r);

            Swal.fire(
              'Deleted!',
              'The carton detail has been deleted successfully.',
              'success'
            );
          }
        });
    }
  });
}
   receiverPincode=''

selectSenderName:any;
selectSenderMail:any;
selectInvoiceNo:any;
  emailContent = '';
    selectPaymentDate: string = ''
  after14PaymentDate = '';
  selectPaymentDateNextDAy: string = ''
    async calculateDate(data,sts){
    this.receiverPincode = '';
    this.receiverPincode = data?.receiver_pincode;
     this.selectSenderName = data.sender_name
    this.selectSenderMail = data.sender_mail
    this.selectInvoiceNo = data.hawb_no
   await this.Get_NextPickupDate_After14Days_freeagent(this.selectPaymentDate,data?.receiver_pincode);
   await this.mark_paid_amount(data,sts)
  }
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
  
    const payload: any = {
      mail: this.params.value.to,
      content: this.editedContent,
      inv_no: this.selectInvoiceNo,
      isPaymentMail: true
    };
  
    const { data, sts } = this.paymentStsupdateData;
  
    let content = sts == 'yes' ? 'Are you sure to update the payment status as paid?' :
                  sts == 'npd' ? 'Are you sure to undo the payment status as Unpaid But Departed?' :
                  'Are you sure to undo the payment status as unpaid?';
  
    Swal.fire({
      title: 'Confirm',
      text: content,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn-ok',
        cancelButton: 'btn-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const d = {
          hawb_no: data.hawb_no,
          created_by: this.userdetails.v_user_id,
          status: sts,
          mode: this.selectedPaymentType,
          remarks: this.customPaymentType,
          paymentDate: this.selectPaymentDate
        };
  
        this.service.sp_v1_ds_history_log_events_insert(data.hawb_no, this.userdetails['v_user_id'], 'Payment Status Update as ' + sts).toPromise();
  
        this.serviceNew.v1_SP_ds_payment_api_status_update(d).subscribe(
          (r: any) => {
            if (r.code == 200) {
              // this.get_invoice();
              this.paymentStsupdate.close();
              this.showMessage('Payment marked as paid successfully', 'success');
            this.callApi(this.GotInvoiceNoToGenerate);

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
   editorOptions = {
        toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
    };
   quillEditorReady(event: any) {
    // Get the HTML content from the editor
    const htmlContent = event.html;

    // Now, set this HTML content to the form value
    this.params.patchValue({ displayDescription: htmlContent });
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
    @ViewChild('paymentStsupdate') paymentStsupdate: any
  
  selectedPaymentType: string = ''
  selectHawbNo: string = ''
  customPaymentType: string = ''
  paymentStsupdateData: any;
  sendMailChecked: boolean = false
  editedContent:any;
 callNotesFile() {
    if (String(this.selectedDetails['hawb_no']).trim().length != 6) {
      this.showMessage('Not A Valid HAWB No.','warning');
      return;
    }
    const payload = {
      invoice_no: String(this.selectedDetails['hawb_no'])
    }
    // data.invoice_no = data.hawb_no
    // this.selectedDetails = data
    this.serviceNew.sendChatData(payload)
    this.modal7.open()
  }
}
