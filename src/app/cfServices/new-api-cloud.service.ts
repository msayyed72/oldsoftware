import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../constant/constant';
import { ValidateEndPointsService } from './validate.service';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewApiCloudService {
  FreeAgentToken=localStorage.getItem('FreeAgentToken');
  RefreshToken=localStorage.getItem('RefreshToken');
  TokenExpiry=localStorage.getItem('TokenExpiry');
  private dataSubject = new BehaviorSubject<any>(null); // Subject to pass data
  private chatSubject = new BehaviorSubject<any>(null); // Subject to pass data
  private chatincomplete = new BehaviorSubject<any>(null); // Subject to pass data
  private customerSubject = new BehaviorSubject<any>(null); // Subject to pass data
  private freeAgentSubject = new BehaviorSubject<any>(null); // Subject to pass data

  constructor(public http :HttpClient,private _service:ValidateEndPointsService, ) { }
  data$ = this.dataSubject.asObservable(); // Exposing as Observable
  chat$ = this.chatSubject.asObservable(); // Exposing as Observable
  chatincomplete$ = this.chatincomplete.asObservable(); // Exposing as Observable
  invoice$ = this.customerSubject.asObservable(); // Exposing as Observable
  $freeAgent = this.freeAgentSubject.asObservable();
  sendData(data: any) {
    this.dataSubject.next(data); // Emitting new data
  }

  getCurrentData() {
    return this.dataSubject.value; // Get latest value
  }
   getNoteData() {
    return this.chatincomplete.value; // Get latest value
  }
  sendChatData(data: any) {
    this.chatSubject.next(data); // Emitting new data
  }
    sendChatDataIncomplete(data: any) {
    this.chatincomplete.next(data); // Emitting new data
  }
   sendinvocieData(data: any) {
    this.customerSubject.next(data); // Emitting new data
  }
   sendFreeAgentData(data: any) {
    this.freeAgentSubject.next(data); // Emitting new data
  }
  getChatCurrentData() {
    return this.chatSubject.value; // Get latest value
  }

  getCo_loaderDetails(flag:any){
    return this.http.get(Constant.CONSTANT_API_CLOUD+'v1_SP_ds_Pickup_order_coLoader_Wise_pickup?_f='+flag)
  }
  v1_SP_ds_Pickup_order_non_pickedup_coLoader_list(Co_loader_id,flag){
    return this.http.get(Constant.CONSTANT_API_CLOUD+'v1_SP_ds_Pickup_order_non_pickedup_coLoader_list?_f='+flag+'&_i='+Co_loader_id)

  }
  v1_SP_Ds_hawb_order_Insert_by_hawb_id(payload:any){
    return this._service.post('v1_SP_Ds_hawb_order_Insert_by_hawb_id',JSON.stringify(payload))
  }
  AssignToDpd(data){
    return this._service.post1('getDpdToken',JSON.stringify(data))
  }
  AssignToParcelForce(data){
    return this._service.post1('booking_parcelforce',JSON.stringify(data))
  }
  v1_SP_Ds_hawb_Update_new(data){
    return this.http.post(Constant.CONSTANT_API_CLOUD+'v1_SP_Ds_hawb_Update_new',JSON.stringify(data))

  }
  v1_ds_pickup_order_view_consignment_page_update(data){
    return this.http.put(Constant.CONSTANT_API_CLOUD+'v1_ds_pickup_order_view_consignment_page_update',JSON.stringify(data))

  }
  v1_SP_Ds_Carton_Update(data){
    return this.http.put(Constant.CONSTANT_API_CLOUD+'v1_SP_Ds_Carton_Update_order',JSON.stringify(data))
  }
  v1_sp_ds_pickup_order_history_insert(data){
    return this.http.post(Constant.CONSTANT_API_CLOUD+'v1_sp_ds_pickup_order_history_insert',JSON.stringify(data))

  }
  v1_sp_ds_pickup_order_call_status_get(_h){
    return this.http.get(Constant.CONSTANT_API_CLOUD+'v1_sp_ds_pickup_order_call_status_get?_h='+_h)

  }
  v1_sp_ds_pickup_order_call_status_update(data){
    return this._service.post('v1_sp_ds_pickup_order_call_status_update',JSON.stringify(data))

  }
  v1_ds_pickup_order_incomplete_call_status_update(data){
    return this._service.post('v1_ds_pickup_order_incomplete_call_status_update',JSON.stringify(data))

  }
  v1_SP_ds_Pickup_order_task_assign(data){
    return this._service.post('v1_SP_ds_Pickup_order_task_assign',JSON.stringify(data))

  }
  v1_SP_ds_Pickup_order_pickedup_check_weight_list(_n){
    return this._service.get('v1_SP_ds_Pickup_order_pickedup_check_weight_list?_c='+_n,{})

  }
    
    v1_SP_Ds_task_status_update(data){
      return this._service.post('v1_SP_Ds_task_status_update',JSON.stringify(data))

    }
    viewAadhar(_n: string) {
      return new Observable(observer => {
        setTimeout(() => {
          this._service.get('viewAadhar?name=' + _n, {}).subscribe({
            next: data => observer.next(data),
            error: err => observer.error(err),
            complete: () => observer.complete()
          });
        }, 0); 
      });
    }
    
    createFolder(_n){
      return this.http.get(Constant.CONSTANT_API_CLOUD+'createFolder?FolderName='+_n)

    }
    DownloadAllAadharFiles(data){
      
      return this.http.post(Constant.CONSTANT_API_CLOUD+'DownloadAllAadharFiles',JSON.stringify(data))

    }
  v1_SP_ds_Pickup_order_history_list(_d){
    return this._service.get('v1_SP_ds_Pickup_order_history_list?hawb_no='+_d,{})

    
  }
  v1_sp_ds_pickup_order_note_insert(data){
    return this.http.post(Constant.CONSTANT_API_CLOUD+'v1_sp_ds_pickup_order_note_insert',data)
  }
  v1_sp_ds_pickup_order_note_get(_d){
    return this.http.get(Constant.CONSTANT_API_CLOUD+'v1_sp_ds_pickup_order_note_get?invoice_no='+_d,{})

  }
  
  v1_ds_insert_pickup_carton_details(data){
    return this.http.post(Constant.CONSTANT_API_CLOUD+'v1_ds_insert_pickup_carton_details',JSON.stringify(data))

  }
  v1_SP_ds_Pickup_order_status_update(data){
    return this._service.post('v1_SP_ds_Pickup_order_status_update',JSON.stringify(data))

  }
  v1_sp_ds_pickup_order_update(data){
    return this.http.post(Constant.CONSTANT_API_CLOUD+'v1_sp_ds_pickup_order_update',JSON.stringify(data))

  }
  v1_SP_ds_payment_api_status_update(data){
    return this._service.post('v1_SP_ds_payment_api_status_update',JSON.stringify(data))

  }
  v1_sp_ds_hawb_aadhar_details_Update(data){
    return this._service.post('v1_sp_ds_hawb_aadhar_details_Update',JSON.stringify(data))

  }
  InsertNonbookToBookBulk(userItem): Observable<any> {
    return this._service.post1( 'insert_nonbook_to_book_bulk', JSON.stringify(userItem)).pipe(retry(2))
  }
  insertDriveImage(data){
    return this._service.post('driveUploadImage',data)

    // return this.http.post('https://api.cargoforce.com/Origin_v2/api_php_booking/index.php/driveUploadImage',data)
  }
  v1_sp_ds_pickup_order_collection_type_Update(data){
    return this._service.post('v1_sp_ds_pickup_order_collection_type_Update',JSON.stringify(data))

  }
  get_pending_report(item): Observable<any> {
    return this._service.post('get_pending_stock', JSON.stringify(item)).pipe(retry(2))
  }
  v1_SP_update_bag_no(item){
    return this._service.post('v1_SP_update_bag_no', JSON.stringify(item)).pipe(retry(2))

  }
  export_dispatch_manifest(mft_no){
    return this._service.get1('export_dispatch_manifest?no='+mft_no,{}).pipe(retry(2))

  }
  v1_SP_Report_Dispatch_Manifest_Wise_packing_list(mft_no){
    return this._service.get1('v1_SP_Report_Dispatch_Manifest_Wise_packing_list?no='+mft_no,{}).pipe(retry(2))

  }
  v1_SP_Report_Dispatch_Manifest_Wise_delivery(mft_no){
    return this._service.get1('v1_SP_Report_Dispatch_Manifest_Wise_delivery?no='+mft_no,{}).pipe(retry(2))

  }
   getDeliveryReportExcel(mft_no){
    return this._service.get5('getDeliveryReportExcel?booking_id='+mft_no,{}).pipe(retry(2))

  }
   getCustomesExcelForDispatch(id,mft_no){
    return this._service.post5('getCustomesExcelForDispatch?booking_id='+id,mft_no).pipe(retry(2))

  }
    v1_SP_Report_Dp_world_Manifest_Wise_delivery(mft_no){
    return this._service.get1('v1_SP_Report_Dp_world_Manifest_Wise_delivery?no='+mft_no,{}).pipe(retry(2))

  }
  v1_SP_ds_carton_aadhar_Update(data){
    return this._service.post('v1_SP_ds_carton_aadhar_Update',data)
  }
    updateSheetData(data){
       return this._service.post('updateGoogleSheetRow',data)
    }
  aadhaar_validation_upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData)
    return this._service.post1('aadhaar_validation_uploads',formData  )

    // return this.http.post('https://api.cargoforce.com/Origin_v2/cargo_origin_api/index.php/aadhaar_validation_uploads', formData, {
    //   headers: new HttpHeaders({
    //     // 'Content-Type': 'multipart/form-data' (Not needed, as FormData sets it automatically)
    //   }),
    //   reportProgress: true
    // })
  }   imgUpload(data){
    return this.http.post('https://api.cargoforce.com/Origin_v2/api_php_booking/index.php/uploadNewArrarFetchImg',data)
    // this._service.
  }
  imgUploadnew(data){
    return this._service.post('uploadNew',data)
    // this._service.
  }
  uploadFinalImg(data){
    return this._service.post('uploadFinalImg',data)
    // this._service.
  }
  getImageNew(name){
    return this.http.get('https://api.cargoforce.com/Origin_v2/api_php_booking/index.php/getImageBase64New/'+name)
  }
  getImage(name){
    return this.http.get('https://api.cargoforce.com/Origin_v2/api_php_booking/index.php/getImageBase64/'+name)
  }
  deleteForwardingBranchBookingall(userItem) {
    return this._service.post1('delete_forwarding_branch_booking_all', JSON.stringify(userItem)).pipe(retry(2))
  }
  DownloadLabelBulk(data){
    return this._service.get3('generateManifestLabel?booking_code='+data,{}).pipe(retry(2))

  }
  verifyFreeagent() {
    
    const clientId = 'awreqKGkJ5fbaI9RqKU9gA';
    const redirectUri = encodeURIComponent('https://api.cargoforce.com/operation/redirect.html');
  
    const freeAgentUrl = `https://login.freeagent.com/login?extra_login_params%5Bafter_login_path%5D=%2Fapp_approvals%2Fnew%3Fclient_id%3D${clientId}%26redirect_uri%3D${redirectUri}%26response_type%3Dcode&extra_login_params%5Blogin_prompt%5D=app_approval`;
  
    // Redirect the user to FreeAgent login page
    window.open(freeAgentUrl, '_self');
  }
    verifyFreeagen1t() {
    
    const clientId = 'awreqKGkJ5fbaI9RqKU9gA';
    const redirectUri = encodeURIComponent('https://api.cargoforce.com/operation/redirect.html');
  
    const freeAgentUrl = `https://login.freeagent.com/login?extra_login_params%5Bafter_login_path%5D=%2Fapp_approvals%2Fnew%3Fclient_id%3D${clientId}%26redirect_uri%3D${redirectUri}%26response_type%3Dcode&extra_login_params%5Blogin_prompt%5D=app_approval`;
  
    // Redirect the user to FreeAgent login page
    window.open(freeAgentUrl, '_self');
  }
  
  getFreeagentToken(_id){
    return this.http.get('https://api.cargoforce.com:8080/api/freeagent/getAccessToken?code='+_id)
  }
  createInvoice_freeAgent(data,tyep){
    this.FreeAgentToken=localStorage.getItem('FreeAgentToken');
    this. RefreshToken=localStorage.getItem('RefreshToken');
    this.TokenExpiry=localStorage.getItem('TokenExpiry');
    const  httpOptions={
        'content-type': 'application/json',
        'Authorization': this.FreeAgentToken,
        'Refresh-Token': this.RefreshToken,
        'Expires-In': this.TokenExpiry
    
    }
    return this._service.postfree('api_freeAgent?_p='+tyep,JSON.stringify(data),httpOptions)
  }
  printInvoice_freeAgent(data){
    this.FreeAgentToken=localStorage.getItem('FreeAgentToken');
    this. RefreshToken=localStorage.getItem('RefreshToken');
    this.TokenExpiry=localStorage.getItem('TokenExpiry');
    const  httpOptions={
        'content-type': 'application/json',
        'Authorization': this.FreeAgentToken,
        'Refresh-Token': this.RefreshToken,
        'Expires-In': this.TokenExpiry
      
    }
    return this._service.postfree('printInvoice_freeAgent',JSON.stringify(data),httpOptions)
  }
  get_invoice_list(point_id,location_id,invoice_no,date):Observable<any>{
    return this._service.get('get_invoice_list?point_id='+point_id+
    '&location_id='+location_id+'&invoice_no='+invoice_no+'&date='+date,{ responseType: 'json' }).pipe(retry(2))
  }
  getPickupNonAllocationListLoad(_f,_u,_st,_end):Observable<any>{
    return this._service.get('getPickupNonAllocationList?_f='+_f+'&_u='+_u+'&_st='+_st+'&_end='+_end,{ responseType: 'json' }).pipe(retry(2))
  }
  get_Pickup_allocatedList(clientId,id,flag,order_no):Observable<any>{
    return this._service.get('get_Pickup_allocatedList?clientId='+clientId+'&_id='+id+'&flag='+flag+'&order_no='+order_no,{ responseType: 'json' }).pipe(retry(2))
  }
  v1_sp_get_tracking_no_for_hawb(data){
        return this._service.post('v1_sp_get_tracking_no_for_hawb',data).pipe(retry(2))

  }
  update_Pickup_allocated_to_staff(data):Observable<any>{
    return this._service.post('update_Pickup_allocated_to_staff',JSON.stringify(data)).pipe(retry(2))
  }
  v1_sp_ds_pickup_order_update_collection_ref(data){
    return this._service.post('v1_sp_ds_pickup_order_update_collection_ref',data)
  }
  v1_ds_pickup_order_incomplete_get_list(){
   return this._service.get('v1_ds_pickup_order_incomplete_get_list',{})
  }
    v1_ds_pickup_order_incomplete_get_list_noLoad(){
   return this.http.get(Constant.CONSTANT_API_CLOUD+'v1_ds_pickup_order_incomplete_get_list')
  }
  v1_SP_ds_invoice_current_status_get(_n){
    return this._service.get('v1_SP_ds_invoice_current_status_get?invoice_no='+_n,{})
   }
  
  v1_ds_pickup_order_incomplete_get_listLoad(){
   return this.http.get(Constant.CONSTANT_API_CLOUD+'v1_ds_pickup_order_incomplete_get_list')
  }
  multipleTractingStsUpdate(data){
     return this._service.post('bulkUpdateTrackingDetails',data)
  }
  v1_sp_get_hawb_details_all_transaction(_n,_f){
    return this.http.get(Constant.CONSTANT_API_CLOUD+'v1_sp_get_hawb_details_all_transaction?inv_no='+_n+'&flag='+_f)
  }
  getFreeAgentAutoComplete(){
    return this.http.get('https://api.cargoforce.com/origin_v2/api_php_booking/index.php/freeAgentAutoCompleteData')
  }
  DownloadLabel(_data) {
    return this._service.get3(
      'convertHtmlToPdf?track_no=' + _data,{});
  }
  
  sendCollectionEMail(payload){
    return this._service.post2('send_collection_mail',payload)
  }
   removeItemMail(payload){
    return this._service.post2('removeItemMail',payload)
  }
    send_mail_to_customer_tracking_shipment(payload){
    return this._service.post2('send_mail_to_customer_tracking_shipment',payload)
  }
    send_final_images(payload){
    return this._service.post2('send_final_images',payload)
  }
  update_Pickup_nonassignToBranch(data){
    return this.http.post(Constant.CONSTANT_API_CLOUD+'update_Pickup_nonassignToBranch',JSON.stringify(data))
  }
  get_Pickup_non_assignList(){
        return this._service.get('get_Pickup_non_assignList',{})

  }
  v1_ds_pickup_order_deposit_payment_status(data){
    return this._service.post('v1_ds_pickup_order_deposit_payment_status',data)
  }
  v1_ds_pickup_order_sales_repersent_update(data){
    return this._service.post('v1_ds_pickup_order_sales_repersent_update',data)
  }
  v1_ds_pickup_order_shipment_details_get(invoice_no){
    return this._service.get('v1_ds_pickup_order_shipment_details_get?invoice_no='+invoice_no,{})
  }
  v1_ds_pickup_order_shipment_carton_details_get(invoice_no){
    return this._service.get('v1_ds_pickup_order_shipment_carton_details_get?invoice_no='+invoice_no,{})

  }

   v1_SP_get_consignment_detail_based_on_hawb_carton_details(invoice_no,carton_no){
    return this._service.get('v1_SP_get_consignment_detail_based_on_hawb_carton_details?inv_no='+invoice_no+'&no='+carton_no,{})

  }

  v1_ds_pickup_carton_details_consignment_page_update(data){
        return this._service.put('v1_ds_pickup_carton_details_consignment_page_update',JSON.stringify(data))

  }
  insertPickupOrderCartonDetails(data){
        return this._service.post('insertPickupOrderCartonDetails',data)

  }
    update_Pickup_assignToBranch(data) {
      return this._service.post('update_Pickup_assignToBranch', JSON.stringify(data)).pipe(retry(2))
    }
    v1_ds_pickup_order_shipment_carton_details_delete(data){
            return this._service.delete('v1_ds_pickup_order_shipment_carton_details_delete/'+data.carton_id+'/'+data.invoice_no,{}).pipe(retry(2))

    }
     v1_sp_ds_hawb_carton_delete(data){
            return this._service.delete('v1_sp_ds_hawb_carton_delete/'+data.carton_id+'/'+data.created_by,{}).pipe(retry(2))

    }
    v1_sp_ds_check_wt_ready_manifest(_p){
          return this._service.get1('v1_sp_ds_check_wt_ready_manifest?point_id='+_p,{})

    }
    v1_SP_get_check_weight_report_list(data){
        return this._service.get('v1_SP_get_check_weight_report_list?fromDate='+data.fromDate+'&toDate='+data.toDate+'&name='+data.type,{})

    }
    sp_get_paid_unpaid_booking_get(data){
        return this._service.get('sp_get_paid_unpaid_booking_get?fromDate='+data.fromDate+'&toDate='+data.toDate+'&name='+data.type,{})

    }
    sp_get_pickup_order_collection_report(data){
        return this._service.get('sp_get_pickup_order_collection_report?fromDate='+data.fromDate+'&toDate='+data.toDate+'&name='+data.type,{})

    }
        v1_SP_Report_get_tracking_details_carton_box_wise(data){
        return this._service.get('v1_SP_Report_get_tracking_details_carton_box_wise?fromDate='+data.fromDate+'&toDate='+data.toDate+'&name='+data.type,{})

    }
    v1_sp_report_packinglist_details_get(data){
        return this._service.get('v1_sp_report_packinglist_details_get?fromDate='+data.fromDate+'&toDate='+data.toDate+'&name='+data.type,{})

    }
    v1_SP_Report_Dispatch_Manifest_Wise_page(data){
        return this._service.get('v1_SP_Report_Dispatch_Manifest_Wise_page?f_date='+data.fromDate+'&t_date='+data.toDate,{})

    }
    v1_sp_ds_manifest_invoice_final_wt_get(_mf){
              return this._service.get('v1_sp_ds_manifest_invoice_final_wt_get?_mf='+_mf,{})

    }
    bulkUploadFinalWeightDetails(data){
                    return this.http.post(Constant.CONSTANT_API_CLOUD+'bulkUploadFinalWeightDetails',data)

    }
       bulkUploadFinalWeightDetailsLoad(data){
                    return this._service.post('bulkUploadFinalWeightDetails',data)

    }
    v1_sp_ds_final_manifest_export_get(_mf){
                          return this.http.get(Constant.CONSTANT_API_CLOUD+'v1_sp_ds_final_manifest_export_get?_c='+_mf,{})

    }
        v1_SP_Report_customs_manifest(_mf){
                          return this._service.get('v1_SP_Report_customs_manifest?manifest_no='+_mf,{})

    }
     manifest_pdf(_mf){
                          return this._service.get('download/manifest_pdf?bill_no='+_mf,{})

    }

    Get_NextPickupDate_After14Days_freeagent(_d){
                          return this._service.get('Get_NextPickupDate_After14Days_freeagent?data='+_d,{})

    }
        Get_NextPickupDate_After14Days_freeagent1(_d,_p){
                          return this._service.get('Get_NextPickupDate_After14Days_freeagent?data='+_d+'&isoda='+_p,{})

    }
    sp_ds_pindcode_odi_get(pincode){
      return this._service.get('sp_ds_pindcode_odi_get?pincode='+pincode,{})
    }
      getPackingList(_d){
        return this._service.post8080('getPackingList',_d)

    }
     sendDraftMailToCustomer(_d){
        return this._service.post8080('sendDraftMailToCustomer',_d)

    }
    fetchSheetAadhar(){
      return this.http.get('https://api.cargoforce.com/Origin_v2/api_php_booking/index.php/getGoogleSheetData')
    }
      fetchSheetData(_id,range){
      return this._service.get('getGoogleSheetData?sheetId='+_id+'&range='+range,{})
    }
    getCourierNames(){
       return this._service.get('getCourierNames',{})
    }
    sendSalesQuotationToCust(_no,_mail,rep_name){
          return this._service.get4('request_send_log_new?no='+_no+'&mail='+_mail+'&sales_rep='+rep_name,{})
    }
      getstock_B_To_B(manifest) {
    return this.http.get(Constant.CONSTANT_API_ORIGIN + 'get_stock_b_to_b?manifest=' + manifest).pipe(retry(2))
  }
    get_booking_B_To_B(manifest, childmanifest) {
    return this._service.get1('get_booking_b_to_b_new?manifest=' + manifest + '&childmanifest=' + childmanifest,{}).pipe(retry(2))
  }
   get_non_booking_b_to_b_new(manifest, childmanifest) {
    return this._service.get1('get_non_booking_b_to_b_new?manifest=' + manifest + '&childmanifest=' + childmanifest,{}).pipe(retry(2))
  }
   v1_ds_order_enquiry_get(_f,_t) {
      return this._service.get('v1_ds_order_enquiry_get?_f='+_f+'&_t='+_t,{}).pipe(retry(2))
    }
    DpWorld(data){
      return this.http.post('http://localhost/rmaheendra1/index.php/Dp_World',data)
    }
    v1_sp_ds_hawb_final_invoice_image_get(id){
      return this._service.get('v1_sp_ds_hawb_final_invoice_image_get?id='+id,{})
    }
        v1_SP_Ds_Carton_get_based_on_hawb_no(id){
      return this._service.get('v1_SP_Ds_Carton_get_based_on_hawb_no?id='+id,{})
    }
    v1_sp_ds_readyfor_manifest_packed_unpacked(point){
            return this._service.get('v1_sp_ds_readyfor_manifest_packed_unpacked?point='+point,{})

    }
    v1_sp_ds_hawb_final_invoice_image_update(data){
      return this._service.put('v1_sp_ds_hawb_final_invoice_image_update',JSON.stringify(data))
    }
     v1_sp_ds_hawb_carton_pack_unpack_update(data){
      return this._service.put('v1_sp_ds_hawb_carton_pack_unpack_update',JSON.stringify(data))
    }
    v1_SP_ds_pickup_order_type_of_shipment(data){
     return this._service.post('v1_SP_ds_pickup_order_type_of_shipment',data)
    }
    makeCollectionRequest(_inv_no,_created_by,payload){
      return this._service.post8080('makeCollectionRequest?_inv_no='+_inv_no+'&_created_by='+_created_by,payload)
    }
      cancelCollection(_inv_no,_coll_ref,_created_by,payload){
      return this._service.post8080('cancelCollection?_inv_no='+_inv_no+'&_collection_ref='+_coll_ref+'&_created_by='+_created_by,payload)
    }
    v1_SP_Report_carton_bagged(data){
      return this._service.get('v1_SP_Report_carton_bagged?fromDate='+data.fromDate+'&toDate='+data.toDate+'&hawb_no='+data.hawb_no,{})
}
v1_SP_Report_for_Not_Paid_Departed(data){
      return this._service.get('v1_SP_Report_for_Not_Paid_Departed?fromDate='+data.fromDate+'&toDate='+data.toDate,{})
}
getTrackingHistory(_no){
  return this._service.get3('getTrackingHistory?inv_no='+_no,{})
}
getShipmentSummaryFromShipsGo(id){
  return this._service.get('getShipmentSummaryFromShipsGo?id='+id,{})
}
getShipmentSummaryFromShipsGoBulk(id){
  return this.http.get(this._service._configSvc+'getShipmentSummaryFromShipsGoBulk?id='+id)
}
  createShipmentForShipsGO(data){
     return this._service.post1('createShipmentForShipsGO',data)
    }
      deleteShipmentFromShipsGo(id){
   return this._service.get1('deleteShipmentFromShipsGo?id='+id,{})
  }
  v1_SP_ds_consignment_airlines_update(data){
    return this._service.post1('v1_SP_ds_consignment_airlines_update',data)
  }
  getHawbTrackingStatusFinal(invoice_no,carton_no){
    return this._service.get(`getHawbTrackingStatusFinal?invoice_no=${invoice_no}&carton_no=${carton_no}`,{})
  }
  v1_sp_ds_pickup_order_note_update_label(data){
    return this._service.post('v1_sp_ds_pickup_order_note_update_label',data)
  }
  v1_sp_ds_pickup_order_note_reason_get(){
    return this._service.get('v1_sp_ds_pickup_order_note_reason_get',{})
  }
  v1_SP_ds_sales_quotation_booker_detail_get(_n){
    return this._service.get('v1_SP_ds_sales_quotation_booker_detail_get?_n='+_n,{})
  }
  getShipmentDetailsTraingFull(inv_no,no){
    return this._service.get('getShipmentDetailsTraingFull?inv_no='+inv_no+'&no='+no,{})
  }
   getAgentRate(data){
    return this._service.getmaster('sp_m_ac_customer_agent_rate_traiff_select',data)
  }
    getAgentRatePerKg(data){
    return this._service.getmaster('sp_m_ac_customer_agent_rate_traiff_unit_price_select',data)
  }
  openFreeAgneInv(post){
     this.FreeAgentToken=localStorage.getItem('FreeAgentToken');
    this. RefreshToken=localStorage.getItem('RefreshToken');
    this.TokenExpiry=localStorage.getItem('TokenExpiry');
    const  httpOptions={
        'content-type': 'application/json',
        'Authorization': this.FreeAgentToken,
        'Refresh-Token': this.RefreshToken,
        'Expires-In': this.TokenExpiry
    
    }
    return this._service.postfree('api_freeAgent?_p=P',post,httpOptions)
  }
     apiUrl = 'https://api.cargoforce.com/operation/nodeNew/logs/serverLogs.json';

   getLogs(){
    return this.http.get('https://api.cargoforce.com:8080/api/users/getServerLogs',{});
  }
