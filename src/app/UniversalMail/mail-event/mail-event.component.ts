import { Component, OnInit } from '@angular/core';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mail-event',
  templateUrl: './mail-event.component.html',
  styleUrls: ['./mail-event.component.css']
})
export class MailEventComponent implements OnInit {
generatedTemplates=[]
  constructor(public serviceNew:NewApiCloudService,public router:Router) { }

  ngOnInit(): void {
    this.v1_m_mail_events_get()
  }


v1_m_mail_events_get(){
  this.serviceNew.v1_m_mail_events_get(-1).subscribe(r=>{
    this.generatedTemplates=r?.['data'].map(r=>({
      ...r,
      'mail_status' :(r['mail_status'] == 'false' ? false :true)
    }))
  })
}
v1_m_mail_events_update(data){
  console.log(data)
  data['mail_status'] = String(data['mail_status'])
    this.serviceNew.v1_m_mail_events_update(data).subscribe(r=>{
        console.log(data)

          this.v1_m_mail_events_get() 

    })
}
EditTemplate(data){
this.router.navigate(['/universal/EventDetails'], { queryParams: data });
}
}
