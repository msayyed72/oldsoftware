import { Component, OnInit, ViewChild } from '@angular/core';
import { AwbService } from 'src/app/cfServices/awb.service';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';
import { GridComponent } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-check-weight',
  templateUrl: './check-weight.component.html',
  styleUrls: ['./check-weight.component.css']
})
export class CheckWeightComponent implements OnInit {
  coLoaderName: any;
  fromDate: string;
  toDate: string;
  invoiceFilter: string;
  userdetails: any;
  currentDate
  constructor( private service: AwbService, private serviceNew: NewApiCloudService) {
    this.fromDate = new Date().toISOString().split('T')[0];
    this.userdetails = JSON.parse(localStorage.getItem("log_data"))

  }

  ngOnInit() {
    this.get_CO_Loader();
    this.v1_m_mail_events_get()

    // this.v1_SP_ds_Pickup_order_pickedup_check_weight_list()
  }
  generatedTemplates:any;
  v1_m_mail_events_get(){
  this.serviceNew.v1_m_mail_events_get(1).subscribe(r=>{
    this.generatedTemplates=r?.['data'].map(r=>({
      ...r,
      'mail_status' :(r['mail_status'] == 'false' ? false :true)
    }))
  })
}
  CO_Loader: any = [];
  get_CO_Loader() {
    this.service.get_CO_Loader().subscribe(data => {
      this.CO_Loader = data['data']
    })
  }
  v1_SP_ds_Pickup_order_pickedup_check_weight_list() {
    this.serviceNew.v1_SP_ds_Pickup_order_pickedup_check_weight_list(
      String(this.invoiceFilter).trim()
    ).subscribe(d => {
      this.ReceivedColoaderDate = d['data'].map(item => ({
        ...item,
        length: parseFloat(item.length),
        width: parseFloat(item.width),
        height: parseFloat(item.height),
        weight: parseFloat(item.weight),
        vol_weight: this.calculateVolumetricWeight(item),
        chrg_weight: this.calculateChargeableWeight(item),
        created_by: this.userdetails['v_user_id'],
        // box_type:
      }));
      this.focusNext(this.heightInput, this.event)

    });
  }
  v1_SP_ds_Pickup_order_pickedup_check_weight_listCheckSendMail(no) {
    this.serviceNew.v1_SP_ds_Pickup_order_pickedup_check_weight_list(
      String(this.invoiceFilter).trim()
    ).subscribe(d => {

      if (this.generatedTemplates?.[0]?.['mail_status']) {
        this.mailBody = this.mailBody.replaceAll('[box_no]',no)
      // if (d['data'].length > 0) {
        const checkcount = d['data'].filter(r => r['update_status'] == '1');
        if (true) {
          const payload = {
            Subject: this.mailSubject,
            mailTo: d['data'][0]['sender_mail'],
           // mailTo: 'chowlysaravanan@gmail.com',
            content: this.mailBody
          }
          this.serviceNew.v1_SP_m_mail_event_counter(1).subscribe()
          this.serviceNew.send_mail_to_customer_tracking_shipment(payload).subscribe()
          console.log('All shipment received');
          console.log(payload)
        } else {
          console.log(checkcount);
          console.log('All shipment not received');
        }
      }


    });
  }


  private calculateVolumetricWeight(item: any): number {
    return Math.ceil((item.length * item.width * item.height) / 5000);
  }

  private calculateChargeableWeight(item: any): number {
    const volWeight = this.calculateVolumetricWeight(item);
    return Math.ceil(Math.max(volWeight, item.act_wgt));
  }

