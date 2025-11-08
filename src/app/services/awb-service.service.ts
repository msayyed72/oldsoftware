import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import  { retry,catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class AwbServiceService {
  private subject = new Subject<any>();
  constructor(private http: HttpClient) { }
  httpOptions={
	headers:new HttpHeaders({
		'content-type': 'application'
	})
}
handleError(error: HttpErrorResponse) {
  if ( error.error instanceof ProgressEvent) {
    console.log('Client side error:', error)
  }
  return throwError(error.error.Details);
}
get_print(awb_no: string,option: string,id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'download/print_'+option+'?bill_no='+awb_no+'&id='+id,{ responseType: 'json' }).pipe(retry(2))
}
get_Online_Status():Observable<any>{
  return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_online_status',{ responseType: 'json' }).pipe(retry(2))
}
get_print_bar(awb_no: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'download/barcode_print_label?bill_no='+awb_no,{ responseType: 'json' }).pipe(retry(2))
}
update_status(awb_no: string,id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API_ORIGIN + 'update_o_status?id='+awb_no+'&sts='+id,{ responseType: 'json' }).pipe(retry(2))
}
get_Inv_id_by_no(awb_no: string,code: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'Get_inv_Id_from_inv_No?NO='+awb_no+'&point='+code,{ responseType: 'json' }).pipe(retry(2))
}
get_transit_type():Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_transit_type').pipe(retry(2))
}
get_service_type(id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_service_type?id='+id).pipe(retry(2))
}
get_service_typeall():Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_service_type_all').pipe(retry(2))
}
get_country():Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_country').pipe(retry(2))
}
get_type():Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_type').pipe(retry(2))
}
get_Custom_Itemname():Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_Custom_Itemname').pipe(retry(2))
}
get_State_By_Region_Id(region_id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_State_By_Region_Id?region_id='+region_id,{ responseType: 'json' }).pipe(retry(2))
}
get_District_By_State_Select(stateId: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_District_By_State_Select?stateId='+stateId,{ responseType: 'json' }).pipe(retry(2))
}
SP_M_Ba_Booking_Agent_By_Branch(pointId: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_Booking_Agent_By_Branch?pointId='+pointId,{ responseType: 'json' }).pipe(retry(2))
}
get_Region_By_Country_Id(country_id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_Region_By_Country_Id?country_id='+country_id,{ responseType: 'json' }).pipe(retry(2))
}
get_branch_By_Country_Id(country_id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_origin_by_country?country_id='+country_id,{ responseType: 'json' }).pipe(retry(2))
}
get_awb_no(pointId: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'Get_Available_AWB_No?pointId='+pointId,{ responseType: 'json' }).pipe(retry(2))
}
packing_list_pdf(no: string,list: string,code: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'download/print_Packing_empty?no='+no+'&list='+list+'&code='+code,{ responseType: 'json' }).pipe(retry(2))
}
get_doc_type():Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_m_document_type',{ responseType: 'json' }).pipe(retry(2))
}
get_destination():Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'detination_get_loading_place',{ responseType: 'json' }).pipe(retry(2))
}
get_InvItem_By_Inv(id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_InvItem_By_Inv?ip_invoiceId='+id).pipe(retry(2))
}
insert_InvItem_By_Inv(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'insert_InvItem_By_Inv',JSON.stringify(item)).pipe(retry(2))  
}
update_InvItem_By_Inv(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'update_InvItem_By_Inv',JSON.stringify(item)).pipe(retry(2))  
}
delete_InvItem_By_Inv(id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'delete_InvItem_By_Inv?id='+id).pipe(retry(2))
}
get_Dimension_By_Inv(id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_dimension?invoiceNo='+id).pipe(retry(2))
}
getBox_Amt(l: string,w: string,h: string,region: string,service: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_box_amount?l='+l+'&w='+w+'&h='+h+'&reg='+region+'&ser='+service).pipe(retry(2))
}
insert_Dimension_By_Inv(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'insert_dimension',JSON.stringify(item)).pipe(retry(2))  
}
update_Dimension_By_Inv(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'update_dimension',JSON.stringify(item)).pipe(retry(2))  
}
delete_Dimension_By_Inv(id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'delete_dimension?invoiceNo='+id).pipe(retry(2))
}
Insertitems(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'insert_item_details',JSON.stringify(item)).pipe(retry(2))  
}
Insertitemsbulk(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'insert_item_details_bulk',JSON.stringify(item)).pipe(retry(2))  
}
get_customer_By_Country_Id(country_id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_customer_by_id?country_id='+country_id,{ responseType: 'json' }).pipe(retry(2))
}
get_item_search(item_name: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_item_name?item_name='+item_name,{ responseType: 'json' }).pipe(retry(2))
}
get_customer_search(cus_id: string,mob: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_customer_by_id_mob?cus_id='+cus_id
  + '&mob='+mob,{ responseType: 'json' }).pipe(retry(2))
}
Inserthawb(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'insert_hawb_Details',JSON.stringify(item)).pipe(catchError(this.handleError) )
}
update_Invoice_Amount_Details(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'update_Invoice_Amount_Details',JSON.stringify(item)).pipe(retry(2))  
}
Insert_Item(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'insert_item_details_bulk_new',JSON.stringify(item)).pipe(retry(2))  
}
Update_Item(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'update_item_details',JSON.stringify(item)).pipe(retry(2))  
}
insert_carton(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'insert_cartonDetails',JSON.stringify(item)).pipe(retry(2))  
}
get_item_by_invoice(invoice_no: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_item_by_invoice?invoice_no='+invoice_no,{ responseType: 'json' }).pipe(retry(2))
}
get_carton_by_invoice(invoice_no: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_carton_by_invoice?invoice_no='+invoice_no,{ responseType: 'json' }).pipe(retry(2))
}
get_item_type():Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_item_type',{ responseType: 'json' }).pipe(retry(2))
}
get_operation_By_Country_Id(country_id: string,region_id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_operation_facility?country_id='+country_id+'&region_id='+region_id).pipe(retry(2))
}
get_customer_kyc(country_id: string): Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'get_customer_kyc?country_id=' + country_id).pipe(retry(2))
}
updateCarton(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'update_carton_details',JSON.stringify(item)).pipe(retry(2))  
}
get_all_details_by_invoice(invoice_no: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_invoice_details_by_invoice?invoice_no='+invoice_no,{ responseType: 'json' }).pipe(retry(2))
}
get_currency():Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_currency',{ responseType: 'json' }).pipe(retry(2))
}
get_rate_date(point_id: string,region_id: string,transit_type_id: string,agent: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_date_rate?point_id='+point_id+
  '&region_id='+region_id+'&transit_type_id='+transit_type_id+'&agent_id='+agent,{ responseType: 'json' }).pipe(retry(2))
}
get_invoice_list(point_id: string,location_id: string,invoice_no: string,date: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_invoice_list?point_id='+point_id+
  '&location_id='+location_id+'&invoice_no='+invoice_no+'&date='+date,{ responseType: 'json' }).pipe(retry(2))
}
get_invoice_list_uncomplete(point_id: string,location_id: string,invoice_no: string,date: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_invoice_list_uncomplete?point_id='+point_id+
  '&location_id='+location_id+'&invoice_no='+invoice_no+'&date='+date,{ responseType: 'json' }).pipe(retry(2))
}
get_invoice_list_unpayment(point_id: string,location_id: string,invoice_no: string,date: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_invoice_list_unpayment?point_id='+point_id+
  '&location_id='+location_id+'&invoice_no='+invoice_no+'&date='+date,{ responseType: 'json' }).pipe(retry(2))
}
getProfitReport(point_id: { from_date: string; to_date: string; }):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'billing_get_profit_report?from_date='+point_id.from_date+
  '&to_date='+point_id.to_date,{ responseType: 'json' }).pipe(retry(2))
}
get_Hawb_Details(inv_id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_Hawb_Details?ip_invoiceId='+inv_id,{ responseType: 'json' }).pipe(retry(2))
}
get_Invoice_Amount_Details(inv_id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_Invoice_Amount_Details?ip_invoiceId='+inv_id,{ responseType: 'json' }).pipe(retry(2))
}
get_label_print(awb_no: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'download/print_label?bill_no='+awb_no,{ responseType: 'json' }).pipe(retry(2))
}
delete_carton(id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API +'delete_Carton_Details?id='+id).pipe(retry(2))
}
updatehawb(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'update_hawb_Details',JSON.stringify(item)).pipe(retry(2))  
}
deleteitemDetails(id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API +'delete_item_details?id='+id).pipe(retry(2))
}
get_receiver_popup(sid: string,rid: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_receiver_by_sender?sid='+sid+
  '&rid='+rid,{ responseType: 'json' }).pipe(retry(2))
}
get_forign_currency_by_country_code(sid: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_forign_currency_by_country_code?code='+sid,{ responseType: 'json' }).pipe(retry(2))
}
get_holiday(point_id: string,region_id: string,transit_type_id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_date_holidays?point_id='+point_id+
  '&region_id='+region_id+'&transit_type_id='+transit_type_id,{ responseType: 'json' }).pipe(retry(2))
}
Insertitemsvoice(item: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'insert_item_voice',JSON.stringify(item)).pipe(retry(2))  
}
  getDashboard_Count(ip_from_date: string,ip_to_date: string,point_id: string,ip_countryID: string,ip_flag: string):Observable<any>
  {
    return this.http.get(Constant.CONSTANT_API + 'getDashboard_Count?ip_from_date='+ip_from_date+'&ip_to_date='+ip_to_date+'&point_id='+point_id+'&ip_countryID='+ip_countryID+'&ip_flag='+ip_flag,{ responseType: 'json' }).pipe(retry(2))
  }
  getDashboard_Details(ip_from_date: string,ip_to_date: string,point_id: string,ip_countryID: string,ip_flag: string):Observable<any>
  {
    return this.http.get(Constant.CONSTANT_API + 'getDashboard_Details?ip_from_date='+ip_from_date+'&ip_to_date='+ip_to_date+'&point_id='+point_id+'&ip_countryID='+ip_countryID+'&ip_flag='+ip_flag,{ responseType: 'json' }).pipe(retry(2))
  }
