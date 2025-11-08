import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import { AwbService } from '../../cfServices/awb.service';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { concatMap, timer } from 'rxjs';

@Component({
  selector: 'app-deposit-invoice-modify',
  templateUrl: './deposit-invoice-modify.component.html',
  styleUrls: ['./deposit-invoice-modify.component.css']
})
export class DepositInvoiceModifyComponent implements OnInit {
    @ViewChild('isAddNoteModal') isAddNoteModal: any
    @ViewChild('modal16') modal16 : any
    
  order_id='';
  userdetails:any;

  constructor(public route:ActivatedRoute,private serviceNew: NewApiCloudService,public service: AwbService,private router: Router,) { 
        this.userdetails = JSON.parse(localStorage.getItem("log_data"))

  }

  ngOnInit(): void {
       if (!localStorage.getItem('FreeAgentToken') && !localStorage.getItem('RefreshToken') && !localStorage.getItem('TokenExpiry')) {
      // this.createInvoice_freeAgent(data)
          this.verifyFreeagentCall()

    } 
    this.route.params.subscribe(datas => {
      this.order_id = datas['id']

    });
     this.route.queryParams.subscribe(params => {
      const encodedData = params['data'];
      if (encodedData) {
        // Decode the data and parse it back to an object
        const decodedData = decodeURIComponent(encodedData);
        const receivedData = JSON.parse(decodedData);
      this.send_invoice(receivedData);
      this.getFreeAgentAutoComplete()

      }
    });
  }
    removeRow(index: number) {
    this.editingData.splice(index, 1);
  }
  selectedDetails:any={};
  send_invoice(data) {
    data.freeAgentRef = data.invoice_no + 'A'
    // this.selectedDetails=data

    if (localStorage.getItem('FreeAgentToken') && localStorage.getItem('RefreshToken') && localStorage.getItem('TokenExpiry')) {
      // this.createInvoice_freeAgent(data)
      this.getPackingListDetails1(data)
      // this.sendFreeAgentInvPdf.show();
    } else {
      this.verifyFreeagentCall()
    }
  }
   editItem: any = {};
activeRowIndex: number | null = null;
selectedPrefix: string = '';
autoCompleteList: any[] = [];
accountNoControl = new FormControl('');
  editingIndex: number | null = null;
  openEditPopup(index: number) {
    this.editingIndex = index;
    this.accountNoControl.reset()
    this.editItem = { ...this.editingData[index] }; // clone item
    this.isAddNoteModal.open(); // show modal
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

      // Update the data
      this.editingData[this.editingIndex] = { ...this.editItem };

      // Hide the modal
      this.isAddNoteModal.close();
    }
  }
    editingDataModufy: any[] = []; // <-- you already have this somewhere for the ngFor table

    getNetTotal(): number {
    return this.editingData.reduce((sum, item) => sum + ((item.quantity * item.unit_price)), 0);
  }
  getNetTotalMod(): number {
    return this.editingDataModufy.reduce((sum, item) => sum + ((item.quantity * item.unit_price)), 0);
  }
  // Convert Net Total to GBP Total (assuming same value for now, modify if needed)
  getGBPAmount(): number {
    return this.getNetTotal(); // If there's a conversion, apply it here
  }
  getGBPAmountMod(): number {
    return this.getNetTotalMod(); // If there's a conversion, apply it here
  }

  getVATAMt(): number {
    const Amt = this.editingData.reduce((sum, item) => sum + (item.VATAMT || 0), 0);
    // const 
    return Amt ? Amt : 0;
  }

  getVATAMtMod(): number {
    const Amt = this.editingDataModufy.reduce((sum, item) => sum + (item.VATAMT || 0), 0);
    // const 
    return Amt ? Amt : 0;
  }
