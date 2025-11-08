import {
    Component, OnDestroy, OnInit,
    ElementRef, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, ViewChild, EventEmitter,
    Output, Input
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AwbServiceService } from '../../services/awb-service.service';
import { CustomerServiceService } from '../../services/customer-service.service';
import { BookingServiceService } from '../../services/booking-service.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { Inject, Injectable } from '@angular/core';
import { includes } from 'lodash';

@Component({
    selector: 'app-item',
    moduleId: module.id,
    templateUrl: './edit.html',
    encapsulation: ViewEncapsulation.None
})
export class InvoiceEditComponent {
    @ViewChild('F_CART') F_CART: any;
    @ViewChild('F_ITN') F_ITN: any;
    @ViewChild('F_QUA') F_QUA: any;
    @ViewChild('F_GOV') F_GOV: any;
    @ViewChild('F_VAP') F_VAP: any;
    @ViewChild('F_SAV') F_SAV: any;
    @ViewChild('F_CTNF') F_CTNF: any;
    clickEventsubscription: Subscription;
    @Output() newItemEvent = new EventEmitter<any>();
    @Input() invoiceNo_new: any;
    valuepercent: any
    invoice_No: any
    inv_id: any
    mode: any;
    valForm: FormGroup;
    userdetails: any;
    userid: any;
    awbno: any
    ItemArray2 = []
    ItemArray: any;
    item_amt_list: any;
    item_inv: any;
    tot_item: any;
    tot_qty: any;
    tot_ctn: any;
    tot_val: any;
    inv_value: any;
    cortarr: any = [];
    tot_val_amt: any;
    totalval: any;
    item_index: undefined;
    existingItem: any;
    existingCartonItem: any;
    constructor(
        public services: CustomerServiceService, fb: FormBuilder, public awbserv: AwbServiceService,
        // public data: any
    ) {
        var user: any = localStorage.getItem("log_data")
        this.userdetails = JSON.parse(user)
        this.userid = this.userdetails.v_user_id;
        
        // console.log(this.valForm.value.invoice_no)
        // this.valForm.controls['invoice_no'].setValue(this.invoiceNo_new)
        // console.log(this.valForm.value.invoice_no)
        this.clickEventsubscription = this.awbserv.getClickEvent().subscribe((data) => {
            setTimeout(() => {
                this.F_ITN.nativeElement.focus()
            }, 500);
            if (data['act_status'] == 'carton') {
                // this.insertItem()
            }
            this.get_item_invoice(data.invoice_id)
            this.invoice_No = data.new_invoice_no
            this.inv_id = data.invoice_id
            this.valForm.controls['invoice_no'].setValue(data.new_invoice_no)
            this.valForm.controls['voc_invoice_no'].setValue(data.new_invoice_no)
            this.valForm.controls['inv_id'].setValue(data.invoice_id)
            // console.log(this.valForm.value.invoice_no)
            this.valForm.controls['value_percent'].setValue(data.valuepercent)
            this.valuepercent = data.valuepercent
            this.mode = data.mode
            if (this.mode == "view") {
                this.valForm.controls['item_description'].disable()
                this.valForm.controls['quantity'].disable()
                this.valForm.controls['no_of_package'].disable()
                this.valForm.controls['unit_price'].disable()
                this.valForm.controls['value_percent'].disable()
                this.valForm.controls['value_amount'].disable()
                this.valForm.controls['item_details'].disable()
                this.valForm.controls['carton_no'].disable()
            }
            this.F_ITN.nativeElement.focus()
        })

        

        this.valForm = fb.group({
            'item_description': [null, Validators.required],
            'quantity': [null, Validators.required],
            'no_of_package': [null, Validators.required],
            'unit_price': ["0",],
            'country_of_origin': [null, Validators.required],
            'value_percent': ["0", Validators.required],
            'value_amount': [0.00, Validators.required],
            'invoice_no': [this.invoiceNo_new],
            'voc_invoice_no': [this.invoiceNo_new],
            'item_details': [null, Validators.required],
            'carton_no': [1, Validators.required],
            'item_type': [null, Validators.required],
            'desc': [null,],
            'inv_no': [null,],
            'user_id': [this.userid,],
            'item_id': [null,],
            'carton_id': [null,],
            'inv_id': [this.inv_id,],
        })
    }

    insertItem() {
        let temp_item = []
        for (var i = 0; i < this.ItemArray.length; i++) {
            if (this.ItemArray[i]['item_id'] == null || this.ItemArray[i]['item_id'] == "") {
                temp_item.push(this.ItemArray[i])
            }
        }
        this.awbserv.Insert_Item(temp_item).subscribe(res => {
            if (res['code'] == 200) {
                this.item_amt_list.ins_item_status = "Y"
                this.newItemEvent.emit(this.item_amt_list);
                this.coloredToast('success', 'Item Insert Successfully')
                this.get_item_invoice(this.inv_id)
                this.item_amt_list.ins_item_status = "N"
            }
        })
    }