get_details_by_pincode(pincode: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'get_details_by_pincode?pincode='+pincode,{ responseType: 'json' }).pipe(retry(2))
}
// send_pdf_to_customer(name,ph_no,url):Observable<any>{
//   return this.http.get('http://www.saudialert.com/pushsms.php?username=jaheerst&api_password=6f5f5fd21npkryfg4&sender=ST-CARGO-AD&to='
//   +ph_no+'&message='+name+'Thanks for your booking. Click here to download your Invoice bill '+url+'&priority=12&e_id=123&t_id=112')
// }
send_pdf_to_customer(name: string,ph_no: string,url: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'request_send?num='+ph_no+'&id='
  +'Hi '+name+', Thanks for Booking. Click here to view your booking pdf '+url,{ responseType: 'json' }).pipe(retry(2))

}
employee_name_based_pointId(point_id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + 'employee_name_based_pointId?point_id='+point_id).pipe(retry(2))
}
get_customer_search_id(id: string): Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'get_customer_search_id?id=' + id).pipe(retry(2))
}
get_customer_search_new(id: string,name: string,country_id: string,mobile: string,start: string,end: string): Observable<any> {
  return this.http.get(Constant.CONSTANT_API + 'get_customer_search?id=' + id
    + '&mobile=' + mobile+ '&country_id=' + country_id+ '&name=' + name + '&start='+start + '&end=' +end).pipe(retry(2))
}
sendClickEvent(data: any) { 
  // console.log(data)
  this.subject.next(data);
}
getClickEvent(): Observable<any>{ 
  return this.subject.asObservable();
}

