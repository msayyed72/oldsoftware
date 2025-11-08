import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent, RowDataBoundEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { NewApiCloudService } from '../../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';
import { DatePipe } from '@angular/common';
import { AwbService } from '../../../cfServices/awb.service';
import { concatMap, timer } from 'rxjs';

@Component({
  selector: 'app-final-invoice',
  templateUrl: './final-invoice.component.html',
  styleUrls: ['./final-invoice.component.css']
})
export class FinalInvoiceComponent implements OnInit {
  @ViewChild('cancelPopup') cancelPopup: any
  @ViewChild('addNotes') addNotes: any
  @ViewChild('consignmentDetailModal') consignmentDetailModal: any

  @ViewChild('editItemModal') editItemModal: any
  @ViewChild('editItemModalEdit') editItemModalEdit: any
  @ViewChild('sendFreeAgentInvPdf') sendFreeAgentInvPdf: any
  @ViewChild('sendFreeAgentInvPdfModify') sendFreeAgentInvPdfModify: any
  @ViewChild('paymentStsupdate') paymentStsupdate: any
  @ViewChild('txtDate') txtDate!: ElementRef<HTMLInputElement>;
  @ViewChild('mainGrid') public mainGrid: GridComponent;
  @ViewChild('sendImgMail') public sendImgMail: any;

