import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import  { retry,catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';
interface toBranch{
  data:any;
  invoice_no:any;
  color:any;
  transit_type_name:any;
  country_name:any;
}
@Injectable({
  providedIn: 'root'
})
export class BookingServiceService {

  constructor(private http:HttpClient) { }

  // get tobranch************************************************
  getDestination_branch_new(point_id:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_destination_branch_new?point_id=' + point_id).pipe(retry(2))
  }
  getManifest_B_To_B(pointId:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_b_to_b?pointId=' + pointId).pipe(retry(2))
  }
  getStockDetailsgodown_b_to_b(point_id:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stockdetailsgodown_b_to_b?point_id=' + point_id).pipe(retry(2))
  }
  getPostbookingPdf(point_id:any, manifest_number:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API2 + 'get_postbooking_pdf?point_id=' + point_id + '&manifest_number=' + manifest_number).pipe(retry(2))
  }
  getPostbookingPdfopen(point_id:any, manifest_number:any,TotalInvoice:any,BookingDate:any,
    TotalCarton:any,VehicleNo:any,BookedBy:any,TotalWeight:any,DriverName:any,DriverNo:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API2 + 'download/hawb_print_label?point_id=' + point_id + '&manifest_number=' 
    + manifest_number+'&TotalInvoice='+TotalInvoice+'&BookingDate='+BookingDate+'&TotalCarton='+
    TotalCarton+'&VehicleNo='+VehicleNo+'&BookedBy='+BookedBy+'&TotalWeight='+TotalWeight+'&DriverName='+
    DriverName+'&DriverNo='+DriverNo).pipe(retry(2))
  }
  getStockPdfopen(point_id:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API2 + 'download/stock_pdf?point_id=' + point_id).pipe(retry(2))
  }
  getStockDetailsgodown_b_to_b_details(point_id:any): Observable<any>{
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stockdetailsgodown_b_to_b_details?point_id=' + point_id).pipe(retry(2))
  }
  getShipmentCompanydif(id:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_shipment_company?id=' + id).pipe(retry(2))
  }

  // gettoBranchManifest
  getstock_B_To_B(manifest:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stock_b_to_b?manifest=' + manifest).pipe(retry(2))
  }
  getconfigure_destination_b_to_b():Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_configure_destination_b_to_b').pipe(retry(2))
  }
  getPackingConditionReceivingBranch():Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_packing_condition_receiving_branch').pipe(retry(2))
  }
  get_non_booking_B_To_B(manifest:any, childmanifest:any):Observable<any> {
    return this.http.get<any>(Constant.CONSTANT_API_ORIGIN + 'get_non_booking_b_to_b?manifest=' + manifest + '&childmanifest=' + childmanifest).pipe(retry(2))
  }
  get_booking_B_To_B(manifest:any, childmanifest:any):Observable<any>  {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_booking_b_to_b?manifest=' + manifest + '&childmanifest=' + childmanifest).pipe(retry(2))
  }
  getReasonCombobox_b_to_b(getStatusTypeId:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_reason_combobox_b_to_b?getStatusTypeId=' + getStatusTypeId).pipe(retry(2))
  }

  getassignbyinvoice_no_receiving_branch(invoice_no:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_invoice_details_receiving_branch?invoice_no=' + invoice_no).pipe(retry(2))
  }
  getInvoiceCartonDetailsreceiving_warehouse(barcode_no:any, manifestNumber:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_invoice_carton_details_receiving_warehouse?barcode_no=' + barcode_no + '&manifestNumber=' + manifestNumber).pipe(retry(2))
  }
  getManualInvoiceDetails(invoice_no:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manual_invoice_details?invoice_no=' + invoice_no).pipe(retry(2))
  }
  getManualCartonDetails(carton_no:any,manifestNumber:any,invoice_no:any,oprMode:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manual_carton_details?carton_no=' + carton_no+'&manifestNumber='+manifestNumber+'&invoice_no='+invoice_no+'&oprMode='+oprMode).pipe(retry(2))
  }
  getManualbarcodeDetails(manifestNumber:any,barcode_no:any,oprMode:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manual_carton_details?manifestNumber='+manifestNumber+'&barcode_no='+barcode_no+'&oprMode='+oprMode).pipe(retry(2))
  }

  // get warehouseto 
  getDestination_warehouse_new(point_id:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_destination_warehouse_new?point_id=' + point_id).pipe(retry(2))
  }
  getManifest_b_to_w(pointId:any,f:any,t:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_b_to_w?pointId=' + pointId+'&f='+f+'&t='+t).pipe(retry(2))
  }


  // getFromBranch
  getManifest_receiving_f_branch(pointId:any,f:any,t:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_receiving_f_branch?pointId=' + pointId+'&f='+f+'&t='+t).pipe(retry(2))
  }
  getfrom_branch_reci_available_manifest(sourcePointId:any, destinationPointId:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_from_branch_reci_available_manifest?sourcePointId=' + sourcePointId + '&destinationPointId=' + destinationPointId).pipe(retry(2))
  }
  getNonClearedCartonDetailsReceivingBranch(p_currentManifestNumber:any, p_refManifestNumber:any):Observable<any> {
    return this.http.get<toBranch>(Constant.CONSTANT_API_ORIGIN + 'get_non_cleared_cartondetails_receiving_branch?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }

  //getFromBranchManifest
  getRackReceivingBranch(current_point_id:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_rack_receiving_branch?current_point_id=' + current_point_id).pipe(retry(2))
  }
  getPalleteReceivingBranch(wh_rack_id:any):Observable<any>  {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_pallete_receiving_branch?wh_rack_id=' + wh_rack_id).pipe(retry(2))
  }
  getStopCartonDetailsReceivingBranch(p_currentManifestNumber:any, p_refManifestNumber:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stopcarton_details_receiving_branch?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }
  getReceivedConsignmentNumberReceivingBranch(manifestNumber:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_received_consignment_number_receiving_branch?manifestNumber=' + manifestNumber).pipe(retry(2))
  }
  getClearedCartonDetailsReceivingBranch(p_currentManifestNumber:any, p_refManifestNumber:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_cleared_carton_details_receiving_branch?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }
  getShipmentCompany(id:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_shipment_company?id=' + id).pipe(retry(2))
  }
  getDestination_dispatch(cid:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_dispatch_dest?cid=' + cid).pipe(retry(2))
  }
  getClrorg():Observable<any>  {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_clr_org').pipe(retry(2))
  }
  getManifest_DP_to_SC(pointId:any,s:any,e:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_DP_to_SC?pointId=' + pointId+'&f='+s+'&t='+e).pipe(retry(2))
  }
  getveh_ship_com(vh_no:any): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_veh_id_shi_com?vh_no='+vh_no).pipe(retry(2))
  }
  getShipmentMode() :Observable<any>{
    return this.http.get(Constant.CONSTANT_API_ORIGIN+'get_shipment_mode').pipe(retry(2))
  }
  getCtnOprDate(invoice_no:any,carton_no:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_ctn_opr_date?invoice_no=' + invoice_no + '&carton_no=' + carton_no).pipe(retry(2))
  }
  getCartonSummary(invoice_no:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_carton_summary?invoice_no=' + invoice_no).pipe(retry(2))
  }
  getDeliveryTracking(invoice_no:any,carton_no:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_delivery_tracking?invoice_no=' + invoice_no + '&carton_no=' + carton_no).pipe(retry(2))
  }
  getInvoiceTracking(invoice_no:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_invoice_tracking?invoice_no=' + invoice_no).pipe(retry(2))
  }
  getCtnCmTracking(invoice_no:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_ctn_cm_tracking?invoice_no=' + invoice_no).pipe(retry(2))
  }
  get_item_by_invoice(invoice_no:any):Observable<any>{
    return this.http.get(Constant.CONSTANT_API + 'get_item_by_invoice?invoice_no='+invoice_no,{ responseType: 'json' }).pipe(retry(2))
  }
  get_track_history(no:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_track_history?pnt='+no)
  }
  getCartonTracking(invoice_no:any,carton_no:any) :Observable<any>{
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_carton_tracking?invoice_no=' + invoice_no + '&carton_no=' + carton_no).pipe(retry(2))
  }
  getCartonCurrentStatus(invoice_no:any):Observable<any>  {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_carton_current_status?invoice_no=' + invoice_no).pipe(retry(2))
  }
// aebServce%%^^^^^^^^^^^^^^
  get_service_type(id:any):Observable<any>{
    return this.http.get(Constant.CONSTANT_API + 'get_service_type?id='+id).pipe(retry(2))
  }
  v1_SP_Report_Dispatch_Manifest_Wise_clearance_excel(manifest:any): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'v1_SP_Report_Dispatch_Manifest_Wise_clearance_excel?manifest='+manifest).pipe(retry(2))
  }

  getdesAgent(id:any,c:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'getdes_Agent?_t_id='+id+'&_c_id='+c).pipe(retry(2))
  }
  get_country():Observable<any>{
    return this.http.get('https://api.cargoforce.com/Origin_v2/api_php_booking//index.php/get_country').pipe(retry(2))
  }

  getManifest_receiving_f_warehouse(pointId:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_receiving_f_warehouse?pointId=' + pointId).pipe(retry(2))
  }
  getNonClearedCartonDetailsreceiving_warehouse(p_currentManifestNumber:any, p_refManifestNumber:any): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_non_cleared_cartondetails_receiving_warehouse?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }

  getClearedCartonDetailsreceiving_warehouse(p_currentManifestNumber:any, p_refManifestNumber:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_cleared_carton_details_receiving_warehouse?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }
  getPackingConditionreceiving_warehouse():Observable<any>  {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_packing_condition_receiving_warehouse').pipe(retry(2))
  }
  getRackreceiving_warehouse(current_point_id:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_rack_receiving_warehouse?current_point_id=' + current_point_id).pipe(retry(2))
  }
  getPalletereceiving_warehouse(wh_rack_id:any):Observable<any>  {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_pallete_receiving_warehouse?wh_rack_id=' + wh_rack_id).pipe(retry(2))
  }
  getStopCartonDetailsreceiving_warehouse(p_currentManifestNumber:any, p_refManifestNumber:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stopcarton_details_receiving_warehouse?p_currentManifestNumber=' + p_currentManifestNumber + '&p_refManifestNumber=' + p_refManifestNumber).pipe(retry(2))
  }
  getReceivedConsignmentNumberreceiving_warehouse(manifestNumber:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_received_consignment_number_receiving_warehouse?manifestNumber=' + manifestNumber).pipe(retry(2))
  }
  getManifest_from_booking_agent(pointId:any):Observable<any>  {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_manifest_from_booking_agent?pointId=' + pointId).pipe(retry(2))
  }
  getDestination_from_booking_agent(point_type:any) :Observable<any>{
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_destination_from_booking_agent?point_type=' + point_type).pipe(retry(2))
  }
  getBranchHawbAllocation(point_type:any,point_id:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_branch_allocation?point_type=' + point_type + '&point_id=' + point_id).pipe(retry(2))
  }
  getBranchStockStartNo(issueingpointId:any, receivingpointid:any,pointcodeprefix:any):Observable<any> {
    return this.http.get(Constant.CONSTANT_API + 'get_branch_stock_startNo?issueingpointId=' + issueingpointId + '&receivingpointid=' + receivingpointid  + '&pointcodeprefix=' + pointcodeprefix).pipe(retry(2))
  }
  getBranchName(location_type:any,location_id:any):Observable<any>{
    return this.http.get(Constant.CONSTANT_API + 'get_branch_master?location_type=' + location_type + '&location_id=' + location_id).pipe(retry(2))
  }
  // update tobranch***********************************
  UpdateManifest_B_To_B(item:any): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_manifest_b_to_b', JSON.stringify(item)).pipe(retry(2))
  }

  // update tobranchManifest***********************************

  UpdateForwardingBranchBooking(item:any): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_forwarding_branch_booking', JSON.stringify(item)).pipe(retry(2))
  }

  // updatewharehouse
  UpdateManifest_b_to_w(item:any): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_manifest_b_to_w', JSON.stringify(item)).pipe(retry(2))
  }

  // updatefrombranch
  UpdateManifest_receiving_f_branch(item:any): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_manifest_receiving_f_branch', JSON.stringify(item)).pipe(retry(2))
  }
  UpdateReceivingBranch(item:any): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_receiving_branch', JSON.stringify(item)).pipe(retry(2))
  }

  UpdateManifest_DP_to_SC(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'update_manifest_Dispatch_to_sCompany', JSON.stringify(userItem)).pipe(retry(2))
  }

  UpdateToGoCargo(item:any): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_to_go_cargo', JSON.stringify(item)).pipe(retry(2))
  } 
  UpdateManifest_receiving_f_warehouse(item:any): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_manifest_receiving_f_warehouse', JSON.stringify(item)).pipe(retry(2))
  }
  UpdateManifest_from_booking_agent(item:any): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_manifest_from_booking_agent', JSON.stringify(item)).pipe(retry(2))
  }
  Updatereceiving_warehouse(item:any): Observable<any> {
    return this.http.put(Constant.CONSTANT_API_ORIGIN + 'update_receiving_warehouse', JSON.stringify(item)).pipe(retry(2))
  }
  // save tobranch**********************************
  InsertManifest_B_To_B(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_b_to_b', JSON.stringify(userItem)).pipe(retry(2))
  }
