import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';
// in bytes, compress images larger than 1MB
const fileSizeMax = 1 * 1024 * 1024
// in pixels, compress images have the width or height larger than 1024px
const widthHeightMax = 1024
const defaultWidthHeightRatio = 1
const defaultQualityRatio = 0.7

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application'
    })
  }
  baseApiUrl = "http://192.168.1.106/St_api_php_booking/booking_pdf"
  get_bill_type() {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_bill_type').pipe(retry(2))
  }
  get_customer_type() {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_type').pipe(retry(2))
  }
  get_country() {
    return this.http.get(Constant.CONSTANT_API + 'get_country').pipe(retry(2))
  }

  get_customer_kyc(country_id:any, customer_type:any): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_kyc?country_id=' + country_id
      + '&customer_type=' + customer_type).pipe(retry(2))
  }
  get_customer(type: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer?id=' + type).pipe(retry(2));
  }
  
  get_state(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_district_state?id=' + id).pipe(retry(2));
  }
  
  get_statebycid(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_state_by_country?id=' + id).pipe(retry(2));
  }
  
  Insertcustomer(item: any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_customer', JSON.stringify(item)).pipe(retry(2));
  }
  
  updatecustomer(item: any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_customer', JSON.stringify(item)).pipe(retry(2));
  }
  
  deletecustomer(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'delete_customer?id=' + id).pipe(retry(2));
  }
  
  deletecustomerkyc(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'delete_customer_kyc?id=' + id).pipe(retry(2));
  }
  
  get_district_by_state(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_district_state?id=' + id).pipe(retry(2));
  }
  
  get_customer_id(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_id').pipe(retry(2));
  }
  
  get_state_all(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_state').pipe(retry(2));
  }
  
  get_taluk(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_taluk_by_district?id=' + id).pipe(retry(2));
  }
  
  get_PoOffice(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_po_by_taluk?id=' + id).pipe(retry(2));
  }
  
  get_location_type(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_locationtype').pipe(retry(2));
  }
  
  get_work_location(country_id: string, point_type_id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_worklocation?country_id=' + country_id
      + '&point_type_id=' + point_type_id).pipe(retry(2));
  }
  
  Insertcustomerkyc(item: any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_customer_kyc', JSON.stringify(item)).pipe(retry(2));
  }
  
  updatecustomerkyc(item: any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_customer_kyc', JSON.stringify(item)).pipe(retry(2));
  }
  
  get_customer_search(id: string, mobile: string, country_id: string, name: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_search?id=' + id
      + '&mobile=' + mobile + '&country_id=' + country_id + '&name=' + name).pipe(retry(2));
  }
  
  get_customer_search_id(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_search_id?id=' + id).pipe(retry(2));
  }
  
  get_customer_search_kyc_id(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_search_kyc_id?id=' + id).pipe(retry(2));
  }
  
  get_customer_print(id: string, logo: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'download/customer_print?id=' + id + '&logo=' + logo).pipe(retry(2));
  }
  
  compress(file: File): Observable<File> {
    const imageType = file.type || 'image/jpeg';
    const reader = new FileReader();
    reader.readAsDataURL(file);
  
    return new Observable((observer) => {
      // This event is triggered each time the reading operation is successfully completed.
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        // Create an HTML image element
        const img = this.createImage(ev);
        
        // Check if the image was successfully created
        if (!img) {
          observer.error('Failed to create image');
          return;
        }
  
        // Choose the side (width or height) that is longer than the other
        const imgWH = img.width > img.height ? img.width : img.height;
  
        // Determines the ratios to compress the image
        let withHeightRatio = (imgWH > widthHeightMax) ? widthHeightMax / imgWH : defaultWidthHeightRatio;
        let qualityRatio = (file.size > fileSizeMax) ? fileSizeMax / file.size : defaultQualityRatio;
  
        // Fires immediately after the browser loads the object
        img.onload = () => {
          const elem = document.createElement('canvas');
          // Resize width, height
          elem.width = img.width * withHeightRatio;
          elem.height = img.height * withHeightRatio;
  
          const ctx = <CanvasRenderingContext2D>elem.getContext('2d');
          ctx.drawImage(img, 0, 0, elem.width, elem.height);
          ctx.canvas.toBlob(
            (blob) => {
              if (blob) {
                observer.next(new File(
                  [blob],
                  file.name,
                  {
                    type: imageType,
                    lastModified: Date.now(),
                  }
                ));
                observer.complete();  // Ensure the observable is completed
              }
            },
            imageType,
            qualityRatio, // Reduce image quality 
          );
        };
      };
  
      // Catch errors when reading the file
      reader.onerror = (error) => observer.error(error);
    });
  }
  private createImage(ev: ProgressEvent<FileReader>) {
    const fileReader = ev.target;  // target is possibly null, so we need to check
    if (fileReader && fileReader.result) {
      let imageContent = fileReader.result as string;
      const img = new Image();
      img.src = imageContent;
      return img;
    } else {
      // Handle the case where fileReader or result is null
      console.error('Failed to load image: FileReader target or result is null');
      return null;
    }
  }
  
  
  public uploadfile(file: File) {
    let formParams = new FormData();
    formParams.append('file', file)
    return this.http.post('http://192.168.1.106/St_api_php_booking', formParams)
  }
}
