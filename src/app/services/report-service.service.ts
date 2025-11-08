import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import  { retry,catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

  constructor(private http: HttpClient) { }
  httpOptions={
	headers:new HttpHeaders({
		'content-type':'application'
	})
}
public exportAsExcelFile(json: any[], excelFileName: string): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
}
private saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
   FileSaver.saveAs(data, fileName + 'Report' + EXCEL_EXTENSION);
}
get_branch():Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'get_branch').pipe(retry(2))
}
get_c_user(f: string,s: string,r: string,start: string,end: string) {
  return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_chatting_request?flag='+f+'&s_user='+s+'&r_user='+r+'&frm='+start+'&to='+end).pipe(retry(2))
}
ins_msg(f: string,s: string,r: string) {
  return this.http.get(Constant.CONSTANT_API_ORIGIN + 'ins_chatting_msg?content='+r+'&s_user='+f+'&r_user='+s).pipe(retry(2))
}
update_msg(r: string) {
  return this.http.get(Constant.CONSTANT_API_ORIGIN + 'update_chatting_msg?content='+r).pipe(retry(2))
}
get_agent(point_id: string):Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'get_agent?point_id='+point_id).pipe(retry(2))
}
get_report(item: any): Observable<any> {
  return this.http.post(Constant.CONSTANT_API + 'get_sales_agent_report', JSON.stringify(item)).pipe(retry(2))
}
get_report_graph(item: any): Observable<any> {
  return this.http.post(Constant.CONSTANT_API + 'get_graph_report', JSON.stringify(item)).pipe(retry(2))
}
get_box_wise_report(item: any): Observable<any> {
  return this.http.post(Constant.CONSTANT_API + 'get_sales_boxwise_report', JSON.stringify(item)).pipe(retry(2))
}
get_customer_wise_report(item: any): Observable<any> {
  return this.http.post(Constant.CONSTANT_API + 'get_sales_customwise_report', JSON.stringify(item)).pipe(retry(2))
}
get_date_wise_report(item: Partial<{ country: string | null; state: string | null; shipment: string | null; region: string | null; from_date: string | null; to_date: string | null; agent: string | null; user: string | null; snofrom: string | null; snoto: string | null; branch: any; branch_name: any; transit_type_name: string | null; region_name_val: string | null; reference_number: string | null; org_country: string | null; }>): Observable<any> {
  return this.http.post(Constant.CONSTANT_API + 'get_sales_date_report', JSON.stringify(item)).pipe(retry(2))
}
get_tot_summary_report(item: { from_date: string; to_date: string; }): Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'get_tot_summary_report?from='+item.from_date+'&to='+item.to_date).pipe(retry(2))
}
get_tot_summary_reportWeight(item: { from_date: string; to_date: string; }): Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'get_tot_summary_reportWeight?from='+item.from_date+'&to='+item.to_date).pipe(retry(2))
}
get_cm_wise_report(item: { cmNo: string; }): Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'get_cm_wise_summary_report?cmNo='+item.cmNo).pipe(retry(2))
}
tot_sales_summary_report(item: { from_date: string; to_date: string; }): Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'tot_sales_summary_report?from='+item.from_date+'&to='+item.to_date).pipe(retry(2))
}
tot_sales_summary_report_weight(item: { from_date: string; to_date: string; }): Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'tot_sales_summary_report_weight?from='+item.from_date+'&to='+item.to_date).pipe(retry(2))
}
get_update_amt_report(item: { from_date: string; to_date: string; branch: string; }): Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'get_update_rate_filter?from='+item.from_date+'&to='+item.to_date+'&br='+item.branch).pipe(retry(2))
}
get_otg_dispatch_report(item: { from_date: string; to_date: string; }): Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'get_org_dispatch_report?from='+item.from_date+'&to='+item.to_date).pipe(retry(2))
}
get_pending_report(item: any): Observable<any> {
  return this.http.post(Constant.CONSTANT_API + 'get_pending_stock', JSON.stringify(item)).pipe(retry(2))
}
get_stock_summary(item: any): Observable<any> {
  return this.http.post(Constant.CONSTANT_API + 'get_pending_stock_summary', JSON.stringify(item)).pipe(retry(2))
}
get_origin_wise(item: any): Observable<any> {
  return this.http.post(Constant.CONSTANT_API + 'get_origin_wise_booking', JSON.stringify(item)).pipe(retry(2))
}
GetDeliveryStatus() {
  return this.http.get(Constant.CONSTANT_API + 'get_delivery_status').pipe(retry(2))
}
get_update_rate() {
  return this.http.get(Constant.CONSTANT_API + 'get_update_rate').pipe(retry(2))
}
update_notf_view_status(id: string) {
  return this.http.get(Constant.CONSTANT_API + 'update_notf_view_status?id='+id).pipe(retry(2))
}
get_update_rate_view(no: string) {
  return this.http.get(Constant.CONSTANT_API + 'get_update_rate_view?no='+no).pipe(retry(2))
}
download_PDF(item: any): Observable<any> {
  return this.http.post(Constant.CONSTANT_API + 'download/agent_wise_sales_report', JSON.stringify(item)).pipe(retry(2))
}
download_date_wise_PDF(item: any,ship: string,reg: string,state: string,from: string | null | undefined,to: string | null | undefined): Observable<any> {
  return this.http.post(Constant.CONSTANT_API + 'download/date_wise_sales_report?ship='+ship+'&reg='+reg+'&state='+state+'&from='+from+'&to='+to, JSON.stringify(item)).pipe(retry(2))
}
get_consolidate(origin_id: string,f_date: string,t_date: string){
  return this.http.get(Constant.CONSTANT_API + 'get_consolidate_report?origin_id='+origin_id+'&f_date='+f_date+'&t_date='+t_date).pipe(retry(2))
}
getBranchName(location_type: string,location_id: string) {
  return this.http.get(Constant.CONSTANT_API + 'get_branch_master?location_type=' + location_type + '&location_id=' + location_id).pipe(retry(2))
}
}