  sparkOptionsInfo
  sparkOptionsWarning
  sparkOptionsDanger
  btn3: any;
  invoice_list: any;
  point_code_pefix
  sparkOptionsSuccess
  invoicedetails;
  userid
  v_point_Id_Branch;
  userdetails
  v_location_id
  pointid
  point_type_id
  country_id
  invoice_no
  pdf_data
  date
  date2
  term
  today = new Date();
  rowClicked: any;
  tot_inv: any;
  tot_ctn: number;
  tot_wgt: number;
  tot_net_Amt: number;
  tot_Rec_Amt: number;
  tot_Blc_Amt: number;
  rowsFilter: any;
  inv_No: any
  invoiceNo: any = "";
  valForm: FormGroup
  v_designation_id: any;
  code: string = '';
  paymentType: any = ''
  state: string = '';
  anyNotUpdated: boolean = false;
  after14PaymentDate = '';
  sendMailChecked: boolean = false
  emailContent = ''
  selectInvoiceNo: string = '';
  selectSenderMail: any;
  constructor(public http: HttpClientModule,
    public serviceNew: NewApiCloudService,
    fb: FormBuilder, private imageCompress: NgxImageCompressService,
   public router: Router,
    private datep: DatePipe, 
    public service: AwbService, private route: ActivatedRoute,
   ) {
    this.userdetails = JSON.parse(localStorage.getItem("log_data"))
    if (this.userdetails) { }
    else {
      this.router.navigate(['login/0']);
    }
    this.route.queryParams.subscribe(params => {
      this.code = params['code'] || '';
      this.state = params['state'] || '';

      if (this.code) {
        this.serviceNew.getFreeagentToken(this.code).subscribe(
          (d: any) => {
            if (d.length > 0) {
              // localStorage.clear()
              localStorage.setItem('FreeAgentToken', d[0].access_token);
              // localStorage.setItem('TokenType', d.data.token_type);
              localStorage.setItem('RefreshToken', d[0].refresh_token);
              localStorage.setItem('TokenExpiry', (d[0].token_expires).toString());
              console.log('Token stored successfully');
            } else {
              console.error('Invalid token response:', d);
            }
          },
          (error) => {
            console.error('Error fetching token:', error);
          }
        );
      }

      console.log('Code:', this.code);
      console.log('State:', this.state);
    });
    this.userid = this.userdetails.v_user_id;
    this.pointid = this.userdetails.v_point_id
    this.point_type_id = this.userdetails.v_point_type_id
    this.point_code_pefix = this.userdetails.v_origin_prefix
    this.country_id = this.userdetails.V_country_id
    this.v_point_Id_Branch = this.userdetails.v_point_Id_Branch
    this.v_location_id = this.userdetails.v_location_id
    this.v_designation_id = this.userdetails.v_designation_id
    this.date = this.datep.transform(this.today, 'yyyy-MM-dd');
    // this.date = '2025-04-05';
    // this.date=
    this.valForm = fb.group({
      'net_amount': [null],
      'received_amount': [null],
      'remarks': [null, Validators.required],
      'invoice_no': [null],
      'invoice_id': [null],
      'created_by': [this.userid]
    });
  }
  get_invoice() {
    this.btn3 = true;
    this.serviceNew.get_invoice_list(this.pointid, this.v_location_id, this.invoice_no, this.date).subscribe(data => {
      if (data['data']) {
        if (data['data'].length) {
          this.invoice_list = data['data'].map((d, i) => {
            return {
              ...d,
              pageNo: i + 1,
                        pendingCount:Number(d['carton_count']) +"/"+Number(d['pickup_carton_count']),

              final_mail_status: d['final_mail_status'] == 1 ? 'Final Img Mail Sended' : 'Not Sent',
              type_of_shipment_text: d['type_of_shipment'] == 1 ? 'Normal' : d['type_of_shipment'] == 2 ? 'Commercial' : '',
              invCurrentSts: d['invoice_api_status'] == 0 ? 'Not Generated' :
                d['invoice_api_status'] == 1 ? 'Generated' :
                  d['invoice_api_status'] == 2 ? 'Marked as Sent' :
                    d['invoice_api_status'] == 3 ? 'Sent to Customer' :
                      'Status Not Found'
            };
          });

        }
        else {
          this.invoice_list = []
        }

      } else {
        this.invoice_list = []
      }

      this.rowsFilter = this.invoice_list
      if (data['code'] == 200) {
        this.tot_inv = this.invoice_list.length
        this.tot_ctn = 0
        this.tot_wgt = 0
        this.tot_net_Amt = 0
        this.tot_Rec_Amt = 0
        this.tot_Blc_Amt = 0
        for (var i = 0; i < this.tot_inv; i++) {
          this.tot_ctn += Number(this.invoice_list[i]['total_carton'])
          this.tot_wgt += Number(this.invoice_list[i]['total_weight'])
          this.tot_net_Amt += Number(this.invoice_list[i]['net_amount'])
          this.tot_Rec_Amt += Number(this.invoice_list[i]['received_amount'])
          this.tot_Blc_Amt += Number(this.invoice_list[i]['balance_amount'])
        }
        this.btn3 = false;
      }
      else {
        this.btn3 = false;
      }
    })
  }
  inv_search() {
    this.service.get_Inv_id_by_no(this.inv_No, this.pointid).subscribe(res => {
      if (res['code'] == "200") {
        this.view_invoice(this.inv_No, res['data'][0]['hawb_id'], res['data'][0]['printing_status'])
      }
      else {
        this.showMessage("No Invoice Here!",'error')
      }
    },
      error => {
        this.showMessage("No Invoice Here!",'error')
      })
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
  RowDateCheck($evt) {
    console.log($evt)
  }
  dblEventDetected(data: any) {
    console.log(data);
    console.log("dbl Event Triggered");

    if (data.rowData && data.rowData.hawb_id) {

      this.consignmentDetailModal.show();
      this.getInvoiceDetails(data.rowData.hawb_id)
      this.getPackingListDetailsnew(data.rowData.hawb_id)
    }
  }

  totalReceivedData: any[] = [];
  getInvoiceDetails(invoice_id) {
    this.service.get_Hawb_Details(invoice_id).subscribe(data => {
      if (data['data'].length > 0) {
        this.totalReceivedData = data['data'];


      }
    });
  }
  packageData: any[] = [];
  getPackingListDetailsnew(invoice_id) {
    this.service.get_carton_by_invoice(invoice_id).subscribe(data => {
      if (data['data'].length > 0) {
        this.packageData = data['data']
      }
    })
  }
getIconClass(status: string): string {
  switch (status) {
    case 'Not Generated':
      return 'text-danger'; // Class for red icon
    case 'Generated':
      return 'text-primary'; // Class for blue icon
    case 'Marked as Sent':
      return 'text-warning'; // Class for yellow icon
    case 'Sent to Customer':
      return 'text-success'; // Class for green icon
    default:
      return 'text-secondary'; // Class for grey icon for any other status
  }
}
  view_invoice(value, id, status) {
   
  }
  print(value) {
    // this.service.get_print(value).subscribe(data=>{
    //   this.pdf_data=data['data']
    //   window.open(data.file_url)

    // })
    this.service.get_label_print(value).subscribe(data => {
      this.pdf_data = data['data']
      window.open(data.file_url)

    })

  }

  submitForm() {
    if (this.valForm.valid) {
      this.service.updateInvoiceCancal(this.valForm.value).subscribe(data => {
        if (data['code'] == 200) {
          this.showMessage('Bill Canceled Successfully!')
          this.cancelPopup.hide()
        }
        else {
          this.showMessage('Failed ! ','error')
          this.cancelPopup.hide()
        }
      })
    }
    else {
      this.showMessage('Please menntion the reason!!','error')
    }
  }
  cancel_invoice(list) {
    this.invoiceNo = list.hawb_no
    this.cancelPopup.show()
    this.valForm.patchValue({
      invoice_no: list.hawb_no,
      net_amount: list.net_amount,
      invoice_id: list.hawb_id
    })
  }

  get_awb_printbar(value) {
    // this.Save_spin='1'
    this.service.get_print_bar(value).subscribe(data => {
      this.pdf_data = data['data']
      window.open(data.file_url)
      // this.Save_spin='2'
    })
  }
  get_awb_print(value) {

    this.service.get_printnew(value, "label", '1', 1).subscribe(data => {
      this.pdf_data = data['data']
      window.open(data.file_url)
    })
  }
  get_awb_print_new(value) {
    // this.Save_spin='1'
    this.service.get_printnew(value, "label_barcode", '1', 1).subscribe(data => {
      this.pdf_data = data['data']
      window.open(data.file_url)
      // this.Save_spin='2'
    })
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.invoice_list.filter(function (report) {
      return report.hawb_no.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rowsFilter = temp;
  }
  filterSettings: any;
  public toolbarOptions: ToolbarItems[] = ['Search'];
  public editSettings: Object;
  Get_NextPickupDate_After14Days_freeagent(data) {
    const selectedDate = new Date(this.selectPaymentDate); // '2025-05-31'
    selectedDate.setDate(selectedDate.getDate() + 1); // Tentatively add 1 day

    // Skip weekends
    while (selectedDate.getDay() === 6 || selectedDate.getDay() === 0) {
      selectedDate.setDate(selectedDate.getDate() + 1);
    }

    this.selectPaymentDateNextDAy = selectedDate.toISOString().split('T')[0]; // e.g., '2025-06-03' if 1st is weekend

    // console.log(nextDate); // Output: 2025-06-01
    this.serviceNew.Get_NextPickupDate_After14Days_freeagent(data).subscribe(d => {
      this.after14PaymentDate = d['data']
      this.emailContent = `
  <p>Dear ${this.selectSenderName},</p>

  <p>We confirm we have received your payment on <strong>${this.formatDate(this.selectPaymentDate)}</strong> against house air waybill number <strong>${this.selectInvoiceNo}</strong>. Thank you!</p>

  <p>The transit time for our door-to-door air economy service to India starts from the next working day after your payment. So, your shipment journey begins on <strong>${this.formatDate(this.selectPaymentDateNextDAy)}</strong>.</p>

  <p>Counting from that date, your delivery is scheduled for the 14th working day, which falls on <strong>${this.after14PaymentDate}</strong>. We aim to deliver on or before this day.</p>

  <p>For your assurance and protection, we highly recommend that you take videos and pictures of the shipment before accepting the delivery from the courier. This is an important step to document the condition of your package upon arrival and will assist in the unlikely event of a dispute or claim.</p>

  <p><strong>Just a heads-up:</strong> our service is non-trackable during its initial stages. However, once your shipment has cleared customs, we'll provide you with a link to track the last mile connection to your delivery address in India.</p>

  <p>Even though tracking might not be available during the entire transit, rest assured, you can request a written proof of delivery once your package arrives.</p>

  <h4 style="color: red;">IMPORTANT:</h4>
  <p>There is a lot of fraud and scam going on in the name of Cargo Force and other companies too. Please be very careful, inform the receiver/consignee about this too and:</p>
  <ul>
    <li><strong>Do NOT</strong> give any payments to anyone in India for your cargo.</li>
    <li><strong>Do NOT</strong> share any One Time Password in India for your cargo.</li>
    <li><strong>Do NOT</strong> make any payments to anyone in India for your cargo.</li>
  </ul>
  <p>We do not, and neither will any of our last mile delivery partners, ask for any additional payment in India. Even if it is 1 Indian Rupee, do NOT pay it in cash, especially online.</p>

  <p>Thank you for your understanding and trust!</p>

  <p>Warm regards,<br><strong>Cargo Force</strong></p>
`;
      this.editedContent = this.emailContent;

    })
  }

  ngOnInit() {
    this.getFreeAgentAutoComplete();

    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };;

    this.toolbarOptions = ['ColumnChooser', 'Search'];
    const dtToday = new Date();
    this.selectPaymentDate = new Date().toISOString().split('T')[0];
    const selectedDate = new Date(this.selectPaymentDate); // '2025-05-31'
    selectedDate.setDate(selectedDate.getDate() + 1); // Add 1 day

    this.selectPaymentDateNextDAy = selectedDate.toISOString().split('T')[0]; // '2025-06-01'
    // console.log(nextDate); // Output: 2025-06-01
    this.selectPaymentDate = new Date().toISOString().split('T')[0];
    this.Get_NextPickupDate_After14Days_freeagent(this.selectPaymentDate)
    this.isBillingClientFound = false;
    let month: string | number = dtToday.getMonth() + 1;
    let day: string | number = dtToday.getDate();
    const year = dtToday.getFullYear();

    month = month < 10 ? '0' + month.toString() : month.toString();
    day = day < 10 ? '0' + day.toString() : day.toString();

    const minDate = `${year}-${month}-${day}`;

    // Set the minimum date to today
    if (this.txtDate) {
      this.txtDate.nativeElement.min = minDate;
    }
    // localStorage.clear()
    this.filterSettings = { ignoreAccent: true, hierarchyMode: 'None', type: 'Excel' };

    this.get_invoice()
  }
  ToogledToolBar(args: any) {
    // console.log(args)

    switch (args.item.text) {
      case 'PDF Export':
        this.mainGrid.pdfExport({
          fileName: 'Custom_File_Name.pdf',
          pageOrientation: 'Landscape'
        });
        break;
      case 'Excel Export':
        this.mainGrid.excelExport({ fileName: 'CustomerBooking.xlsx' });
        break;
      case 'CSV Export':
        this.mainGrid.csvExport({ fileName: 'Custom_File_Name.csv' });
        break;
      case 'Print':
        this.mainGrid.print();
        break;
      case 'Add':  // Handle Add button click
        this.mainGrid.addRecord(); // This adds a new row in the grid
        break;
      default:
        console.log('No matching toolbar action found:', args.item.text);
    }
  }
  booking() {
    if (this.v_designation_id == 36) {
      this.router.navigate(['booking-philippine']);
    }
    else {
      this.router.navigate(['invoice-booking']);
    }

  }
  changeTableRowColor(idx: any) {
    // console.log(idx)
    this.rowClicked = idx;
  }
  selectedDetails: any = {};
  send_invoice(data) {
    data.freeAgentRef = data.hawb_no
    this.selectedDetails = data

    if (localStorage.getItem('FreeAgentToken') && localStorage.getItem('RefreshToken') && localStorage.getItem('TokenExpiry')) {
      // this.createInvoice_freeAgent(data)
      this.getPackingListDetails(data)
      // this.selectedDetails=data
      this.sendFreeAgentInvPdf.show();
    } else {
      this.verifyFreeagentCall()
    }
  }
  generateInvoice() {
    const invoiceData = {

    };

    // console.log("Invoice Data:", invoiceData);


  }


  verifyFreeagentCall() {
    this.serviceNew.verifyFreeagent()
  }
  PackingListDetails: any[] = [];
  editingData: any = [];
  // Row
  getPackingListDetails(id) {

    if (id['agent_customer'] != 'bookingAgent') {
      this.service.get_carton_by_invoice(id.hawb_id).subscribe((data) => {
        if (data.data.length > 0) {
          this.PackingListDetails = data.data.map((item) => ({
            ...item,
            quantity: 1,
            unit_price: 4,
            VAT: 0,
            VATAMT: 0
          }));

          this.editingData = [{
            description: this.PackingListDetails.map(item =>
              `HAWB: ${item.hawb_no} - Box: ${item.carton_no} - Weight: ${item.chrg_weight}Kg`
            ).join('\n'),
            quantity: Number(Math.max(10, this.PackingListDetails.reduce((sum, item) => sum + Number(item.chrg_weight), 0))),
            unit_price: 4,
            VAT: 0,
            sub_total: (Number(Math.max(10, this.PackingListDetails.reduce((sum, item) => sum + Number(item.chrg_weight), 0))) * 4)
          }];

          // Add deposit adjustment if applicable
          if (id.deposit_payment_amt > 0 && id.getPackingListDetails != 'Drop_At_Warehouse') {
            this.editingData.push({
              description: 'Deposit Amount Adjusted',
              quantity: 1,
              VAT: 0,
              unit_price: -Math.abs(Number(id.deposit_payment_amt)),
              sub_total: -Math.abs(Number(id.deposit_payment_amt))
            });
          }

          // Apply surcharges
          this.PackingListDetails.forEach(item => {
            // Heavy Weight
            if (Number(item.act_wgt) > 30.26 && item.getPackingListDetails != 'Drop_At_Warehouse') {
              this.editingData.push({
                description: "Carrier Heavy Weight Surcharge",
                quantity: 1,
                unit_price: 60,
                VAT: 0,
                sub_total: 60
              });
            }

            // Long Length
            let longSurchargeCount = 0;
            if (Number(item.length) > 80 && item.getPackingListDetails != 'Drop_At_Warehouse') longSurchargeCount++;
            if (Number(item.width) > 80 && item.getPackingListDetails != 'Drop_At_Warehouse') longSurchargeCount++;
            if (Number(item.height) > 80 && item.getPackingListDetails != 'Drop_At_Warehouse') longSurchargeCount++;

            for (let i = 0; i < longSurchargeCount; i++) {
              this.editingData.push({
                description: "Carrier Long Length Surcharge",
                quantity: 1,
                unit_price: 60,
                VAT: 0,
                sub_total: 60
              });
            }
          });

        } else {
          this.editingData = [];
        }
      });
    } else {
      let CollectionType = ''
      if (id['collection_type'] == 'Drop_At_Warehouse') {
        CollectionType = 'drop'
      } else {
        CollectionType = 'pickup'

      }
      this.service.get_carton_by_invoice(id.hawb_id).subscribe((res) => {
        if (!res || !res.data || res.data.length === 0) {
          this.PackingListDetails = [];
          this.editingData = [];
          return;
        }

        this.PackingListDetails = res.data.map((item: any) => ({
          ...item,
          quantity: 1,
          unit_price: 4,
          VAT: 0,
          VATAMT: 0
        }));

        const totalWeight = this.PackingListDetails.reduce((sum: number, item: any) => {
          const w = Number(Math.ceil(parseFloat(item.act_wgt)).toFixed(2)) ;
          return sum + (isNaN(w) ? 0 : w);
        }, 0);

        const chargeableWeight = Number(Math.ceil(Math.max(10, totalWeight)).toFixed(2)) ;
        const fallbackAmount = chargeableWeight * 4;

        const payload = {
          user_id: id['agent_customer_user_id'] ? id['agent_customer_user_id'] : null,
          shipment_wt: chargeableWeight,
          service_type: CollectionType || 'pickup',
          shipment_mode: 'ND',
          payment_mode: 'prepaid'
        };

        this.serviceNew.getAgentRate(payload).subscribe(
          (r: any) => {
            let apiAmount: number | null = null;
            if (
              r &&
              r.status === 'success' &&
              r.code === '200' &&
              r.data &&
              r.data.length > 0 &&
              r.data[0].final_amount !== undefined &&
              r.data[0].final_amount !== null &&
              r.data[0].final_amount !== ''
            ) {
              const parsed = parseFloat(r.data[0].final_amount);
              if (isFinite(parsed)) apiAmount = parsed;
            }

            this.quoteAmount = apiAmount !== null ? apiAmount : fallbackAmount;

            const descriptionText = this.PackingListDetails
              .map((item: any) => `HAWB: ${item.hawb_no} - Box: ${item.carton_no} - Weight: ${Math.ceil(item.act_wgt)}Kg`)
              .join('\n');

            const derivedUnitPrice = Math.round((this.quoteAmount / chargeableWeight) * 100) / 100;

            this.editingData = [{
              description: descriptionText,
              quantity: Number(chargeableWeight),
              unit_price: derivedUnitPrice,
              VAT: 0,
              sub_total: this.quoteAmount
            }];

            if (id.deposit_payment_amt > 0 && id.getPackingListDetails !== 'Drop_At_Warehouse') {
              const dep = Math.abs(Number(id.deposit_payment_amt));
              this.editingData.push({
                description: 'Deposit Amount Adjusted',
                quantity: 1,
                VAT: 0,
                unit_price: -dep,
                sub_total: -dep
              });
            }

            this.PackingListDetails.forEach((item: any) => {
              if (id.getPackingListDetails === 'Drop_At_Warehouse') return;

              const aw = parseFloat(item.act_wgt);
              if (!isNaN(aw) && aw > 30.26) {
                this.editingData.push({
                  description: 'Carrier Heavy Weight Surcharge',
                  quantity: 1,
                  unit_price: 60,
                  VAT: 0,
                  sub_total: 60
                });
              }

              let count = 0;
              const L = parseFloat(item.length), W = parseFloat(item.width), H = parseFloat(item.height);
              if (!isNaN(L) && L > 80) count++;
              if (!isNaN(W) && W > 80) count++;
              if (!isNaN(H) && H > 80) count++;

              for (let i = 0; i < count; i++) {
                this.editingData.push({
                  description: 'Carrier Long Length Surcharge',
                  quantity: 1,
                  unit_price: 60,
                  VAT: 0,
                  sub_total: 60
                });
              }
            });
          },
          () => {
            this.quoteAmount = fallbackAmount;

            const descriptionText = this.PackingListDetails
              .map((item: any) => `HAWB: ${item.hawb_no} - Box: ${item.carton_no} - Weight: ${item.chrg_weight}Kg`)
              .join('\n');

            const derivedUnitPrice = Math.round((this.quoteAmount / chargeableWeight) * 100) / 100;

            this.editingData = [{
              description: descriptionText,
              quantity: Number(chargeableWeight),
              unit_price: derivedUnitPrice,
              VAT: 0,
              sub_total: this.quoteAmount
            }];
          }
        );
      });
    }


  }
  quoteAmount: any;

  async compressImageTo2MB(image: File): Promise<File> {

    console.log("Compressing image to ≤2MB...");

    if (!image || !(image instanceof File)) {
      return Promise.reject('Invalid image file provided');
    }

    // Check if the file is a PDF
    if (image.type === 'application/pdf') {
      // If it's a PDF, return the same file without compressing
      console.log('File is a PDF, returning original file.');
      return Promise.resolve(image);
    }

    // Compress image logic if it's not a PDF
    return new Promise<File>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);

      reader.onload = async () => {
        try {
          let quality = 90;
          let compressedBase64: string = reader.result as string;

          while (true) {
            const newCompressed = await this.imageCompress.compressFile(compressedBase64, -1, quality, quality);
            const blob = await fetch(newCompressed).then(res => res.blob());

            if (blob.size <= 2 * 1024 * 1024 || quality <= 10) {
              const compressedFile = new File([blob], image.name, { type: image.type });
              resolve(compressedFile);
              return;
            }

            quality -= 10;
            compressedBase64 = newCompressed;
          }
        } catch (error) {
          reject(`Image compression failed: ${error}`);
        }
      };

      reader.onerror = () => reject('Error reading the image file');
    });
  }
  pendingUploadFiles: File[] = []; // holds files dropped but not yet uploaded
  uploadedImageUrls: string[] = []; // holds URLs after upload
  async onImageUploadAadhar(file: File): Promise<string> {
    let processedFile = file;

    try {
      if (file.type.startsWith('image/')) {
        processedFile = await this.compressImageTo2MB(file);
      }

      const formData = new FormData();
      formData.append('avatar', processedFile);

      return new Promise<string>((resolve, reject) => {
        this.serviceNew.imgUploadnew(formData).subscribe({
          next: (res) => {
            console.log('Upload response:', res);
            if (res.status === 'success' && typeof res.url === 'string') {
              const url = `$a-z/${res.url}`;
              this.saveNotes('Final Img Sended In Mail'); // Save to your NotesReceivedForInvoice array

              this.saveNotes(url);
              resolve(url); // ✅ resolve with string
            } else {
              reject(new Error('Upload succeeded but no valid URL returned'));
            }
          },
          error: (err) => {
            console.error('Upload failed:', err);
            reject(err);
          }
        });
      });
    } catch (err) {
      console.error('Processing failed:', err);
      return Promise.reject(err);
    }
  }


  saveNotes(EnteredNotes) {
    const Notes = {
      invoice_no: this.selectedDetails.hawb_no,
      notes: EnteredNotes,
      created_by: this.userdetails.v_user_id,
    };

    this.serviceNew.v1_sp_ds_pickup_order_note_insert(Notes).subscribe(
      (data) => {
        // this.NotesForInvoices.hide()

        if (data['code'] == 200) {
          // this.toastr.successToastr('Notes inserted successfully.');
          // this.getHawbListAssigned();
          if (this.selectedDetails.hawb_no) {
            // const msg = {
            //   sender: this.userdetails['v_user_name'],
            //   content: this.EnteredNotes,
            //   timestamp: new Date().toISOString()
            // };
            // const msg = { from: 'Dharun', message: 'Hello Server!' };

            // this._chat.send({
            //   source: 'notes',
            //   event: 'notes',
            //   payload: { message: this.userdetails['v_employee_name'] + " Sended message:- " + this.EnteredNotes }
            // }); this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no'])
            // this.EnteredNotes = ''; // Clear input after success

          }

        } else {
          this.showMessage('Failed to insert notes. Please try again.','error');
        }
      },
      (error) => {
        // this.NotesForInvoices.hide()
        this.showMessage('An error occurred. Please check your connection.','error');
        console.error('Error inserting notes:', error);
      }
    );
  }
