import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from './cfServices/event-emitter.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(private _eventEmitterSvc: EventEmitterService,private _spinner: NgxSpinnerService,) {}
    ngOnInit(): void {
         this._eventEmitterSvc.onLoaderToggle
        .subscribe((showLoader: any) => {
          if (showLoader) {
            this._spinner.show();
          } else {  
            this._spinner.hide();
          }
        });
        }

}
