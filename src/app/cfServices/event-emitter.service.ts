import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  constructor() { }

  public onLoaderToggle: EventEmitter<any> = new EventEmitter();
  public AUTH_LOGOUT_EVENT: EventEmitter<any> = new EventEmitter();
  public AUTH_LOGIN_EVENT: EventEmitter<any> = new EventEmitter();
  public onAlert: EventEmitter<any> = new EventEmitter();
}
