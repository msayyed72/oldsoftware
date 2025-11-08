import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GridComponent, RowDataBoundEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AwbService } from '../../cfServices/awb.service';
import Swal from 'sweetalert2';
import { concatMap } from 'rxjs';

interface FreeAgentToken {
  access_token: string;
  refresh_token: string;
  token_expires: number; // epoch seconds
}

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  @ViewChild('cancelPopup') cancelPopup:any
  @ViewChild('editItemModal') editItemModal:any
  @ViewChild('sendFreeAgentInvPdf') sendFreeAgentInvPdf:any
  @ViewChild('sendFreeAgentInvPdfModify') sendFreeAgentInvPdfModify:any
  @ViewChild('editItemModalEdit') editItemModalEdit:any
  
  @ViewChild('paymentStsupdate') paymentStsupdate:any
  @ViewChild('txtDate') txtDate!: ElementRef<HTMLInputElement>;
@ViewChild('mainGrid') public mainGrid: GridComponent;

  sparkOptionsInfo
  sparkOptionsWarning
  sparkOptionsDanger
  btn3:any;
  invoice_list:any;
  point_code_pefix
  sparkOptionsSuccess
  invoicedetails;
  userid
  v_point_Id_Branch;
  userdetails
  v_location_id
  pointid
  point_type_id
  country_id
  invoice_no
  pdf_data
  date
  date2
  term
  today = new Date();
  rowClicked: any;
  tot_inv: any;
  tot_ctn: number;
  tot_wgt: number;
  tot_net_Amt: number;
  tot_Rec_Amt: number;
  tot_Blc_Amt: number;
  rowsFilter: any;
  inv_No:any
  invoiceNo: any="";
  valForm:FormGroup;
  v_designation_id: any;
  code: string = '';
  paymentType:any=''
