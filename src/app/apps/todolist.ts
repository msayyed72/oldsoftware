import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from 'angular-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewApiCloudService } from '../cfServices/new-api-cloud.service';
import { AwbService } from '../cfServices/awb.service';
import { ChatService } from '../cfServices/chat-service.service';
@Component({
    selector:'app-todolist',
    moduleId: module.id,
    templateUrl: './todolist.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class TodolistComponent {
    userdetails:any;
    allTasks: any[]=[];
    constructor(public fb: FormBuilder,public serviceNew:NewApiCloudService,public service:AwbService,public _chat:ChatService) {
        var user: any = localStorage.getItem("log_data")
        this.userdetails = JSON.parse(user)
    }
    @ViewChild('addTaskModal') addTaskModal!: ModalComponent;
    @ViewChild('viewTaskModal') viewTaskModal!: ModalComponent;
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

    filteredTasks: any = [];
    pagedTasks: any = [];
    searchTask = '';
    selectedTask: any = this.defaultParams;
    isPriorityMenu: any = null;
    isTagMenu: any = null;

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
    parseCustomDate(dateString: string): Date {
        if (!dateString) return null;
        
        // Split DD-MM-YYYY format
        const [day, month, year] = dateString.split('-');
        return new Date(
          parseInt(year),
          parseInt(month) - 1, // Months are 0-based in JS
          parseInt(day)
        );
      }
    //   allTasks
    getHawbListAssigned(flag) {
        // this.isLoading = true;
        this.service.getPickupNonAllocationList(flag, this.userdetails.v_user_id, 1, 20).subscribe(
          (data: any) => {
            if (data && data.data) {
              const mappedTasks = data.data.map(task => ({
                ...task,
                status: task.task_status === 'n' ? 'important' : 'complete',
                created_date: this.parseCustomDate(task.created_date),
                completed_time: task.completed_time ? new Date(task.completed_time) : null
              }));
      
              this.allTasks = mappedTasks;  // <-- First, assign it.
              console.log(this.allTasks)
              this.searchTasks();           // <-- Then, call searchTasks().
            }
      
            // this.isLoading = false;
          },
          (error) => {
            // this.coloredToast('danger','Failed to load tasks', 'Error');
            // this.isLoading = false;
          }
        );
      }
      allTasksTOu: any[]=[]
      getHawbListAssignedTou(flag) {
        // this.isLoading = true;
        this.service.getPickupNonAllocationList(flag, this.userdetails.v_user_id, 1, 20).subscribe(
          (data: any) => {
            if (data && data.data) {
              const mappedTasks = data.data.map(task => ({
                ...task,
                status: 'all',
                created_date: this.parseCustomDate(task.created_date),
                completed_time: task.completed_time ? new Date(task.completed_time) : null
              }));
      
              this.allTasksTOu = mappedTasks;  // <-- First, assign it.
              console.log(this.allTasks)
              this.searchTasks();           // <-- Then, call searchTasks().
            }
      
            // this.isLoading = false;
          },
          (error) => {
            // this.coloredToast('danger','Failed to load tasks', 'Error');
            // this.isLoading = false;
          }
        );
      }
      allTaskByByU:any[]=[]
      getHawbListAssignedByu(flag) {
        // this.isLoading = true;
        this.service.getPickupNonAllocationList(flag, this.userdetails.v_user_id, 1, 20).subscribe(
          (data: any) => {
            if (data && data.data) {
              const mappedTasks = data.data.map(task => ({
                ...task,
                status:'forU',
                created_date: this.parseCustomDate(task.created_date),
                completed_time: task.completed_time ? new Date(task.completed_time) : null
              }));
      
              this.allTaskByByU = mappedTasks;  // <-- First, assign it.
              console.log(this.allTasks)
              this.searchTasks();           // <-- Then, call searchTasks().
            }
      
            // this.isLoading = false;
          },
          (error) => {
            // this.coloredToast('danger','Failed to load tasks', 'Error');
            // this.isLoading = false;
          }
        );
      }
      
    ngOnInit() {
        this.getHawbListAssigned('2');
        this.getHawbListAssignedByu('4')
        this.getHawbListAssignedTou('3')

    }

    initForm() {
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
        console.log(this.selectedTab)
        if (isResetPage) {
            this.pager.currentPage = 1;
        }
        let res;
        if (this.selectedTab === 'complete' || this.selectedTab === 'important' || this.selectedTab === 'trash') {
            res = this.allTasks.filter((d) => d.status === this.selectedTab);
        }else if(this.selectedTab === 'all'){
            res = this.allTasksTOu.filter((d) => d.status === this.selectedTab);

        }else if(this.selectedTab === 'forU'){
            res = this.allTaskByByU.filter((d) => d.status === this.selectedTab);

        } else {
            res = this.allTasks.filter((d) => d.status != 'trash');
        }

        // if (this.selectedTab === 'team' || this.selectedTab === 'update') {
        //     res = res.filter((d) => d.tag === this.selectedTab);
        // } else if (this.selectedTab === 'high' || this.selectedTab === 'medium' || this.selectedTab === 'low') {
        //     res = res.filter((d) => d.priority === this.selectedTab);
        // }
        this.filteredTasks = res.filter((d) => d.task_name?.toLowerCase().includes(this.searchTask));
        console.log(this.allTasks)
        console.log(this.filteredTasks);
        console.log(res);
        console.log(this.searchTask)
        console.log('fil')
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
        console.log(this.pagedTasks)

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

    viewTask(item: any = null) {
        this.selectedTask = item;
        setTimeout(() => {
            this.viewTaskModal.open();
        });
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
    markTaskComplete(historyId: any) {
       
      
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            popup: 'sweet-alerts',
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary',
          },
          buttonsStyling: false,
        });
      
        swalWithBootstrapButtons.fire({
          title: 'Task Completion Confirmation',
          text: 'Have you completed the assigned task?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          reverseButtons: true,
          padding: '2em',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            const taskDetails = {
              _d: historyId.history_id,
            };
      
            this.serviceNew.v1_SP_Ds_task_status_update(taskDetails).subscribe(
              (response: any) => {
                if (response && response.code === '200') {
                  this.saveNotes(
                    historyId.invoice_no,
                    "Task Has Been Completed By " + this.userdetails['v_user_name'] + " Task Name:- " + historyId.task_name + ", Task Details:- " + historyId.call_notes
                  );
                  this.getHawbListAssigned('2');
                  this.coloredToast('success',"Task successfully marked as completed.");
                } else {
                  this.coloredToast('danger',"Failed to update task status.");
                }
              },
              (error) => {
                console.error("Error updating task status:", error);
                this.coloredToast('danger',"An error occurred while updating the task status.");
              }
            );
          } else if (result.dismiss === Swal.DismissReason.cancel) {
           this.coloredToast('info',"Task status update cancelled.");
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
      EnteredNotes
      saveNotes(inv_no,EnteredNotes){
        const Notes = {
          invoice_no: inv_no,
          notes: EnteredNotes,
          created_by: this.userdetails.v_user_id,
        };
      
        this.serviceNew.v1_sp_ds_pickup_order_note_insert(Notes).subscribe(
          (data) => {
            // this.NotesForInvoices.hide()
    
            if (data['code'] == 200) {
              // this.coloredToast('success',('Notes inserted successfully.');
              this.EnteredNotes = ''; // Clear input after success
              // this.getHawbListAssigned();
           
                // const msg = {
                //   sender: this.userdetails['v_user_name'],
                //   content: this.EnteredNotes,
                //   timestamp: new Date().toISOString()
                // };
                const msg = { from: 'Dharun', message: 'Hello Server!' };
    
                this._chat.send({ from: 'Angular', message: this.userdetails['v_user_name'] });
                // this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no'])
      
              
    
            } else {
              this.coloredToast('danger','Failed to insert notes. Please try again.');
            }
          },
          (error) => {
            // this.NotesForInvoices.hide()
            this.coloredToast('danger','An error occurred. Please check your connection.');
            console.error('Error inserting notes:', error);
          }
        );
      }
      
}