highlightBookingAgent(args: RowDataBoundEventArgs) {
  const data = args.data as any;

  if (
    data &&
    data.agent_customer &&
    typeof data.agent_customer === 'string' &&
    data.agent_customer.toLowerCase() === 'bookingagent'
  ) {
    (args.row as HTMLTableRowElement).classList.add('row-booking-agent');
  }
}
  addRow() {
    console.log(this.selectedDetails)
    if (this.selectedDetails['agent_customer'] == 'bookingAgent') {
      let CollectionType = ''
      if (this.selectedDetails['collection_type'] == 'Drop_At_Warehouse') {
        CollectionType = 'drop'
      } else {
        CollectionType = 'pickup'

      }
      const payload = {
        user_id: this.selectedDetails['agent_customer_user_id'] ? this.selectedDetails['agent_customer_user_id'] : null,
        shipment_wt: 1,
        service_type: CollectionType || 'pickup',
        shipment_mode: 'ND',
        payment_mode: 'prepaid'
      };

      this.serviceNew.getAgentRatePerKg(payload).subscribe(
        (r: any) => {
          if (
            r &&
            r.status === 'success' &&
            r.code === '200' &&
            r.data &&
            r.data.length > 0 &&
            r.data[0].final_amount !== undefined &&
            r.data[0].final_amount !== null &&
            r.data[0].final_amount !== ''
          ) {
            const parsed = parseFloat(r.data[0].final_amount);
            this.editingData.push({
              description: '',
              quantity: 1, // Default quantity
              unit_price: parsed, // Default price
              sub_total: parsed // Initial subtotal
            });
          }
        })
    } else {
      this.editingData.push({
        description: '',
        quantity: 1, // Default quantity
        unit_price: 4, // Default price
        sub_total: 4 // Initial subtotal
      });
    }


  }
  addRowMod() {
    this.editingDataModufy.push({
      description: '',
      quantity: 1, // Default quantity
      unit_price: 4, // Default price
      sub_total: 4 // Initial subtotal
    });
  }
  removeRow(index: number) {
    this.editingData.splice(index, 1);
  }
  removeRowModify(index: number) {
    this.editingDataModufy.splice(index, 1);
  }

  // Calculate subtotal
  getSubtotal() {
    return this.editingData.quantity * this.editingData.unit_price;
  }

  // Calculate the total amount dynamically
  getNetTotal(): number {
    return this.editingData.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }
  getNetTotalMod(): number {
    return this.editingDataModufy.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }
  // Convert Net Total to GBP Total (assuming same value for now, modify if needed)
  getGBPAmount(): number {
    return this.getNetTotal(); // If there's a conversion, apply it here
  }
  getGBPAmountMod(): number {
    return this.getNetTotalMod(); // If there's a conversion, apply it here
  }

  getVATAMt(): number {
    const Amt = this.editingData.reduce((sum, item) => sum + (item.VATAMT || 0), 0);
    // const 
    return Amt ? Amt : 0;
  }

  getVATAMtMod(): number {
    const Amt = this.editingDataModufy.reduce((sum, item) => sum + (item.VATAMT || 0), 0);
    // const 
    return Amt ? Amt : 0;
  }


  getMergedDetails(): string {
    return this.PackingListDetails.map(item =>
      `HAWB: ${item.hawb_no} - Box: ${item.carton_no} - Weight: ${item.chrg_weight}Kg`
    ).join('\n');
  }
  splitName(fullName: string): { firstName: string, lastName: string } {
    const nameParts = fullName.trim().split(/\s+/);
    const lastName = nameParts.pop() || ''; // Get last word
    const firstName = nameParts.join(' ');  // Join the rest as first name

    return { firstName, lastName };
  }
  isBillingClientFound: boolean = false;

  createInvoice_freeAgent() {
    // console.log(this.editingData)
    const invoiceItems = this.editingData.map(item => ({
      description: item.description ? item.description.trim() : "",
      item_type: "", // Add logic here if required
      price: item.unit_price.toString(),
      quantity: item.quantity || 0,
      sales_tax_rate: parseFloat(item.VAT) || 0 // Ensures it becomes a float like 20.0

    }));


    this.serviceNew.createInvoice_freeAgent({}, 'C').pipe(
      concatMap((res: any) => {
        let contacts = [];
        let contactUrl = '';

        if (res && res.data && res.data.list && res.data.list.contacts) {
          contacts = res.data.list.contacts;
        }

        const senderMail = this.selectedDetails.sender_mail;
        this.isBillingClientFound = false;

        for (let i = 0; i < contacts.length; i++) {
          const contact = contacts[i];
          if (
            (contact.billing_email && contact.billing_email === senderMail) ||
            (contact.email && contact.email === senderMail)
          ) {
            // console.log('Matching mail f/ound:', senderMail);
            this.isBillingClientFound = true;
            contactUrl = contact.url;
            break;
          }
        }

        const data: any = {
          invoice_no: this.selectedDetails.hawb_no,
          freeAgentRef: this.selectedDetails.freeAgentRef,
          net_amount: this.getGBPAmount(),
          total_value: this.getGBPAmount() + this.getVATAMt(),
          invoice_items: invoiceItems,
          created_by: this.userdetails['v_user_id'],
          firstName: '',
          lastName: '',
          senderMail: '',
          senderPhone: '',
          sender_address: '',
          sender_address2: '',
          sender_address3: '',
          sender_pincode: '',
          shipper_city: '',
          contactUrl: '',
          invoiceUrl: 'https://api.freeagent.com/v2/invoices'
        };
        const fullName = this.selectedDetails['sender_name'];
        const nameParts = this.splitName(fullName);

        data.firstName = nameParts.firstName;
        data.lastName = nameParts.lastName;
        data.senderMail = this.selectedDetails['sender_mail'];
        data.senderPhone = this.selectedDetails['sender_mobile'];
        data.sender_address = this.selectedDetails['sender_address'];
        data.sender_address2 = this.selectedDetails['sender_address2'];
        data.sender_address3 = this.selectedDetails['sender_address3'];
        data.shipper_city = this.selectedDetails['shipper_city'];
        data.sender_pincode = this.selectedDetails['sender_pincode'];
        data.type = 'final_invoice';

        if (!this.isBillingClientFound) {
          // Adding a delay (0 or 1 sec) before the second API call
          return timer(10).pipe(  // You can change the 1000ms to 0 for immediate delay or 1000 for 1 second delay
            concatMap(() => this.serviceNew.createInvoice_freeAgent(data, 'CC')),
            concatMap((resCC: any) => {
              if (
                resCC &&
                resCC.status === 'success' &&
                resCC.data &&
                resCC.data.invoice &&
                resCC.data.invoice.contact &&
                resCC.data.invoice.contact.url
              ) {
                data.contactUrl = resCC.data.invoice.contact.url;
              }
              return this.serviceNew.createInvoice_freeAgent(data, 'I');
            })
          );
        } else {
          data.contactUrl = contactUrl;
          return this.serviceNew.createInvoice_freeAgent(data, 'I');
        }
      })
    ).subscribe(
      (r: any) => {
        if (
          r &&
          r.status === 'success' &&
          r.data &&
          r.data.f_name
        ) {
          this.showMessage("Invoice created successfully!");
          this.get_invoice();
          this.sendFreeAgentInvPdf.hide();
          window.open("https://api.cargoforce.com/operation/nodeNew/invoice_pdf/invoice-" + r.data.f_name, "_blank");
        } else if (
          r &&
          r.data &&
          r.data.invoice &&
          r.data.invoice.errors &&
          r.data.invoice.errors.length > 0
        ) {
          for (let i = 0; i < r.data.invoice.errors.length; i++) {
            this.showMessage(r.data.invoice.errors[i].message,'error');
          }
        } else {
          this.showMessage("Unexpected error occurred while creating the invoice.",'error');
        }
      },
      (error: any) => {
        this.showMessage("API request failed. Please try again.",'error');
      }
    );
  }
  createInvoice_freeAgent_CreditNote() {
    console.log(this.editingData)
    const invoiceItems = this.editingData.map(item => ({
      description: item.description ? item.description.trim() : "",
      item_type: "", // Add logic here if required
      price: item.unit_price.toString(),
      quantity: item.quantity || 0,
    }));

    this.serviceNew.createInvoice_freeAgent({}, 'C').pipe(
      concatMap((res: any) => {
        let contacts = [];
        let contactUrl = '';

        if (res && res.data && res.data.list && res.data.list.contacts) {
          contacts = res.data.list.contacts;
        }

        const senderMail = this.selectedDetails.sender_mail;
        this.isBillingClientFound = false;

        for (let i = 0; i < contacts.length; i++) {
          const contact = contacts[i];
          if (
            (contact.billing_email && contact.billing_email === senderMail) ||
            (contact.email && contact.email === senderMail)
          ) {
            console.log('Matching mail found:', senderMail);
            this.isBillingClientFound = true;
            contactUrl = contact.url;
            break;
          }
        }

        const data: any = {
          invoice_no: this.selectedDetails.hawb_no,
          freeAgentRef: this.selectedDetails.freeAgentRef,
          net_amount: this.getGBPAmount(),
          invoice_items: invoiceItems,
          created_by: this.userdetails['v_user_id'],
          firstName: '',
          lastName: '',
          senderMail: '',
          senderPhone: '',
          sender_address: '',
          sender_address2: '',
          sender_address3: '',
          sender_pincode: '',
          shipper_city: '',
          contactUrl: '',
          invoiceUrl: 'https://api.freeagent.com/v2/invoices'
        };
        const fullName = this.selectedDetails['sender_name'];
        const nameParts = this.splitName(fullName);

        data.firstName = nameParts.firstName;
        data.lastName = nameParts.lastName;
        data.senderMail = this.selectedDetails['sender_mail'];
        data.senderPhone = this.selectedDetails['sender_mobile'];
        data.sender_address = this.selectedDetails['sender_address'];
        data.sender_address2 = this.selectedDetails['sender_address2'];
        data.sender_address3 = this.selectedDetails['sender_address3'];
        data.shipper_city = this.selectedDetails['shipper_city'];
        data.sender_pincode = this.selectedDetails['sender_pincode'];
        data.type = 'final_invoice';

        if (!this.isBillingClientFound) {
          // Adding a delay (0 or 1 sec) before the second API call
          return timer(10).pipe(  // You can change the 1000ms to 0 for immediate delay or 1000 for 1 second delay
            concatMap(() => this.serviceNew.createInvoice_freeAgent(data, 'CC')),
            concatMap((resCC: any) => {
              if (
                resCC &&
                resCC.status === 'success' &&
                resCC.data &&
                resCC.data.invoice &&
                resCC.data.invoice.contact &&
                resCC.data.invoice.contact.url
              ) {
                data.contactUrl = resCC.data.invoice.contact.url;
              }
              return this.serviceNew.createInvoice_freeAgent(data, 'CN');
            })
          );
        } else {
          data.contactUrl = contactUrl;
          return this.serviceNew.createInvoice_freeAgent(data, 'CN');
        }
      })
    ).subscribe(
      (r: any) => {
        if (
          r &&
          r.status === 'success' &&
          r.data &&
          r.data.f_name
        ) {
          this.service.sp_v1_ds_history_log_events_insert(this.selectedDetails.hawb_no, this.userdetails['v_user_id'], 'FreeAgent Final InvoiceCredit Note Has Been Generated').toPromise()

          this.showMessage("Invoice created successfully!");
          this.get_invoice();
          this.sendFreeAgentInvPdf.hide();
          window.open("" + r.data.f_name, "_blank");
        } else if (
          r &&
          r.data &&
          r.data.invoice &&
          r.data.invoice.errors &&
          r.data.invoice.errors.length > 0
        ) {
          for (let i = 0; i < r.data.invoice.errors.length; i++) {
            this.showMessage(r.data.invoice.errors[i].message,'error');
          }
        } else {
          this.showMessage("Unexpected error occurred while creating the invoice.",'error');
        }
      },
      (error: any) => {
        this.showMessage("API request failed. Please try again.",'error');
      }
    );
  }
  ViewInvoice(data) {
    window.open('https://api.cargoforce.com/operation/nodeNew/invoice_pdf/invoice-' + data.hawb_no + '.pdf')
  }
  createInvoice_freeAgentUpdate() {
    console.log(this.selectedDetails)
    if (!this.selectedDetails['invoice_url']) {
      this.showMessage("Somthing Went Wrong",'error')
      return;
    }
    if (this.selectedDetails['invoice_url']) {
      const check: any[] = String(this.selectedDetails['invoice_url']).split('/')
      if (check[check.length - 1] == 'invoices') {
        this.showMessage("Somthing Went Wrong",'error')
        return;
      }
    }
    console.log(this.editingDataModufy)
    const invoiceItems = this.editingDataModufy.map(item => ({
      description: item.description ? item.description.trim() : "",
      item_type: "", // Add logic here if required
      price: item.unit_price.toString(),
      url: item.url ? item.url.toString() : '',
      category: item.category ? item.category.toString() : '',

      quantity: item.quantity.toString(),
    }));

    // this.selectedDetails.sender_mail = "info@cargoforce.com";

    this.serviceNew.createInvoice_freeAgent({}, 'C').pipe(
      concatMap((res: any) => {
        let contacts = [];
        let contactUrl = '';

        if (res && res.data && res.data.list && res.data.list.contacts) {
          contacts = res.data.list.contacts;
        }

        const senderMail = this.selectedDetails.sender_mail;
        this.isBillingClientFound = false;

        for (let i = 0; i < contacts.length; i++) {
          const contact = contacts[i];
          if (
            (contact.billing_email && contact.billing_email === senderMail) ||
            (contact.email && contact.email === senderMail)
          ) {
            console.log('Matching mail found:', senderMail);
            this.isBillingClientFound = true;
            contactUrl = contact.url;
            break;
          }
        }

        const data: any = {
          invoice_no: this.selectedDetails.hawb_no,
          net_amount: this.getGBPAmountMod(),
          invoice_items: invoiceItems,
          created_by: this.userdetails['v_user_id'],
          firstName: '',
          lastName: '',
          senderMail: '',
          senderPhone: '',
          sender_address: '',
          sender_address2: '',
          sender_address3: '',
          sender_pincode: '',
          shipper_city: '',
          contactUrl: '',
          type: 'final_invoice',
          freeAgentRef: this.selectedDetails['freeAgentRef'],
          invoiceUrl: this.selectedDetails['invoice_url']
        };
        const fullName = this.selectedDetails['sender_name'];
        const nameParts = this.splitName(fullName);
        data.firstName = nameParts.firstName || '';
        data.lastName = nameParts.lastName || '';
        data.senderMail = this.selectedDetails['sender_mail'] || '';
        data.senderPhone = this.selectedDetails['sender_mobile'] || '';
        data.sender_address = this.selectedDetails['sender_address'] || '';
        data.sender_address2 = this.selectedDetails['sender_address2'] || '';
        data.sender_address3 = this.selectedDetails['sender_address3'] || '';
        data.shipper_city = this.selectedDetails['sender_city'] || '';
        data.sender_pincode = this.selectedDetails['sender_pincode'] || '';

        if (!this.isBillingClientFound) {


          return this.serviceNew.createInvoice_freeAgent(data, 'CC').pipe(
            concatMap((resCC: any) => {
              if (
                resCC &&
                resCC.status === 'success' &&
                resCC.data &&
                resCC.data.invoice &&
                resCC.data.invoice.contact &&
                resCC.data.invoice.contact.url
              ) {
                data.contactUrl = resCC.data.invoice.contact.url;
              }
              return this.serviceNew.createInvoice_freeAgent(data, 'I');
            })
          );
        } else {
          data.contactUrl = contactUrl;
          return this.serviceNew.createInvoice_freeAgent(data, 'I');
        }
      })
    ).subscribe(
      (r: any) => {
        if (
          r &&
          r.status === 'success' &&
          r.data &&
          r.data.invoice &&
          r.data.invoice.invoice // checking if invoice object exists
        ) {
          this.service.sp_v1_ds_history_log_events_insert(this.selectedDetails.hawb_no, this.userdetails['v_user_id'], 'FreeAgent Final Invoice Has Been Generated').toPromise()

          this.showMessage("Invoice Updated successfully!");
          this.get_invoice();
          this.sendFreeAgentInvPdf.hide();
          this.sendFreeAgentInvPdfModify.hide()
          // If you still want to open a new tab, you'll need to decide what to use in URL
          // For now I'll use the invoice reference (like "AA9760") if you want
          const invoiceReference = r.data.invoice.invoice.reference;
          if (invoiceReference) {
            // window.open("https://api.cargoforce.com/origin_v2/send_email/" + invoiceReference, "_blank");
          }
        } else if (
          r &&
          r.data &&
          r.data.invoice &&
          r.data.invoice.errors &&
          r.data.invoice.errors.length > 0
        ) {
          for (let i = 0; i < r.data.invoice.errors.length; i++) {
            this.showMessage(r.data.invoice.errors[i].message,'error');
          }
        } else {
          this.showMessage("Unexpected error occurred while creating the invoice.",'error');
        }
      },
      (error: any) => {
        this.showMessage("API request failed. Please try again.",'error');
      }
    );
  }

  send_final_invoice(data) {
    if (!localStorage.getItem('FreeAgentToken') && !localStorage.getItem('RefreshToken') && !localStorage.getItem('TokenExpiry')) {
      this.verifyFreeagentCall()

      return;
    }

    const content = {
      invoice_no: data.hawb_no,

      url: data.invoice_url,
      created_by: this.userdetails['v_user_id'],
      email: String(data.sender_mail).trim(),
      sender_name: data['sender_name']

    };
    this.service.sp_v1_ds_history_log_events_insert(data.hawb_no, this.userdetails['v_user_id'], 'FreeAgent Email Sent').toPromise()

    this.serviceNew.createInvoice_freeAgent(content, 'E').subscribe(
      (r: any) => {
        console.log(r);
        if (r.status === 'success' && r.code === '200') {
          this.showMessage('Invoice marked as read successfully!', 'success');
          this.get_invoice()

        } else {
          this.showMessage('Failed to mark invoice as read.', 'error');
        }
      },
      (error) => {
        console.error(error);
        this.showMessage('Invoice marked as read successfully!', 'success');
        this.get_invoice()

        // this.toastr.errorToastr('An error occurred while processing the request.', 'Error');
      }
    );
  }
  editedContent: string = ''
  onEmailContentInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.editedContent = target.innerHTML;
  }
  formatDate(dateStr) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",  // correct: 'long', 'short', or 'narrow'
      day: "numeric",   // correct: 'numeric' or '2-digit'
      month: "long",    // correct: 'long', 'short', or 'narrow'
      year: "numeric"   // correct: 'numeric' or '2-digit'
    };
    const date = new Date(dateStr);
    // const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }

  mark_paid_amount(data, sts) {
    if (!localStorage.getItem('FreeAgentToken') && !localStorage.getItem('RefreshToken') && !localStorage.getItem('TokenExpiry')) {
      this.verifyFreeagentCall()

      return;
    }
    console.log(data)
    this.selectSenderName = data.sender_name
    this.selectSenderMail = data.sender_mail
    this.selectInvoiceNo = data.hawb_no
    this.emailContent = `
<p>Dear ${this.selectSenderName},</p>

<p>We confirm we have received your payment on <strong>${this.formatDate(this.selectPaymentDate)}</strong> against house air waybill number <strong>${this.selectInvoiceNo}</strong>. Thank you!</p>

<p>The transit time for our door-to-door air economy service to India starts from the next working day after your payment. So, your shipment journey begins on <strong>${this.formatDate(this.selectPaymentDateNextDAy)}.</p>

<p>Counting from that date, your delivery is scheduled for the 14th working day, which falls on <strong>${this.after14PaymentDate}</strong>. We aim to deliver on or before this day.</p>

<p>For your assurance and protection, we highly recommend that you take videos and pictures of the shipment before accepting the delivery from the courier. This is an important step to document the condition of your package upon arrival and will assist in the unlikely event of a dispute or claim.</p>

<p><strong>Just a heads-up:</strong> our service is non-trackable during its initial stages. However, once your shipment has cleared customs, we'll provide you with a link to track the last mile connection to your delivery address in India.</p>

<p>Even though tracking might not be available during the entire transit, rest assured, you can request a written proof of delivery once your package arrives.</p>

<h4 style="color: red;">IMPORTANT:</h4>
<p>There is a lot of fraud and scam going on in the name of Cargo Force and other companies too. Please be very careful, inform the receiver/consignee about this too and:</p>
<ul>
  <li><strong>Do NOT</strong> give any payments to anyone in India for your cargo.</li>
  <li><strong>Do NOT</strong> share any One Time Password in India for your cargo.</li>
  <li><strong>Do NOT</strong> make any payments to anyone in India for your cargo.</li>
</ul>
<p>We do not, and neither will any of our last mile delivery partners, ask for any additional payment in India. Even if it is 1 Indian Rupee, do NOT pay it in cash, especially online.</p>

<p><strong>Ground Floor Delivery:</strong><br> Our service ensures delivery to the ground floor only. Any extra assistance by the driver is purely voluntary.</p>

<p>If you are giving money to the delivery guy, it is entirely at your discretion, and we do not instruct anyone to request payment. Please be aware that Cargo Force or our partners will never ask for money during delivery.</p>

<p>Thank you for your understanding and trust!</p>

<p>Warm regards,<br><strong>Cargo Force</strong></p>


`;
    this.editedContent = this.emailContent;

    this.paymentStsupdateData = { data, sts };
    if (sts === 'yes') {
      this.paymentStsupdate.show()

    } else {
      this.afterConformationPAyment(false)
    }

  }
  
  selectedPaymentType: string = ''
  selectPaymentDate: string = ''
  selectSenderName: string = ''
  selectHawbNo: string = ''
  selectPaymentDateNextDAy: string = ''
  customPaymentType: string = ''
  paymentStsupdateData: any;

  afterConformationPAyment(isValidType) {
  if (isValidType) {
    if (this.selectedPaymentType == '') {
      this.showMessage("Plz Select the payment type", 'warning');
      return;
    }
    if (this.selectedPaymentType == 'Other' && this.customPaymentType.trim() == '') {
      this.showMessage("Plz Fill Payment Type To Continue", 'warning');
      return;
    }
  }

  const payload: any = {
    mail: this.selectSenderMail,
    content: this.editedContent,
    inv_no: this.selectInvoiceNo,
    isPaymentMail: true
  };

  const { data, sts } = this.paymentStsupdateData;

  let content = sts == 'yes' ? 'Are you sure to update the payment status as paid?' :
                sts == 'npd' ? 'Are you sure to undo the payment status as Unpaid But Departed?' :
                'Are you sure to undo the payment status as unpaid?';

  Swal.fire({
    title: 'Confirm',
    text: content,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn-ok',
      cancelButton: 'btn-cancel'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const d = {
        hawb_no: data.hawb_no,
        created_by: this.userdetails.v_user_id,
        status: sts,
        mode: this.selectedPaymentType,
        remarks: this.customPaymentType,
        paymentDate: this.selectPaymentDate
      };

      this.service.sp_v1_ds_history_log_events_insert(data.hawb_no, this.userdetails['v_user_id'], 'Payment Status Update as ' + sts).toPromise();

      this.serviceNew.v1_SP_ds_payment_api_status_update(d).subscribe(
        (r: any) => {
          if (r.code == 200) {
            this.get_invoice();
            this.paymentStsupdate.hide();
            this.showMessage('Payment marked as paid successfully', 'success');

            // Call sendCollectionEMail after 1 second if checkbox is checked
            if (this.sendMailChecked) {
              setTimeout(() => {
                this.serviceNew.sendCollectionEMail(payload).toPromise();
              }, 1000); // 1000ms = 1 second
            }
          } else {
            this.showMessage('Failed to mark payment as paid', 'error');
          }
        },
        (error) => {
          this.showMessage('An error occurred while updating payment status', 'error');
        }
      );
    }
  });
}

  loading: boolean = true;


  showLoading() {
    this.loading = true;
  }
  autoCompleteData: any[] = [];
  autoCompleteList: any[] = [];
  suggestionData: any[] = [];
  showSuggestions: boolean = false;
  getFreeAgentAutoComplete() {
    this.serviceNew.getFreeAgentAutoComplete().subscribe(d => {
      this.autoCompleteData = d['data'];
      this.suggestionData = d['data']
    });
  }
  hideLoading() {
    this.loading = false;
  }
  getBadgeClass(status: string): string {
    switch (status) {
      case 'Not Generated':
        return 'badge badge-not-generated';
      case 'Generated':
        return 'badge badge-generated';
      case 'Marked as Sent':
        return 'badge badge-marked';
      case 'Sent to Customer':
        return 'badge badge-sent';
      default:
        return 'badge badge-unknown';
    }
  }
  onActionBegin(args: any) {
    // console.log("Action Begin Event Fire d:", args);

    if (args.requestType === 'searching' && args.searchString) {
      let searchText = args.searchString.trim();
      let pattern = /^(aa|AA|aA|Aa)\d{4}$/;

      if (searchText.length === 6) {
        this.service.sp_v1_ds_history_log_events_insert(searchText, this.userdetails['v_user_id'], 'HAWB SEARCH IN VIEW AND MODIFY').toPromise()

        // Wait for filtering to complete
        setTimeout(() => {
          let gridData: any = this.mainGrid.dataSource;
          let filteredData: any[] = [];

          if (Array.isArray(gridData)) {
            filteredData = gridData;
          } else if (gridData && gridData.result && Array.isArray(gridData.result)) {
            filteredData = gridData.result;
          }

          console.log("Filtered Data:", filteredData);

          // Check if the searched term exists in the filtered data
          let isFound = filteredData.some(item => item.hawb_no === searchText);

          if (!isFound) {
            console.log("No records found for:", searchText);
            this.callApi(searchText);
          } else {
            console.log("Records found for:", searchText);
          }
        }, 500);
      }
    }
  }



  callApi(searchText: string) {
    this.btn3 = true;
    this.serviceNew.get_invoice_list(this.pointid, this.v_location_id, searchText, -1).subscribe(data => {
      if (data['data'] && data['data'].length) {
        let newInvoices = data['data'].map((d, i) => ({
          ...d,
          pageNo: this.invoice_list.length + 1,
          pendingCount:Number(d['carton_count']) +"/"+Number(d['pickup_carton_count']),
          invCurrentSts: d['invoice_api_status'] == 0 ? 'Not Generated' :
            d['invoice_api_status'] == 1 ? 'Generated' :
              d['invoice_api_status'] == 2 ? 'Marked as Sent' :
                d['invoice_api_status'] == 3 ? 'Sent to Customer' :
                  'Status Not Found'
        }));

        // ✅ **Filter to keep only unique `hawb_no` values**
        let allInvoices = [...this.invoice_list, ...newInvoices];
        this.invoice_list = allInvoices.filter((v, i, self) =>
          i === self.findIndex(t => t.hawb_no === v.hawb_no) // Keep only the first occurrence of each `hawb_no`
        );

      } else {
        console.log("No new invoices found.");
      }

      this.rowsFilter = this.invoice_list;

      if (data['code'] == 200) {
        this.tot_inv = this.invoice_list.length;
        this.tot_ctn = 0;
        this.tot_wgt = 0;
        this.tot_net_Amt = 0;
        this.tot_Rec_Amt = 0;
        this.tot_Blc_Amt = 0;

        for (let i = 0; i < this.tot_inv; i++) {
          this.tot_ctn += Number(this.invoice_list[i]['total_carton']);
          this.tot_wgt += Number(this.invoice_list[i]['total_weight']);
          this.tot_net_Amt += Number(this.invoice_list[i]['net_amount']);
          this.tot_Rec_Amt += Number(this.invoice_list[i]['received_amount']);
          this.tot_Blc_Amt += Number(this.invoice_list[i]['balance_amount']);
        }
      }

      this.btn3 = false;
    });
  }
  activeRowIndex: number | null = null;
  selectedPrefix: string = '';
  // autoCompleteList: any[] = []; // Autocomplete suggestions

  filterSuggestions() {
    if (this.selectedPrefix.trim()) {
      // Filter suggestions based on the selected prefix (input value)
      this.autoCompleteList = this.suggestionData;
    } else {
      this.autoCompleteList = [];
    }
  }

  // Handle focus on input
  onInputFocus(index: number) {
    this.activeRowIndex = index;
    this.filterSuggestions(); // Filter suggestions when the input is focused
  }
  accountNoControl = new FormControl('');

  // Handle suggestion selection
  selectSuggestion(suggestion: any) {

    console.log(suggestion)
    this.editItem.description = `${suggestion.value} ${this.editItem.description}`;
    this.selectedPrefix = ''; // Clear the selected prefix after selection
    this.autoCompleteList = []; // Clear suggestions
    this.editItem.unit_price = suggestion.unit
    this.editItem.VAT = suggestion.isVAT
  }
  selectSuggestionnew(suggestion: any) {

    console.log(suggestion)
    this.editItemnew.description = `${suggestion.value} ${this.editItemnew.description}`;
    this.selectedPrefix = ''; // Clear the selected prefix after selection
    this.autoCompleteList = []; // Clear suggestions
    this.editItemnew.unit_price = suggestion.unit
    this.editItemnew.VAT = suggestion.isVAT
  }
  // Handle blur and hide suggestions
  hideSuggestionsWithDelay() {
    setTimeout(() => {
      this.autoCompleteList = [];
    }, 150);
  }



  // Declare variables
  editItem: any = {};
  editItemnew: any = {};
  editingIndex: number | null = null;
  editingIndexnew: number | null = null;

  // Open the edit popup
  openEditPopup(index: number) {
    this.editingIndex = index;
    this.accountNoControl.reset()
    this.editItem = { ...this.editingData[index] }; // clone item
    this.editItemModal.show(); // show modal
  }
  openEditPopupUpdate(index: number) {
    this.editingIndexnew = index;
    this.accountNoControl.reset()
    this.editItemnew = { ...this.editingDataModufy[index] }; // clone item
    // if(index >0){
    this.editItemnew['url'] = this.selectedDetails['invoice_url']
    this.editItemnew['isPresent'] = false;
    // }
    this.editItemModalEdit.show(); // show modal
  }
  // Save the edited item

  saveEditMod() {
    console.log(this.editItemnew)
    // Check if editingIndex is not null and editItem is valid
    if (this.editingIndexnew !== null) {

      // Validate required fields
      if (!this.editItemnew.quantity || this.editItemnew.quantity <= 0) {
        this.showMessage("Please enter a valid quantity.",'warning');
        return; // Exit the function if validation fails  
      }

      if (!this.editItemnew.unit_price) {
        this.showMessage("Please enter a valid unit price.",'warning');
        return; // Exit the function if validation fails
      }

      // if (!this.editItem.VAT ) {
      //   this.toastr.warningToastr("Please enter a valid VAT percentage.");
      //   return; // Exit the function if validation fails
      // }

      // Calculate VAT amount if all inputs are valid
      this.editItemnew.VATAMT = this.editItemnew.VAT !== 0
        ? ((this.editItemnew.quantity * this.editItemnew.unit_price) * this.editItemnew.VAT * 0.01)
        : 0;
      this.editItem.sub_total = this.editItem.quantity * this.editItem.unit_price;
      const payload = {
        invoiceUrl: this.editItemnew.url,
        invoice_no: this.selectedDetails.hawb_no,
        description: this.editItemnew.description,
        price: this.editItemnew.unit_price,
        quantity: this.editItemnew.quantity,
        vat: this.editItemnew.VAT
      }
      this.service.sp_v1_ds_history_log_events_insert(this.selectedDetails.hawb_no, this.userdetails['v_user_id'], 'Freeagent Final Final Invoice Row Modify').toPromise()

      // Update the data
      this.editingDataModufy[this.editingIndexnew] = { ...this.editItemnew };
      if (this.editItemnew['isPresent']) {
        this.serviceNew.createInvoice_freeAgent(payload, 'UI').subscribe(d => {
          this.showMessage("Updated Successfully")
          this.editItemModalEdit.hide();

        })
      } else {
        this.serviceNew.createInvoice_freeAgent(payload, 'UI').subscribe(d => {
          this.showMessage("Updated Successfully")
          this.editItemModalEdit.hide();

        })
      }

      // Hide the modal
    }
  }
  insertDreeagentInd() {
    if (String(this.editItemnew.description).includes('undefined')) {
      this.editItemnew.description = String(this.editItemnew.description).replace('undefined', this.selectedDetails.hawb_no);
    }
    const payload = {
      description: this.editItemnew.description,
      price: this.editItemnew.unit_price,
      quantity: this.editItemnew.quantity,
      vat: this.editItemnew.VAT
    }
    const data: any = {
      invoice_no: this.selectedDetails.hawb_no,
      freeAgentRef: this.selectedDetails.freeAgentRef,
      net_amount: this.getGBPAmount(),
      invoice_items: payload,
      created_by: this.userdetails['v_user_id'],
      firstName: '',
      lastName: '',
      senderMail: '',
      senderPhone: '',
      sender_address: '',
      sender_address2: '',
      sender_address3: '',
      sender_pincode: '',
      shipper_city: '',
      contactUrl: '',
      invoiceUrl: this.selectedDetails['invoice_url']
    };
    const fullName = this.selectedDetails['sender_name'];
    const nameParts = this.splitName(fullName);

    data.firstName = nameParts.firstName;
    data.lastName = nameParts.lastName;
    data.senderMail = this.selectedDetails['sender_mail'];
    data.senderPhone = this.selectedDetails['sender_mobile'];
    data.sender_address = this.selectedDetails['sender_address'];
    data.sender_address2 = this.selectedDetails['sender_address2'];
    data.sender_address3 = this.selectedDetails['sender_address3'];
    data.shipper_city = this.selectedDetails['shipper_city'];
    data.sender_pincode = this.selectedDetails['sender_pincode'];
    data.type = 'final_invoice';

    this.serviceNew.createInvoice_freeAgent(data, 'I').subscribe(d => {

    })
    console.log(this.editItemnew)
    console.log(payload)

  }
  saveEdit() {
    console.log(this.editItem)
    // Check if editingIndex is not null and editItem is valid
    if (this.editingIndex !== null) {

      // Validate required fields
      if (!this.editItem.quantity || this.editItem.quantity <= 0) {
        this.showMessage("Please enter a valid quantity.",'warning');
        return; // Exit the function if validation fails  
      }

      if (!this.editItem.unit_price) {
        this.showMessage("Please enter a valid unit price.",'warning');
        return; // Exit the function if validation fails
      }

      // if (!this.editItem.VAT ) {
      //   this.toastr.warningToastr("Please enter a valid VAT percentage.");
      //   return; // Exit the function if validation fails
      // }

      // Calculate VAT amount if all inputs are valid
      this.editItem.VATAMT = this.editItem.VAT !== 0
        ? ((this.editItem.quantity * this.editItem.unit_price) * this.editItem.VAT * 0.01)
        : 0;

      this.editItem.sub_total = this.editItem.quantity * this.editItem.unit_price;

      // Update the data
      this.editingData[this.editingIndex] = { ...this.editItem };

      // Hide the modal
      this.editItemModal.hide();
    }
  }
  assignRowDate(data) {
    this.selectedDetails = data;
  }
  editingDataModufy: any[] = []; // <-- you already have this somewhere for the ngFor table

  editInvoice(HaebData: any) {
    this.selectedDetails = HaebData;

    const requestData = {
      url: HaebData['invoice_url']
    };

    this.serviceNew.createInvoice_freeAgent(requestData, 'SI').subscribe((response: any) => {
      let invoice = null;
      let items = [];

      // Determine if it's an invoice or credit note
      if (response && response.data && response.data.list) {
        if (response.data.list.invoice) {
          invoice = response.data.list.invoice;
          items = invoice.invoice_items || [];
        } else if (response.data.list.credit_note) {
          invoice = response.data.list.credit_note;
          items = invoice.credit_note_items || [];
        }
      }

      // Extract reference if available
      if (invoice && invoice.reference) {
        this.selectedDetails['freeAgentRef'] = invoice.reference;
      }

      // Map items
      this.editingDataModufy = items.map((item: any) => ({
        quantity: parseFloat(item.quantity),
        description: item.description,
        url: item.url,
        categogy: item.category,
        isPresent: true,
        unit_price: parseFloat(item.price),
        VAT: 0 // Because sales_tax_status is OUT_OF_SCOPE
      }));

      this.sendFreeAgentInvPdfModify.show();
    });
  }

  deleteInvoice(HaebData) {
    this.selectedDetails = HaebData;
    const requestData = {
      invoice_no: HaebData['hawb_no'],
      url: HaebData['invoice_url'],

      created_by: this.userdetails.v_user_id,
      type: 'final_invoice',
    };
    this.service.sp_v1_ds_history_log_events_insert(HaebData['hawb_no'], this.userdetails['v_user_id'], 'Freeagent Final Invoice Deleted').toPromise()

    this.serviceNew.createInvoice_freeAgent(requestData, 'DI').subscribe((response: any) => {
      if (response.status === 'success') {
        this.showMessage("deleted Successfully");
        this.get_invoice()
      }
      // this.sendFreeAgentInvPdfModify.show()
    });
  }

  panelOpenState = false;
  ReceivedColoaderDate = []
  loadData(data) {
    const filterValue = String(data.hawb_no).trim();

    if (
      filterValue.length === 6 &&
      /^[a-zA-Z]{2}\d{4}$/.test(filterValue)
    ) {
      this.service.sp_v1_ds_history_log_events_insert(filterValue, this.userdetails['v_user_id'], 'View And Modify Hawb Search').toPromise()

      this.serviceNew.v1_SP_ds_Pickup_order_pickedup_check_weight_list(filterValue)
        .subscribe((d: any) => {
          if (d && d.status === "success" && d.data && d.data.length > 0) {
            const firstItem = d.data[0];
            const messageKey = Object.keys(firstItem)[0];
            const messageValue = firstItem[messageKey];

            if (typeof messageValue === "string" && Object.keys(firstItem).length === 1) {
              this.showMessage(messageValue, "warning");
              this.ReceivedColoaderDate = [];
              return;
            }

            this.ReceivedColoaderDate = d.data;

            // ✅ Check if any item's update_status is not "1"
            this.anyNotUpdated = d.data.some((item: any) => item.update_status !== "1");

            // If all are "1", then anyNotUpdated will be false
            // You can use this.anyNotUpdated wherever needed
          } else {
            this.ReceivedColoaderDate = [];
          }

          this.processData(d);
        });
    } else {
      this.ReceivedColoaderDate = [];
    }
  }

  private processData(d: any) {
    this.ReceivedColoaderDate = d['data'].map(item => ({
      ...item,
      length: Math.ceil(parseFloat(item.length)),
      width: Math.ceil(parseFloat(item.width)),
      height: Math.ceil(parseFloat(item.height)),
      act_wgt: Math.ceil(parseFloat(item.act_wgt)),
      vol_weight: this.calculateVolumetricWeight(item),
      chrg_weight: this.calculateChargeableWeight(item),
      created_by: this.userdetails['v_user_id']
    }));
  }
  private calculateChargeableWeight(item: any): number {
    const volWeight = this.calculateVolumetricWeight(item);
    return Math.ceil(Math.max(volWeight, item.act_wgt));
  }

  private calculateVolumetricWeight(item: any): number {
    return Math.ceil((item.length * item.width * item.height) / 5000);
  }
  callNotesFile(data) {
    data.invoice_no = data.hawb_no
    this.selectedDetails = data
    this.serviceNew.sendChatData(data)
    this.addNotes.show()
  }
  

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }
  uploadedFiles: { file: File; preview: string; type: string }[] = [];
  openBlobPDF(blobUrl: string): void {
    window.open(blobUrl, '_blank', 'noopener');
  }
  handleFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files.length) return;

    const files = Array.from(input.files);
    files.forEach(file => {
      const fileType = file.type;

      if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
          const result = (e.target as FileReader).result as string;
          this.uploadedFiles.push({ file, preview: result, type: fileType });
        };
        reader.readAsDataURL(file);
      } else if (fileType === 'application/pdf') {
        const blobURL = URL.createObjectURL(file);
        this.uploadedFiles.push({ file, preview: blobURL, type: fileType });
      }
    });

    input.value = ''; // Reset input to allow same file re-selection
  }



  handleDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const files = Array.from(event.dataTransfer.files);

      files.forEach(file => {
        const fileType = file.type;

        if (fileType.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent) => {
            const preview = (e.target as FileReader).result as string;

            // Insert image inline
            // const editor = document.querySelector('.email-content-display') as HTMLElement;
            // editor.innerHTML += `<img src="${preview}" style="max-width: 100%; height: auto;" />`;
            // this.emailContent = editor.innerHTML;

            this.uploadedFiles.push({ file, preview, type: fileType });
          };
          reader.readAsDataURL(file);
        } else if (fileType === 'application/pdf') {
          const blobURL = URL.createObjectURL(file);
          this.uploadedFiles.push({ file, preview: blobURL, type: fileType });
        }
      });
    }
  }

  removeFile(fileToRemove: { file: File; preview: string; type: string }): void {
    // Remove from preview list
    this.uploadedFiles = this.uploadedFiles.filter(file => file !== fileToRemove);

    // Optionally: Remove the image tag from the editor content
    if (fileToRemove.type.startsWith('image/')) {
      const editor = document.querySelector('.email-content-display') as HTMLElement;
      const parser = new DOMParser();
      const doc = parser.parseFromString(editor.innerHTML, 'text/html');
      const images = Array.from(doc.querySelectorAll('img'));

      images.forEach(img => {
        if (img.src === fileToRemove.preview) {
          img.remove();
        }
      });

      editor.innerHTML = doc.body.innerHTML;
      this.emailContent = editor.innerHTML;
    }
  }

  async sendEmail(): Promise<void> {
    const editor = document.querySelector('.email-content-display') as HTMLElement;
    const emailHtmlContent = editor.innerHTML || '';

    // Extract files from local state
    const allFiles = this.uploadedFiles.map(file => file.file);

    try {
      // Upload all files
      const uploadUrls: string[] = await Promise.all(
        allFiles.map(file => this.onImageUploadAadhar(file))
      );

      console.log('✅ Uploaded URLs:', uploadUrls);

      // Prepare payload for API
      const payload: any = {
        mail: this.selectedDetails['sender_mail'],
        content: emailHtmlContent,
        inv_no: this.selectedDetails['hawb_no'],
        imgurl: uploadUrls,
        created_by: this.userdetails['v_user_id']
      };

      // Send email + data to backend
      this.service.sp_v1_ds_history_log_events_insert(this.selectedDetails['hawb_no'], this.userdetails['v_user_id'], 'Final Img Sended To Customer').toPromise()

      await this.serviceNew.send_final_images(payload).toPromise();

      // ✅ After success: reset files and refresh UI
      this.uploadedFiles = [];
      this.get_invoice();
      this.sendImgMail.hide()
    } catch (err) {
      console.error('❌ Error during sendEmail():', err);
    }
  }


  sendImgMailSend(data) {
    this.sendImgMail.show();
    this.emailContent = `
  <p>Dear ${data['sender_name']},</p>

  <p>Please see the final image(s) of your package(s) attached. The items have been securely packed, and two additional layers of taping have been applied to ensure extra protection during transit.</p>

  <p>Let us know if you require any further details.</p>

  <p>Best Regards,<br>${this.userdetails['v_user_name']}</p>
`;
    this.editedContent = this.emailContent;
  }
  // update_type_of_shipment(type) {
  //   console.log(type)
  //   if (type.type_of_shipment == '1' || type.type_of_shipment == '2') {
  //     const payload = {
  //       hawb_no: type.hawb_no,
  //       created_by: this.userdetails['v_user_id'],
  //       status: type.type_of_shipment
  //     }
  //     this.serviceNew.v1_SP_ds_pickup_order_type_of_shipment(payload).subscribe(r => {
  //       this.toastr.successToastr('Updated Type Of Shipment');
  //          this.get_invoice()



  //     })
  //   } else {
  //     this.toastr.warningToastr('Invalid Type')
  //   }
  // }
   navigateShipment(data){
 this.router.navigate(['/wareHouseShipment/FinalInvoiceEdit',data.hawb_no], {
      queryParams: { data: encodeURIComponent(JSON.stringify(data)) }
    });
}
  
}
