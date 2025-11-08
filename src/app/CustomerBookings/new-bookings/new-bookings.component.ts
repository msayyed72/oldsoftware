import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterSettingsModel, GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { fromEvent, Subscription } from 'rxjs';
import { ChatService } from '../../cfServices/chat-service.service';
import { AwbService } from '../../cfServices/awb.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'lodash';
import Swal from 'sweetalert2';
// import { Router } from 'express';
import { DatePipe } from '@angular/common';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-new-bookings',
  templateUrl: './new-bookings.component.html',
  styleUrls: ['./new-bookings.component.css'],
  animations: [
    trigger('toggleAnimation', [
        transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
        transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
],
})
export class NewBookingsComponentols implements OnInit {
  @ViewChild('pickupTimeModal') pickupTimeModal: any;
  @ViewChild('addTaskModal') addTaskModal: any;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('AssignmentModal') private AssignmentModal!: any;
  @ViewChild('pickupDateTimeModal') private pickupDateTimeModal!: any;
  @ViewChild('TaskAssignmentViewnew') private TaskAssignmentViewnew!: any;
  @ViewChild('collectionTypeChangeModel') private collectionTypeChangeModel!: any;
  @ViewChild('viewmanifest') private viewmanifest!: any;
  @ViewChild('successConnectedOfShipment') private successConnectedOfShipment!: any;
  
      public data: Object[] = [];
      // public dsdadsdas: Object[] = [];
      public filterSettings: Object ={ ignoreAccent:true ,hierarchyMode:'None', type: 'Excel' };
      public toolbar: string[]= ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
      public editSettings: Object ={ allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };
      public orderidrules: Object={ required: true, number: true };
      public customeridrules!: Object 
      public freightrules: Object | undefined;
      filterTaskName:FilterSettingsModel ={type:'Excel'}
  public dsdadsdas: any[] = [
    { OrderID: 10248, CustomerName: 'Maria', OrderDate: '7/4/1996', Freight: 32.38, ShipCountry: 'France' },
    { OrderID: 10249, CustomerName: 'Ana Trujillo', OrderDate: '7/5/1996', Freight: 11.61, ShipCountry: 'Germany' },
    { OrderID: 10250, CustomerName: 'Antonio Moreno', OrderDate: '7/8/1996', Freight: 65.83, ShipCountry: 'Brazil' },
    { OrderID: 10251, CustomerName: 'Thomas Hardy', OrderDate: '7/8/1996', Freight: 41.34, ShipCountry: 'France' },
    { OrderID: 10252, CustomerName: 'Christina Berglund', OrderDate: '7/9/1996', Freight: 51.30, ShipCountry: 'Belgium' },
    { OrderID: 10253, CustomerName: 'Hanna Moos', OrderDate: '7/10/1996', Freight: 58.17, ShipCountry: 'Brazil' },
    { OrderID: 10254, CustomerName: 'Frédérique Citeaux', OrderDate: '7/11/1996', Freight: 22.98, ShipCountry: 'Switzerland' },
    { OrderID: 10255, CustomerName: 'Martín Sommer', OrderDate: '7/12/1996', Freight: 148.33, ShipCountry: 'Switzerland' },
  ];
  AssignList:any;
  private inactivitySubscription!: Subscription;
  private apiSubscription!: Subscription;
  private inactivityTime = 10000; // 10 seconds
  assignForm!: FormGroup ;
  assignForm1!:FormGroup ;
  taskForm!: FormGroup ;
  userdetails:any;
  AssignClient=-1;
  pickupDate: string = '';
fromTime: string = '';
toTime: string = '';
fromDateTime: string = '';
toDateTime: string = '';
availableTimes: string[] = [];
public indexTemplate: any;
code: string = '';
state: string = '';
dispatchType=''
newCollectionType=''
DpdCollectionRefNo=''
   constructor(public _chat:ChatService,private imageCompress: NgxImageCompressService,public service: AwbService,public fb: FormBuilder, private router: Router, private datep: DatePipe, private serviceNew: NewApiCloudService,
      private route: ActivatedRoute)  { 
        const logData = localStorage.getItem("log_data");
        if (logData) {
          this.userdetails = JSON.parse(logData);
        } else {
          // Handle the case where "log_data" is null or not found
          this.userdetails = {}; // or any default value you prefer
        }
        this.assignFormValues();
        this. taskAssignForm();
        this.indexTemplate = (data: any) => {
          return `<span>${data.index + 1}</span>`;
        };
     
        
      }

    assignFormValues(){
      this.assignForm = this.fb.group({
        'orderNo': [''],
        'type': ["-1",],
        'employeId': [null],
        'cretedBy': [this.userdetails.v_user_id],
        'remarks': [''],
        'coLoder': [null],
        'ship_ref_no': [null],
        'local_trasfer': [null],
        'parcelData': [null],
        'coloaderName':[null],
        'invoice_no':[null],
        'collectionRef':[null]
      });
      this.assignForm1 = this.fb.group({
        'orderNo': [''],
        'type': ["-1",],
        'employeId': [null],
        'cretedBy': [this.userdetails.v_user_id],
        'remarks': [''],
        'coLoder': [null],
        'ship_ref_no': [null],
        'local_trasfer': [null],
        'parcelData': [null],
        'coloaderName':[null],
        'invoice_no':[null]
      })
    }
    taskAssignForm(){
      this.taskForm = this.fb.group({
        assignTo: ['', Validators.required],
        inv_no: [''],
        assignBy: [''],
        taskName: ['', Validators.required],
        taskDetails: ['',Validators.required]
      });
    }
   isAssignBranchIsProcessing = false;
   orderDetails: any[] = [
    { OrderID: 10248, CustomerName: 'Maria', OrderDate: '7/4/1996', Freight: 32.38, ShipCountry: 'France' },
    { OrderID: 10249, CustomerName: 'Ana Trujillo', OrderDate: '7/5/1996', Freight: 11.61, ShipCountry: 'Germany' },
    { OrderID: 10250, CustomerName: 'Antonio Moreno', OrderDate: '7/8/1996', Freight: 65.83, ShipCountry: 'Brazil' },
    { OrderID: 10251, CustomerName: 'Thomas Hardy', OrderDate: '7/8/1996', Freight: 41.34, ShipCountry: 'France' },
    { OrderID: 10252, CustomerName: 'Christina Berglund', OrderDate: '7/9/1996', Freight: 51.30, ShipCountry: 'Belgium' },
    { OrderID: 10253, CustomerName: 'Hanna Moos', OrderDate: '7/10/1996', Freight: 58.17, ShipCountry: 'Brazil' },
    { OrderID: 10254, CustomerName: 'Frédérique Citeaux', OrderDate: '7/11/1996', Freight: 22.98, ShipCountry: 'Switzerland' },
    { OrderID: 10255, CustomerName: 'Martín Sommer', OrderDate: '7/12/1996', Freight: 148.33, ShipCountry: 'Switzerland' },
  ];
  public toolbarOptions: ToolbarItems[] = ['ExcelExport', 'PdfExport', 'Search'];
  chatLog: any[] = [];