state: string = '';
  constructor(public http:HttpClientModule,
    public serviceNew:NewApiCloudService,
   public fb: FormBuilder,
   
   public router:Router,
    private datep:DatePipe,
    public service : AwbService,private route: ActivatedRoute,
    ) {
      this.userdetails = JSON.parse(localStorage.getItem("log_data"))
      if(this.userdetails)
      {}
      else
      {
        this.router.navigate(['login/0']);
      }
       this.route.queryParams.subscribe(params => {
      this.code = params['code'] || '';
      this.state = params['state'] || '';

      if (this.code) {
        this.serviceNew.getFreeagentToken(this.code).subscribe({
  next: (d: FreeAgentToken | FreeAgentToken[]) => {
    const tok: FreeAgentToken | undefined =
      Array.isArray(d) ? d[0] : d;

    if (tok && tok.access_token && tok.refresh_token && tok.token_expires) {
      localStorage.setItem('FreeAgentToken', tok.access_token);
      localStorage.setItem('RefreshToken', tok.refresh_token);
      // convert seconds → ms for consistency if you compare Dates later
      localStorage.setItem('TokenExpiry', String(Number(tok.token_expires) * 1000));
      console.log('Token stored successfully');
    } else {
      console.error('Invalid token response (shape mismatch):', d);
    }
  },
  error: (err) => console.error('Error fetching token:', err),
  complete: () => console.log('Token fetch process completed'),
});
      }

      console.log('Code:', this.code);
      console.log('State:', this.state);
    });
   
    this.userid=this.userdetails.v_user_id;
    this.pointid=this.userdetails.v_point_id
    this.point_type_id=this.userdetails.v_point_type_id
    this.point_code_pefix=this.userdetails.v_origin_prefix
    this.country_id=this.userdetails.V_country_id
    this.v_point_Id_Branch=this.userdetails.v_point_Id_Branch
    this.v_location_id=this.userdetails.v_location_id
    this.v_designation_id = this.userdetails.v_designation_id
    this.date = this.datep.transform(this.today, 'yyyy-MM-dd');
    // this.date = '2025-04-05';
    // this.date=
    this.valForm = fb.group({
      'net_amount': [null],
      'received_amount':[null],
      'remarks':[null,Validators.required],
      'invoice_no':[null],
      'invoice_id':[null],
      'created_by':[this.userid]
    });
    this.initForm()
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
  get_invoice(){
    this.btn3=true;
    this.serviceNew.get_invoice_list(this.pointid,this.v_location_id,this.invoice_no,this.date).subscribe(data=>{
      if(data['data']){
        if(data['data'].length){
          this.invoice_list = data['data'].map((d, i) => {
            return {
              ...d,
              pageNo: i + 1,
              invCurrentSts: d['invoice_api_status'] == 0 ? 'Not Generated' :
                             d['invoice_api_status'] == 1 ? 'Generated' :
                             d['invoice_api_status'] == 2 ? 'Marked as Sent' :
                             d['invoice_api_status'] == 3 ? 'Sent to Customer' : 
                             'Status Not Found'
            };
          });
          //  this.Get_NextPickupDate_After14Days_freeagent(this.selectPaymentDate)
        }
        else{
          this.invoice_list=[]
        }
      
      }else{
        this.invoice_list=[]
      }
    	
      this.rowsFilter =this.invoice_list.map(r=>({
    ...r,
    mergeWtAndPcs: r['total_carton']+" - "+r['total_weight'] ,
    mergeDate:r['payment_date'] + "\n"+r['expected_dly_date']
  }));
    	if (data['code']==200) {
      this.tot_inv=this.invoice_list.length
      this.tot_ctn=0
      this.tot_wgt=0
      this.tot_net_Amt=0
      this.tot_Rec_Amt=0
      this.tot_Blc_Amt=0
      for(var i = 0; i<this.tot_inv;i++)
      {
        this.tot_ctn+=Number(this.invoice_list[i]['total_carton'])
        this.tot_wgt+=Number(this.invoice_list[i]['total_weight'])
        this.tot_net_Amt+=Number(this.invoice_list[i]['net_amount'])
        this.tot_Rec_Amt+=Number(this.invoice_list[i]['received_amount'])
        this.tot_Blc_Amt+=Number(this.invoice_list[i]['balance_amount'])
      }
    		this.btn3=false;
    	}
    	else{
    		this.btn3=false;
    	}
    })
  }
  getIconClass(status: string): string {
  switch (status) {
    case 'Not Generated':
      return 'text-danger'; // Class for red icon
    case 'Generated':
      return 'text-primary'; // Class for blue icon
    case 'Marked as Sent':
      return 'text-warning'; // Class for yellow icon
    case 'Sent to Customer':
      return 'text-success'; // Class for green icon
    default:
      return 'text-secondary'; // Class for grey icon for any other status
  }
}
  inv_search()
  {
    this.service.get_Inv_id_by_no(this.inv_No,this.pointid).subscribe(res=>{
      if(res['code']=="200")
      {
        this.view_invoice(this.inv_No,res['data'][0]['hawb_id'],res['data'][0]['printing_status'])
      }
      else{
        this.coloredToast('danger',"No Invoice Here!")
      }
    },
    error=>{
      this.coloredToast('danger',"No Invoice Here!")
    })
  }
  RowDateCheck($evt){
    console.log($evt)
  }

  view_invoice(value, id, status) {
  this.router.navigate(['/wareHouseShipment/Modify', value, 'modify', id]);
  }
  
  print(value)
{
  // this.service.get_print(value).subscribe(data=>{
  //   this.pdf_data=data['data']
  //   window.open(data.file_url)

  // })
   this.service.get_label_print(value).subscribe(data=>{
    this.pdf_data=data['data']
    window.open(data.file_url)

  })

}

submitForm()
{
  if(this.valForm.valid)
  {
    this.service.updateInvoiceCancal(this.valForm.value).subscribe(data=>{
      if(data['code']==200)
      {
        this.coloredToast('success','Bill Canceled Successfully!')
        this.cancelPopup.close()
      }
      else
      {
        this.coloredToast('danger','Failed ! ')
        this.cancelPopup.close()
      }
    })
  }
  else
  {
    this.coloredToast('danger','Please menntion the reason!!')
  }
}
cancel_invoice(list)
{
  this.invoiceNo = list.hawb_no
  this.cancelPopup.open()
  this.valForm.patchValue({
    invoice_no:list.hawb_no,
    net_amount:list.net_amount,
    invoice_id:list.hawb_id
  })
}

get_awb_printbar(value){
  // this.Save_spin='1'
  this.service.get_print_bar(value).subscribe(data=>{
    this.pdf_data=data['data']
    window.open(data.file_url)
    // this.Save_spin='2'
  })
}
get_awb_print(value){
  
      this.service.get_printnew(value,"label",'1',1).subscribe(data=>{
        this.pdf_data=data['data']
        window.open(data.file_url)
      })
}
get_awb_print_new(value){
  // this.Save_spin='1'
  this.service.get_printnew(value,"label_barcode",'1',1).subscribe(data=>{
    this.pdf_data=data['data']
    window.open(data.file_url)
    // this.Save_spin='2'
  })
}
updateFilter(event) {
  const val = event.target.value.toLowerCase();

  const temp = this.invoice_list.filter(function(report) {
      return report.hawb_no.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.rowsFilter = temp.map(r=>({
    ...r,
    mergeWtAndPcs: r['total_carton']+" - "+r['total_weight'] ,
    mergeDate:r['payment_date'] + "\n"+r['expected_dly_date']
  }));
}
filterSettings:any;
  public toolbarOptions: ToolbarItems[] = ['ExcelExport', 'PdfExport', 'Search'];
  public editSettings: Object;

  ngOnInit() {
    this.getFreeAgentAutoComplete();
 this.selectPaymentDate = new Date().toISOString().split('T')[0];
   
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;

    this.toolbarOptions= ['Search'];
    const dtToday = new Date();
this.isBillingClientFound=false;
    let month: string | number = dtToday.getMonth() + 1;
    let day: string | number = dtToday.getDate();
    const year = dtToday.getFullYear();

    month = month < 10 ? '0' + month.toString() : month.toString();
    day = day < 10 ? '0' + day.toString() : day.toString();

    const minDate = `${year}-${month}-${day}`;
    
    // Set the minimum date to today
    if (this.txtDate) {
      this.txtDate.nativeElement.min = minDate;
    }
    // localStorage.clear()
    this.filterSettings = { ignoreAccent:true ,hierarchyMode:'None', type: 'Excel' };

    this.get_invoice()
  }
  ToogledToolBar(args: any) {
    console.log(args)

    switch (args.item.text) {
      case 'PDF Export':
        this.mainGrid.pdfExport({ 
          fileName: 'Custom_File_Name.pdf', 
          pageOrientation: 'Landscape'
        });
        break;
      case 'Excel Export':
        this.mainGrid.excelExport({ fileName: 'CustomerBooking.xlsx' });
        break;
      case 'CSV Export':
        this.mainGrid.csvExport({ fileName: 'Custom_File_Name.csv' });
        break;
      case 'Print':
        this.mainGrid.print();
        break;
      case 'Add':  // Handle Add button click
        console.log('Add button clicked');
        this.mainGrid.addRecord(); // This adds a new row in the grid
        break;
      default:
        console.log('No matching toolbar action found:', args.item.text);
    }
  }
  booking()
  {
    if(this.v_designation_id == 36)
    {
      this.router.navigate(['booking-philippine']);
    }
    else
    {
      this.router.navigate(['invoice-booking']);
    }
   
  }
  changeTableRowColor(idx: any) { 
    // console.log(idx)
    this.rowClicked = idx;
  }
  selectedDetails:any={};
  send_invoice(data){
    
    this.selectedDetails=data

    if(localStorage.getItem('FreeAgentToken') && localStorage.getItem('RefreshToken') && localStorage.getItem('TokenExpiry')){
        // this.createInvoice_freeAgent(data)
        this.getPackingListDetails(data.hawb_id)
        this.sendFreeAgentInvPdf.open();
    }else{
      this.verifyFreeagentCall()
    }
  }
  generateInvoice() {
    const invoiceData = {
    
    };
  
    console.log("Invoice Data:", invoiceData);
  
  
  }
  
  
  verifyFreeagentCall() {
    this.serviceNew.verifyFreeagent()
  }
  PackingListDetails: any[] = [];
  editingData: any = [];
  
  getPackingListDetails(id) {
    this.service.get_carton_by_invoice(id).subscribe((data) => {
      if (data.data.length > 0) {
        this.PackingListDetails = data.data.map((item) => ({
          ...item,
          quantity: 1, // Default quantity
          unit_price: 4, // Default unit price
          VAT:0,
          VATAMT:0
        }));
      
        // Ensure editingData is always an array
        this.editingData = [{
          description: this.PackingListDetails.map(item =>
            `HAWB: ${item.hawb_no} - Box: ${item.carton_no} - Weight: ${item.chrg_weight}Kg`
          ).join('\n'),
          quantity: this.PackingListDetails.reduce((sum, item) => sum + Number(item.chrg_weight ), 0),
          unit_price: 4, // Default unit price
          sub_total: this.PackingListDetails.reduce((sum, item) => sum + Number(item.chrg_weight ), 0) *4,
        }];
      } else {
        this.editingData = []; // Ensure it's an empty array if no data
      }
    });
  }
  
  
  
  addRow() {
    this.editingData.push({
      description: '',
      quantity: 1, // Default quantity
      unit_price: 4, // Default price
      sub_total: 4 // Initial subtotal
    });
  }
  
  removeRow(index: number) {
    this.editingData.splice(index, 1);
  }
  
  // Calculate subtotal
  getSubtotal() {
    return this.editingData.quantity * this.editingData.unit_price;
  }
  
// Calculate the total amount dynamically
getNetTotal(): number {
  return this.editingData.reduce((sum, item) => sum + ((item.quantity * item.unit_price)), 0);
}

// Convert Net Total to GBP Total (assuming same value for now, modify if needed)
getGBPAmount(): number {
  return this.getNetTotal(); // If there's a conversion, apply it here
}

getVATAMt():number {
  const Amt= this.editingData.reduce((sum, item) => sum + (item.VATAMT || 0), 0);
  // const 
  return Amt ? Amt :0;
}
  
  getMergedDetails(): string {
    return this.PackingListDetails.map(item => 
      `HAWB: ${item.hawb_no} - Box: ${item.carton_no} - Weight: ${item.chrg_weight}Kg`
    ).join('\n');
  }  
  splitName(fullName: string): { firstName: string, lastName: string } {
    const nameParts = fullName.trim().split(/\s+/);
    const lastName = nameParts.pop() || ''; // Get last word
    const firstName = nameParts.join(' ');  // Join the rest as first name
  
    return { firstName, lastName };
  }
 isBillingClientFound:boolean=false;
 createInvoice_freeAgent() {
  const invoiceItems = this.editingData.map(item => ({
    description: item.description ? item.description.trim() : "",
    item_type: "", // Add logic here if required
    price: item.unit_price.toString(),
    quantity: item.quantity.toString(),
  }));

  // this.selectedDetails.sender_mail = "info@cargoforce.com";

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
        contactUrl: ''
      };
  
      if (!this.isBillingClientFound) {
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
  
        return this.serviceNew.createInvoice_freeAgent(data, 'CC').pipe(
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
            return this.serviceNew.createInvoice_freeAgent(data, 'I');
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
        this.coloredToast('success',"Invoice created successfully!");
        this.get_invoice();
        this.sendFreeAgentInvPdf.close();
        window.open("https://api.cargoforce.com/origin_v2/send_email/" + r.data.f_name, "_blank");
      } else if (
        r &&
        r.data &&
        r.data.invoice &&
        r.data.invoice.errors &&
        r.data.invoice.errors.length > 0
      ) {
        for (let i = 0; i < r.data.invoice.errors.length; i++) {
          this.coloredToast('danger',r.data.invoice.errors[i].message);
        }
      } else {
        this.coloredToast('danger',"Unexpected error occurred while creating the invoice.");
      }
    },
    (error: any) => {
      this.coloredToast('danger',"API request failed. Please try again.");
    }
  );
  
 }  
  mark_invoice_payment_read(data,type) {
    if(!localStorage.getItem('FreeAgentToken') && !localStorage.getItem('RefreshToken') && !localStorage.getItem('TokenExpiry')){
      this.verifyFreeagentCall()

        return;
      }
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          popup: 'sweet-alerts',
          confirmButton: 'btn btn-secondary',
          cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
        },
        buttonsStyling: false,
      });
      
      swalWithBootstrapButtons.fire({
        title: 'Confirm',
        text: 'Are you sure to mark this invoice as Marked As Send?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true,
        padding: '2em',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          const content = {
            url: data.invoice_url,
            invoice_no: data.hawb_no,
            created_by: this.userdetails['v_user_id']
          };
      
          this.serviceNew.createInvoice_freeAgent(content, type).subscribe(
            (r: any) => {
              console.log(r);
              if (r.status === 'success' && r.code === '200') {
                this.coloredToast('success', 'Invoice marked as read successfully!');
                this.get_invoice();
              } else {
                this.coloredToast('danger', 'Failed to mark invoice as read.');
              }
            },
            (error) => {
              console.error(error);
              this.coloredToast('danger', 'An error occurred while processing the request.');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // No action needed if 'No' is clicked
        }
      });
        
    // this.popupManager.open('Confirm', 'Are you sure tomark this invoice Marked As Send?', 
    //   {
    //     width: '300px',
    //     closeOnOverlay: false,
    //     animate: 'scale',
    //     actionButtons: [
    //       {
    //         text: 'Yes',
    //         buttonClasses: 'btn-ok',
    //         onAction: () => {
    //           const content = {
    //             url: data.invoice_url,
    //             invoice_no: data.hawb_no,
    //             created_by: this.userdetails['v_user_id']
    //           };
            
    //           this.serviceNew.createInvoice_freeAgent(content, type).subscribe(
    //             (r: any) => {
    //               console.log(r);
    //               if (r.status === 'success' && r.code === '200') {
    //                 this.coloredToast('success','Invoice marked as read successfully!');
    //                 this.get_invoice()
          
    //               } else {
    //                 this.coloredToast('danger','Failed to mark invoice as read.');
    //               }
    //             },
    //             (error) => {
    //               console.error(error);
    //               this.coloredToast('danger','An error occurred while processing the request.');
    //             }
    //           );
  
    //           return true;
    //         }
    //       },
    //       {
    //         text: 'No',
    //         buttonClasses: 'btn-cancel',
    //         onAction: () => false
    //       }
    //     ],
    //   }
    // );
    
  }
  send_final_invoice(data) {
    if(!localStorage.getItem('FreeAgentToken') && !localStorage.getItem('RefreshToken') && !localStorage.getItem('TokenExpiry')){
      this.verifyFreeagentCall()

        return;
      }
          
    const content = {
      invoice_no: data.hawb_no,

      url: data.invoice_url,
      created_by: this.userdetails['v_user_id'],
      email: 'hshaikh@cargoforce.com'
    };
  
    this.serviceNew.createInvoice_freeAgent(content, 'E').subscribe(
      (r: any) => {
        console.log(r);
        if (r.status === 'success' && r.code === '200') {
          this.coloredToast('success','Invoice marked as read successfully!');
          this.get_invoice()

        } else {
          this.coloredToast('danger','Failed to mark invoice as read.');
        }
      },
      (error) => {
        console.error(error);
        this.coloredToast('success','Invoice marked as read successfully!');
        this.get_invoice()

        // this.coloredToast('danger','An error occurred while processing the request.', 'Error');
      }
    );
  }
 
  loading: boolean = true;


  showLoading() {
    this.loading = true;
  }
  autoCompleteData: any[] = [];
  autoCompleteList: any[] = [];
  suggestionData: any[] = [];
  showSuggestions: boolean = false;
  getFreeAgentAutoComplete() {
    this.serviceNew.getFreeAgentAutoComplete().subscribe(d => {
      this.autoCompleteData = d['data'];
      this.suggestionData=d['data']
    });
  }
  hideLoading() {
    this.loading = false;
  }
  getBadgeClass(status: string): string {
    switch (status) {
      case 'Not Generated':
        return 'badge badge-not-generated';
      case 'Generated':
        return 'badge badge-generated';
      case 'Marked as Sent':
        return 'badge badge-marked';
      case 'Sent to Customer':
        return 'badge badge-sent';
      default:
        return 'badge badge-unknown';
    }
  }
  onActionBegin(args: any) {
    // console.log("Action Begin Event Fire d:", args);

    if (args.requestType === 'searching' && args.searchString) {
      let searchText = args.searchString.trim();
      let pattern = /^(aa|AA|aA|Aa)\d{4}$/;

      if (searchText.length === 6) {
        this.service.sp_v1_ds_history_log_events_insert(searchText, this.userdetails['v_user_id'], 'HAWB SEARCH IN VIEW AND MODIFY').toPromise()

        // Wait for filtering to complete
        setTimeout(() => {
          let gridData: any = this.mainGrid.dataSource;
          let filteredData: any[] = [];

          if (Array.isArray(gridData)) {
            filteredData = gridData;
          } else if (gridData && gridData.result && Array.isArray(gridData.result)) {
            filteredData = gridData.result;
          }

          console.log("Filtered Data:", filteredData);

          // Check if the searched term exists in the filtered data
          let isFound = filteredData.some(item => item.hawb_no === searchText);

          if (!isFound) {
            console.log("No records found for:", searchText);
            this.callApi(searchText);
          } else {
            console.log("Records found for:", searchText);
          }
        }, 500);
      }
    }
  }



  callApi(searchText: string) {
    this.btn3 = true;
    this.serviceNew.get_invoice_list(this.pointid, this.v_location_id, searchText, -1).subscribe(data => {
      if (data['data'] && data['data'].length) {
        let newInvoices = data['data'].map((d, i) => ({
          ...d,
          pageNo: this.invoice_list.length + 1,
          invCurrentSts: d['invoice_api_status'] == 0 ? 'Not Generated' :
            d['invoice_api_status'] == 1 ? 'Generated' :
              d['invoice_api_status'] == 2 ? 'Marked as Sent' :
                d['invoice_api_status'] == 3 ? 'Sent to Customer' :
                  'Status Not Found'
        }));

        // ✅ **Filter to keep only unique `hawb_no` values**
        let allInvoices = [...this.invoice_list, ...newInvoices];
        this.invoice_list = allInvoices.filter((v, i, self) =>
          i === self.findIndex(t => t.hawb_no === v.hawb_no) // Keep only the first occurrence of each `hawb_no`
        );

      } else {
        console.log("No new invoices found.");
      }

      this.rowsFilter = this.invoice_list.map(r=>({
    ...r,
    mergeWtAndPcs: r['total_carton']+" - "+r['total_weight'] ,
    mergeDate:r['payment_date'] + "\n"+r['expected_dly_date']
  }));;

      if (data['code'] == 200) {
        this.tot_inv = this.invoice_list.length;
        this.tot_ctn = 0;
        this.tot_wgt = 0;
        this.tot_net_Amt = 0;
        this.tot_Rec_Amt = 0;
        this.tot_Blc_Amt = 0;

        for (let i = 0; i < this.tot_inv; i++) {
          this.tot_ctn += Number(this.invoice_list[i]['total_carton']);
          this.tot_wgt += Number(this.invoice_list[i]['total_weight']);
          this.tot_net_Amt += Number(this.invoice_list[i]['net_amount']);
          this.tot_Rec_Amt += Number(this.invoice_list[i]['received_amount']);
          this.tot_Blc_Amt += Number(this.invoice_list[i]['balance_amount']);
        }
      }

      this.btn3 = false;
    });
  }
    activeRowIndex: number | null = null;
  selectedPrefix: string = '';
  // autoCompleteList: any[] = []; // Autocomplete suggestions

  filterSuggestions() {
    if (this.selectedPrefix.trim()) {
      // Filter suggestions based on the selected prefix (input value)
      this.autoCompleteList = this.suggestionData;
    } else {
      this.autoCompleteList = [];
    }
  }

  // Handle focus on input
  onInputFocus(index: number) {
    this.activeRowIndex = index;
    this.filterSuggestions(); // Filter suggestions when the input is focused
  }
  accountNoControl = new FormControl('');

  // Handle suggestion selection
  selectSuggestion(suggestion: any) {
    
    console.log(suggestion)
    this.editItem.description = `${suggestion.value} ${this.editItem.description}`;
    this.selectedPrefix = ''; // Clear the selected prefix after selection
    this.autoCompleteList = []; // Clear suggestions
    this.editItem.unit_price=suggestion.unit
    this.editItem.VAT=suggestion.isVAT
  }

  // Handle blur and hide suggestions
  hideSuggestionsWithDelay() {
    setTimeout(() => {
      this.autoCompleteList = [];
    }, 150);
  }
  

  
  // Declare variables
  editItem: any = {};
  editItemnew: any = {};
  editingIndex: number | null = null;
  editingIndexnew: number | null = null;

