import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddNotesComponent } from '../add-notes/add-notes.component';

const routes: Routes = [
    { path: 'notes/AddNotes', component: AddNotesComponent, title: 'Add Notes' },
   
   
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
        RouterModule.forChild(routes),
    
  ]
})
export class AddnotesModule { }
