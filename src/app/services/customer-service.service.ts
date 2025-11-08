import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application'
    })
  }

  get_bill_type() {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_bill_type').pipe(retry(2))
  }
  get_customer_type() {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_type').pipe(retry(2))
  }
  get_country() {
    return this.http.get(Constant.CONSTANT_API + 'get_country').pipe(retry(2))
  }

  get_customer_kyc(country_id: string, customer_type: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_kyc?country_id=' + country_id
      + '&customer_type=' + customer_type).pipe(retry(2))
  }
  get_customer(type: string) {
    return this.http.get(Constant.CONSTANT_API + 'get_customer?id='+type).pipe(retry(2))
  }
  get_state(id: string) {
    return this.http.get(Constant.CONSTANT_API + 'get_district_state?id=' + id).pipe(retry(2))
  }
  get_statebycid(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_state_by_country?id=' + id).pipe(retry(2))
  }
  Insertcustomer(item: any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_customer', JSON.stringify(item)).pipe(retry(2))
  }
  updatecustomer(item: any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_customer', JSON.stringify(item)).pipe(retry(2))
  }
  deletecustomer(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'delete_customer?id=' + id).pipe(retry(2))
  }
  deletecustomerkyc(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'delete_customer_kyc?id=' + id).pipe(retry(2))
  }
  get_district_by_state(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_district_state?id=' + id).pipe(retry(2))
  }
  get_customer_id(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_id').pipe(retry(2))
  }
  get_state_all():Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_state').pipe(retry(2))
  }
  get_taluk(id: string):Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_taluk_by_district?id=' + id).pipe(retry(2))
  }
  get_PoOffice(id: string):Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_po_by_taluk?id=' + id).pipe(retry(2))
  }
  get_location_type(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_locationtype').pipe(retry(2))
  }
  get_work_location(country_id: string, point_type_id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_worklocation?country_id=' + country_id
      + '&point_type_id=' + point_type_id).pipe(retry(2))
  }
  Insertcustomerkyc(item: any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_customer_kyc', JSON.stringify(item)).pipe(retry(2))
  }
  updatecustomerkyc(item: any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_customer_kyc', JSON.stringify(item)).pipe(retry(2))
  }
  get_customer_search(id: string,mobile: string,country_id: string,name: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_search?id=' + id
      + '&mobile=' + mobile+ '&country_id=' + country_id+ '&name=' + name).pipe(retry(2))
  }
  get_customer_search_id(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_search_id?id=' + id).pipe(retry(2))
  }
  get_customer_search_kyc_id(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_search_kyc_id?id=' + id).pipe(retry(2))
  }
  get_customer_print(id: string,logo: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'download/customer_print?id=' + id+'&logo=' + logo).pipe(retry(2))
  }
}