// Open the edit popup
openEditPopup(index: number) {
  this.editingIndex = index;
  this.accountNoControl.reset()
  this.editItem = { ...this.editingData[index] }; // clone item
  this.editItemModal.open(); // show modal
}

// Save the edited item
saveEdit() {
  console.log(this.editItem)
  // Check if editingIndex is not null and editItem is valid
  if (this.editingIndex !== null) {
    
    // Validate required fields
    if (!this.editItem.quantity || this.editItem.quantity <= 0) {
     this.coloredToast('warning',"Please enter a valid quantity.");
      return; // Exit the function if validation fails  
    }

    if (!this.editItem.unit_price) {
     this.coloredToast('warning',"Please enter a valid unit price.");
      return; // Exit the function if validation fails
    }

    // if (!this.editItem.VAT ) {
    //  this.coloredToast('warning',"Please enter a valid VAT percentage.");
    //   return; // Exit the function if validation fails
    // }

    // Calculate VAT amount if all inputs are valid
    this.editItem.VATAMT = this.editItem.VAT !== 0 
      ? ((this.editItem.quantity * this.editItem.unit_price) * this.editItem.VAT * 0.01) 
      : 0;

    // Update the data
    this.editingData[this.editingIndex] = { ...this.editItem };

    // Hide the modal
    this.editItemModal.close();
  }
}
saveEditMod() {
  // console.log(this.editItem)
  // Check if editingIndex is not null and editItem is valid
  if (this.editingIndexnew !== null) {
    
    // Validate required fields
    if (!this.editItemnew.quantity || this.editItemnew.quantity <= 0) {
     this.coloredToast('warning',"Please enter a valid quantity.");
      return; // Exit the function if validation fails  
    }

    if (!this.editItemnew.unit_price) {
      this.coloredToast('warning',"Please enter a valid unit price.");
      return; // Exit the function if validation fails
    }

    // if (!this.editItem.VAT ) {
    //   this.toastr.warningToastr("Please enter a valid VAT percentage.");
    //   return; // Exit the function if validation fails
    // }

    // Calculate VAT amount if all inputs are valid
    this.editItemnew.VATAMT = this.editItemnew.VAT !== 0 
      ? ((this.editItemnew.quantity * this.editItemnew.unit_price) * this.editItemnew.VAT * 0.01) 
      : 0;

    // Update the data
    this.editingDataModufy[this.editingIndexnew] = { ...this.editItemnew };

    // Hide the modal
    this.editItemModalEdit.hide();
  }
}

