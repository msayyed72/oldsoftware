import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from 'angular-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Tagify from '@yaireo/tagify';
import { NewApiCloudService } from '../../../cfServices/new-api-cloud.service';
import { ActivatedRoute } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-send-notification-mail',
  templateUrl: './send-notification-mail.component.html',
  styleUrls: ['./send-notification-mail.component.css'],
   animations: [
          trigger('toggleAnimation', [
              transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
              transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
          ]),
      ],
})
export class SendNotificationMailComponent implements OnInit {
    receivedParamData:any;
    
  constructor(public fb: FormBuilder,public _service:NewApiCloudService,public router:ActivatedRoute) {
     this.router.queryParams.subscribe(params => {
        this.receivedParamData=params
        console.log(params)
  });
  }
    @ViewChild('addTaskModal') addTaskModal!: ModalComponent;
    @ViewChild('viewTaskModal') viewTaskModal!: ModalComponent;
      @ViewChild('hawbInput') hawbInputRef!: ElementRef;

      tagify!: Tagify;

    defaultParams = {
        id: null,
        title: '',
        description: '',
        descriptionText: '',
        assignee: '',
        path: '',
        tag: '',
        priority: 'low',
    };

    selectedTab = '';
    isShowTaskMenu = false;

    params!: FormGroup;
    allTasks = [
      
     
       
    ];
    filteredTasks: any = [];
    pagedTasks: any = [];
    searchTask = '';
    selectedTask: any = this.defaultParams;
    isPriorityMenu: any = null;
    isTagMenu: any = null;
filterForm:FormGroup;
    pager = {
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        startIndex: 0,
        endIndex: 0,
    };

    editorOptions = {
        toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
    };
filterSettings:any;
    ngOnInit() {
            this.filterSettings = { ignoreAccent: true, hierarchyMode: 'None', type: 'Excel' };

        this.searchTasks();
        this.initForm()
    const input = document.querySelector('#tags') as HTMLInputElement;
 const tagifyInstance = new Tagify(input, {
      delimiters: ',|\n',  // Use comma or newline to separate tags
    });
      tagifyInstance.on('add', () => this.updateFormValues(tagifyInstance));
    tagifyInstance.on('remove', () => this.updateFormValues(tagifyInstance));
     tagifyInstance.on('input', () => this.updateFormValues(tagifyInstance));
  tagifyInstance.on('change', () => this.updateFormValues(tagifyInstance));
    this.updateFormValues(tagifyInstance);


}
GetStateNames:any=[]
getStateNames(){
    this._service.getStateNames('IN').subscribe(r=>{
        this.GetStateNames = r['data']
    })
}
  updateFormValues(tagifyInstance: any): void {
    const tags = tagifyInstance.value.map((tag: any) => tag.value);

    // Patch form with updated tag values
    this.filterForm.patchValue({
      hawbNo: tags.join(','),  // Join tags with newline for storage
      hawbNos: tags            // Store tags as an array for backend processing
    });

    // Optionally update a count (if needed)
    // this.hawbCount = tags.length;
  }

    initForm() {
          this.filterForm = this.fb.group({
      type: [''],         // For hawb_no
      hawbNo: [null],         // For hawb_no
      hawbNos: [null],         // For hawb_no
      fromDate: [null],       // For from_date
      toDate: [null],         // For to_date
      ptpMfNo: [null],        // For ptp_mf_no
      stateName: [null],      // For state_name
      pincode: [null]         // For pincode
    });
        this.params = this.fb.group({
            id: [null],
            title: ['', Validators.required],
            description: [''],
            descriptionText: [''],
            assignee: [''],
            path: [''],
            tag: [''],
            priority: ['low'],
        });
    }

    searchTasks(isResetPage = true) {
        if (isResetPage) {
            this.pager.currentPage = 1;
        }
        let res = this.allTasks;
        // if (this.selectedTab === 'complete' || this.selectedTab === 'important' || this.selectedTab === 'trash') {
        //     res = this.allTasks.filter((d) => d.status === this.selectedTab);
        // } else {
        //     res = this.allTasks.filter((d) => d.status != 'trash');
        // }

        // if (this.selectedTab === 'team' || this.selectedTab === 'update') {
        //     res = res.filter((d) => d.tag === this.selectedTab);
        // } else if (this.selectedTab === 'high' || this.selectedTab === 'medium' || this.selectedTab === 'low') {
        //     res = res.filter((d) => d.priority === this.selectedTab);
        // }
        this.filteredTasks = res.filter((d) => d.hawb_no?.toLowerCase().includes(this.searchTask));
        this.getPager();
    }

