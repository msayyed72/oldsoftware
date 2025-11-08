import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SendNotificationMailComponent } from '../notification/send-notification-mail/send-notification-mail.component';
import { NotificationComponent } from '../notification/notification.component';
import { MailEventComponent } from '../mail-event/mail-event.component';
import { EditTemplateComponent } from '../mail-event/MailEvent/edit-template/edit-template.component';

const routes: Routes = [
    { path: 'universal/sendMail', component: NotificationComponent, title: 'Send Notification Mail' },
    { path: 'universal/Event', component: MailEventComponent, title: 'Event' },
    { path: 'universal/EventDetails', component: EditTemplateComponent, title: 'Event Details' },
    { path: 'universal/sendMailDetails', component: SendNotificationMailComponent, title: 'Send Notification Mail' },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ]
})
export class UniverselModule { }
1