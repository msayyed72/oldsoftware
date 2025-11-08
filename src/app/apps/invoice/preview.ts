import { Component, ViewChild } from '@angular/core';
import { AwbServiceService } from '../../services/awb-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
    moduleId: module.id,
    templateUrl: './preview.html',
})
export class InvoicePreviewComponent {
    userdetails: any;
    userid: any;
    pointid: any;
    point_type_id: any;
    point_code_pefix: any;
    country_id: any;
    v_point_Id_Branch: any;
    v_location_id: any;
    date: any;
    invoiceDate: any
    today = new Date();
    invoice_list: any = [];
    btn3: boolean = true;
    rowsFilter: any;
    invoice_no: any;
    pdf_data: any;

    constructor(public router: Router,
        private datep: DatePipe,
        public service: AwbServiceService) {
        var user: any = localStorage.getItem("log_data")
        this.userdetails = JSON.parse(user)
        if (this.userdetails) { }
        else {
            this.router.navigate(['login/0']);
        }
        this.userid = this.userdetails.v_user_id;
        this.pointid = this.userdetails.v_point_id
        this.point_type_id = this.userdetails.v_point_type_id
        this.point_code_pefix = this.userdetails.v_origin_prefix
        this.country_id = this.userdetails.V_country_id
        this.v_point_Id_Branch = this.userdetails.v_point_Id_Branch
        this.v_location_id = this.userdetails.v_location_id
        this.date = this.datep.transform(this.today, 'yyyy-MM-dd');
        // this.date=
    }
    search = '';
    cols = [
        { field: 'id', title: 'S.No' },
        { field: 'hawb_date', title: 'HAWB Date' },
        { field: 'hawb_no', title: 'Invoice No' },
        { field: 'state_name', title: 'State' },
        { field: 'sender_name', title: 'Sender Name' },
        { field: 'total_carton', title: 'Cartons' },
        { field: 'total_weight', title: 'Weight' },
        { field: 'printing_status', title: 'Print' },
    ];
    jsonData = this.invoice_list;

    get_invoice() {
        this.btn3 = true;
        this.service.get_invoice_list(this.pointid, this.v_location_id, this.invoice_no, this.date).subscribe(data => {
            this.invoice_list = data['data']
            this.rowsFilter = this.invoice_list
            if (data['code'] == 200) {
                //   this.tot_inv=this.invoice_list.length
                //   this.tot_ctn=0
                //   this.tot_wgt=0
                //   this.tot_net_Amt=0
                //   this.tot_Rec_Amt=0
                //   this.tot_Blc_Amt=0
                //   for(var i = 0; i<this.tot_inv;i++)
                //   {
                //     this.tot_ctn+=Number(this.invoice_list[i]['total_carton'])
                //     this.tot_wgt+=Number(this.invoice_list[i]['total_weight'])
                //     this.tot_net_Amt+=Number(this.invoice_list[i]['net_amount'])
                //     this.tot_Rec_Amt+=Number(this.invoice_list[i]['received_amount'])
                //     this.tot_Blc_Amt+=Number(this.invoice_list[i]['balance_amount'])
                //   }
                this.btn3 = false;
            }
            else {
                this.btn3 = false;
            }
        })
    }

    get_awb_print(value: any) {
        // this.Save_spin='1'
        this.service.get_print(value, "Invoice", '1').subscribe(data => {
            this.pdf_data = data['data']
            window.open(data.file_url)
            // this.Save_spin='2'
        })
    }

    ngOnInit() {
        this.get_invoice()
    }
    async view_invoice(value: any, id: any, status: number) {
        const swalWithBootstrapButtons = Swal.mixin({
            buttonsStyling: false,
            customClass: {
                popup: 'sweet-alerts',
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
            },
        });
        swalWithBootstrapButtons
            .fire({
                title: 'Click here to Continue!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'View',
                cancelButtonText: 'Modify',
                reverseButtons: true,
                padding: '1em',
            })
            .then((result) => {
                if (result.value) {
                    this.router.navigate(['/apps/invoice/list', value, 'view', id])
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    if (status == 1 && this.userdetails.v_user_type != 'ADMIN') {
                        this.popup()
                    }
                    else {
                        this.router.navigate(['/apps/invoice/list', value, 'modify', id])
                    }
                }
            });
    }

    async popup() {
        Swal.fire({
            title: 'Alert!',
            text: 'Cannot Modify the Invoice , Contact Admin',
            imageUrl: '/assets/images/custom-swal.svg',
            imageWidth: 224,
            imageHeight: 'auto',
            imageAlt: 'Custom image',
            padding: '2em',
            customClass: 'sweet-alerts',
        });
    }
    exportTable(type: string) {
        let columns: any = this.cols.map((d: { field: any }) => {
            return d.field;
        });

        let records = this.invoice_list;
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type == 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return this.capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: { [x: string]: any }) => {
                columns.map((d: any, index: number) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.csv');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.csv');
                }
            }
        } else if (type == 'print') {
            var rowhtml = '<p>' + filename + '</p>';
            rowhtml +=
                '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
            columns.map((d: any) => {
                rowhtml += '<th>' + this.capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';

            records.map((item: { [x: string]: any }) => {
                rowhtml += '<tr>';
                columns.map((d: any) => {
                    let val = item[d] ? item[d] : '';
                    rowhtml += '<td>' + val + '</td>';
                });
                rowhtml += '</tr>';
            });
            rowhtml +=
                '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
            rowhtml += '</tbody></table>';
            var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write('<title>Print</title>' + rowhtml);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
            // winPrint.close();
        } else if (type == 'txt') {
            let coldelimiter = ',';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return this.capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: { [x: string]: any }) => {
                columns.map((d: any, index: number) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.txt');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.txt');
                }
            }
        }
    }

    excelColumns() {
        return {
            Id: 'id',
            FirstName: 'firstName',
            LastName: 'lastName',
            Company: 'company',
            Age: 'age',
            'Start Date': 'dob',
            Email: 'email',
            'Phone No.': 'phone',
        };
    }

    excelItems() {
        return this.invoice_list;
    }

    capitalize(text: string) {
        return text
            .replace('_', ' ')
            .replace('-', ' ')
            .toLowerCase()
            .split(' ')
            .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    }
    formatDate(date: any) {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    }
}