    get_item_invoice(value: any) {
        this.awbserv.get_item_by_invoice(value).subscribe(data => {
            this.item_inv = data['data']
            this.ItemArray = data['data']
            if (this.ItemArray != null) {
                if (this.ItemArray.length > 0) {
                    this.tot_item = this.ItemArray.length
                    this.valForm.controls['value_percent'].setValue(this.ItemArray[0]['value_percent'])
                    this.add()
                    this.tot_item = this.ItemArray.length
                    this.tot_qty = 0
                    this.tot_ctn = 0
                    this.tot_val = 0
                    this.inv_value = 0
                    for (var i = 0; i < this.tot_item; i++) {
                        this.tot_qty = 1 * Number(this.tot_qty) + Number(this.ItemArray[i]['quantity'])
                        this.tot_val = 1 * Number(this.tot_val) + Number(this.ItemArray[i]['value_amount'])
                        this.inv_value = 1 * Number(this.inv_value) + (Number(this.ItemArray[i]['quantity']) * Number(this.ItemArray[i]['unit_price']))
                    }
                    this.cortarr = []
                    this.ItemArray.forEach((obj:any) => {
                        if (obj.carton_no && !includes(this.cortarr, obj.carton_no)) {
                            this.cortarr.push(obj.carton_no)
                        }
                    });
                    this.tot_ctn = this.cortarr.length
                    this.Mul(this.ItemArray)
                }
            }
        })
    }

    Mul(data: any) {

        this.tot_val_amt = 0
        for (let i = 0; i < data.length; i++) {
            this.tot_val_amt += Number(data[i]['value_amount'])
        }
        this.item_amt_list = {
            tot_val_amt: this.tot_val_amt,
            inv_value: this.inv_value,
            ins_item_status: "N",
            tot_item:this.tot_item
        }
        this.newItemEvent.emit(this.item_amt_list);
    }

    save() {
        this.insert_Item(this.valForm.value)
    }
    reset() {
        this.valForm.controls['item_description'].setValue("")
        this.valForm.controls['quantity'].setValue("")
        this.valForm.controls['no_of_package'].setValue("")
        this.valForm.controls['unit_price'].setValue("0")
        if (this.valuepercent == "" || this.valuepercent == null) {
            this.valForm.controls['value_percent'].setValue("0")
        }
        else {
            this.valForm.controls['value_percent'].setValue(this.valuepercent)
        }
        this.valForm.controls['value_amount'].setValue("0")
        this.valForm.controls['item_details'].setValue("")
    }

    insert_Item(ItemDate: any) {
        // console.log(ItemDate)
        if (ItemDate.item_description == "" || ItemDate.item_description == null) {
            this.coloredToast('warning', 'Enter The Item Name');
            this.F_ITN.nativeElement.focus();
        }
        else if (ItemDate.quantity == "" || ItemDate.quantity == null) {
            this.coloredToast('warning', 'Enter The Qty');
            this.F_QUA.nativeElement.focus();
        }
        else if (ItemDate.carton_no == "" || ItemDate.carton_no == null) {
            this.coloredToast('warning', 'Enter The Carton No');
            this.F_CART.nativeElement.focus();
        }
        else if (ItemDate.invoice_no == "" || ItemDate.invoice_no == null) {
            this.coloredToast('warning', 'Invoice Number does not Exits, Please Generate HAWB');
        }
        else {
        this.reset()
            if (ItemDate.item_id == null || ItemDate.item_id == "") {
                if (this.ItemArray.length > 0) {
                    this.existingItem = this.ItemArray.filter((d: { item_description: string; }) =>
                        d.item_description.toUpperCase() == ItemDate.item_description.toUpperCase())
                    // console.log(this.existingItem)
                    if (this.existingItem.length > 0) {
                        this.existingCartonItem = this.existingItem.filter((e: { carton_no: any; }) => e.carton_no == ItemDate.carton_no)
                        // console.log(this.existingCartonItem)
                        if (this.existingCartonItem.length > 0) {
                            this.valForm.controls['quantity'].setValue(Number(this.existingCartonItem[0]['quantity']) + Number(ItemDate.quantity))
                            this.valForm.controls['item_id'].setValue(this.existingCartonItem[0]['packing_list_id'])
                            this.valForm.controls['carton_id'].setValue(this.existingCartonItem[0]['carton_id'])
                            this.awbserv.Update_Item(ItemDate).subscribe(res => {
                                if (res['code'] == 200) {
                                    // this.insertItem()
                                    this.item_index = undefined
                                    this.coloredToast('success', 'Item Updated Successfully')
                                    this.get_item_invoice(this.inv_id)
                                    this.valForm.controls['item_description'].setValue("")
                                    this.valForm.controls['quantity'].setValue("")
                                    this.valForm.controls['unit_price'].setValue("0")
                                    this.valForm.controls['value_percent'].setValue(this.valuepercent)
                                    this.valForm.controls['value_amount'].setValue("0")
                                    this.valForm.controls['item_id'].setValue("")
                                    this.valForm.controls['carton_id'].setValue("")
                                }
                            })
                        }
                        else {
                            this.awbserv.Insert_Item(ItemDate).subscribe(res => {
                                if (res['code'] == 200) {
                                    this.Mul(ItemDate)
                                    // this.reset()
                                    this.item_amt_list.ins_item_status = "Y"
                                    this.newItemEvent.emit(this.item_amt_list);
                                    this.coloredToast('success', 'Item Insert Successfully')
                                    this.get_item_invoice(this.inv_id)
                                    this.item_amt_list.ins_item_status = "N"
                                }
                            })
                        }
                    }
                    else {
                        this.awbserv.Insert_Item(ItemDate).subscribe(res => {
                            if (res['code'] == 200) {
                                this.Mul(ItemDate)
                                // this.reset()
                                this.item_amt_list.ins_item_status = "Y"
                                this.newItemEvent.emit(this.item_amt_list);
                                this.coloredToast('success', 'Item Insert Successfully')
                                this.get_item_invoice(this.inv_id)
                                this.item_amt_list.ins_item_status = "N"
                            }
                        })
                    }
                }
                else {
                    this.awbserv.Insert_Item(ItemDate).subscribe(
                        res => {
                            if (res['code'] == 200) {
                                this.Mul(ItemDate)
                                // this.reset()
                                this.item_amt_list.ins_item_status = "Y"
                                this.newItemEvent.emit(this.item_amt_list);
                                this.coloredToast('success', 'Item Insert Successfully')
                                this.get_item_invoice(this.inv_id)
                                this.item_amt_list.ins_item_status = "N"
                            }
                        })
                }
            }
            else {
                this.awbserv.Update_Item(ItemDate).subscribe(res => {
                    if (res['code'] == 200) {
                        this.insertItem()
                        this.item_index = undefined
                        this.coloredToast('success', 'Item Updated Successfully')
                        this.get_item_invoice(this.inv_id)
                        this.valForm.controls['item_description'].setValue("")
                        this.valForm.controls['quantity'].setValue("")
                        this.valForm.controls['unit_price'].setValue("0")
                        this.valForm.controls['value_percent'].setValue(this.valuepercent)
                        this.valForm.controls['value_amount'].setValue("0")
                        this.valForm.controls['carton_no'].setValue("")
                        this.valForm.controls['item_id'].setValue("")
                        this.valForm.controls['carton_id'].setValue("")
                    }
                })
            }
        }
    }

