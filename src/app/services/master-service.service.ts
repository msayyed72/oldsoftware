import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  base_api = 'http://localhost/fileupload-api/'
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  delete_des(id){
    return this.http.delete('http://65.0.1.125:81/stcargo.net/ST_Origin/St_api_php_booking/index.php/v1_SP_ds_ticket_sales_Delete/'+id).pipe(retry(2))
  }
  get_des_tab(id,point_id){
    return this.http.get('http://65.0.1.125:81/stcargo.net/ST_Origin/St_api_php_booking/index.php/v1_SP_ds_ticket_sales_Select?ticket_id='+id+'&point_id='+point_id).pipe(retry(2))
  }
  Update_des(item) {
    return this.http.put('http://65.0.1.125:81/stcargo.net/ST_Origin/St_api_php_booking/index.php/v1_SP_ds_ticket_sales_Update', JSON.stringify(item)).pipe(retry(2))
  }
get_des_insert(item){
  return this.http.post('http://65.0.1.125:81/stcargo.net/ST_Origin/St_api_php_booking/index.php/v1_SP_ds_ticket_sales_Insert', JSON.stringify(item)).pipe(retry(2))
}
  get_des(){
    return this.http.get('http://65.0.1.125:81/stcargo.net/ST_Origin/St_api_php_booking/index.php/v1_SP_m_ticket_destination_Select').pipe(retry(2))
  }
  get_country(){
    return this.http.get('http://65.0.1.125:81/stcargo.net/ST_Master/ST_Master_php_testing/index.php/get_country').pipe(retry(2))
  }
  getCountry() {
    return this.http.get(Constant.CONSTANT_API3 + 'get_country').pipe(retry(2))
  }
  get_deliverd(values){
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_Report_Admin_get_delivered?origin_country='+values.origin_country+'&dest_country='+values.dest_country+'&branch='+values.branch+'&fromdate='+values.fromdate+'&todate='+values.todate).pipe(retry(2))
  }
  get_undeliverd(values){
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_Report_Admin_get_Undelivered?origin_country='+values.origin_country+'&dest_country='+values.dest_country+'&delivery_area_id='+values.delivery_area_id+'&region_id='+values.region_id+'&branch='+values.branch+'&fromdate='+values.fromdate+'&todate='+values.todate).pipe(retry(2))
  }
  get_area(id){
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_get_loading_delivery_area_by_region?region_id_area='+id).pipe(retry(2))
  }
  get_branchwise(values){
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_Report_Admin_get_branch_stock?country='+values.country+'&branch='+values.branch+'&fromdate='+values.fromdate+'&todate='+values.todate).pipe(retry(2))
  }
 
  getwharehouse(values){
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_Report_Admin_get_warehouse_stock?country='+values.country+'&exchange_point_id='+values.exchange_point_id+'&fromdate='+values.fromdate+'&todate='+values.todate).pipe(retry(2))

  }
  get_region(country_code){
    return this.http.get(Constant.CONSTANT_API3+'get_regionname_by_country?country_code='+country_code).pipe(retry(2))
  
  }
  get_agent_report(values){
    return this.http.get(Constant.CONSTANT_API + 'v1_SP_Report_Admin_get_agent_stock?country='+values.country+'&agent_point_id='+values.agent_point_id+'&fromdate='+values.fromdate+'&todate='+values.todate).pipe(retry(2))

  }
  getagent(){
    return this.http.get( 'http://65.0.1.125:81/stcargo.net/ST_Master/ST_Master_php_testing/index.php/get_booking_agent')
  }
  get_country_warehouse(id) {
    return this.http.get( 'http://65.0.1.125:81/stcargo.net/ST_Master/ST_Master_php_testing/index.php/get_country_based_WH?id='+id)
  }
  get_origin(id){
    return this.http.get('http://65.0.1.125:81/stcargo.net/ST_Master/ST_Master_php_testing/index.php/get_loading_country_based_origin?country_code='+id).pipe(retry(2))
  }
  get_pdf(id,point_id): Observable<any>{
    return this.http.get('http://65.0.1.125:81/stcargo.net/ST_Origin/St_api_php_booking/index.php/ticket_print_pdf?ticket_id='+id+'&point_id='+point_id).pipe(retry(2))
  }
  get_pdf_label(id,point_id): Observable<any>{
    return this.http.get('http://65.0.1.125:81/stcargo.net/ST_Origin/St_api_php_booking/index.php/ticket_print_pdf_new?ticket_id='+id+'&point_id='+point_id).pipe(retry(2))
  }
  getLogin(id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_login?id=' + id).pipe(retry(2))
  }
  change_cp(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'change_ps', JSON.stringify(userItem)).pipe(retry(2))
  }
  request_send(id,num,pr) {
    return this.http.get('http://www.saudialert.com/pushsms.php?username=jaheerst&api_password=6f5f5fd21npkryfg4&sender=ST-CARGO-AD&to='+num+'&message=One Time Password for your application is '+id+'&priority='+pr+'&e_id=123&t_id=112')
  }
  branch_bulk(userItem): Observable<any> {
    return this.http.post('http://65.0.1.125:81/stcargo.net/ST_Master/ST_Master_php_testing/index.php/branch_bulk_upload', JSON.stringify(userItem)).pipe(retry(2))
  }
  request_send_log(num,mail) {
    return this.http.get('http://45.118.162.26:81/Cargo_force/Origin_v2/send_email/index.php/request_send_log?no='+num+'&mail='+mail)
  }
  get_print_inv_pdf(num) {
    return this.http.get('http://65.0.1.125:81/stcargo.net/ST_Origin_v1/St_cargo_origin_api/index.php/get_manifest_dispatch_report?No='+num)
  }
  ins_track_history(no,pnt,usr) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'ins_track_history?invNo='+no+'&pnt='+pnt+'&usr='+usr)
  }
  get_track_history(no) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_track_history?pnt='+no)
  }
  getDestination_receiving_f_branch(point_type) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_destination_receiving_f_branch?point_type=' + point_type).pipe(retry(2))
  }
  getManifest_receiving_f_branch(pointId,f,t) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_receiving_f_branch?pointId=' + pointId+'&f='+f+'&t='+t).pipe(retry(2))
  }
  InsertManifest_receiving_f_branch(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_receiving_f_branch', JSON.stringify(userItem)).pipe(retry(2))
  }
  UpdateManifest_receiving_f_branch(item): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_manifest_receiving_f_branch', JSON.stringify(item)).pipe(retry(2))
  }
  deleteManifest_receiving_f_branch(id) {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_manifest_receiving_f_branch/' + id).pipe(retry(2))
  }
  getDestination_receiving_f_warehouse(point_type) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_destination_receiving_f_warehouse?point_type=' + point_type).pipe(retry(2))
  }
  getManifest_receiving_f_warehouse(pointId) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_receiving_f_warehouse?pointId=' + pointId).pipe(retry(2))
  }
  InsertManifest_receiving_f_warehouse(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_receiving_f_warehouse', JSON.stringify(userItem)).pipe(retry(2))
  }
  UpdateManifest_receiving_f_warehouse(item): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_manifest_receiving_f_warehouse', JSON.stringify(item)).pipe(retry(2))
  }
  deleteManifest_receiving_f_warehouse(id) {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_manifest_receiving_f_warehouse/' + id).pipe(retry(2))
  }
  getDestination_B_To_B(point_type) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_destination_b_to_b?point_type=' + point_type).pipe(retry(2))
  }
  getDestination_branch_new(point_id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_destination_branch_new?point_id=' + point_id).pipe(retry(2))
  }
  getDestination_warehouse_new(point_id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_destination_warehouse_new?point_id=' + point_id).pipe(retry(2))
  }
  getDestination_dispatch(cid) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_dispatch_dest?cid=' + cid).pipe(retry(2))
  }
  getManifest_B_To_B(pointId) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_b_to_b?pointId=' + pointId).pipe(retry(2))
  }
  InsertManifest_B_To_B(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_b_to_b', JSON.stringify(userItem)).pipe(retry(2))
  }
  UpdateManifest_B_To_B(item): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_manifest_b_to_b', JSON.stringify(item)).pipe(retry(2))
  }
  deleteManifest_B_To_B(id) {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_manifest_b_to_b/' + id).pipe(retry(2))
  }
  getDestination_B_To_W(point_type) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_destination_b_to_w?point_type=' + point_type).pipe(retry(2))
  }
  getManifest_b_to_w(pointId,f,t) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_b_to_w?pointId=' + pointId+'&f='+f+'&t='+t).pipe(retry(2))
  }
  InsertManifest_b_to_w(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_b_to_w', JSON.stringify(userItem)).pipe(retry(2))
  }
  UpdateManifest_b_to_w(item): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_manifest_b_to_w', JSON.stringify(item)).pipe(retry(2))
  }
  deleteManifest_b_to_w(id) {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_manifest_b_to_w/' + id).pipe(retry(2))
  }
  //receiving
  getPackingConditionReceivingBranch() {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_packing_condition_receiving_branch').pipe(retry(2))
  }
  getRackReceivingBranch(current_point_id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_rack_receiving_branch?current_point_id=' + current_point_id).pipe(retry(2))
  }
  getPalleteReceivingBranch(wh_rack_id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_pallete_receiving_branch?wh_rack_id=' + wh_rack_id).pipe(retry(2))
  }
  getNonClearedCartonDetailsReceivingBranch(p_currentManifestNumber, p_refManifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_non_cleared_cartondetails_receiving_branch?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }
  getStopCartonDetailsReceivingBranch(p_currentManifestNumber, p_refManifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stopcarton_details_receiving_branch?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }
  getReceivedConsignmentNumberReceivingBranch(manifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_received_consignment_number_receiving_branch?manifestNumber=' + manifestNumber).pipe(retry(2))
  }
  getClearedCartonDetailsReceivingBranch(p_currentManifestNumber, p_refManifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_cleared_carton_details_receiving_branch?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }
  v1_sp_get_agent_bill_from_manifest(mf_no) {
    return this.http.get(Constant.CONSTANT_API + 'v1_sp_get_agent_bill_from_manifest?_mfNo=' + mf_no).pipe(retry(2))
  }
  v1_sp_get_agent_bill_delete(mf_no) {
    return this.http.delete(Constant.CONSTANT_API + 'v1_o_ac_agent_bill_delete/'+mf_no).pipe(retry(2))
  }
  getassignbyinvoice_no_receiving_branch(invoice_no) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_invoice_details_receiving_branch?invoice_no=' + invoice_no).pipe(retry(2))
  }
  InsertReceivingBranch(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_receiving_branch', JSON.stringify(userItem)).pipe(retry(2))
  }
  UpdateReceivingBranch(item): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_receiving_branch', JSON.stringify(item)).pipe(retry(2))
  }
  deleteClearedCartonReceivingBranch(id) {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_cleared_carton_receiving_branch/' + id).pipe(retry(2))
  }
  deleteClearedCartonReceivingBranchall(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'delete_cleared_carton_receiving_branch_all', JSON.stringify(userItem)).pipe(retry(2))
  }
  getDestination_from_booking_agent(point_type) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_destination_from_booking_agent?point_type=' + point_type).pipe(retry(2))
  }
  v1_SP_m_point_booking_agent_Select_by_regional(point_type) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'v1_SP_m_point_booking_agent_Select_by_regional?point_type=' + point_type).pipe(retry(2))
  }
  get_agentReport(point) {
    return this.http.get(Constant.CONSTANT_API + 'v1_o_ac_agent_payment_voucher?_ag=' + point).pipe(retry(2))
  }
  getManifest_from_booking_agent(pointId,from,to) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_from_booking_agent?pointId=' + pointId +'&startLimit='+from+'&endLimit='+to).pipe(retry(2))
  }
  InsertManifest_from_booking_agent(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_from_booking_agent', JSON.stringify(userItem)).pipe(retry(2))
  }
  v1_o_ac_agent_payment_Insert(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_agent_payment_Insert', JSON.stringify(userItem)).pipe(retry(2))
  }
  UpdateManifest_from_booking_agent(item): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_manifest_from_booking_agent', JSON.stringify(item)).pipe(retry(2))
  }
  deleteManifest_from_booking_agent(id) {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_manifest_from_booking_agent/' + id).pipe(retry(2))
  }
  // receiving booking agent
  getPackingConditionfrom_boooking_agnet() {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_packing_condition_from_boooking_agnet').pipe(retry(2))
  }
  getRackfrom_boooking_agnet(current_point_id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_rack_from_boooking_agnet?current_point_id=' + current_point_id).pipe(retry(2))
  }
  getPalletefrom_boooking_agnet(wh_rack_id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_pallete_from_boooking_agnet?wh_rack_id=' + wh_rack_id).pipe(retry(2))
  }
  getNonClearedCartonDetailsfrom_boooking_agnet(p_currentManifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_non_cleared_cartondetails_from_boooking_agnet?p_currentManifestNumber=' + p_currentManifestNumber).pipe(retry(2))
  }
  getStopCartonDetailsfrom_boooking_agnet(p_currentManifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stopcarton_details_from_boooking_agnet?p_currentManifestNumber=' + p_currentManifestNumber).pipe(retry(2))
  }
  getReceivedConsignmentNumberfrom_boooking_agnet(manifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_received_consignment_number_from_boooking_agnet?manifestNumber=' + manifestNumber).pipe(retry(2))
  }
  getClearedCartonDetailsfrom_boooking_agnet(p_currentManifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_cleared_carton_details_from_boooking_agnet?p_currentManifestNumber=' + p_currentManifestNumber).pipe(retry(2))
  }
  Insertfrom_boooking_agnet(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_from_boooking_agnet', JSON.stringify(userItem)).pipe(retry(2))
  }
  Updatefrom_boooking_agnet(item): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_from_boooking_agnet', JSON.stringify(item)).pipe(retry(2))
  }
  deleteClearedCartonfrom_boooking_agnet(id) {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_cleared_carton_from_boooking_agnet/' + id).pipe(retry(2))
  }
  //receiving  warehouse
  getPackingConditionreceiving_warehouse() {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_packing_condition_receiving_warehouse').pipe(retry(2))
  }
  getRackreceiving_warehouse(current_point_id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_rack_receiving_warehouse?current_point_id=' + current_point_id).pipe(retry(2))
  }
  getPalletereceiving_warehouse(wh_rack_id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_pallete_receiving_warehouse?wh_rack_id=' + wh_rack_id).pipe(retry(2))
  }
  getNonClearedCartonDetailsreceiving_warehouse(p_currentManifestNumber, p_refManifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_non_cleared_cartondetails_receiving_warehouse?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }
  getStopCartonDetailsreceiving_warehouse(p_currentManifestNumber, p_refManifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stopcarton_details_receiving_warehouse?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }
  getReceivedConsignmentNumberreceiving_warehouse(manifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_received_consignment_number_receiving_warehouse?manifestNumber=' + manifestNumber).pipe(retry(2))
  }
  getClearedCartonDetailsreceiving_warehouse(p_currentManifestNumber, p_refManifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_cleared_carton_details_receiving_warehouse?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }
  Insertreceiving_warehouse(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_receiving_warehouse', JSON.stringify(userItem)).pipe(retry(2))
  }
  Updatereceiving_warehouse(item): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_receiving_warehouse', JSON.stringify(item)).pipe(retry(2))
  }
  deleteClearedCartonreceiving_warehouse(id) {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_cleared_carton_receiving_warehouse/' + id).pipe(retry(2))
  }
  deleteClearedCartonreceiving_warehouseall(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'delete_cleared_carton_receiving_warehouse_all', JSON.stringify(userItem)).pipe(retry(2))
  }
  getstock_B_To_B(manifest) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stock_b_to_b?manifest=' + manifest).pipe(retry(2))
  }
  get_non_booking_B_To_B(manifest, childmanifest) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_non_booking_b_to_b?manifest=' + manifest + '&childmanifest=' + childmanifest).pipe(retry(2))
  }
  get_booking_B_To_B(manifest, childmanifest) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_booking_b_to_b?manifest=' + manifest + '&childmanifest=' + childmanifest).pipe(retry(2))
  }
  getInvoiceCartonDetailsreceiving_warehouse(barcode_no, manifestNumber) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_invoice_carton_details_receiving_warehouse?barcode_no=' + barcode_no + '&manifestNumber=' + manifestNumber).pipe(retry(2))
  }
  getStockDetailsgodown_b_to_b(point_id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stockdetailsgodown_b_to_b?point_id=' + point_id).pipe(retry(2))
  }
  getStockDetailsgodown_b_to_b_details(point_id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stockdetailsgodown_b_to_b_details?point_id=' + point_id).pipe(retry(2))
  }
  InsertForwardingBranchBooking(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_forwarding_branch_booking', JSON.stringify(userItem)).pipe(retry(2))
  }
  UpdateForwardingBranchBooking(item): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_forwarding_branch_booking', JSON.stringify(item)).pipe(retry(2))
  }
  deleteForwardingBranchBooking(mf_details_id) {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_forwarding_branch_booking/' + mf_details_id).pipe(retry(2))
  }
  deleteForwardingBranchBookingall(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'delete_forwarding_branch_booking_all', JSON.stringify(userItem)).pipe(retry(2))
  }
  InsertNonbookToBookBulk(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_nonbook_to_book_bulk', JSON.stringify(userItem)).pipe(retry(2))
  }
  getconfigure_destination_b_to_b() {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_configure_destination_b_to_b').pipe(retry(2))
  }
  getReasonCombobox_b_to_b(getStatusTypeId) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_reason_combobox_b_to_b?getStatusTypeId=' + getStatusTypeId).pipe(retry(2))
  }
  getfrom_branch_reci_available_manifest(sourcePointId, destinationPointId) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_from_branch_reci_available_manifest?sourcePointId=' + sourcePointId + '&destinationPointId=' + destinationPointId).pipe(retry(2))
  }
  getPostbookingPdf(point_id, manifest_number) {
    return this.http.get(Constant.CONSTANT_API2 + 'get_postbooking_pdf?point_id=' + point_id + '&manifest_number=' + manifest_number).pipe(retry(2))
  }
  getPostbookingPdfopen(point_id, manifest_number,TotalInvoice,BookingDate,
    TotalCarton,VehicleNo,BookedBy,TotalWeight,DriverName,DriverNo) {
    return this.http.get(Constant.CONSTANT_API2 + 'download/hawb_print_label?point_id=' + point_id + '&manifest_number=' 
    + manifest_number+'&TotalInvoice='+TotalInvoice+'&BookingDate='+BookingDate+'&TotalCarton='+
    TotalCarton+'&VehicleNo='+VehicleNo+'&BookedBy='+BookedBy+'&TotalWeight='+TotalWeight+'&DriverName='+
    DriverName+'&DriverNo='+DriverNo).pipe(retry(2))
  }
  getShipmentMode() {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_shipment_mode').pipe(retry(2))
  }
  getShipmentCompany(id) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_shipment_company?id=' + id).pipe(retry(2))
  }
  getSupplier(id) {
    return this.http.get(Constant.CONSTANT_API + 'read/v1_sp_get_supplier_list?_t=' + id).pipe(retry(2))
  }
  v1_m_ac_ledger_sub_head() {
    return this.http.get(Constant.CONSTANT_API + 'v1_m_ac_ledger_sub_head?_t=').pipe(retry(2))
  }
  v1_SP_o_ac_ledger_get_by_point(point) {
    return this.http.get(Constant.CONSTANT_API + 'read/v1_SP_o_ac_ledger_get_by_point?_p='+point).pipe(retry(2))
  }
  getAgentByRegion(id) {
    return this.http.get(Constant.CONSTANT_API3 + 'get_booking_agent?_p=' + id).pipe(retry(2))
  }
  v1_sp_get_clearance_rate(id) {
    return this.http.post(Constant.CONSTANT_API + 'v1_sp_get_clearance_rate',JSON.stringify(id)).pipe(retry(2))
  }
  v1_ac_ledger_insert(id) {
    return this.http.post(Constant.CONSTANT_API + 'v1_ac_ledger_insert',JSON.stringify(id)).pipe(retry(2))
  }
  v1_ac_ledger_update(id) {
    return this.http.post(Constant.CONSTANT_API + 'update/v1_SP_o_ac_ledger_balance_update',JSON.stringify(id)).pipe(retry(2))
  }
  v1_m_expense_insert(id) {
    return this.http.post(Constant.CONSTANT_API + 'v1_m_expense_insert',JSON.stringify(id)).pipe(retry(2))
  }
  v1_m_item_list_Insert(id) {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'v1_m_item_list_Insert',JSON.stringify(id)).pipe(retry(2))
  }
  get_o_ac_airway_bill_purchase_dispatch(air,sup,point) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_o_ac_airway_bill_purchase_dispatch?_sp='+sup+'&_al='+air+'&_p='+ point).pipe(retry(2))
  }
  InsertManifest_DP_to_SC(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_Dispatch_to_sCompany', JSON.stringify(userItem)).pipe(retry(2))
  }
  UpdateManifest_DP_to_SC(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'update_manifest_Dispatch_to_sCompany', JSON.stringify(userItem)).pipe(retry(2))
  }
  deleteManifest_DP_to_SC(id) {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'deleteManifest_DP_to_SC/' + id).pipe(retry(2))
  }
  getManifest_DP_to_SC(pointId,s,e) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_DP_to_SC?pointId=' + pointId+'&f='+s+'&t='+e).pipe(retry(2))
  }
  insertDispatch(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'Dispatch_manifest_to_sCompany', JSON.stringify(userItem)).pipe(retry(2))
  }
  insertunDispatch(mf_no): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'UnDispatch_manifest_to_sCompany?mf_no=' + mf_no).pipe(retry(2))
  }
  export_manifest(mf_no): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'export_manifest?no=' + mf_no).pipe(retry(2))
  }
  export_dispatch_manifest(mf_no,path): Observable<any> {
    return this.http.get('http://45.118.160.218:8080/BM_Cargo_Invoice_JED/invoice/'+path+'?consignmentNumber='+mf_no).pipe(retry(2))
  }
  getClr_Org(): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_clr_Org?no=').pipe(retry(2))
  }
  non_booked_ctn(mf_no): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_nonBooked_Ctn?mf_no='+mf_no).pipe(retry(2))
  }
  booked_ctn(mf_no): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_Booked_Ctn?mf_no='+mf_no).pipe(retry(2))
  }
  InsertToGoCargo(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_to_go_cargo', JSON.stringify(userItem)).pipe(retry(2))
  }
  UpdateToGoCargo(item): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_to_go_cargo', JSON.stringify(item)).pipe(retry(2))
  } 
  // hawb Allocation 
  
  getBranchHawbAllocation(point_type,point_id) {
    return this.http.get(Constant.CONSTANT_API + 'get_branch_allocation?point_type=' + point_type + '&point_id=' + point_id).pipe(retry(2))
  }
  getBranchName(location_type,location_id) {
    return this.http.get(Constant.CONSTANT_API + 'get_branch_master?location_type=' + location_type + '&location_id=' + location_id).pipe(retry(2))
  }
  getBranchStockStartNo(issueingpointId, receivingpointid,pointcodeprefix) {
    return this.http.get(Constant.CONSTANT_API + 'get_branch_stock_startNo?issueingpointId=' + issueingpointId + '&receivingpointid=' + receivingpointid  + '&pointcodeprefix=' + pointcodeprefix).pipe(retry(2))
  }
  InsertBranchAllocation(userItem): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_branch_allocation', JSON.stringify(userItem)).pipe(retry(2))
  }
  deleteBranchAllocation(c_note_issue_id,awb_starting_no,awb_ending_no,issuing_point_id,receiving_point_id) {
    return this.http.delete(Constant.CONSTANT_API + 'delete_Branch_Allocation/' + c_note_issue_id +'/' + awb_starting_no + '/' +awb_ending_no + '/'+issuing_point_id+'/'+receiving_point_id).pipe(retry(2))
  }

  // Quick Tracking
  getQuickTracking(invoice_no) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_quick_tracking?invoice_no=' + invoice_no).pipe(retry(2))
  }

  // Admin Tracking
  getInvoiceTracking(invoice_no) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_invoice_tracking?invoice_no=' + invoice_no).pipe(retry(2))
  }
  getCtnCmTracking(invoice_no) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_ctn_cm_tracking?invoice_no=' + invoice_no).pipe(retry(2))
  }
  getCartonCurrentStatus(invoice_no) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_carton_current_status?invoice_no=' + invoice_no).pipe(retry(2))
  }
  getCartonSummary(invoice_no) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_carton_summary?invoice_no=' + invoice_no).pipe(retry(2))
  }
  getCtnOprDate(invoice_no,carton_no) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_ctn_opr_date?invoice_no=' + invoice_no + '&carton_no=' + carton_no).pipe(retry(2))
  }
  getCartonTracking(invoice_no,carton_no) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_carton_tracking?invoice_no=' + invoice_no + '&carton_no=' + carton_no).pipe(retry(2))
  }
  getDeliveryTracking(invoice_no,carton_no) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_delivery_tracking?invoice_no=' + invoice_no + '&carton_no=' + carton_no).pipe(retry(2))
  }
    //DLY Schedule---------------------------------------
    Get_dly_schedule() {
      return this.http.get(Constant.CONSTANT_API + 'getDLY_schedule').pipe(retry(2))
    }
    Insert_dly_schedule(userItem): Observable<any> {
      return this.http.post(Constant.CONSTANT_API + 'insertDLY_schedule', JSON.stringify(userItem)).pipe(retry(2))
    }
    Update_dly_schedule(item): Observable<any> {
      return this.http.post(Constant.CONSTANT_API + 'updateDLY_schedule', JSON.stringify(item)).pipe(retry(2))
    }
    delete_dly_schedule(id) {
      return this.http.delete(Constant.CONSTANT_API + 'deleteDLY_schedule/' + id).pipe(retry(2))
    }
    //DLY Schedule-------------------------------------------------

    //DLY Schedule---------------------------------------
    getBranchRate() {
      return this.http.get(Constant.CONSTANT_API + 'getBranchRate').pipe(retry(2))
    }
    InsertBranchRate(userItem): Observable<any> {
      return this.http.post(Constant.CONSTANT_API + 'insertBranchRate', JSON.stringify(userItem)).pipe(retry(2))
    }
    UpdateBranchRate(item): Observable<any> {
      return this.http.post(Constant.CONSTANT_API + 'updateBranchRate', JSON.stringify(item)).pipe(retry(2))
    }
    deleteBranchRate(id) {
      return this.http.delete(Constant.CONSTANT_API + 'deleteBranchRate/' + id).pipe(retry(2))
    }
    getWarehouse() {
      return this.http.get(Constant.CONSTANT_API + 'get_Warehouse').pipe(retry(2))
    }
    getOriginBranchs() {
      return this.http.get(Constant.CONSTANT_API + 'get_origin_branch').pipe(retry(2))
    }
    get_ServiceArea() {
      return this.http.get(Constant.CONSTANT_API + 'getServiceArea').pipe(retry(2))
    }
    GetRegion() {
      return this.http.get(Constant.CONSTANT_API + 'get_Region').pipe(retry(2))
    }
    getTransit() {
      return this.http.get(Constant.CONSTANT_API + 'get_transit').pipe(retry(2))
    }
    getStockPdfopen(point_id) {
      return this.http.get(Constant.CONSTANT_API2 + 'download/stock_pdf?point_id=' + point_id).pipe(retry(2))
    }
    getClrorg() {
      return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_clr_org').pipe(retry(2))
    }
    getveh_ship_com(vh_no): Observable<any> {
      return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_veh_id_shi_com?vh_no='+vh_no).pipe(retry(2))
    }
    getBranchRateDashBoard(ip_branch) {
      return this.http.get(Constant.CONSTANT_API + 'getBranchRateDashBoard?ip_branch=' + ip_branch).pipe(retry(2))
    }
    getManualInvoiceDetails(invoice_no) {
      return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manual_invoice_details?invoice_no=' + invoice_no).pipe(retry(2))
    }
    getManualCartonDetails(carton_no,manifestNumber,invoice_no,oprMode) {
      return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manual_carton_details?carton_no=' + carton_no+'&manifestNumber='+manifestNumber+'&invoice_no='+invoice_no+'&oprMode='+oprMode).pipe(retry(2))
    }
    getManualbarcodeDetails(manifestNumber,barcode_no,oprMode) {
      return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manual_carton_details?manifestNumber='+manifestNumber+'&barcode_no='+barcode_no+'&oprMode='+oprMode).pipe(retry(2))
    }
    // 
    v1_SP_Report_Dispatch_Manifest_Wise_clearance_excel(manifest): Observable<any> {
      return this.http.get(Constant.CONSTANT_API_ORIGIN + 'v1_SP_Report_Dispatch_Manifest_Wise_clearance_excel?manifest='+manifest).pipe(retry(2))
    }

    agentBillGen(data) {
      return this.http.post(Constant.CONSTANT_API + 'v1_o_ac_agent_billing_Insert',data).pipe(retry(2))
    }
    downloadInvoice(data) {
      return this.http.get(Constant.CONSTANT_API + 'download/agent_bill_report?_inv='+data).pipe(retry(2))
    }
    v1_ac_get_acc_ledger_current_balance(acc,date) {
      return this.http.get(Constant.CONSTANT_API + 'v1_ac_get_acc_ledger_current_balance?_acc='+acc+'&_date='+date).pipe(retry(2))
    }
    v1_ac_get_acc_ledger_current_balance_opening(acc,date) {
      return this.http.get(Constant.CONSTANT_API + 'v1_ac_get_acc_ledger_current_balance_opening?_acc='+acc+'&_date='+date).pipe(retry(2))
    }
    get_agent_Bill_list(data) {
      return this.http.get(Constant.CONSTANT_API + 'get_agent_Bill_list?_b='+data).pipe(retry(2))
    }

    v1_ds_order_enquiry_insert(data) {
      return this.http.post(Constant.CONSTANT_API + 'v1_ds_order_enquiry_insert',data).pipe(retry(2))
    }

   

    v1_ds_pickup_order_get(f,t) {
      return this.http.get(Constant.CONSTANT_API + 'v1_ds_pickup_order_get?_f='+f+'&_t='+t).pipe(retry(2))
    }
  
}