v1_SP_Report_Agent_booking_list(data:any){
    return this._service.get('v1_SP_Report_Agent_booking_list?fromdate='+data.fromdate+'&todate='+data.todate+'&agent_id='+data.agent_id+'&hawb_no='+data.hawb_no,{})
  }
getimgpreview(name,flag,type){
  return this.http.get('https://api.cargoforce.com:8080/api/users/getimgpreview?name='+name+'&type='+flag,type)
}


 v1_sp_ds_consignment_master_airway_bill_get(data){
    return this._service.get8('v1_sp_ds_consignment_master_airway_bill_get?manifest_no='+data,{})
  }
  v1_sp_ds_consignment_MAWB_update(data){
    return this.http.put('https://api.cargoforce.com/Origin_v2/airlines/index.php/v1_sp_ds_consignment_MAWB_update',JSON.stringify(data))

  }
  v1_sp_ds_consignment_master_delivery_note_detail_update(data){
    return this.http.put('https://api.cargoforce.com/Origin_v2/airlines/index.php/v1_sp_ds_consignment_master_delivery_note_detail_update',JSON.stringify(data))
  }
  getManifestPdf(data){
    return this._service.get8('getManifestPdf?manifest_no='+data,{})
  }
  delivarynotepdf(data){
    return this._service.get8('delivarynotepdf?ptp_mf_no='+data,{})
  }
  getDataForTypeOfIATA(){
    return this._service.get8('getDataForTypeOfIATA',{})
  }
  getStateNames(name){
  return this._service.getmaster('get_state_country?id='+name,{})
}
v1_sp_ds_global_mail_get_based_on_filters(data){
  return this._service.get('v1_sp_ds_global_mail_get_based_on_filters',data)
}
v1_sp_ds_global_mail_insert(data){
  return this._service.post('v1_sp_ds_global_mail_insert',data)
}
v1_sp_ds_global_mail_update(data){
  return this._service.post('v1_sp_ds_global_mail_update',data)
}
v1_sp_ds_global_mail_get(id){
  return this._service.get('v1_sp_ds_global_mail_get?mail_templat_id='+id,{})
}
v1_sp_ds_global_mail_delete(data){
  return this._service.get('v1_sp_ds_global_mail_delete',data)
}

send_bulk_emails_to_customer_for_notifications(data){
  return this._service.post2('send_bulk_emails_to_customer_for_notifications',data)
}

v1_m_mail_events_get(id){
  return this._service.get('v1_m_mail_events_get?id='+id,{})
}
v1_m_mail_events_update(data){
  return this.http.post('https://api.cargoforce.com/Origin_v2/api_php_booking/index.php/v1_m_mail_events_update',JSON.stringify(data))
}
v1_m_mail_events_update_content(data){
  return this._service.post('v1_m_mail_events_update_content',data)
}
v1_SP_m_mail_event_counter(id){
  return this._service.get('v1_SP_m_mail_event_counter?inv_no='+id,{})
}
}


