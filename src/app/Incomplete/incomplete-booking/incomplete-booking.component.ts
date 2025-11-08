import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterSettingsModel, GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { AwbService } from 'src/app/cfServices/awb.service';
import { ChatService } from 'src/app/cfServices/chat-service.service';
import { NewApiCloudService } from 'src/app/cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-incomplete-booking',
  templateUrl: './incomplete-booking.component.html',
  styleUrls: ['./incomplete-booking.component.css']
})
export class IncompleteBookingComponent implements OnInit {

    @ViewChild('addNotes') addNotes: any

  private inactivitySubscription!: Subscription;
  @ViewChild('mainGrid') public mainGrid: GridComponent;
  public toolbarOptions: ToolbarItems[] = [ 'Search'];
  public filterSettings: Object;
      public toolbar: string[];
      public editSettings: Object;
  private apiSubscription!: Subscription;
  private inactivityTime = 10000; // 10 seconds
  filterTaskName:FilterSettingsModel ={type:'Excel'}
  userdetails: any;

  constructor(public _chat: ChatService,public service: AwbService,public fb: FormBuilder, private router: Router, private datep: DatePipe, private serviceNew: NewApiCloudService,
        private route: ActivatedRoute) {
    const currentUrl = this.router.url;
 this._chat.onMessageBySource('Thanks_For_Visit').subscribe((msg) => {
    if(currentUrl=='/incompleBooking'){
      this.v1_ds_pickup_order_incomplete_get_list_noLoad();

    }
      
    });

         }

  ngOnInit() {
        this.userdetails = JSON.parse(localStorage.getItem("log_data"))

    
    this.getHawbListAssignedLoad();

    this.toolbarOptions = ['Search'];
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;
    this.filterSettings = { ignoreAccent:true ,hierarchyMode:'None', type: 'Excel' };

    // const userActivity$ = merge(
    //   fromEvent(document, 'mousemove'),
    //   fromEvent(document, 'keydown'),
    //   fromEvent(document, 'click')
    // );

    // this.inactivitySubscription = userActivity$
    // .pipe(
    //   debounceTime(1000), // Wait for 1 second to avoid multiple triggers
    //   startWith(null), // Start immediately
    //   switchMap(() => interval(this.inactivityTime)) // Restart interval on activity
    // )
    // .subscribe(() => {
    //   this.getHawbListAssigned();
    
    // });
  }
  filteredRowAssignList
  AssignList
  getHawbListAssigned() {
    // this.isLoading = true;
    
    // Prepare filter parameters:
    this.serviceNew.v1_ds_pickup_order_incomplete_get_listLoad().subscribe(data => {
        this.AssignList = data['data'];
        this.filteredRowAssignList = data['data'].map(d=>({
          ...d,sender_mobile:d['s_phn_cnrty_code']+String(d['sender_mobile']),receiver_mobile:String(d['r_phn_cnrty_code'])+String(d['receiver_mobile'])
        }))
       
      });
  }

 updateContact(gotInput) {
  Swal.fire({
    title: 'Customer Contact Confirmation For HAWB NO. ' + gotInput['token_id'],
    text: 'Have you contacted the customer?',
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const ContactDetails = {
        _h: gotInput['token_id'],
        updated_by: this.userdetails.v_user_id
      };
      this.serviceNew.v1_ds_pickup_order_incomplete_call_status_update(ContactDetails).subscribe(
        (data) => {
          if (data['code']) {
            this.getHawbListAssignedLoad();
            Swal.fire('Success', 'Status updated successfully!', 'success');
          } else {
            Swal.fire('Error', 'Failed to update status.', 'error');
          }
        },
        (error) => {
          Swal.fire('Error', 'An error occurred. Please try again.', 'error');
          console.error('Error updating status:', error);
        }
      );
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
  getHawbListAssignedLoad() {
    // this.isLoading = true;
    
    // Prepare filter parameters
    this.serviceNew.v1_ds_pickup_order_incomplete_get_list().subscribe(data => {
        this.AssignList = data['data'];
        this.filteredRowAssignList = data['data'].map(d=>({
          ...d,sender_mobile:d['s_phn_cnrty_code']+String(d['sender_mobile']),receiver_mobile:String(d['r_phn_cnrty_code'])+String(d['receiver_mobile'])
        }))       
      });
  }
  v1_ds_pickup_order_incomplete_get_list_noLoad(){
     
    // Prepare filter parameters
    this.serviceNew.v1_ds_pickup_order_incomplete_get_list_noLoad().subscribe(data => {
        this.AssignList = data['data'];
        this.filteredRowAssignList = data['data'].map(d=>({
          ...d,sender_mobile:d['s_phn_cnrty_code']+String(d['sender_mobile']),receiver_mobile:String(d['r_phn_cnrty_code'])+String(d['receiver_mobile'])
        }))       
      });
  }
  ngOnDestroy() {
    if (this.inactivitySubscription) this.inactivitySubscription.unsubscribe();
    if (this.apiSubscription) this.apiSubscription.unsubscribe();
  }
  ToogledToolBar(args: any) {
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
  selectedDetails:any
    callNotesFile(data) {
      console.log(data)
      const payload = {
        invoice_no:data.token_id
      }
    data.invoice_no = data.hawb_no
    this.selectedDetails = data
    this.serviceNew.sendChatData(payload)
    this.addNotes.open()
  }

}