editingDataModufy: any[] = []; // <-- you already have this somewhere for the ngFor table

editInvoice(HaebData: any) {
  this.selectedDetails=HaebData;
  const requestData = {
    url: HaebData['invoice_url']
  };

  this.serviceNew.createInvoice_freeAgent(requestData, 'SI').subscribe((response: any) => {
    if (response.status === 'success') {
      const invoiceItems = response.data.list.invoice.invoice_items || [];

      this.editingDataModufy = invoiceItems.map((item: any) => ({
        quantity: parseFloat(item.quantity),
        description: item.description,
        unit_price: parseFloat(item.price),
        VAT: 0 // Your API returns "sales_tax_status": "OUT_OF_SCOPE", so VAT is 0
      }));
    }
    this.sendFreeAgentInvPdfModify.show()
  });
}
deleteInvoice(HaebData){
  this.selectedDetails=HaebData;
  const requestData = {
    invoice_no:HaebData['hawb_no'],
    url: HaebData['invoice_url'],
    created_by:this.userdetails.v_user_id
  };

  this.serviceNew.createInvoice_freeAgent(requestData, 'DI').subscribe((response: any) => {
    if (response.status === 'success') {
      this.coloredToast('success',"deleted Successfully");
      this.get_invoice()
    }
    // this.sendFreeAgentInvPdfModify.show()
  });
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
    highlightBookingAgent(args: RowDataBoundEventArgs) {
  const data = args.data as any;

  if (
    data &&
    data.agent_customer &&
    typeof data.agent_customer === 'string' &&
    data.agent_customer.toLowerCase() === 'bookingagent'
  ) {
    (args.row as HTMLTableRowElement).classList.add('row-booking-agent');
  }
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
isOdiLocation =false;
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
  editedContent:any;
  receiverPincode=''
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
  selectedPaymentType: string = ''
  customPaymentType: string = ''
  sendMailChecked: boolean = false
   editorOptions = {
        toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
    };
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
    params:FormGroup;
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
    inv_no: this.selectInvoiceNo,
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
        hawb_no: this.selectInvoiceNo,
        created_by: this.userdetails.v_user_id,
        status: sts,
        mode: this.params.value.paymentSts,
        remarks: this.params.value.customPaymentType,
        paymentDate: this.params.value.date
      };
      this.service.sp_v1_ds_history_log_events_insert(data.hawb_no, this.userdetails['v_user_id'], 'Payment Status Update as ' + sts).toPromise();

      this.serviceNew.v1_SP_ds_payment_api_status_update(d).subscribe(
        (r: any) => {
          if (r.code == 200) {
      // this.getInvoiceDetails();
          this.get_invoice()

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

   quillEditorReady(event: any) {
    // Get the HTML content from the editor
    const htmlContent = event.html;

    // Now, set this HTML content to the form value
    this.params.patchValue({ displayDescription: htmlContent });
}
}