get_agent_bill_report(datas: { agent: string; from_date: string; to_date: string; service_type: string; }):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + "v1_o_ac_bill_generation_get?agent_id="+datas.agent
  +"&from_date="+datas.from_date +"&to_date="+datas.to_date +"&_service="+datas.service_type).pipe(retry(2))
}
v1_o_ac_agent_billing_select_by_date(datas: { agent: string; from_date: string; to_date: string; service_type: string; }):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + "v1_o_ac_agent_billing_select_by_date?agent_id="+datas.agent
  +"&from_date="+datas.from_date +"&to_date="+datas.to_date +"&_service="+datas.service_type).pipe(retry(2))
}
v1_SP_m_expense_get_agent_wise(datas: { agent: string; from_date: string; to_date: string; }):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + "v1_SP_m_expense_get_agent_wise?agent_id="+datas.agent
  +"&from_date="+datas.from_date +"&to_date="+datas.to_date).pipe(retry(2))
}
get_account_report(datas: { exp: string; from_date: string; to_date: string; point: string; }):Observable<any>{
  return this.http.get(Constant.CONSTANT_API + "v1_SP_m_expense_get_exp_type_wise?exp="+datas.exp
  +"&from_date="+datas.from_date +"&to_date="+datas.to_date+"&_p="+datas.point).pipe(retry(2))
}
bill_gen_agent(data: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_agent_billing_Insert',JSON.stringify(data)).pipe(retry(1))
}
get_boxType():Observable<any>{
  return this.http.get(Constant.CONSTANT_API +'v1_m_box_type_Insert').pipe(retry(2))
}
box_sales_entry_select():Observable<any>{
  return this.http.get(Constant.CONSTANT_API +'v1_o_ac_box_sales_entry_select').pipe(retry(2))
}
insert_box_sale(data: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'box_sales_entry_Insert',JSON.stringify(data)).pipe(retry(1))
}
expesne_insert(data: any):Observable<any>{
  return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_daily_expense_Insert',JSON.stringify(data)).pipe(retry(1))
} 
get_expense(id: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API +'v1_o_ac_daily_expense_select?id='+id).pipe(retry(2))
}
v1_SP_m_expense_types(name: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API +'v1_SP_m_expense_types?_n='+name).pipe(retry(2))
}
v1_SP_m_expense_types_head():Observable<any>{
  return this.http.get(Constant.CONSTANT_API +'v1_SP_m_expense_types_head').pipe(retry(2))
}
get_daybook():Observable<any>{
  return this.http.get(Constant.CONSTANT_API +'v1_o_ac_bill_transaction_select').pipe(retry(2))
}
dashboardGet(flag: string,from: string,to: string):Observable<any>{
  return this.http.get(Constant.CONSTANT_API +'v1_dashboard_get?_f='+flag+'&form_date='+from+'&to_date='+to).pipe(retry(2))
}

}
