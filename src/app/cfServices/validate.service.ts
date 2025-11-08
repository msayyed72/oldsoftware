import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
// import { commonUtilitiesService } from './CommonUtilities.service';
import { EventEmitterService } from './event-emitter.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateEndPointsService {
_configSvc='https://api.cargoforce.com/Origin_v2/api_php_booking/index.php/';
_configSvc3='https://api.cargoforce.com/Origin_v2/api_php_booking/reports_pdf/';
_configSvc1='https://api.cargoforce.com/Origin_v2/cargo_origin_api/index.php/';
_configSvc2='https://api.cargoforce.com/Origin_v2/send_email/index.php/';
_configSvc4='https://api.cargoforce.com:8080/api/users/';
_configSvc5='https://api.cargoforce.com:8080/api/reports/';
_configSvc6='https://api.cargoforce.com:8080/api/freeagent/';
_configSvc7='https://api.cargoforce.com/master/Master_php_testing/index.php/';
_configSvc8='https://api.cargoforce.com/Origin_v2/airlines/index.php/';
  constructor(
    private _http: HttpClient,
    // private _commonUtilService: commonUtilitiesService,
    // private _configSvc: ConfigService,
    private _eventEmitter : EventEmitterService
  ) { }

  public get(url: string, params: any, headers = {}, extraHeaders?: {}): Observable<any> {
      this._eventEmitter.onLoaderToggle.emit(true);
    const _OPTIONS = {
      ...this.headers(headers, extraHeaders),
      params
    };

    return this._http.get(this.buildUrl(url), _OPTIONS).pipe(
      map(res => res), catchError(this.handleError),
      finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
  }
  
  public get1(url: string, params: any, headers = {}, extraHeaders?: {}): Observable<any> {
    this._eventEmitter.onLoaderToggle.emit(true);
  const _OPTIONS = {
    ...this.headers(headers, extraHeaders),
    params
  };

  return this._http.get(this.buildUrl1(url), _OPTIONS).pipe(
    map(res => res), catchError(this.handleError),
    finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
}
  public getmaster(url: string, params: any, headers = {}, extraHeaders?: {}): Observable<any> {
      this._eventEmitter.onLoaderToggle.emit(true);
    const _OPTIONS = {
      ...this.headers(headers, extraHeaders),
      params
    };

    return this._http.get(this.buildUrl7(url), _OPTIONS).pipe(
      map(res => res), catchError(this.handleError),
      finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
  }
  
public get2(url: string, params: any, headers = {}, extraHeaders?: {}): Observable<any> {
  this._eventEmitter.onLoaderToggle.emit(true);
const _OPTIONS = {
  ...this.headers(headers, extraHeaders),
  params
};

return this._http.get(this.buildUrl3(url), _OPTIONS).pipe(
  map(res => res), catchError(this.handleError),
  finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
}
public get4(url: string, params: any, headers = {}, extraHeaders?: {}): Observable<any> {
  this._eventEmitter.onLoaderToggle.emit(true);
const _OPTIONS = {
  ...this.headers(headers, extraHeaders),
  params
};

return this._http.get(this.buildUrl2(url), _OPTIONS).pipe(
  map(res => res), catchError(this.handleError),
  finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
}
public get3(url: string, params: any, headers = {}, extraHeaders?: {}): Observable<any> {
  this._eventEmitter.onLoaderToggle.emit(true);
const _OPTIONS = {
  ...this.headers(headers, extraHeaders),
  params
};

return this._http.get(this.buildUrl4(url), _OPTIONS).pipe(
  map(res => res), catchError(this.handleError),
  finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
}

public get5(url: string, params: any, headers = {}, extraHeaders?: {}): Observable<any> {
  this._eventEmitter.onLoaderToggle.emit(true);
const _OPTIONS = {
  ...this.headers(headers, extraHeaders),
  params
};

return this._http.get(this.buildUrl5(url), _OPTIONS).pipe(
  map(res => res), catchError(this.handleError),
  finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
}

public get8(url: string, params: any, headers = {}, extraHeaders?: {}): Observable<any> {
  this._eventEmitter.onLoaderToggle.emit(true);
const _OPTIONS = {
  ...this.headers(headers, extraHeaders),
  params
};

return this._http.get(this.buildUrl8(url), _OPTIONS).pipe(
  map(res => res), catchError(this.handleError),
  finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
}

  // public postimg(url: string, data: any, headers = {}, extraHeaders?: {}): Observable<any> {
  //   this._eventEmitter.onLoaderToggle.emit(true);
  //   // const _HEADERS = this.headers(headers, extraHeaders);
  //   return this._http.post(this.buildUrl(url), data).pipe(
  //     map(res => res), catchError(error => this.handleError(error)),
  //     finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
  // }
  public post(url: string, data: any, headers = {}, extraHeaders?: {}): Observable<any> {
    this._eventEmitter.onLoaderToggle.emit(true);
    const _HEADERS = this.headers(headers, extraHeaders);
    return this._http.post(this.buildUrl(url),  data, _HEADERS).pipe(
      map(res => res), catchError(error => this.handleError(error)),
      finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
  }
    public post5(url: string, data: any, headers = {}, extraHeaders?: {}): Observable<any> {
    this._eventEmitter.onLoaderToggle.emit(true);
    const _HEADERS = this.headers(headers, extraHeaders);
    return this._http.post(this.buildUrl5(url),  data, _HEADERS).pipe(
      map(res => res), catchError(error => this.handleError(error)),
      finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
  }
   public post8080(url: string, data: any, headers = {}, extraHeaders?: {}): Observable<any> {
    this._eventEmitter.onLoaderToggle.emit(true);
    const _HEADERS = this.headers(headers, extraHeaders);
    return this._http.post(this.buildUrl4(url),  data, _HEADERS).pipe(
      map(res => res), catchError(error => this.handleError(error)),
      finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
  }
  public post1(url: string, data: any, headers = {}, extraHeaders?: {}): Observable<any> {
    this._eventEmitter.onLoaderToggle.emit(true);
    const _HEADERS = this.headers(headers, extraHeaders);
    console.log(data)
    return this._http.post(this.buildUrl1(url), data, _HEADERS).pipe(
      map(res => res), catchError(error => this.handleError(error)),
      finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
  }
  public post2(url: string, data: any, headers = {}, extraHeaders?: {}): Observable<any> {
    this._eventEmitter.onLoaderToggle.emit(true);
    const _HEADERS = this.headers(headers, extraHeaders);
    console.log(data)
    return this._http.post(this.buildUrl2(url), data, _HEADERS).pipe(
      map(res => res), catchError(error => this.handleError(error)),
      finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
  }
   public postfree(url: string, data: any, headers = {}, extraHeaders?: {}): Observable<any> {
    this._eventEmitter.onLoaderToggle.emit(true);
    const _HEADERS = this.headers(headers, extraHeaders);
    console.log(data)
    return this._http.post(this.buildUrl6(url), data, _HEADERS).pipe(
      map(res => res), catchError(error => this.handleError(error)),
      finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
  }
  public put(url: string, data: any, headers = {}, extraHeaders?: {}): Observable<any> {
    this._eventEmitter.onLoaderToggle.emit(true);
    const _HEADERS = this.headers(headers);
    return this._http.put(this.buildUrl(url), data, _HEADERS).pipe(
      map(res => res), catchError(error => this.handleError(error)),
      finalize(() => this._eventEmitter.onLoaderToggle.emit(false)));
  }

  public delete(url: string, data?: any): Observable<any> {
    this._eventEmitter.onLoaderToggle.emit(true);
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const options = {
      headers: headers,
      body: data
    };
    return this._http.delete(this.buildUrl(url), options).pipe(
      map(res => res), catchError(error => this.handleError(error)),
      finalize(() => this._eventEmitter.onLoaderToggle.emit(false))
    );
  }

  private headers(baseHeaders = {}, extraHeaders = {}, data?: any) {
    const headers = { ...baseHeaders, ...extraHeaders };

    // Remove 'Content-Type' if data is FormData so the browser can set it automatically
    if (data instanceof FormData && headers['Content-Type']) {
        delete headers['Content-Type'];
    }

    return { headers: new HttpHeaders(headers) };
}

  private buildUrl(url: string) {
    return this._configSvc + url;
  }
  private buildUrl1(url: string) {
    return this._configSvc1 + url;
  }
  private buildUrl2(url: string) {
    return this._configSvc2 + url;
  }
  private buildUrl3(url: string) {
    return this._configSvc3 + url;
  }
    private buildUrl4(url: string) {
    return this._configSvc4 + url;
  }
   private buildUrl5(url: string) {
    return this._configSvc5 + url;
  }
   private buildUrl6(url: string) {
    return this._configSvc6 + url;
  }
    private buildUrl7(url: string) {
    return this._configSvc7 + url;
  }
  private buildUrl8(url: string) {
    return this._configSvc8 + url;
  }
  handleError(error: HttpErrorResponse | any): any {
    throw throwError(error);
  }
}