  calculateWeights(item: any) {
    // Convert dimensions to numbers
    item.length = Number(item.length);
    item.width = Number(item.width);
    item.height = Number(item.height);

    item.vol_weight = Math.ceil(this.calculateVolumetricWeight(item));
    item.chrg_weight = Math.ceil(this.calculateChargeableWeight(item));
  }
  ReceivedColoaderDate = [];
  // In your component
  loadingIndex: number = -1;
  heightInput: HTMLInputElement;
  event: any;
  submitForm(item: any, index: number, heightInput: HTMLInputElement, $event: any) {
    const boxNo = Number(item.carton_no);
    if (isNaN(boxNo) || boxNo <= 0) {
                                          this.showMessage("Carton number must be a number and greater than 0");

      // this.toastr.warningToastr('Carton number must be a number and greater than 0');
      return;
    }

    // 2. Count occurrences of carton_no in ReceivedColoaderDate array
    const count = this.ReceivedColoaderDate.filter(x => x.carton_no == item.carton_no);
    // const countofUpdate = this.ReceivedColoaderDate.filter(x => x.carton_no == item.carton_no);
    console.log(this.ReceivedColoaderDate)
    console.log(count)
    if (count.length > 1) {
                                    this.showMessage("Already box_no exists");

      // this.toastr.warningToastr('Already box_no exists');
      return;
    }
    // this.toastr.successToastr("Updated Successfully");
    this.loadingIndex = index;
    this.heightInput = heightInput;
    this.event = $event;
    this.service.sp_v1_ds_history_log_events_insert(item.invoice_no,this.userdetails['v_user_id'],'Check Weight For Box No:- '+item.carton_no).toPromise()
    // this.v1_SP_ds_Pickup_order_pickedup_check_weight_listCheckSendMail()
    this.serviceNew.v1_SP_Ds_Carton_Update(item).subscribe({
      next: (data) => {
                              this.showMessage("Updated Successfully");

        // this.toastr.successToastr("Updated Successfully");
        this.loadingIndex = -1;
        this.v1_SP_Ds_hawb_order_Insert_by_hawb_id(item)
        // this._chat.send({
        //   source: 'check_weight',
        //   event: 'check_weight',
        //   payload: { invoice_no: item.invoice_no, ctn_no: item.carton_no }
        // });


      },
      error: (err) => {
                      this.showMessage( err.error.message , 'error');

        this.loadingIndex = -1;
      }
    });
  }

  tableData: string[][] = [
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"]
  ];

  addRow() {
    this.tableData.push(new Array(this.tableData[0].length).fill(""));
  }

  addColumn() {
    this.tableData.forEach(row => row.push(""));
  }
  // In your component
  focusNext(currentInput: HTMLInputElement, event: any) {
    // event.preventDefault();

    const inputs = Array.from(currentInput.closest('tr').querySelectorAll('input') || []);
    const currentIndex = inputs.indexOf(currentInput);

    let nextInput: HTMLInputElement | null = null;

    if (currentIndex > -1 && currentIndex < inputs.length - 1) {
      nextInput = inputs[currentIndex + 1] as HTMLInputElement;
    } else if (currentIndex === inputs.length - 1) {
      const nextRow = currentInput.closest('tr').nextElementSibling;
      if (nextRow) {
        nextInput = nextRow.querySelector('input');
      }
    }

    if (nextInput) {
      nextInput.focus();

      // Wait a tick to ensure focus before selecting
      setTimeout(() => {
        nextInput.select();
      }, 0);
    }
  }
mailBody=''
mailSubject=''
  // Modified load data function
  loadData() {
    if (!this.invoiceFilter || this.invoiceFilter.trim() === ''){
            this.ReceivedColoaderDate = []

return;
    } 

    const filterValue = String(this.invoiceFilter).trim();

    if (
      filterValue.length === 6
    ) {
      this.serviceNew.v1_SP_ds_Pickup_order_pickedup_check_weight_list(filterValue)
        .subscribe((d: any) => {
          if (d && d.status === "success" && d.data && d.data.length > 0) {
            const firstItem = d.data[0];
              this.mailSubject = String(this.generatedTemplates[0]['mail_subject']).replaceAll('[hawb_no]',firstItem['invoice_no']).replaceAll('[sender_name]',firstItem['sender_name']).replaceAll('[receiver_name]',firstItem['receiver_name'])
              this.mailBody = String(this.generatedTemplates[0]['mail_body']).replaceAll('[hawb_no]',firstItem['invoice_no']).replaceAll('[sender_name]',firstItem['sender_name']).replaceAll('[receiver_name]',firstItem['receiver_name'])
            // Check if the first key is a warning message (assuming it's not structured like an order)
            const messageKey = Object.keys(firstItem)[0];
            const messageValue = firstItem[messageKey];

            // If the message key is something like "warning" instead of valid order data, show toastr
            if (typeof messageValue === "string" && Object.keys(firstItem).length === 1) {
              this.showMessage(messageValue , 'error');
              this.ReceivedColoaderDate = []
              return; // Stop further execution
            }
          }
          this.processData(d);
        });
    } else {
      this.ReceivedColoaderDate = []
    }
  }
  getTotalActWeight(): number {
  // return this.ReceivedColoaderDate.reduce((sum, item) => sum + (Number(item.act_wgt) || 0), 0);

  let total = 0;
  for (const item of this.ReceivedColoaderDate) {
    total += Number(item.act_wgt) || 0;
  }
  return total;
}


getTotalVolWeight(): number {
  // return this.ReceivedColoaderDate.reduce((sum, item) => sum + (Number(item.vol_weight) || 0), 0);
   let total = 0;
  for (const item of this.ReceivedColoaderDate) {
    total += Number(item.vol_weight) || 0;
  }
  return total;
}

getTotalChargeableWeight(): number {
  // return this.ReceivedColoaderDate.reduce((sum, item) => sum + (Number(item.chrg_weight) || 0), 0);
   let total = 0;
  for (const item of this.ReceivedColoaderDate) {
    total += Number(item.chrg_weight) || 0;
  }
  return total;
}