    getPager() {
        setTimeout(() => {
            if (this.filteredTasks.length) {
                this.pager.totalPages = this.pager.pageSize < 1 ? 1 : Math.ceil(this.filteredTasks.length / this.pager.pageSize);
                if (this.pager.currentPage > this.pager.totalPages) {
                    this.pager.currentPage = 1;
                }
                this.pager.startIndex = (this.pager.currentPage - 1) * this.pager.pageSize;
                this.pager.endIndex = Math.min(this.pager.startIndex + this.pager.pageSize - 1, this.filteredTasks.length - 1);
                this.pagedTasks = this.filteredTasks.slice(this.pager.startIndex, this.pager.endIndex + 1);
            } else {
                this.pagedTasks = [];
                this.pager.startIndex = -1;
                this.pager.endIndex = -1;
            }
        });
    }

    setPriority(task: any, name: string = '') {
        let item = this.filteredTasks.find((d: { id: any }) => d.id === task.id);
        item.priority = name;
        this.searchTasks(false);
    }

    setTag(task: any, name: string = '') {
        let item = this.filteredTasks.find((d: { id: any }) => d.id === task.id);
        item.tag = name;
        this.searchTasks(false);
    }

    tabChanged(type: any = null) {
        this.selectedTab = type;
        this.searchTasks();
        this.isShowTaskMenu = false;
    }

    taskComplete(task: any = null) {
        let item = this.filteredTasks.find((d: { id: any }) => d.id === task.id);
        item.status = item.status === 'complete' ? '' : 'complete';
        this.searchTasks(false);
    }

    setImportant(task: any = null) {
        let item = this.filteredTasks.find((d: { id: any }) => d.id === task.id);
        item.status = item.status === 'important' ? '' : 'important';
        this.searchTasks(false);
    }

  
onRowSelected(args: any) {
  // Ignore if the checkbox itself was clicked
  const target = args?.target as HTMLElement;
  if (target && (target.classList.contains('e-checkbox-wrapper') || target.classList.contains('e-check'))) {
    return; // checkbox click -> do nothing
  }

  const data = args.data;
  if (data?.hawb_no) {
    this.selectedTask = data;
    setTimeout(() => {
      this.viewTaskModal.open();
    });
  }
}


    addEditTask(task: any = null) {
        this.isShowTaskMenu = false;

        this.addTaskModal.open();
        this.initForm();

        if (task) {
            this.params.setValue({
                id: task.id,
                title: task.title,
                description: task.description,
                descriptionText: task.descriptionText,
                assignee: task.assignee,
                path: task.path,
                tag: task.tag,
                priority: task.priority,
            });
        }
    }

    deleteTask(task: any, type: string = '') {
        if (type === 'delete') {
            let currtask = this.allTasks.find((d: any) => d.id === task.id);
            currtask!.status = 'trash';
        }
        if (type === 'deletePermanent') {
            this.allTasks = this.allTasks.filter((d: any) => d.id != task.id);
        } else if (type === 'restore') {
            let currtask = this.allTasks.find((d: any) => d.id === task.id);
            currtask!.status = '';
        }
        this.searchTasks(false);
    }

    saveTask() {
        if (!this.params.value.title) {
            this.showMessage('Title is required.', 'error');
            return;
        }

        if (this.params.value.id) {
            //update task
            this.allTasks = this.allTasks.map((d: any) => {
                if (d.id === this.params.value.id) {
                    d = {...d, ...this.params.value};
                    d.descriptionText = this.params.value.descriptionText; //this.quillEditorObj.getText();
                }
                return d;
            });
            this.searchTasks();
        } else {
            //add task
            const maxid = this.allTasks.length ? this.allTasks.reduce((max, obj) => (obj.id > max ? obj.id : max), this.allTasks[0].id) : 0;

            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth());
            const yyyy = today.getFullYear();
            const monthNames: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            let task = this.params.value;
            task.id = maxid + 1;
            task.descriptionText = this.params.value.descriptionText; //this.quillEditorObj.getText();
            task.date = monthNames[mm] + ', ' + dd + ' ' + yyyy;

            this.allTasks.splice(0, 0, task);
            this.searchTasks();
        }

        this.showMessage('Task has been saved successfully.');
        this.addTaskModal.close();
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

    setDiscriptionText(event: any) {
        this.params.patchValue({ descriptionText: event.text });
    }

    getTasksLength(type: string) {
        return this.allTasks.filter((task) => task.status == type).length;
    }

