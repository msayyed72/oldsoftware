import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AwbService {
  private subject = new Subject<any>();
  private onlineSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(navigator.onLine);
  constructor(private http: HttpClient) {
    this.initNetworkStatusListener();
  }
  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application'
    })
  }
  private initNetworkStatusListener() {
    const online$ = fromEvent(window, 'online').pipe(mapTo(true));
    const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));

    merge(online$, offline$).subscribe(this.onlineSubject);
  }

  getNetworkStatus(): Observable<boolean> {
    return this.onlineSubject.asObservable();
  }

  isOnline(): boolean {
    return this.onlineSubject.value;
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ProgressEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('Client side error:', error)
    }
    return throwError(error.error.Details);
  }
  get_print(awb_no, option, id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'download/print_' + option + '?bill_no=' + awb_no + '&id=' + id, { responseType: 'json' }).pipe(retry(2))
  }
  get_printnew(awb_no, option, id, size): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'download/print_' + option + '?bill_no=' + awb_no + '&id=' + id + '&size=' + size, { responseType: 'json' }).pipe(retry(2))
  }
  get_print_125(awb_no, option, id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'download/print_' + option + '?bill_no=' + awb_no + '&id=' + id, { responseType: 'json' }).pipe(retry(2))
  }
  get_Online_Status(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_online_status', { responseType: 'json' }).pipe(retry(2))
  }
  get_print_bar(awb_no): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'download/barcode_print_label?bill_no=' + awb_no, { responseType: 'json' }).pipe(retry(2))
  }
  update_status(awb_no, id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'update_o_status?id=' + awb_no + '&sts=' + id, { responseType: 'json' }).pipe(retry(2))
  }
  get_Inv_id_by_no(awb_no, code): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'Get_inv_Id_from_inv_No?NO=' + awb_no + '&point=' + code, { responseType: 'json' }).pipe(retry(2))
  }
  get_transit_type(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_transit_type').pipe(retry(2))
  }
  get_service_type(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_service_type?id=' + id).pipe(retry(2))
  }
  get_service_typeall(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_service_type_all').pipe(retry(2))
  }
  v1_get_m_branch_rate_philippines(ser, reg, box): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_get_m_branch_rate_philippines?_s=' + ser + '&_r=' + reg + '&_b=' + box).pipe(retry(2))
  }
  get_country(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_country').pipe(retry(2))
  }
  getemployeeBasedOnBranch(orderNo): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_employee_based_on_branch?point=' + orderNo, { responseType: 'json' }).pipe(retry(2))
  }
  get_CO_Loader(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_Master + 'get_CO_Loader').pipe(retry(2))
  }
  getPickupNonAssignList(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_Pickup_non_assignList').pipe(retry(2))
  }
  orderViewAssign(orderNo): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_Pickup_non_assignList_by_OrderNo?orderNo=' + orderNo, { responseType: 'json' }).pipe(retry(2))
  }
  update_Pickup_assignToBranch(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_Pickup_assignToBranch', JSON.stringify(data), { responseType: 'json' }).pipe(retry(2))
  }
  update_Pickup_nonassignToBranch(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_Pickup_nonassignToBranch', JSON.stringify(data), { responseType: 'json' }).pipe(retry(2))
  }
  getPickupAssignList(clientId, _f): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'getHawbListAssigned?clientId=' + clientId + '&_f=' + _f, { responseType: 'json' }).pipe(retry(2))
  }
  getPickupNonAllocationList(_f, _u, _st, _end): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'getPickupNonAllocationList?_f=' + _f + '&_u=' + _u + '&_st=' + _st + '&_end=' + _end, { responseType: 'json' }).pipe(retry(2))
  }

  update_Pickup_allocated_to_staff(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_Pickup_allocated_to_staff', JSON.stringify(data), { responseType: 'json' }).pipe(retry(2))
  }
  update_Pickup_nonAllocatedToBranch(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_Pickup_nonAllocatedToBranch', JSON.stringify(data), { responseType: 'json' }).pipe(retry(2))
  }
  getPickupNonPickedupList(clientId, id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'getPickupNonPickedupList?clientId=' + clientId + '&_id=' + id, { responseType: 'json' }).pipe(retry(2))
  }
  insert_hawb_order(data) {
    return this.http.post(Constant.CONSTANT_API + 'insert_hawb_Details_order', JSON.stringify(data))
  }
  update_Pickup_confirm(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_Pickup_confirm', JSON.stringify(data), { responseType: 'json' }).pipe(retry(2))
  }


  get_OrderClientConformation(clientId, user): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_OrderClientConfirmed?_f=' + clientId + '&_p=' + user, { responseType: 'json' }).pipe(retry(2))
  }
  get_Pickup_pickedupList(clientId, id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_Pickup_pickedupList?clientId=' + clientId + '&_id=' + id, { responseType: 'json' }).pipe(retry(2))
  }


  get_Pickup_allocatedList(clientId, id, flag): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_Pickup_allocatedList?clientId=' + clientId + '&_id=' + id + '&flag=' + flag, { responseType: 'json' }).pipe(retry(2))
  }
  get_OrderClientAllocated(clientId, point): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_OrderClientAllocated?_f=' + clientId + '&_p=' + point, { responseType: 'json' }).pipe(retry(2))
  }
  get_OrderClientAssigned(clientId): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_OrderClientAssigned?_f=' + clientId, { responseType: 'json' }).pipe(retry(2))
  }
  getBranchBasedOnCountry(countryId): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_branch_based_on_country?country_id=' + countryId).pipe(retry(2))
  }
  v1_ac_get_current_balance_amount_branch(acc, date): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_ac_get_current_balance_amount_branch?_t=' + acc + '&_d=' + date).pipe(retry(2))
  }
  v1_o_ac_voucher_Insert_tranfer(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_voucher_Insert_journal', data).pipe(retry(2))
  }
  get_type(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_type').pipe(retry(2))
  }
  get_Custom_Itemname(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_Custom_Itemname').pipe(retry(2))
  }
  get_State_By_Region_Id(region_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_State_By_Region_Id?region_id=' + region_id, { responseType: 'json' }).pipe(retry(2))
  }
  get_statebycid(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_state_by_country?id=' + id).pipe(retry(2))
  }
  v1_m_bank_details(id: string): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'v1_m_bank_details?_point=' + id).pipe(retry(2))
  }
  get_District_By_State_Select(stateId): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_District_By_State_Select?stateId=' + stateId, { responseType: 'json' }).pipe(retry(2))
  }
  SP_M_Ba_Booking_Agent_By_Branch(pointId): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_Booking_Agent_By_Branch?pointId=' + pointId, { responseType: 'json' }).pipe(retry(2))
  }
  get_Region_By_Country_Id(country_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_Region_By_Country_Id?country_id=' + country_id, { responseType: 'json' }).pipe(retry(2))
  }
  get_branch_By_Country_Id(country_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_origin_by_country?country_id=' + country_id, { responseType: 'json' }).pipe(retry(2))
  }
  get_awb_no(pointId): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'Get_Available_AWB_No?pointId=' + pointId, { responseType: 'json' }).pipe(retry(2))
  }
  packing_list_pdf(no, list, code): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'download/print_Packing_empty?no=' + no + '&list=' + list + '&code=' + code, { responseType: 'json' }).pipe(retry(2))
  }
  get_doc_type(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_m_document_type', { responseType: 'json' }).pipe(retry(2))
  }
  get_destination(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'detination_get_loading_place', { responseType: 'json' }).pipe(retry(2))
  }
  get_InvItem_By_Inv(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_InvItem_By_Inv?ip_invoiceId=' + id).pipe(retry(2))
  }
  insert_InvItem_By_Inv(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_InvItem_By_Inv', JSON.stringify(item)).pipe(retry(2))
  }
  update_InvItem_By_Inv(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_InvItem_By_Inv', JSON.stringify(item)).pipe(retry(2))
  }
  delete_InvItem_By_Inv(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'delete_InvItem_By_Inv?id=' + id).pipe(retry(2))
  }
  get_Dimension_By_Inv(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_dimension?invoiceNo=' + id).pipe(retry(2))
  }
  insert_Dimension_By_Inv(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_dimension', JSON.stringify(item)).pipe(retry(2))
  }
  update_Dimension_By_Inv(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_dimension', JSON.stringify(item)).pipe(retry(2))
  }
  delete_Dimension_By_Inv(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'delete_dimension?invoiceNo=' + id).pipe(retry(2))
  }
  Insertitems(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_item_details', JSON.stringify(item)).pipe(retry(2))
  }
  Insertitemsbulk(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_item_details_bulk', JSON.stringify(item)).pipe(retry(2))
  }
  get_customer_By_Country_Id(country_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_by_id?country_id=' + country_id, { responseType: 'json' }).pipe(retry(2))
  }
  get_item_search(item_name): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_item_name?item_name=' + item_name, { responseType: 'json' }).pipe(retry(2))
  }
  get_customer_search(cus_id, mob): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_by_id_mob?cus_id=' + cus_id
      + '&mob=' + mob, { responseType: 'json' }).pipe(retry(2))
  }
  Inserthawb(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_hawb_Details', JSON.stringify(item)).pipe(catchError(this.handleError))
  }
  insert_hawb_Details_ph(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_hawb_Details_ph', JSON.stringify(item)).pipe(catchError(this.handleError))
  }
  update_Invoice_Amount_Details(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_Invoice_Amount_Details', JSON.stringify(item)).pipe(retry(2))
  }
  Insert_Item(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_item_details_bulk_new', JSON.stringify(item)).pipe(retry(2))
  }
  insert_item_details_audit(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_item_details_audit', JSON.stringify(item)).pipe(retry(2))
  }
  Insert_CartonNew(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_cartonDetails_New', JSON.stringify(item)).pipe(retry(2))
  }
  Update_Item(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_item_details', JSON.stringify(item)).pipe(retry(2))
  }
  insert_carton(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_cartonDetails', JSON.stringify(item)).pipe(retry(2))
  }
  get_item_by_invoice(invoice_no): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_item_by_invoice?invoice_no=' + invoice_no, { responseType: 'json' }).pipe(retry(2))
  }
  get_carton_by_invoice(invoice_no): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_carton_by_invoice?invoice_no=' + invoice_no, { responseType: 'json' }).pipe(retry(2))
  }
  get_item_type(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_item_type', { responseType: 'json' }).pipe(retry(2))
  }
  get_operation_By_Country_Id(country_id, region_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_operation_facility?country_id=' + country_id + '&region_id=' + region_id).pipe(retry(2))
  }
  get_customer_kyc(country_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_kyc?country_id=' + country_id).pipe(retry(2))
  }
  updateCarton(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_carton_details', JSON.stringify(item)).pipe(retry(2))
  }
  get_all_details_by_invoice(invoice_no): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_invoice_details_by_invoice?invoice_no=' + invoice_no, { responseType: 'json' }).pipe(retry(2))
  }
  get_currency(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_currency', { responseType: 'json' }).pipe(retry(2))
  }
  get_rate_date(point_id, region_id, transit_type_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_date_rate?point_id=' + point_id +
      '&region_id=' + region_id + '&transit_type_id=' + transit_type_id, { responseType: 'json' }).pipe(retry(2))
  }

  get_Hawb_Details(inv_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_Hawb_Details?ip_invoiceId=' + inv_id, { responseType: 'json' }).pipe(retry(2))
  }
  get_Invoice_Amount_Details(inv_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_Invoice_Amount_Details?ip_invoiceId=' + inv_id, { responseType: 'json' }).pipe(retry(2))
  }
  get_Invoice_Amount_Details_parent(inv_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_Invoice_Amount_Details_parent?ip_invoiceId=' + inv_id, { responseType: 'json' }).pipe(retry(2))
  }
  get_label_print(awb_no): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'download/print_label?bill_no=' + awb_no, { responseType: 'json' }).pipe(retry(2))
  }
  delete_carton(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'delete_Carton_Details?id=' + id).pipe(retry(2))
  }
  updatehawb(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update_hawb_Details', JSON.stringify(item)).pipe(retry(2))
  }
  updateInvoiceCancal(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'update/invoice_cancel_bill', JSON.stringify(item)).pipe(retry(2))
  }
  deleteitemDetails(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'delete_item_details?id=' + id).pipe(retry(2))
  }
  get_receiver_popup(sid, rid): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_receiver_by_sender?sid=' + sid +
      '&rid=' + rid, { responseType: 'json' }).pipe(retry(2))
  }
  get_forign_currency_by_country_code(sid): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_forign_currency_by_country_code?code=' + sid, { responseType: 'json' }).pipe(retry(2))
  }
  get_holiday(point_id, region_id, transit_type_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_date_holidays?point_id=' + point_id +
      '&region_id=' + region_id + '&transit_type_id=' + transit_type_id, { responseType: 'json' }).pipe(retry(2))
  }
  get_branch_by_point(point) {
    return this.http.get(Constant.CONSTANT_API + 'get_branch_by_point?_p=' + point).pipe(retry(2))
  }
  get_agentList(point, type) {
    return this.http.get(Constant.CONSTANT_API + 'get_agent_by_type?_p=' + point + '&_a=' + type).pipe(retry(2))
  }
  Insertitemsvoice(item): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_item_voice', JSON.stringify(item)).pipe(retry(2))
  }
  getDashboard_Count(ip_from_date, ip_to_date, point_id, ip_countryID, ip_flag): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'getDashboard_Count?ip_from_date=' + ip_from_date + '&ip_to_date=' + ip_to_date + '&point_id=' + point_id + '&ip_countryID=' + ip_countryID + '&ip_flag=' + ip_flag, { responseType: 'json' }).pipe(retry(2))
  }
  getDashboard_Details(ip_from_date, ip_to_date, point_id, ip_countryID, ip_flag): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'getDashboard_Details?ip_from_date=' + ip_from_date + '&ip_to_date=' + ip_to_date + '&point_id=' + point_id + '&ip_countryID=' + ip_countryID + '&ip_flag=' + ip_flag, { responseType: 'json' }).pipe(retry(2))
  }
  get_details_by_pincode(pincode): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_details_by_pincode?pincode=' + pincode, { responseType: 'json' }).pipe(retry(2))
  }
  // send_pdf_to_customer(name,ph_no,url):Observable<any>{
  //   return this.http.get('http://www.saudialert.com/pushsms.php?username=jaheerst&api_password=6f5f5fd21npkryfg4&sender=ST-CARGO-AD&to='
  //   +ph_no+'&message='+name+'Thanks for your booking. Click here to download your Invoice bill '+url+'&priority=12&e_id=123&t_id=112')
  // }
  send_pdf_to_customer(name, ph_no, url): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'request_send?num=' + ph_no + '&id='
      + 'Hi ' + name + ', Thanks for Booking. Click here to view your booking pdf ' + url, { responseType: 'json' }).pipe(retry(2))

  }
  employee_name_based_pointId(point_id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'employee_name_based_pointId?point_id=' + point_id).pipe(retry(2))
  }
  get_customer_search_id(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_search_id?id=' + id).pipe(retry(2))
  }
  getcreditReport(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'getcreditReport?_f=&_b=' + id.branch).pipe(retry(2))
  }
  updateCreditPayment(id): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'updateCreditPayment', JSON.stringify(id)).pipe(retry(2))
  }
  get_customer_search_new(id, name, country_id, mobile, start, end): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_customer_search?id=' + id
      + '&mobile=' + mobile + '&country_id=' + country_id + '&name=' + name + '&start=' + start + '&end=' + end).pipe(retry(2))
  }
  sendClickEvent(data) {
    this.subject.next(data);
  }
  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }


  get_expense(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_o_ac_daily_expense_select?id=' + id).pipe(retry(2))
  }
  get_voucher_new(id, point): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_o_ac_voucher_get?_t=' + id + '&_p=' + point).pipe(retry(2))
  }
  get_voucher(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_o_ac_voucher_get?id=' + id).pipe(retry(2))
  }
  v1_SP_m_expense_types(name): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_m_expense_types?_n=' + name).pipe(retry(2))
  }
  v1_SP_m_expense_types_head(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_m_expense_types_head').pipe(retry(2))
  }
  v1_SP_get_o_account_head_by_point(id, type): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_get_o_account_head_by_point?_p=' + id + '&_t=' + type).pipe(retry(2))
  }
  v1_ac_get_acc_ledger_export(point, from, to): Observable<any> {
    var data = { "from_date": from, "to_date": to, "account": point }
    return this.http.post(Constant.CONSTANT_API_SPRING + 'generateAccount_LedgerReport', data).pipe(retry(2))
  }
  v1_m_get_bank_details_by_region(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_m_get_bank_details_by_region?_p=' + id).pipe(retry(2))
  }
  v1_get_m_item_list(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'v1_get_m_item_list?_p=').pipe(retry(2))
  }
  v1_get_voucher_list_transaction(t, p): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_get_voucher_list_transaction?_t=' + t + '&_p=' + p).pipe(retry(2))
  }
  download_voucher(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_SPRING + 'invoicePDF', data).pipe(retry(2))
  }
  expesne_insert(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_daily_expense_Insert', JSON.stringify(data)).pipe(retry(1))
  }
  insert_voucher(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_voucher_Insert', JSON.stringify(data)).pipe(retry(1))
  }

  v1_o_ac_voucher_Insert_journal(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_voucher_Insert_journal', JSON.stringify(data)).pipe(retry(1))
  }

  get_boxType(type): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_m_box_type_Insert?_t=' + type).pipe(retry(2))
  }
  box_sales_entry_select(point): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_o_ac_box_sales_entry_select?_p=' + point).pipe(retry(2))
  }
  insert_box_sale(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'box_sales_entry_Insert', JSON.stringify(data)).pipe(retry(1))
  }

  getConsignmentBilling(list): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'read/getConsignmentBilling?from_date=' + list.ip_from_date + '&to_date=' + list.ip_to_date + '&_reg=' + list.region).pipe(retry(2))
  }
  getCharges(id): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'read/getConsignmentCharges?_cm=' + id).pipe(retry(2))
  }
  v1_get_clearance_charge_type(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_get_clearance_charge_type?_cm=').pipe(retry(2))
  }
  insertCharges(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_mawb_charge_Insert', data).pipe(retry(2))
  }

  get_daybook(point, from, to): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_ac_get_current_balance_amount?_f=' + from + '&_t=' + to + '&_p=' + point).pipe(retry(2))
  }

  v1_ac_get_acc_ledger(point, from, to): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_ac_get_acc_ledger?_f=' + from + '&_t=' + to + '&_p=' + point).pipe(retry(2))
  }

  v1_SP_Report_care_of_agent_bill_report(point, from, to): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_Report_care_of_agent_bill_report?_f=' + from + '&_t=' + to + '&_p=' + point).pipe(retry(2))
  }

  bill_gen_agent(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_agent_billing_Insert', JSON.stringify(data)).pipe(retry(1))
  }

  v1_SP_o_ac_airwaybill_purchase_insert(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_SP_o_ac_airwaybill_purchase_insert', JSON.stringify(data)).pipe(retry(1))
  }

  v1_o_ac_agent_sales_Insert(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_agent_sales_Insert', JSON.stringify(data)).pipe(retry(1))
  }

  v1_o_ac_agent_sales_Update(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_agent_sales_Update', JSON.stringify(data)).pipe(retry(1))
  }

  v1_o_ac_purchase_entry_Insert(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_purchase_entry_Insert', JSON.stringify(data)).pipe(retry(1))
  }

  v1_m_discount_approval_otp_insert(data): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_m_discount_approval_otp_insert', JSON.stringify(data)).pipe(retry(1))
  }

  get_agent_bill_report(datas): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + "v1_o_ac_bill_generation_get?agent_id=" + datas.agent
      + "&from_date=" + datas.from_date + "&to_date=" + datas.to_date + "&_service=" + datas.service_type).pipe(retry(2))
  }

  v1_o_ac_agent_forwding_list(datas): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + "v1_o_ac_agent_forwding_list?agent=" + datas.agent
      + "&from=" + datas.from + "&to=" + datas.to + "&_service=" + datas.service_type).pipe(retry(2))
  }

  getPurchase(user): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'read/v1_SP_o_ac_airwaybill_purchase_get?_u=' + user).pipe(retry(2))
  }

  v1_o_ac_agent_sales_Select(point): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_o_ac_agent_sales_Select?_p=' + point).pipe(retry(2))
  }
  deleteAgentSales(point): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API + 'v1_o_ac_agent_sales_delete/' + point).pipe(retry(2))
  }

  deleteVoucherSales(point): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API + 'v1_o_ac_voucher_delete/' + point).pipe(retry(2))
  }

  deleteTransactionSales(point): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API + 'v1_o_ac_transaction_delete/' + point).pipe(retry(2))
  }

  deletePurchaseEntry(point): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API + 'v1_o_ac_purchase_delete/' + point).pipe(retry(2))
  }

  v1_o_ac_awb_purchase_delete(point): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API + 'v1_o_ac_awb_purchase_delete/' + point).pipe(retry(2))
  }

  deleteExpenseEntry(point): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API + 'v1_o_ac_expense_delete/' + point).pipe(retry(2))
  }

  v1_o_ac_purchase_entry_get(point): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'v1_o_ac_purchase_entry_get?_p=' + point).pipe(retry(2))
  }



  GetOperationUpdate(date, todate, point_id) {
    return this.http.get(Constant.CONSTANT_API + 'get_invoice_list?date=' + date + '&t_date=' + todate + '&point_id=' + point_id)
  }
  GetOperationUpdateStatus(date) {
    return this.http.get(Constant.CONSTANT_API + 'get_invoice_list_status?date=' + date)
  }
  GetOperationStatus() {
    return this.http.get(Constant.CONSTANT_API + 'booking_get_operation_type_details')
  }
  UppdateOperation(data) {
    return this.http.put(Constant.CONSTANT_API + 'booking_update_operation_status_new', JSON.stringify(data))

  }

  get_operation_status(awb_no): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'getoperationStatus?inv=' + awb_no)
  }
  get_otg_dispatch_report(from_date, to_date, point): Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_org_dispatch_report?from=' + from_date + '&to=' + to_date + '&point=' + point).pipe(retry(2))
  }

  delete_operation_status(data) {
    return this.http.post(Constant.CONSTANT_API + 'v1_SP_Manifest_detail_delete', JSON.stringify(data))
  }
  sp_v1_ds_history_log_events_insert(hawb,done,oper){
    return this.http.get(Constant.CONSTANT_API + 'sp_v1_ds_history_log_events_insert?hawb_no='+hawb+'&done='+done+'&operation_status='+oper)
  }

get_booking_agent(){
    return this.http.get('https://api.cargoforce.com/master/Master_php_testing/index.php/get_booking_agent?_p=1')
  }



}