  private processData(d: any) {
    this.ReceivedColoaderDate = d['data'].map(item => ({
      ...item,
      length: parseFloat(item.length),
      width: parseFloat(item.width),
      height: parseFloat(item.height),
      act_wgt: parseFloat(item.act_wgt),
      vol_weight: this.calculateVolumetricWeight(item),
      chrg_weight: this.calculateChargeableWeight(item),
      created_by: this.userdetails['v_user_id']
    }));
  }


  v1_SP_Ds_hawb_order_Insert_by_hawb_id(data) {
    if (data) {
      data['box_no'] = data['carton_no'];
      data['weight'] = data['act_wgt'];
      data['vol_wgt'] = data['vol_weight'];
      data['chargeable_wt'] = data['chrg_weight'];



    }
    const Payload = {
      hawb_no: data.invoice_no,
      created_by: this.userdetails.v_user_id,
      cartonData: Array.isArray(data) ? data : [data]  // Ensure cartonData is an array
    };

    console.log(Payload);

    this.serviceNew.v1_SP_Ds_hawb_order_Insert_by_hawb_id(Payload).subscribe(response => {
      this.v1_SP_ds_Pickup_order_pickedup_check_weight_list();
      this.v1_SP_ds_Pickup_order_pickedup_check_weight_listCheckSendMail(data['carton_no'])

      if (response['code'] === 200) {  // Use '===' instead of '='
        // this.toastr.successToastr("Inserted Successfully");
        setTimeout(() => {
          this.focusNext(this.heightInput, this.event)
        }, 100);
      }
    });
  }
  addNewRow() {
    const maxCartonNo = this.ReceivedColoaderDate.length
      ? Math.max(...this.ReceivedColoaderDate.map(item => Number(item.carton_no) || 0))
      : 0;

    this.ReceivedColoaderDate.push({
      item_type: 'BOX',
      invoice_no: this.ReceivedColoaderDate[0].invoice_no || '',
      carton_no: maxCartonNo + 1,
      act_wgt: 0,
      length: 0,
      width: 0,
      height: 0,
      vol_weight: 0,
      chrg_weight: 0,
      update_status: 0,
      isNew: true,
      created_by: this.userdetails['v_user_id']
    });
  }


  removeRow(index: number) {
    if (this.ReceivedColoaderDate.length > 1) {
      this.ReceivedColoaderDate.splice(index, 1);
    }
  }



  showMessage(msg = '', type = 'success') {
    const toast: any = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: 'toast' },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: '10px 20px',
    });
  }

}