  chatMessages:any
  ngOnInit() {
    // this._chat.newMessageReceived.subscribe((msg) => {
    //   this.getHawbListAssigned();
    //   if(this.selectedData['invoice_no']){
    //     this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no'])

    //   }
    // });

    // Initial logging
    // console.log(this.chatMessages);  // Logs the initial state of chatMessages
    console.log('this.chatMessages');  // Logs the string "this.chatMessages"
    // this.toolbarOptions = ['ExcelExport', 'PdfExport', 'CsvExport','Print','Search];
    this.toolbarOptions = ['Search'];
    this.getHawbListAssigned();
    
    this.get_CO_Loader();
    this.getEmployee()
    this.generateTimeSlots();
    this.getHawbListAssignedLoad()
    this.data = this.orderDetails;
    this.dsdadsdas = this.orderDetails; // Assuming same data source for new grid
    this.filterSettings = { ignoreAccent:true ,hierarchyMode:'None', type: 'Excel' };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;
    this.orderidrules = { required: true, number: true };
    this.customeridrules = { required: true, minLength: 5 };
    this.freightrules = { required: true, min: 0 };
    this.loading=false;
    this.selectedFilter='all';
    this.filterBy='-1';
    this.typeOfService='1^12';
    this.newCollectionType=new Date().toISOString().split('T')[0]
    this.currentEmployee=this.userdetails.v_user_name;
    this.isAssignBranchIsProcessing = false;

    const userActivity$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'click')
    );

    // Reset the timer on user activity
    // this.inactivitySubscription = userActivity$
    //   .pipe(
    //     debounceTime(1000), // Wait for 1 second to avoid multiple triggers
    //     startWith(null), // Start immediately
    //     switchMap(() => interval(this.inactivityTime)) // Restart interval on activity
    //   )
    //   .subscribe(() => {
    //     this.getHawbListAssigned();
        
    //   });
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
  getEmpNameBasedOnUserId(){
    const fil=this.employees.find((d: { user_id: any; }) => d.user_id == this.selectedEmployee)
    return fil.employee_name ? fil.employee_name : '';
  }

  // invoiceDateFilter: string;
  isLoading=false;
 // Add these variables in your component
currentPage: number = 1;
itemsPerPage: number = 50; // Default page size
totalItems: number = 0;
// Add this event handler
onRowDataBound(args: any) {
  if (args.row) {
    if (this.AssignClient === args.rowIndex) {
      args.row.style.backgroundColor = 'lightblue';
      args.row.style.color = 'black';  // Set text color to black
    } else {
      args.row.style.backgroundColor = 'white';
      args.row.style.color = 'black';  // Reset text color to black
    }
  }
}


// Modify your data fetching method
getHawbListAssigned() {
  // this.isLoading = true;
  
  // Prepare filter parameters
  this.service.getPickupNonAllocationList('1', -1, 0, 1000)
    .subscribe(data => {
      this.AssignList = data['data'];
      this.filteredRowAssignList = data['data'].map((d: any, i: number) => {
        return { ...d, pageNo: i + 1 }; // Ensure to return modified object
      });
      this.totalItems = this.filteredRowAssignList.length; // Correctly set total items
      this.isLoading = false;
    });
}

getHawbListAssignedLoad() {
  // this.isLoading = true;
  
  // Prepare filter parameters
  this.serviceNew.getPickupNonAllocationListLoad('1', -1, 0, 1000)
    .subscribe((data: { [x: string]: any[]; }) => {
      this.AssignList = data['data'];
      this.filteredRowAssignList = data['data'].map((d, i) => {
        return { ...d, pageNo: i + 1 }; // Ensure to return modified object
      });
      this.totalItems = this.filteredRowAssignList.length; // Correctly set total items
      this.isLoading = false;
    });
}

// Update your applyFilters method

