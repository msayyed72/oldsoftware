import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the existing headers from the request
    const headers = req.headers;

    // Your custom headers
    const locationHeader = '13.204.17.100'; // Location value
    const authorizationToken = '**********'; // Replace this with the actual token

    // Add the Bearer prefix to Authorization1 header
    const authorizationHeader = `Bearer ${authorizationToken}`;

    // Clone the request and modify the headers
    const modifiedReq = req.clone({
      setHeaders: {
        'location': locationHeader,
        'Authorization1': authorizationHeader // Adding 'Bearer ' prefix
      }
    });

    // Pass the modified request to the next handler
    return next.handle(modifiedReq);
  }
}
