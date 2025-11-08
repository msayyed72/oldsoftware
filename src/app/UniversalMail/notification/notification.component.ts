import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'angular-custom-modal';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';
import { AwbService } from '../../cfServices/awb.service';
import { MasterService } from '../../services/master-service.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

    valForm: FormGroup;
        params!: FormGroup;

@ViewChild('SendCollectionMAil') SendCollectionMAil:any;
@ViewChild('SendCollectionMAilnew') SendCollectionMAilnew:any;

  constructor(public fb: FormBuilder,public serviceNew:NewApiCloudService,private bill_ser: AwbService,private service:MasterService,) {
     this.valForm = fb.group({
            'name': [null, Validators.required],
            'mail': [null, Validators.email],
            'country_code':['+44',Validators.required],
            'contact': [null, Validators.required],
            'location': [null, Validators.required],
            'user_id': [null, Validators.required]
          })
  }
  InitialCapitalize(data) {
    if (!data) return data; // Handle null, undefined, or empty string

    let value= data
        .split(' ') // Split string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join(' '); // Join words back into a string
  this.valForm.get('name').setValue(value); // Set the converted value back to the form control

}
  editorOptions = {
        toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
    };
    quillEditorReady(event: any) {
    // Get the HTML content from the editor
    const htmlContent = event.html;

    // Replace all single and double quotes with two single quotes
    const updatedHtmlContent = htmlContent.replace(/['"]/g, "''");

    // Now, set this HTML content to the form value
    this.params.patchValue({ displayDescription: updatedHtmlContent });
}

 initForm() {
        this.params = this.fb.group({
            id: [null],
            selected: false,
            from: ['vristo@mail.com'],
            to: ['', Validators.required],
            cc: [''],
            title: ['', Validators.required],
            file: [[]],
            description: [''],
            displayDescription: [''],
            template_name:[''],
            template_subject:[''],
            created_by:['']
        });
    }
    ngOnInit() {
      
        this.user_data= JSON.parse(localStorage.getItem("log_data"))
    this.user_id=this.user_data.v_user_id;
    this.valForm.controls['user_id'].setValue(this.user_id)
            this.initForm()

 
        this.v1_sp_ds_global_mail_get()
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
      name:any
  mail:any
  contact:any
  location:any
  user_id: any;
  user_data: any;
  enquiryList: any;
  // valForm: FormGroup;
  btn3=false
employees:any;
fromDate=new Date().toISOString().split('T')[0];
toDate=new Date().toISOString().split('T')[0];


 
  
  sendMail(data)
  {
    this.serviceNew.sendSalesQuotationToCust (data.shipper_name,data.email,data.employee_name).subscribe(res=>{
      this.showMessage("Mail Send Successfully")
    },(error=>{
            this.showMessage("Failed",'error')

    })
    )
  }

emailContent:any;
CreateTemplate(){
  const payload={
    template_name:this.params.value.template_name,
    template_subject:this.params.value.template_subject,
    template_body:this.params.value.displayDescription,
    created_by:this.user_id
  }
  this.serviceNew.v1_sp_ds_global_mail_insert(payload).subscribe(r=>{
    if(r['code']){
      this.showMessage('Template Created Successfully');
      this.v1_sp_ds_global_mail_get();
      this.SendCollectionMAil.close()
            this.params.reset()

    }else{
            this.showMessage('Template Creation Failed','danger')

    }
  })
}
UpdateTemplate(){
  const payload={
    mail_template_id:this.params.value.id,
    template_name:this.params.value.template_name,
    template_subject:this.params.value.template_subject,
    template_body:this.params.value.displayDescription,
    created_by:this.user_id
  }
  this.serviceNew.v1_sp_ds_global_mail_update(payload).subscribe(r=>{
    if(r['code']){
      this.showMessage('Template Created Successfully');
      this.v1_sp_ds_global_mail_get();
      this.SendCollectionMAilNew.close()
      this.params.reset()
    }else{
            this.showMessage('Template Creation Failed','danger')

    }
  })
}
generatedTemplates=[]
v1_sp_ds_global_mail_get(){
  this.serviceNew.v1_sp_ds_global_mail_get(-1).subscribe(r=>{
    this.generatedTemplates=r?.['data']
  })
}
EditTemplate(data){
  this.params.patchValue({
    id:data?.mail_template_id,
    template_name:data?.mail_template_name,
    template_subject:data?.mail_template_subject,
    description:data?.mail_template_body,
    displayDescription:data?.mail_template_body,
created_by:this.user_id
  })
  this.SendCollectionMAilNew.open()
}
 truncateText(text: string): string {
    // Check if text exists and split by lines
    if (text) {
      const firstLine = text.split('\n')[0]; // Get the first line
      return firstLine + (text.includes('\n') ? '...' : ''); // Add ellipsis if there are more lines
    }
    return text; // If no text, return as is
  }

 deleteTemplate(data) {
  // Trigger SweetAlert confirmation dialog
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      // Proceed with delete action if confirmed
      const payload = {
        template_id: data.mail_template_id,
        created_by: this.user_id
      };

      // Call the delete service method
      this.serviceNew.v1_sp_ds_global_mail_delete(payload).subscribe(response => {
        // Handle the response after successful delete
              this.v1_sp_ds_global_mail_get();

        Swal.fire('Deleted!', 'Your template has been deleted.', 'success');
      }, error => {
        // Handle the error if deletion fails
        Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
      });
    }
  });
}

@ViewChild('SendCollectionMAilNew') SendCollectionMAilNew:any;
}