// Calculate total pages (for template)
get totalPages(): number {
  return Math.ceil(this.totalItems / this.itemsPerPage);
}
  
  getEmployee() {
    this.service.getemployeeBasedOnBranch(this.userdetails.v_point_id).subscribe(data => {
      this.employees = data['data'];
      this.allUsers=data['data']
    })
  }
  invoiceNoFilter: string = '';
  invoiceDateFilter: string = '';
  senderNameFilter: string = '';
  totalPkgsFilter: number | null = null;
  totalWeightFilter: number | null = null;
  collectionTypeFilter: string = '';
  callStatusFilter: string = '';
  notesFilter: string = '';
  assignByFilter: string = '';
 // In your component
 filteredRowAssignList!: string | any[] 
 applyFilters() {
  this.currentPage = 1; // Reset to first page when filters change

  if (this.invoiceDateFilter) {
    const data: string[] = this.invoiceDateFilter.split('-');
    if (data.length === 3) {
     var dataOfselected = `${data[2]}-${data[1]}-${data[0]}`;
    }
  }
  this.filteredRowAssignList = this.AssignList.filter((item: { invoice_no: string | string[]; created_date: string; sender_name: string; total_carton: number; total_weight: number; collection_type: string; contact_status: string; notes: string; task_assign_by: string; }) => {
    return (
      (!this.invoiceNoFilter || item.invoice_no.includes(this.invoiceNoFilter)) &&
      (!dataOfselected || item.created_date === dataOfselected) &&
      (!this.senderNameFilter || item.sender_name.toLowerCase().includes(this.senderNameFilter.toLowerCase())) &&
      (this.totalPkgsFilter === null || item.total_carton == this.totalPkgsFilter) &&
      (this.totalWeightFilter === null || item.total_weight == this.totalWeightFilter) &&
      (!this.collectionTypeFilter || item.collection_type === this.collectionTypeFilter) &&
      (!this.callStatusFilter || item.contact_status === this.callStatusFilter) &&
      (!this.notesFilter || (item.notes && item.notes.toLowerCase().includes(this.notesFilter.toLowerCase()))) &&
      (!this.assignByFilter || (item.task_assign_by && item.task_assign_by.toLowerCase().includes(this.assignByFilter.toLowerCase())))
    );
  });
}
  ngOnDestroy() {
    if (this.inactivitySubscription) this.inactivitySubscription.unsubscribe();
    if (this.apiSubscription) this.apiSubscription.unsubscribe();
  }
  _loading: boolean = false;  // Add this to your component
  _btnAssign:any;
  assignToBranch() {
    const findTransporter=this.CO_Loader.filter((f: { [x: string]: any; })=> f['transporter_id'] == this.assignForm.value.coLoder)
    if(findTransporter.length>0){
      this.assignForm.get('coloaderName')?.setValue(findTransporter?.[0]?.transporter_name || '');

    }
    this.assignForm.get('invoice_no')?.setValue(this.selectedData['invoice_no']);
    this.assignForm.get('parcelData')?.setValue(this.totalReceivedData);
    this.assignForm.get('collectionRef')?.setValue(this.DpdCollectionRefNo);
    
    console.log(this.assignForm.value.type + " viewForm.value.type");
  
    this.isAssignBranchIsProcessing = true; // Start loading
  
    this.serviceNew.update_Pickup_allocated_to_staff(this.assignForm.value).subscribe(
      (      data: { [x: string]: number; }) => {
        if (data['code'] == 200) {
          this._btnAssign = true;
          // this.assignForm.reset();
          this.getHawbListAssigned();
          this.coloredToast('success',"assign Successful")
          this.successConnectedOfShipment.open()
          
        }else{          
          this.coloredToast('warning',"assign Failed")


        }
        this.isAssignBranchIsProcessing = false; // Stop loading
      },
      (      error: any) => {
        this.coloredToast('warning',"assign Failed")

        console.error("Error:", error);
        this.isAssignBranchIsProcessing = false; // Stop loading
      }
    );
  }
  strify(data: any){
  console.log(this.loading)
  return data;
  }
  // disableLoading(){
  //   this.loading=true;
  // }
  loading=false;
  // totalReceivedData:any;
  assignToDpdCourerForPickup() {
    this.isAssignBranchIsProcessing = true; // Start loading
    this.totalReceivedData[0].total_pcs=this.totalPcsOfInvoice;
    this.totalReceivedData[0].total_wgt=this.totalWtOfInvoice;
    this.totalReceivedData[0].typeOfService=this.typeOfService;
    this.totalReceivedData[0].optinalRef2=this.optinalRef2;
    this.serviceNew.AssignToDpd(this.totalReceivedData[0]).subscribe(
      (data: any) => {
        console.log("Response:", data);
        console.log(this.totalReceivedData);
  
        if (data.status === "success" && data.code === "200" && data.data && data.data.data) {
          const shipmentData = data.data.data;
          this.assignForm.get('coloaderName')?.setValue('DPD');
  
          if (this.assignForm.get('ship_ref_no')) {
            this.assignForm.get('ship_ref_no')?.setValue(shipmentData.shipmentId);
          }
  
          if (shipmentData.consignmentDetail && shipmentData.consignmentDetail.length > 0) {
            if (this.assignForm.get('local_trasfer')) {
              this.assignForm.get('local_trasfer')?.setValue(shipmentData.consignmentDetail[0].consignmentNumber);
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
          this.coloredToast('warning', JSON.stringify(data));
        }
      },
      (error: any) => {
        this.isAssignBranchIsProcessing = false;
        console.error("API Error:", error);
        this.coloredToast('warning', JSON.stringify(error));
      }
    );
  }
  scrollToBottom(): void {
    try {
      if (this.chatContainer.nativeElement) {
        setTimeout(() => {
          const element = this.chatContainer.nativeElement;
          element.scroll({
            top: element.scrollHeight,
            left: 0,
            behavior: 'smooth'
          });
        }, 100); // Increased timeout for better reliability
      }
    } catch(err) {
      console.error('Scroll error:', err);
    }
  }
  totalReceivedData:any[] = [];
  assignData:any;
 pickuptypevalue = 'Co_Loader';
selectedData:any=[];
pickupTime:any;
orderViewAssign(list, _t,i) {
  console.log(list)
  console.log("list")
  this.AssignClient=i;
  if(list['collection_type'] != 'Drop_At_Warehouse'){
    this.pickuptypevalue='Co-Loader'
    this. pickupTime = list['collection_type'] // Splitting dd-mm-yyyy
   this.pickupDateForPF  = list['collection_type'] // Splitting dd-mm-yyyy
    // this.pickupTime = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearranging to yyyy-mm-dd
    
  }else{
    this.pickuptypevalue='Drop Off'

  }
  if(list){
    this.selectedData=list;
  }
  // this.order_remarks = '';
  if (_t == '1') {
    this._btnAssign = false
    // this._btnnonAssign = true
  }
  else {
    this._btnAssign = true
    // this._btnnonAssign = false
  }
  this.service.orderViewAssign(list.order_no).subscribe(data => {
    console.log(data['data'])
    if (data['data'].length > 0) {
      this.totalReceivedData = data['data'].map((item: any) => ({
        ...item,
        chargeable_wt: Math.ceil(this.GreattestOfTwo(item.weight,item.vol_wgt)), // Initializing chargeable_wt to 0
        parcelNumbers:''
      }));
            } else {
      this.totalReceivedData = []
    }
    console.log(this.totalReceivedData)
    console.log('this.totalReceivedData')
    this.assignData = data['data'][0]
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
  insertCartonDataAddedNew(data: any[]) {
    this.serviceNew.v1_ds_insert_pickup_carton_details(data).subscribe(
      (response: any) => {
        this.service.orderViewAssign(this.selectedData['order_no']).subscribe(d=>{
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
  totalPcsOfInvoice:any=0;
  totalWtOfInvoice:any=0;
  typeOfService='1^12';
  optinalRef2='';
  ValidatePickup(data: { coLoder: string; }){
    this.totalPcsOfInvoice=this.totalReceivedData.length;
    this.totalWtOfInvoice= this.totalReceivedData.reduce((sum,item)=> sum+item.chargeable_wt ,0)

    const filterNotPresentCartonData:any[] =this.totalReceivedData.filter(d=> d['pickup_id'] == '')
    if(filterNotPresentCartonData.length>0){
      this.insertCartonDataAddedNew(filterNotPresentCartonData);
    }
    this.updateShipperDetails()

    if(this.assignForm.value.type == 'Co-Loader' && data.coLoder == '1'){
      this.pickupTimeModal.open();
    }else if(this.assignForm.value.type == 'Co-Loader' && data.coLoder == '2'){
      this.pickupDateTimeModal.open();

    }else{
      this.assignToBranch();
    }
  }
  CO_Loader:any=[];
  get_CO_Loader() {
    this.service.get_CO_Loader().subscribe(data => {
      this.CO_Loader = data['data']
    })
  }
  calculateChargeableWeight(list: any) {
    // Calculate volumetric weight (length * width * height) / 5000
    list.vol_wgt = Math.ceil(Number(((list.length || 0) * (list.width || 0) * (list.height || 0)) / 5000)).toFixed(2);
  
    // Determine chargeable weight as the greater of actual weight and volumetric weight
    list.chargeable_wt = Math.ceil(Number(Math.max(list.weight || 0, list.vol_wgt))).toFixed(2);
  }
  v1_SP_Ds_hawb_order_Insert_by_hawb_id() {
    const Payload = {
      hawb_no: this.selectedData['invoice_no'],
      created_by: this.userdetails.v_user_id,
      cartonData:this.totalReceivedData
    }
console.log(Payload)
    this.serviceNew.v1_SP_Ds_hawb_order_Insert_by_hawb_id(Payload).subscribe((data: { [x: string]: number; }) => {
      if (data['code'] = 200) {
        this.coloredToast('success',"Inserted Successfully");
        this.Refresh()

      }
    })
  }  
  Refresh(){
    this.router.navigate(['/']).then(() => { this.router.navigate(['/OrderAssign']); })

  }
  Refresh1(){
    if(this.assignForm.get('coLoder')?.value==1){
      this.coloredToast('warning',"Plz Update Dpd Collection ref")
      return;
    }
    this.router.navigate(['/']).then(() => { this.router.navigate(['/OrderAssign']); })

  }
  imagePreview: string | null = null;
selectedImageFile: File | null = null;
isDragging = false;

// Drag & Drop handlers

onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragging = true;
}

onDragLeave(event: DragEvent) {
  this.isDragging = false;
}


async onDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  this.isDragging = false;

  const dataTransfer = event.dataTransfer;
  if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
    await this.handleFiles(dataTransfer.files, event);
  }
}



async handleFileInput(event: any) {
  await this.handleFiles(event.target.files,event);
}

private async handleFiles(files: FileList, event: any) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  for (const file of Array.from(files)) {
    if (!validTypes.includes(file.type)) {
      this.coloredToast('warning',`Unsupported file type: ${file.type}`);
      continue;
    }

    try {
      await this.onImageUploadAadhar(file); // pass the file directly
    } catch (error) {
      console.error('Upload failed:', error);
      this.coloredToast('warning',`Failed to upload ${file.name}`);
    }
  }

}


async onImageUploadAadhar(file: File) {
  let compressedFile: File;
  try {
    if (file && file.type.startsWith('image/')) {
      compressedFile = await this.compressImageTo2MB(file); // only compress if it's an image
    } else {
      compressedFile = file;
    }

    const formData = new FormData();
    formData.append('avatar', compressedFile);

    this.serviceNew.imgUploadnew(formData).subscribe((data: { [x: string]: string; }) => {
      if (data['status'] === 'success' && data['url']) {
        const fileUrl = "$a-z/" + data['url'];
        this.saveNotes(fileUrl); // Save to your NotesReceivedForInvoice array
      }
    });

  } catch (error) {
    console.error('Image upload failed:', error);
  }
}
isFirstMessageOfDay(index: number): boolean {
  if (index === 0) return true;
  const current = new Date(this.NotesReceivedForInvoice[index].created_time).toDateString();
  const prev = new Date(this.NotesReceivedForInvoice[index - 1].created_time).toDateString();
  return current !== prev;
}


isImageOrPdf(note: string): boolean {
  // Check if note contains a ManuvalUploadedImg path
  return note.startsWith('$a-z/');
}

isImage(note: string): boolean {
  // Check if the file is an image (based on file extension)
  return note.endsWith('.jpg') || note.endsWith('.jpeg') || note.endsWith('.png') || note.endsWith('.gif');
}

isPdf(note: string): boolean {
  // Check if the file is a PDF
  return note.endsWith('.pdf');
}

getFileUrl(note: string): string {
  // Return the URL for the image or PDF file
  const fileName = note.replace('$a-z/', '');
  return `https://api.cargoforce.com/Origin_v2/api_php_booking/chatImages/${fileName}`;
}

openMedia(note: string): void {
  // Open the image or PDF in a new window
  const url = this.getFileUrl(note);
  window.open(url, '_blank');
}
pastedImageFile: File | null = null;
allUsers: any[] =[];
filteredUsers: any[] = [];
showMentionList: boolean = false;
selectedIndex: number = 0;

onKeyUp(event: KeyboardEvent): void {
  const cursorPosition = (event.target as HTMLInputElement).selectionStart || 0;
  const value = this.EnteredNotes.slice(0, cursorPosition);
  const mentionMatch = value.match(/@(\w*)$/);

  if (mentionMatch) {
    const query = mentionMatch[1].toLowerCase();
    this.filteredUsers = this.allUsers.filter(user =>
      user.employee_name.toLowerCase().startsWith(query)
    );
    this.showMentionList = this.filteredUsers.length > 0;
  } else {
    this.showMentionList = false;
  }
}


mentionPattern = /@\w+/g;
mentions: { name: string, start: number, end: number }[] = [];

onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    const cursorPos = (event.target as HTMLInputElement).selectionStart!;
    const mentionToDelete = this.mentions.find(m => cursorPos > m.start && cursorPos <= m.end);

    if (mentionToDelete) {
      // Prevent default backspace
      event.preventDefault();
      this.EnteredNotes =
        this.EnteredNotes.slice(0, mentionToDelete.start) +
        this.EnteredNotes.slice(mentionToDelete.end);
      
      // Move cursor
      setTimeout(() => {
        const input = event.target as HTMLInputElement;
        input.setSelectionRange(mentionToDelete.start, mentionToDelete.start);
      });

      // Remove from mentions list
      this.mentions = this.mentions.filter(m => m !== mentionToDelete);
    }
  }
}

highlightMentions(text: string): string {
  return text.replace(/@([^\s]+)/g, (match, afterAt, offset) => {
    for (const emp of this.employees) {
      const empName = emp.employee_name;
      if (text.substring(offset + 1).toLowerCase().startsWith(empName.toLowerCase())) {
        const fullMention = '@' + empName;
        return `<span class="text-primary">${fullMention}</span>`;
      }
    }
    return match; // No match found, leave as is
  });
}

selectUser(user: string) {
  const mentionText = `@${user}`;
  const cursorPos = this.EnteredNotes.lastIndexOf('@');

  this.EnteredNotes =
    this.EnteredNotes.substring(0, cursorPos) +
    mentionText +
    ' ' + // Add space after mention
    this.EnteredNotes.substring(cursorPos + 1); // skip already typed @

  const start = cursorPos;
  const end = start + mentionText.length;

  this.mentions.push({ name: mentionText, start, end });

  this.showMentionList = false;

  // Set cursor after the inserted mention
  setTimeout(() => {
    const inputElement = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
      inputElement.setSelectionRange(end + 1, end + 1); // move cursor after space
    }
  });
}


handlePaste(event: ClipboardEvent) {
  const clipboardData = event.clipboardData;
  if (!clipboardData) return;  // Ensure clipboardData is not null

  const items = clipboardData.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.indexOf('image') === 0) {
      const file = item.getAsFile();
      if (file) {
        this.pastedImageFile = file;
        console.log(this.pastedImageFile);
        this.onImageUploadAadhar(file);

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          // Cast e.target.result to a string type since it's the image preview
          this.imagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }
}

async compressImageTo2MB(image: File): Promise<File> {
  
  console.log("Compressing image to ≤2MB...");

  if (!image || !(image instanceof File)) {
    return Promise.reject('Invalid image file provided');
  }

  // Check if the file is a PDF
  if (image.type === 'application/pdf') {
    // If it's a PDF, return the same file without compressing
    console.log('File is a PDF, returning original file.');
    return Promise.resolve(image);
  }

  // Compress image logic if it's not a PDF
  return new Promise<File>((resolve, reject) => {
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


removeImage(): void {
  this.selectedImageFile = null;
  this.imagePreview = null;
  // Reset the file input
  const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
}

  EnteredNotes:string=''
  InsertNotes(EnteredNotes: any) {
    if (!this.EnteredNotes.trim() ) {
      this.coloredToast('warning','Please Enter Notes To continue');
      return;
    }
    this.saveNotes(EnteredNotes)
   
  }
  saveNotes(EnteredNotes: string){
    const Notes = {
      invoice_no: this.selectedData['invoice_no'],
      notes: EnteredNotes,
      created_by: this.userdetails.v_user_id,
    };
  
    this.serviceNew.v1_sp_ds_pickup_order_note_insert(Notes).subscribe(
      (data: { [x: string]: number; }) => {
        this.addTaskModal.close()

        if (data['code'] == 200) {
          // this.coloredToast('success','Notes inserted successfully.');
          this.EnteredNotes = ''; // Clear input after success
          // this.getHawbListAssigned();
          if(this.selectedData['invoice_no']){
            // const msg = {
            //   sender: this.userdetails['v_user_name'],
            //   content: this.EnteredNotes,
            //   timestamp: new Date().toISOString()
            // };
            const msg = { from: 'Dharun', message: 'Hello Server!' };

            this._chat.send({ from: 'Angular', message: this.userdetails['customer_name'] });
            this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no'])
  
          }

        } else {
          this.coloredToast('warning','Failed to insert notes. Please try again.');
        }
      },
      (error: any) => {
        this.addTaskModal.close()
        this.coloredToast('warning','An error occurred. Please check your connection.');
        console.error('Error inserting notes:', error);
      }
    );
  }
  NotesReceived=[]
  NotesReceivedForInvoice:any[]=[]
  v1_sp_ds_pickup_order_call_status_get(data: any){
    this.serviceNew.v1_sp_ds_pickup_order_note_get(data).subscribe((data: { [x: string]: never[]; })=>{
      this.NotesReceived=data['data']
      this.scrollToBottom()
    })
  }
  v1_sp_ds_pickup_order_note_get(data: any): void {
    this.serviceNew.v1_sp_ds_pickup_order_note_get(data).subscribe((response: any) => {
      if (response && response.data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
  
        // 🔼 Sort by created_time ASCENDING
        const sortedData = response.data.sort((a: any, b: any) => {
          return new Date(a.created_time).getTime() - new Date(b.created_time).getTime();
        });
  
        this.NotesReceivedForInvoice = sortedData.map((d: any) => {
          const created = new Date(d.created_time);
          const createdMidnight = new Date(created);
          createdMidnight.setHours(0, 0, 0, 0);
  
          const timeDiff = today.getTime() - createdMidnight.getTime();
          const diffInDays = timeDiff / (1000 * 60 * 60 * 24);
  
          let displayDate = '';
          if (createdMidnight.getTime() === today.getTime()) {
            displayDate = 'Today';
          } else if (createdMidnight.getTime() === yesterday.getTime()) {
            displayDate = 'Yesterday';
          } else if (diffInDays < 6) {
            displayDate = created.toLocaleDateString('en-US', { weekday: 'long' });
          } else {
            displayDate = created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          }
  
          return {
            ...d,
            updated_time: d.created_time 
            ? new Date(d.created_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
            : '',
                      display_date: displayDate
          };
        });
  
        this.scrollToBottom();
      }
    });
  }
  
  
  
  
  AssginTime(){
    this.totalReceivedData[0]['collection_type']=this.pickupTime;
  }
  transform(value: string): string {
    switch(value.toLowerCase()) {
      case 'n': return 'New';
      case 'p': return 'In Progress';
      case 'c': return 'Completed';
      default: return 'Unknown';
    }
  }
  updateContact() {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Customer Contact Confirmation For HAWB NO. '+this.selectedData['invoice_no'],
      showCancelButton: true,
      confirmButtonText: 'COnform',
      padding: '2em',
      customClass: 'sweet-alerts',
  }).then((result) => {
      if (result.value) {
        const ContactDetails={
          _h: this.selectedData['invoice_no'],
          updated_by: this.userdetails.v_user_id
        }
        this.serviceNew.v1_sp_ds_pickup_order_call_status_update(ContactDetails).subscribe(
          (data: { [x: string]: any; }) => {
            if (data['code']) {
              this.getHawbListAssigned();

              this.coloredToast('success','Status updated successfully!');
            } else {
              this.coloredToast('warning','Failed to update status.');
            }
          },
          (error: any) => {
            this.coloredToast('warning','An error occurred. Please try again.');
            console.error('Error updating status:', error);
          }
        );
      }
  });
   
    
  }
  assignEmpTask(){
    
    if(this.taskForm.invalid){
      this.coloredToast('warning',"Plz Fill All Details To Assign Task");
      return;
    }
    const assignTask = {
      _h: this.selectedData['invoice_no'],
      _f: this.userdetails['v_user_id'],
      _t: this.taskForm.value.assignTo,
      _tn:  this.taskForm.value.taskName,
      _n: this.taskForm.value.taskDetails
    };
  Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Customer Contact Confirmation For HAWB NO. '+this.selectedData['invoice_no'],
      showCancelButton: true,
      confirmButtonText: 'COnform',
      padding: '2em',
      customClass: 'sweet-alerts',
  }).then((result) => {
    if (result.value) {

    this.serviceNew.v1_SP_ds_Pickup_order_task_assign(assignTask).subscribe({
      next: (d: any) => {
        const ConstD= this.employees.filter((r: { [x: string]: any; }) => r['user_id'] == this.taskForm.value.assignTo)
        if(ConstD.length >0){
          this.saveNotes(this.userdetails['v_user_name']+" Assigned Task To "+ConstD[0].employee_name+ " - Task Name:- " +this.taskForm.value.taskName + "\n Task Details :- " + this.taskForm.value.taskDetails )

        }
        this.getHawbListAssigned();
        this.addTaskModal.close()
        this.coloredToast('success',"Task assigned to the current employee successfully!");
        this.closeModal();
      },
      error: (err: any) => {
        this.coloredToast('warning',"Error assigning task. Please try again.");
        console.error('Error:', JSON.stringify(err));
      }
    });
  }
  });
  
  
   
  }
 
  currentStep: 'initial' | 'select' | 'review' = 'initial';
  currentEmployee = '';
  selectedEmployee: any = null;
  assignmentNotes = '';
  keepingCurrentEmployee: boolean = false;

  employees:any;

  // Handle same employee assignment
  assignToSame() {
    this.keepingCurrentEmployee = true;
    this.sameEmployeeSelected=true;
  }
  sameEmployeeSelected:boolean=false;;
  // Handle confirmation actions
  handleConfirmation() {
    const assignTask = {
      _h: this.selectedData['invoice_no'],
      _f: this.userdetails['v_user_id'],
      _t: ''
    };
  
    if (this.keepingCurrentEmployee) {
      this.sameEmployeeSelected = true;
      assignTask._t = this.userdetails['v_user_id'];
  
      this.serviceNew.v1_SP_ds_Pickup_order_task_assign(assignTask).subscribe({
        next: (d: any) => {
          this.getHawbListAssigned();

          this.coloredToast('success',"Task assigned to the current employee successfully!");
          this.closeModal();
        },
        error: (err: any) => {
          this.coloredToast('warning',"Error assigning task. Please try again.");
          console.error('Error:', JSON.stringify(err));
        }
      });
  
    } else if (this.currentStep === 'select') {
      this.sameEmployeeSelected = false;
      this.currentStep = 'review';
  
    } else if (this.currentStep === 'review') {
      this.sameEmployeeSelected = false;
      assignTask._t = this.selectedEmployee;
  
      this.serviceNew.v1_SP_ds_Pickup_order_task_assign(assignTask).subscribe({
        next: (d: any) => {
          this.getHawbListAssigned();

          this.coloredToast('success',`Task successfully assigned.`);
          console.log('Finalizing assignment to:', this.selectedEmployee);
          console.log('Assignment Notes:', this.assignmentNotes);
          this.closeModal();
        },
        error: (err: any) => {
          this.coloredToast('warning',"Error finalizing assignment. Please try again.");
          console.error('Error:', err);
        }
      });
    }
  }
  DropOffShipments:any;
get_Pickup_allocatedList(){
  this.serviceNew.get_Pickup_allocatedList(1,this.userdetails.v_location_id,3,-1).subscribe((data: { [x: string]: any; })=>{
    this.DropOffShipments =data['data']
  })
}
filterBy:any;
checkTypeOfColoader(id: string){
  if(id == '-1'){
    this.get_Pickup_allocatedListByCoLoader(1,4)
  }else{
    this.get_Pickup_allocatedListByCoLoader(id,2)

  }
}
get_Pickup_allocatedListByCoLoader(id: string | number,flag: string | number){
  this.serviceNew.get_Pickup_allocatedList(id, this.userdetails.v_location_id, flag,-1).subscribe((response: { [x: string]: any; }) => {
    const dataList = response['data'][0];
    this.pickupShipemnts = dataList;

    if (dataList.length > 0) {
      this.pickupShipemnts = dataList.map((item: { [x: string]: string; }) => ({
        ...item,
        collection_status_new: item['collection_status'] === '1' ? 'Collected' : 'Not Collected',
        call_status_new: item['call_status'] === '1' ? 'Called' : 'Not Called',
      }));
    }
  });
}
pickupShipemnts!: any[]
  // Navigation controls
  goBack() {
    if (this.currentStep === 'review') {
      this.currentStep = 'select';
    } else if (this.currentStep === 'select') {
      this.currentStep = 'initial';
      this.selectedEmployee = null;
    } else if (this.currentStep === 'initial' && this.keepingCurrentEmployee) {
      this.keepingCurrentEmployee = false;
      this.sameEmployeeSelected = false;
    }
  }
  
  // Close modal and reset state
  closeModal() {
    this.keepingCurrentEmployee = false;
    this.sameEmployeeSelected = false;
    this.currentStep = 'initial';
    this.selectedEmployee = null;
    this.assignmentNotes = '';
    this.AssignmentModal.close();
  }
  
  getButtonLabel() {
    if (this.keepingCurrentEmployee) return 'Confirm Assignment';
    switch (this.currentStep) {
      case 'review': return 'Confirm Assignment';
      case 'select': return 'Review Assignment';
      default: return 'Assign Task';
    }
  }
  selectedFilter: string = 'all';
filteredData: any[] = [];

setFilter(filterType: string): void {
  this.selectedFilter = filterType;
  this.applyFilter();
}

private applyFilter(): void {
  if (this.selectedFilter === 'all') {
    // this.filteredData = this.originalData;
  } else {
    // this.filteredData = this.originalData.filter(item => 
    //   item.shipmentType === this.selectedFilter
    // );
  }
}
pickupDateForPF: any
confirmPickupTime() {
  if (!this.pickupDateForPF || !this.fromTime || !this.toTime) {
    this.coloredToast('warning','Please select date and time slots.');
    return;
  }

  this.fromDateTime = `${this.pickupDateForPF}T${this.fromTime}:00`;
  this.toDateTime = `${this.pickupDateForPF}T${this.toTime}:00`;

  console.log("From DateTime:", this.fromDateTime);
  console.log("To DateTime:", this.toDateTime);

  this.assignToParcelForceForPickup();
  this.pickupDateTimeModal.close();
}
assignToParcelForceForPickup() {
  this.isAssignBranchIsProcessing = true; // Start loading

  this.totalReceivedData[0].fromDateTime = this.fromDateTime;
  this.totalReceivedData[0].toDateTime = this.toDateTime;
  this.totalReceivedData[0].total_pcs=this.totalPcsOfInvoice;

  this.serviceNew.AssignToParcelForce(this.totalReceivedData[0]).subscribe(
    (response: any) => {
      console.log(response);

      if (response && response.data && response.data.Alerts && response.data.Alerts.Alert) {
        let alerts = response.data.Alerts.Alert;
        alerts = Array.isArray(alerts) ? alerts : [alerts];

        alerts.forEach((alert: any) => {
          if (alert.Type === "ERROR") {
            this.coloredToast('warning',alert.Message);
          } else if (alert.Type === "WARNING") {
            this.coloredToast('warning',alert.Message);
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
        
        this.assignForm.get('coloaderName')?.setValue('Parcel Force');

        // Assign ShipmentNumber to each index of totalReceivedData
        this.totalReceivedData.forEach((item, index) => {
          this.totalReceivedData[index].parcelNumbers = shipmentNumber;
        });
        this.assignForm.get('local_trasfer')?.setValue(shipmentNumber)

        this.coloredToast('success',"Shipment assigned successfully!");
        console.log("Updated totalReceivedData:", this.totalReceivedData);

        this.assignToBranch();
      } else {
        this.coloredToast('warning',"ShipmentNumber not found in response!");
      }

      this.isAssignBranchIsProcessing = false; // Stop loading
    },
    (error: any) => {
      this.isAssignBranchIsProcessing = false; // Stop loading
      console.error("API Error:", error);
      this.coloredToast('warning',"Failed to assign shipment. Please try again!");
    }
  );
}


exportToExcel() {
  this.mainGrid.excelExport();
}

exportToPdf() {
  this.mainGrid.pdfExport();
}
ToogledToolBar(args: any) {
  switch (args.item.text) {
    case 'PDF Export':
      this.mainGrid?.pdfExport({
        fileName: 'Custom_File_Name.pdf',
        pageOrientation: 'Landscape'
      });
      break;
    case 'Excel Export':
      this.mainGrid?.excelExport({ fileName: 'CustomerBooking.xlsx' });
      break;
    case 'CSV Export':
      this.mainGrid?.csvExport({ fileName: 'Custom_File_Name.csv' });
      break;
    case 'Print':
      this.mainGrid?.print();
      break;
    case 'Add':
      console.log('Add button clicked');
      this.mainGrid?.addRecord();
      break;
    default:
      console.log('No matching toolbar action found:', args.item.text);
  }
}
ToogledToolBar1(args: any) {
  switch (args.item.text) {
    case 'PDF Export':
      this.grid?.pdfExport({
        fileName: 'Custom_File_Name.pdf',
        pageOrientation: 'Landscape'
      });
      break;
    case 'Excel Export':
      this.grid?.excelExport({ fileName: 'CustomerBooking.xlsx' });
      break;
    case 'CSV Export':
      this.grid?.csvExport({ fileName: 'Custom_File_Name.csv' });
      break;
    case 'Print':
      this.grid?.print();
      break;
    case 'Add':
      console.log('Add button clicked');
      this.grid?.addRecord();
      break;
    default:
      console.log('No matching toolbar action found:', args.item.text);
  }
}

ToogledToolBar2(args: any) {
  switch (args.item.text) {
    case 'PDF Export':
      this.grid1?.pdfExport({
        fileName: 'Custom_File_Name.pdf',
        pageOrientation: 'Landscape'
      });
      break;
    case 'Excel Export':
      this.grid1?.excelExport({ fileName: 'CustomerBooking.xlsx' });
      break;
    case 'CSV Export':
      this.grid1?.csvExport({ fileName: 'Custom_File_Name.csv' });
      break;
    case 'Print':
      this.grid1?.print();
      break;
    case 'Add':
      console.log('Add button clicked');
      this.grid1?.addRecord();
      break;
    default:
      console.log('No matching toolbar action found:', args.item.text);
  }
}

public indexValueAccessor(args: any): number {
  // Returns row index + 1 (to start from 1 instead of 0)
  return args.rowIndex + 1;
}
@ViewChild('mainGrid') public mainGrid!: GridComponent ;
@ViewChild('grid') public grid!: GridComponent;
@ViewChild('grid1') public grid1!: GridComponent;

entryMethod: 'api' | 'manual' | null = null;
manualReference: string = '';
resetEntryMethod() {
  this.entryMethod = null;
  this.manualReference = '';
  this.assignForm.get('coLoder')?.setValue(null)
  this.assignForm.get('local_trasfer')?.setValue(null)
  this.assignForm.get('ship_ref_no')?.setValue(null)
  // this.assignForm1.reset({ coLoder: '-1' });
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
allTaskDataBasedOnHawb: any[] = [];

viewAssignedTask(data: any) {
  console.log(data);
  this.serviceNew.v1_SP_ds_Pickup_order_history_list(data.invoice_no).subscribe(
    (d: any) => {
      if (d && d['data']) {
        this.allTaskDataBasedOnHawb = d['data'];
        // this.TaskAssignmentViewnew.open()
      } else {
        this.allTaskDataBasedOnHawb = [];
      }
    },
    (error: any) => {
      console.error("Error fetching data:", error);
      this.allTaskDataBasedOnHawb = [];
    }
  );
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
    invoice_no: this.selectedData['invoice_no'],
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


verifyColoaderPickup(data: { invoice_no: any; }, sts: string, type: string) {
  let actionText = sts === '1' ? 'Assign' : 'Redo';

  let message = '';
  if (type === 'call') {
    message = `Are you sure you want to ${actionText} the call status?`;
  } else if (type === 'pickup') {
    message = `Are you sure you want to ${actionText} the collection pickup?`;
  }
  Swal.fire({
    icon: 'warning',
    title: 'Are you sure?',
    text: 'Customer Contact Confirmation For HAWB NO. '+this.selectedData['invoice_no'],
    showCancelButton: true,
    confirmButtonText: 'COnform',
    padding: '2em',
    customClass: 'sweet-alerts',
}).then((result) => {
  if (result.value) {
    const d = {
      hawb_no: data.invoice_no,
      status: sts,
      created_by: this.userdetails.v_user_id,
      type: type
    };

    this.serviceNew.v1_SP_ds_Pickup_order_status_update(d).subscribe({
      next: (response: any) => {
        console.log(`${type === 'call' ? 'Call' : 'Pickup'} status updated successfully`, response);
        this.coloredToast('success',`${type === 'call' ? 'Call' : 'Pickup'} status ${actionText.toLowerCase()}ed successfully`);
        this.get_Pickup_allocatedListByCoLoader('1', '4');
      },
      error: (error: any) => {
        console.error(`Error updating ${type === 'call' ? 'call' : 'pickup'} status`, error);
        this.coloredToast('warning',`Failed to ${actionText.toLowerCase()} ${type === 'call' ? 'call' : 'pickup'} status. Please try again.`);
      }
    });
  }})
 
  
}



verifyCallStsCheck(data:any){
  // this.viewmanifest.open()

if(data.contact_status == 'N'){
  this.coloredToast('warning',"Please verify the call confirmation before collecting the shipment.");
}else{
  this.viewmanifest.open()
}
}
updateCollectionType() {
  if (!this.selectedData || !this.selectedData['invoice_no']) {
    this.coloredToast('warning',"Invoice number is missing");
    return;
  }

  const d = {
    hawb_no: this.selectedData['invoice_no'],
    collection_type: ''
  };

  if (this.dispatchType === 'pickup') {
    if (!this.newCollectionType) {
      this.coloredToast('warning',"Please select a valid collection type for pickup");
      return;
    }
    d.collection_type = this.newCollectionType;
  } else if (this.dispatchType === 'dropoff') {
    d.collection_type = 'Drop_At_Warehouse';
  } else {
    this.coloredToast('warning',"Please select a valid dispatch type");
    return;
  }
  Swal.fire({
    icon: 'warning',
    title: 'Are you sure?',
    text:'Are you sure Has To Update The Collection Type To '+d.collection_type+' ?',
    showCancelButton: true,
    confirmButtonText: 'COnform',
    padding: '2em',
    customClass: 'sweet-alerts',
}).then((result) => {
  if (result.value) {
 
            this.serviceNew.v1_sp_ds_pickup_order_collection_type_Update(d).subscribe({
              next: (r: any) => {
                this.coloredToast('success',"Collection type updated successfully");
                this.collectionTypeChangeModel.close()
                this.getHawbListAssignedLoad();
              },
              error: (err: any) => {
                this.coloredToast('warning',"Failed to update collection type");
                console.error("Error updating collection type:", err);
              }
            });
          }
  });

}
v1_sp_ds_pickup_order_update_collection_ref() {
  if (String(this.DpdCollectionRefNo).trim().length < 12) {
    this.coloredToast('warning',"Please enter Collection Number for DPD to update");
    return;
  }

  const value = {
    hawn_no: this.selectedData['invoice_no'],
    ref: this.DpdCollectionRefNo
  };

  this.serviceNew.v1_sp_ds_pickup_order_update_collection_ref(value).subscribe({
    next: (res: any) => {
      if (res && res['code']==200) {
        this.Refresh()
        this.coloredToast('success',"Collection Reference updated successfully");
      } else {
        this.coloredToast('warning',"Failed to update Collection Reference");
      }
    },
    error: (err: any) => {
      console.error("Error updating Collection Reference", err);
      this.coloredToast('warning',"An error occurred while updating Collection Reference");
    }
  });
}
onActionBegin(args: any) {

  if (args.requestType === 'searching' && args.searchString) {
    let searchText = args.searchString.trim();
    let pattern = /^(aa|AA|aA|Aa)\d{4}$/;

    if (searchText.length === 6 && pattern.test(searchText)) {
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
        let isFound = filteredData.some(item => item.invoice_no == String(searchText).toUpperCase());

        if (!isFound) {
          console.log("No records found for:", searchText);
          this.callApi(searchText)
          // const emptyRow = document.querySelector('tr.e-emptyrow td.e-lastrowcell');
          // if (emptyRow) {
          //   emptyRow.textContent = 'No records available...';
          // }
          
        } else {
          console.log("Records found for:", searchText);
        }
      }, 500);
    }
  }
}

callApi(searchText: any) {
  this.serviceNew.v1_SP_ds_invoice_current_status_get(searchText).subscribe((r: any) => {
    const emptyRow = document.querySelector('tr.e-emptyrow td.e-lastrowcell');
    if (true) {
      if (r['code'] == 200 && r['data'].length > 0 ) {
        Swal.fire(
          'Shipment Found',
          `The current shipment status is: <span class="badge bg-danger">${r['data'][0]['status']}</span>`,
          'error' // alert icon
        );
      } else {
        Swal.fire(
          'Shipment Status Not Found',
          'The current shipment status could not be found for this shipment.',
          'error'
        );
      }
    }
  });
}

UpdateSts(){
  if(this.pickupShipemnts.length>0){
  const DpdFilter=  this.pickupShipemnts.filter(d => d['transporter_name'] == 'DPD' && (d['co_loader_tracking_no'] != '' || null));
  if(DpdFilter.length>0){
    this.serviceNew.multipleTractingStsUpdate(DpdFilter).subscribe((r:any)=>{
      this.get_Pickup_allocatedListByCoLoader('1','4')

    })
  }else{
    this.coloredToast('warning',"No Dpd Shipments Found")
  }
  }
}
message: string=''
sendMessage() {

  this.message = '';
}
showContextMenu: boolean = false;
contextMenuPosition = { x: 0, y: 0 };
selectedMessage: any = null;

openContextMenu(event: MouseEvent, message: any) {
  event.preventDefault(); // prevent the browser's default context menu
  this.contextMenuPosition.x = event.clientX;
  this.contextMenuPosition.y = event.clientY;
  this.selectedMessage = message;
  this.showContextMenu = true;
}
copyMessage(message: any) {
  const textToCopy = message.notes || '';

  // Create a temporary textarea element to hold the text to copy
  const textArea = document.createElement('textarea');
  textArea.value = textToCopy;
  document.body.appendChild(textArea);

  // Select the text inside the textarea
  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length); // For mobile devices

  // Execute the copy command
  const successful = document.execCommand('copy');
  
  if (successful) {
    console.log('Copied to clipboard');
  } else {
    console.error('Failed to copy to clipboard');
  }

  // Clean up by removing the textarea
  document.body.removeChild(textArea);

  // Close the context menu if necessary
  this.showContextMenu = false;
}

tab8: string = 'home';


onQueryCellInfo(args: any): void {
  // Check if the column is one you want to modify
  if (args.column.field === 'ColumnName') {
    args.cell.style.backgroundColor = '#ed260fff'; // Set your color here
  }
}

deleteMessage(message: any) {
  // Your delete logic here, maybe emit an event or call API
  console.log('Deleting message:', message);
  this.NotesReceivedForInvoice = this.NotesReceivedForInvoice.filter(m => m !== message);
  this.showContextMenu = false;
}

@HostListener('document:click')
onDocumentClick() {
  this.showContextMenu = false;
}
pdf_data:any;
DownloadLabel(inv_no:any){
    // this.Save_spin='1'
    this.service.get_printnew(inv_no,"label_barcode",'1',this.totalReceivedData.length).subscribe(data=>{
      this.pdf_data=data['data']
      window.open(data.file_url)
      // this.Save_spin='2'
    })
  
}
DownloadLabelForCollection(data: any) {
  this.serviceNew.DownloadLabel('').subscribe((response: string) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(response); // it's already HTML, no JSON.stringify!
      printWindow.document.write(`
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      `);
      printWindow.document.close();
    }
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
  async showAlert(message:string ,) {
    Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: message,
        showCancelButton: true,
        confirmButtonText: 'COnform',
        padding: '2em',
        customClass: 'sweet-alerts',
    }).then((result) => {
        if (result.value) {
            Swal.fire({ title: 'Deleted!', text: 'Your file has been deleted.', icon: 'success', customClass: 'sweet-alerts' });
        }
    });
}

codeArr: any = [];
toggleCode = (name: string) => {
    if (this.codeArr.includes(name)) {
        this.codeArr = this.codeArr.filter((d: string) => d != name);
    } else {
        this.codeArr.push(name);
    }
};
dropdownOpen: boolean = false;

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}
navigateShipment(data){
 this.router.navigate(['/customer/Edit'], {
      queryParams: { data: encodeURIComponent(JSON.stringify(data)) }
    });
}
}