selectSuggestion(suggestion: any) {
 if (!suggestion) return;

  this.editItem.description = `${suggestion.value} ${this.editItem.description || ''}`;
  this.autoCompleteList = [];
  this.selectedPrefix = '';

  this.editItem.unit_price = suggestion.unit;
  this.editItem.VAT = suggestion.isVAT;

  const isDeposit = suggestion.value === 'Deposit Amount Adjusted';
  this.editItem.sts = (isDeposit ? 'Deposit For Invoice - ' : 'Return For Invoice - ')
    + this.selectedDetails.freeAgentRef;
  this.editItem.flag = isDeposit ? 1 : 2;
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
    addRownew() {
    this.editingData.push({
      description: '',
      quantity: 1, // Default quantity
      unit_price: 4, // Default price
      sub_total: 4, // Initial subtotal
      sales_tax_rate: 0 // Ensures it becomes a float like 20.0

    });
  }
    verifyFreeagentCall() {
    this.serviceNew.verifyFreeagent()
  }
  autoCompleteData:any;
  suggestionData:any;
    getFreeAgentAutoComplete() {
    this.serviceNew.getFreeAgentAutoComplete().subscribe(d => {
      this.autoCompleteData = d['data'];
      this.suggestionData = d['data']
    });
  }
    PackingListDetails: any[] = [];
  editingData: any = [];

  getPackingListDetails1(id) {
   this.service.orderViewAssign(this.order_id).subscribe((res: any) => {
  if (res?.data?.length > 0) {
    const firstItem = res.data[0];
    firstItem.freeAgentRef = firstItem.invoice_no + 'A';
    this.selectedDetails = firstItem;

        this.PackingListDetails = res.data.map((item) => ({
          ...item,
          quantity: 1, // Default quantity
          unit_price: 0, // Default unit price
          VAT: 0,
          VATAMT: 0
        }));

        // Ensure editingData is always an array
        this.editingData = [{
          // description: this.PackingListDetails.map(item =>
          //   `HAWB: ${item.invoice_no} - Box: ${item.box_no} - Weight: ${this.getChargeableWt(item)}Kg`
          // ).join('\n'),
          description: 'Order Booking Deposit UK ',
          // quantity: this.PackingListDetails.reduce((sum, item) => sum + this.getChargeableWt(item) , 0),
          quantity: 1,
          unit_price: (Number(id.total_carton || 0) * 10) > 50 ? Number(id.total_carton || 0) * 10 : 50, // Default unit price
          // sub_total: this.PackingListDetails.reduce((sum, item) => sum + this.getChargeableWt(item), 0) *4,
          sub_total: (Number(id.total_carton || 0) * 10) > 50 ? Number(id.total_carton || 0) * 10 : 50,
          sales_tax_rate: 0 // Ensures it becomes a float like 20.0

        }];
        console.log(this.editingData)
      } else {
        this.editingData = []; // Ensure it's an empty array if no data
      }
    });
  }
    getPackingListDetails(id) {
   this.service.orderViewAssign(this.order_id).subscribe((res: any) => {
  if (res?.data?.length > 0) {
    const firstItem = res.data[0];
    firstItem.freeAgentRef = firstItem.invoice_no + 'A';
    this.selectedDetails = firstItem;

   
      }
    });
  }
    isBillingClientFound: boolean = false;

    createInvoice_freeAgent() {
    const invoiceItems = this.editingData.map(item => ({
      description: item.description ? item.description.trim() : "",
      item_type: "", // Add logic here if required
      price: item.unit_price.toString(),
      quantity: item.quantity.toString(),
      sales_tax_rate: parseFloat(item.VAT) || 0 // Ensures it becomes a float like 20.0

    }));

    const stsForInvocie = this.editingData[0].sts
    let flagForInvocie = this.editingData[0].flag ? this.editingData[0].flag : '1'

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
          invoice_no: this.selectedDetails.invoice_no,
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
          type: flagForInvocie == '1' ? 'deposit' : 'return',
          sts: stsForInvocie ? stsForInvocie : 'Deposit For Invoice - ' + this.selectedDetails.freeAgentRef,
          flag: flagForInvocie,

          invoiceUrl: 'https://api.freeagent.com/v2/invoices'
        };
        const fullName = this.selectedDetails['sender_name'];
        const nameParts = this.splitName(fullName);

        data.firstName = nameParts.firstName;
        data.lastName = nameParts.lastName;
        data.senderMail = this.selectedDetails['shipper_mail_id'];
        data.senderPhone = this.selectedDetails['sender_contact_no'];
        data.sender_address = this.selectedDetails['sender_address'];
        data.sender_address2 = this.selectedDetails['sender_address2'];
        data.sender_address3 = this.selectedDetails['sender_address3'];
        data.shipper_city = this.selectedDetails['shipper_city'];
        data.sender_pincode = this.selectedDetails['sender_pincode'];

        if (!this.isBillingClientFound) {
          // Adding a delay (10ms) before the second API call
          return timer(10).pipe(
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
              // Optionally add delay before the second call
              return timer(10).pipe(
                concatMap(() => this.serviceNew.createInvoice_freeAgent(data, 'I'))
              );
            })
          );
        } else {
          data.contactUrl = contactUrl;
          return this.serviceNew.createInvoice_freeAgent(data, 'I');
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
                 this.service.sp_v1_ds_history_log_events_insert(this.selectedDetails.invoice_no,this.userdetails['v_user_id'],'Free Agent Deposit Invoice Is Created').toPromise()

          this.showMessage("Invoice created successfully!");
                this.getPackingListDetails(this.selectedDetails)


          window.open("https://api.cargoforce.com/operation/nodeNew/invoice_pdf/invoice-" + r.data.f_name, "_blank");
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
 // import at top of component
async mark_invoice_payment_read(type: 'M' | 'D') {
  // Token check
  if (
    !localStorage.getItem('FreeAgentToken') &&
    !localStorage.getItem('RefreshToken') &&
    !localStorage.getItem('TokenExpiry')
  ) {
    this.verifyFreeagentCall();
    return;
  }

  // Confirm with Swal
  const result = await Swal.fire({
    title: 'Confirm',
    text:
      type === 'M'
        ? 'Are you sure you want to mark this invoice as Sent?'
        : 'Are you sure you want to mark this invoice as Draft?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    allowOutsideClick: false,
  });

  if (!result.isConfirmed) return;

  const content = {
    url: this.selectedDetails.invoice_url,
    invoice_no: this.selectedDetails.invoice_no,
    created_by: this.userdetails['v_user_id'],
    type: 'deposit',   // 👈 differentiate here
  };

  try {
    await this.service
      .sp_v1_ds_history_log_events_insert(
        this.selectedDetails.invoice_no,
        this.userdetails['v_user_id'],
        type === 'M'
          ? 'Free Agent Deposit Invoice Marked As Sent'
          : 'Free Agent Deposit Invoice Marked As Draft'
      )
      .toPromise(); // convert observable to promise
  } catch (_) {}

  this.serviceNew.createInvoice_freeAgent(content, type).subscribe(
    (r: any) => {
      if (r?.status === 'success' && r?.code === '200') {
        this.showMessage(
          type === 'M'
            ? 'Invoice marked as sent successfully!'
            : 'Invoice marked as draft successfully!'
        );
        this.getPackingListDetails(this.selectedDetails);
      } else {
        this.showMessage('Failed to update invoice.', 'Error');
      }
    },
    (error) => {
      console.error(error);
      this.showMessage('An error occurred while processing the request.', 'Error');
    }
  );
}

goBack(){
 this.router.navigate(['/customer/deposit_invoice']);

}

  send_final_invoice() {
    if (!localStorage.getItem('FreeAgentToken') && !localStorage.getItem('RefreshToken') && !localStorage.getItem('TokenExpiry')) {
      this.verifyFreeagentCall()

      return;
    }

    const content = {
      invoice_no: this.selectedDetails.invoice_no,
      sender_name: this.selectedDetails.sender_name,

      url: this.selectedDetails.invoice_url,
      created_by: this.userdetails['v_user_id'],
      email: String(this.selectedDetails.shipper_mail_id).trim()
    };
       this.service.sp_v1_ds_history_log_events_insert(this.selectedDetails.invoice_no,this.userdetails['v_user_id'],'Free Agent Deposit Email Has Been Sent').toPromise()

    this.serviceNew.createInvoice_freeAgent(content, 'DE').subscribe(
      (r: any) => {
        console.log(r);
        if (r.status === 'success' && r.code === '200') {
          this.showMessage('Invoice marked as read successfully!');
          // this.get_invoice()


        } else {
          this.showMessage('Failed to mark invoice as read.', 'error');
        }
      },
      (error) => {
        console.error(error);
        this.showMessage('Invoice marked as read successfully!');
                     this.getPackingListDetails(this.selectedDetails)


        // this.toastr.errorToastr('An error occurred while processing the request.', 'Error');
      }
    );
  }
  async deleteInvoice() {
  // Confirm with Swal
  const result = await Swal.fire({
    title: 'Confirm Deletion',
    text: 'Are you sure you want to delete this invoice?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'No, cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    allowOutsideClick: false,
  });

  if (!result.isConfirmed) return;

  const requestData = {
    invoice_no: this.selectedDetails['invoice_no'],
    url: this.selectedDetails['invoice_url'],
    created_by: this.userdetails.v_user_id,
    type: 'deposit',
  };

  // Log event (ignore failure)
  try {
    await this.service
      .sp_v1_ds_history_log_events_insert(
        this.selectedDetails['invoice_no'],
        this.userdetails['v_user_id'],
        'Free Agent Deposit Invoice Is Deleted'
      )
      .toPromise();
  } catch (_) {}

  // Call delete API
  this.serviceNew.createInvoice_freeAgent(requestData, 'DI').subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.showMessage('Invoice deleted successfully');
        this.getPackingListDetails(this.selectedDetails);
      } else {
        this.showMessage('Failed to delete invoice', 'Error');
      }
    },
    (error) => {
      console.error(error);
      this.showMessage('An error occurred while deleting invoice.', 'Error');
    }
  );
}
PaymentPaidAmt=0;
FinalBal(Num1:any,num2:any){
return Number(Num1 || 0) - Number(num2 ||0)
}
    v1_ds_pickup_order_deposit_payment_status() {
    const p = {
      hawb_no: this.selectedDetails.invoice_no,
      deposit_paid_status: 'paid',
      deposit_payment_amt: this.PaymentPaidAmt
    }
    this.service.sp_v1_ds_history_log_events_insert(this.selectedDetails['invoice_no'],this.userdetails['v_user_id'],'Updated Payment Amt :-'+this.PaymentPaidAmt).toPromise()
    this.serviceNew.v1_ds_pickup_order_deposit_payment_status(p).subscribe(d => {
                this.getPackingListDetails(this.selectedDetails)
      this.PaymentPaidAmt = 0
      this.modal16.close()

    })
  }
}