    getSelectedType(type:string){
       this.filterForm.patchValue({
    hawbNo: null,          // For hawb_no
    hawbNos: null,         // For hawb_nos
    fromDate: null,        // For from_date
    toDate: null,          // For to_date
    ptpMfNo: null,         // For ptp_mf_no
    stateName: null,       // For state_name
    pincode: null          // For pincode
});
const current=new Date().toISOString().split('T')[0]
        switch(type){
            case '1':
            this.filterForm.get('fromDate').setValue(-1)
            this.filterForm.get('toDate').setValue(-1)
            this.filterForm.get('pincode').setValue(-1)
            this.filterForm.get('stateName').setValue(-1)
            this.filterForm.get('hawbNo').setValue(-1)
            return; 
            case '2':
                 this.filterForm.get('fromDate').setValue(-1)
            this.filterForm.get('toDate').setValue(-1)
            this.filterForm.get('pincode').setValue(-1)
            this.filterForm.get('stateName').setValue(-1)
            this.filterForm.get('ptpMfNo').setValue(-1)
            return; 
             case '3':
                this.getStateNames()
                 this.filterForm.get('fromDate').setValue(current)
            this.filterForm.get('toDate').setValue(current)
            this.filterForm.get('pincode').setValue(-1)
            this.filterForm.get('hawbNo').setValue(-1)
            this.filterForm.get('ptpMfNo').setValue(-1)
            return; 
             case '4':
                 this.filterForm.get('fromDate').setValue(current)
            this.filterForm.get('toDate').setValue(current)
            this.filterForm.get('ptpMfNo').setValue(-1)
            this.filterForm.get('stateName').setValue(-1)
            this.filterForm.get('hawbNo').setValue(-1)
            return; 
            default:
                 this.filterForm.get('fromDate').setValue(-1)
            this.filterForm.get('toDate').setValue(-1)
            this.filterForm.get('pincode').setValue(-1)
            this.filterForm.get('stateName').setValue(-1)
            this.filterForm.get('hawbNo').setValue(-1)
            this.filterForm.get('ptpMfNo').setValue(-1)
            
            break;

            
        }
    }
onRowDataBound(args: any) {
  if (args.data.status === 'complete') {
    args.row.classList.add('bg-white-light');
  }
}

fetchMailSenfingData=[]
    fetchDate(){
        this._service.v1_sp_ds_global_mail_get_based_on_filters(this.filterForm.value).subscribe(r=>{
            if(r?.data?.length >0){
           this.fetchMailSenfingData = r['data'].map(r => {

            r['Payment_status'] = r['Payment_status'] == 'yes' ? 'PAID' : r['Payment_status'] =='no' ? 'NOT PAID' : r['Payment_status'] == 'npd' ? 'NPD' : 'NOT PAID'
  const templateSubject = (this.receivedParamData['mail_template_subject'] || '')
    .replaceAll('[hawb_no]', r['hawb_no'] || '')
    .replaceAll('[sender_name]', r['Sender_name'] || '')
    .replaceAll('[receiver_name]', r['Receiver_no'] || '')
    .replaceAll('[booking_done_person_name]', r['sign_up_customer_name'] || '');

  const templateBody = (this.receivedParamData['mail_template_body'] || '')
    .replaceAll('[hawb_no]', r['hawb_no'] || '')
    .replaceAll('[sender_name]', r['Sender_name'] || '')
    .replaceAll('[receiver_name]', r['Receiver_no'] || '')
    .replaceAll('[booking_done_person_name]', r['sign_up_customer_name'] || '');

  const templateBodyClean = templateBody.replace(/<[^>]*>/g, '');

  // Collect and dedupe emails
  const uniqueMails = Array.from(
    new Set(
      [r.sender_mail, r.sign_up_customer_mail, r.receiver_mail]
        .filter(m => m && m.trim() !== '')
    )
  );

  return {
    ...r,
    templateSubject,
    templateBody,
    templateBodyClean,
    mails: uniqueMails   // 👈 final deduped emails
  };
});

            this.allTasks=this.fetchMailSenfingData;
            this.searchTasks();

            }
        }) 
    }
 SendMailToCustomers() {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to send emails to selected customers?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, send it!',
    cancelButtonText: 'No, cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(this.pagedTasks);
    const selectedRecords = this.filterTableGrid.getSelectedRecords();
console.log(selectedRecords)
      this._service.send_bulk_emails_to_customer_for_notifications(selectedRecords).subscribe({
        next: (r: any) => {
          Swal.fire({
            title: 'Success!',
            text: 'Emails sent successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error: (err: any) => {
          Swal.fire({
            title: 'Failed!',
            text: 'Something went wrong while sending emails.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Cancelled',
        text: 'Emails were not sent',
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
  });
}
@ViewChild('filterTableGrid') filterTableGrid:GridComponent;
}
