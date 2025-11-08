import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewApiCloudService } from '../../../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {
receivedData:any;
recId=''
  constructor(public route:ActivatedRoute,public serviceNew:NewApiCloudService,) { 
this.route.queryParams.subscribe(r=>{
    this.receivedData=r;
    this.recId=r['mail_events_id'];
    this.v1_m_mail_events_get(r['mail_events_id'])
    })
  }
user_data:any;
  ngOnInit(): void {
            this.user_data= JSON.parse(localStorage.getItem("log_data"))

  }

v1_m_mail_events_get(id){
  this.serviceNew.v1_m_mail_events_get(id).subscribe(r=>{
    this.receivedData = r['data'][0]
    this.subject=this.receivedData['mail_subject']
    this.body=this.receivedData['mail_body']
    this.eventName=this.receivedData['mail_events_name']
    this.eventDetails=this.receivedData['mail_events_description']
    this.mailOption = this.receivedData['mail_status']  ; 
  })
}
mailOption: boolean; // radio button value
  eventName = 'My Event';
  eventDetails = 'Event details here';
  subject = '';
  body = '';

  sendMail() {
    console.log('Mail Option:', this.mailOption);
    console.log('Subject:', this.subject);
    console.log('Body:', this.body);
    const payload = {
    mail_id: this.recId,        // SMALLINT(5)
    mail_sub: this.subject,      // VARCHAR(1000)
    mail_body: this.body,     // MEDIUMTEXT
    updated_by: this.user_data['v_user_id']      // INT(10)
};

this.serviceNew.v1_m_mail_events_update_content(payload).subscribe(r=>{
  this.showMessage('SuccessFully Updates')
  this.v1_m_mail_events_get(this.recId)
})
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
  v1_m_mail_events_update(){
    let data:any={
      mail_status:'',
      mail_events_id:''
    };
  data['mail_status'] = String(this.mailOption)
  data['mail_events_id'] = String(this.recId)
    this.serviceNew.v1_m_mail_events_update(data).subscribe(r=>{
          this.v1_m_mail_events_get(this.recId) 

    })
}
    editorOptions = {
        toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
    };
}