    ctnfocus() {
        if (this.valForm.value.carton_no == "" || this.valForm.value.carton_no == null) {
            this.coloredToast('warning', 'Enter The Carton No');
            this.F_CART.nativeElement.focus();
        }
        else {
            this.F_ITN.nativeElement.focus();
            this.F_ITN.nativeElement.select();
        }
    }
    itnfocus() {
        if (this.valForm.value.carton_no == "" || this.valForm.value.carton_no == null) {
            this.coloredToast('warning', 'Enter The Carton No');
            this.F_CART.nativeElement.focus();
        }
        else {
            this.F_ITN.nativeElement.focus();
            this.F_ITN.nativeElement.select();
        }
        //this.F_ITN.nativeElement.focus();
    }

    quafocus() {
        if (this.valForm.value.carton_no == "" || this.valForm.value.carton_no == null) {
            this.coloredToast('warning', 'Enter The Carton No');
            this.F_CART.nativeElement.focus();
        }
        else if (this.valForm.value.item_description == "" || this.valForm.value.item_description == null) {
            this.coloredToast('warning', 'Enter The Item Description');
            this.F_ITN.nativeElement.focus();
        }
        else {
            this.F_QUA.nativeElement.focus();
            this.F_QUA.nativeElement.select();
        }
    }
    vapfocus() {
        this.F_SAV.nativeElement.focus();
        this.F_SAV.nativeElement.select();
    }
    savfocus() {
        this.F_SAV.nativeElement.focus();
        this.F_SAV.nativeElement.select();
    }
    valuecal(value: any) {
        // console.log(value)
        var a = Number(value.unit_price) * Number(value.quantity)
        this.valForm.controls['value_amount'].setValue(a)
        // var b = Number(value.value_percent)
        // var c = a * b / 100
        // if ((value.unit_price == 0) || (value.value_percent == 0)) {
        //   this.valForm.controls['value_amount'].setValue('0')
        // }
        // else {
        //   this.valForm.controls['value_amount'].setValue(c)
        // }
    }
    setcartno(value: any) {
        this.valForm.controls['carton_no'].setValue(value.carton_no)
    }
    add() {
        this.totalval = 0
        for (let j = 0; j < this.ItemArray.length; j++) {
            this.totalval += Number(this.ItemArray[j].value_amount);

        }
        // this.awbserv.sendClickEvent(this.totalval)
        // console.log('va', this.totalval);

    }

    ngOnInit() {

    }

    coloredToast(color: string, msg: any) {
        const toast = Swal.mixin({
            toast: true,
            position: 'bottom-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
            customClass: {
                popup: `color-${color}`,
            },
            target: document.getElementById(color + '-toast') || 'body',
        });
        toast.fire({
            title: msg,
        });
    }
}