// save gettoBranchManifest
  InsertNonbookToBookBulk(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_nonbook_to_book_bulk', JSON.stringify(userItem)).pipe(retry(2))
  }
  InsertForwardingBranchBooking(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_forwarding_branch_booking', JSON.stringify(userItem)).pipe(retry(2))
  }
  // insertWArehouse
  InsertManifest_b_to_w(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_b_to_w', JSON.stringify(userItem)).pipe(retry(2))
  }
  


  // InsertFromBranch
  InsertManifest_receiving_f_branch(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_receiving_f_branch', JSON.stringify(userItem)).pipe(retry(2))
  }
  InsertReceivingBranch(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_receiving_branch', JSON.stringify(userItem)).pipe(retry(2))
  }
  InsertManifest_DP_to_SC(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_Dispatch_to_sCompany', JSON.stringify(userItem)).pipe(retry(2))
  }
  insertDispatch(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'Dispatch_manifest_to_sCompany', JSON.stringify(userItem)).pipe(retry(2))
  }
  insertunDispatch(mf_no:any): Observable<any> {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'UnDispatch_manifest_to_sCompany?mf_no=' + mf_no).pipe(retry(2))
  }
  InsertToGoCargo(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_to_go_cargo', JSON.stringify(userItem)).pipe(retry(2))
  }
  InsertManifest_receiving_f_warehouse(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_receiving_f_warehouse', JSON.stringify(userItem)).pipe(retry(2))
  }
  Insertreceiving_warehouse(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_receiving_warehouse', JSON.stringify(userItem)).pipe(retry(2))
  }
  InsertManifest_from_booking_agent(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'insert_manifest_from_booking_agent', JSON.stringify(userItem)).pipe(retry(2))
  }
  InsertBranchAllocation(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API + 'insert_branch_allocation', JSON.stringify(userItem)).pipe(retry(2))
  }

  //delete*******************************************

  deleteManifest_B_To_B(id:any):Observable<any> {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_manifest_b_to_b/' + id).pipe(retry(2))
  }
  deleteForwardingBranchBookingall(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'delete_forwarding_branch_booking_all', JSON.stringify(userItem)).pipe(retry(2))
  }
  deleteForwardingBranchBooking(mf_details_id:any): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_forwarding_branch_booking/' + mf_details_id).pipe(retry(2))
  }
  deleteManifest_receiving_f_branch(id:any): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_manifest_receiving_f_branch/' + id).pipe(retry(2))
  }
  deleteClearedCartonReceivingBranch(id:any): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_cleared_carton_receiving_branch/' + id).pipe(retry(2))
  }
  deleteClearedCartonReceivingBranchall(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'delete_cleared_carton_receiving_branch_all', JSON.stringify(userItem)).pipe(retry(2))
  }
  deleteManifest_DP_to_SC(id:any): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'deleteManifest_DP_to_SC/' + id).pipe(retry(2))
  }
  deleteManifest_receiving_f_warehouse(id:any) : Observable<any>{
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_manifest_receiving_f_warehouse/' + id).pipe(retry(2))
  }
  deleteClearedCartonreceiving_warehouseall(userItem:any): Observable<any> {
    return this.http.post(Constant.CONSTANT_API_ORIGIN + 'delete_cleared_carton_receiving_warehouse_all', JSON.stringify(userItem)).pipe(retry(2))
  }
  deleteClearedCartonreceiving_warehouse(id:any): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_cleared_carton_receiving_warehouse/' + id).pipe(retry(2))
  }
  deleteManifest_from_booking_agent(id:any): Observable<any>  {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_manifest_from_booking_agent/' + id).pipe(retry(2))
  }
  deleteManifest_b_to_w(id:any):Observable<any> {
    return this.http.delete(Constant.CONSTANT_API_ORIGIN + 'delete_manifest_b_to_w/' + id).pipe(retry(2))
  }
  // pdf
  ktm_manifest(data:any): Observable<any> {
    return this.http.post('http://65.0.1.125:8080/DrCourierReport_V1/st_cargo/sit/private/v1/prelogin/report/writeDispatchExcelKTM',data).pipe(retry(2))
  }
  ubccj_manifest(data:any): Observable<any> {
    return this.http.post('http://65.0.1.125:8080/DrCourierReport_V1/st_cargo/sit/private/v1/prelogin/report/writeDispatchExcelUb_Cjj',data).pipe(retry(2))
  }
  packing_manifest(data:any): Observable<any> {
    return this.http.post('http://65.0.1.125:8080/DrCourierReport_V1/st_cargo/sit/private/v1/prelogin/report/writeDispatchExcelPackingList',data).pipe(retry(2))
  }
  checklist_manifest(data:any): Observable<any> {
    return this.http.post('http://65.0.1.125:8080/DrCourierReport_V1/st_cargo/sit/private/v1/prelogin/report/writeDispatchExcelchecklist',data).pipe(retry(2))
  }
  courier_manifest(data:any): Observable<any> {
    return this.http.post('http://65.0.1.125:8080/DrCourierReport_V1/st_cargo/sit/private/v1/prelogin/report/DRCourierManifest',data).pipe(retry(2))
  }
  delivery_manifest(data:any): Observable<any> {
    return this.http.post('http://65.0.1.125:8080/DrCourierReport_V1/st_cargo/sit/private/v1/prelogin/report/DRCourierDeliveryManifest',data).pipe(retry(2))
  }
  deleteBranchAllocation(c_note_issue_id:any,awb_starting_no:any,awb_ending_no:any,issuing_point_id:any,receiving_point_id:any): Observable<any> {
    return this.http.delete(Constant.CONSTANT_API + 'delete_Branch_Allocation/' + c_note_issue_id +'/' + awb_starting_no + '/' +awb_ending_no + '/'+issuing_point_id+'/'+receiving_point_id).pipe(retry(2))
  }
}
