import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AwbServiceService } from '../services/awb-service.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Inject, Injectable } from '@angular/core';
import { MasterService } from '../services/master-service.service';
import Swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    templateUrl: './boxed-signin.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class BoxedSigninComponent {
    store: any;
    @ViewChild('F_USR') F_USR: any;
    @ViewChild('F_PWD') F_PWD: any;
    valForm: FormGroup;
    userDetails: any;
    password: any;
    btn3: boolean=false;
    pno: any;
    mail: any;
    log_info: any;
    v_opt: any;
    verify: FormGroup;
    btn4: boolean=true;
    urlPath: any;
    constructor(public router: Router,fb: FormBuilder,public ser:AwbServiceService,
        public service: MasterService) {
        this.valForm = fb.group({
            'email': [null, Validators.required],
            'password': [null, Validators.required]
        });
        this.verify = fb.group({
            'otp': [null, Validators.required]
        });
    }

    pwdfocus() {
        this.F_PWD.nativeElement.focus();
    }

    get_login(value: any) {
        this.service.getLogin(value.email).subscribe(res => {
            this.userDetails = res['data'];
            this.password = this.userDetails['v_user_password']
        });
    }

    getFromLocal(key:any): void {
        var enc = btoa(JSON.stringify(key))
        var dec = atob(enc)
        // console.log('recieved= key:' + enc, dec);
        // this.storage.set("logdata", key);
        localStorage.setItem("log_data", JSON.stringify(key));
    }

    submitForm(value: any) {

        this.btn3 = true;
        this.service.getLogin(value.email).subscribe(res => {
            var dec = atob(res['data']);
            var f_Json = JSON.parse(dec)
            this.userDetails = f_Json[0]
            // if(this.userDetails.v_designation_name == "ORIGIN USER" || this.userDetails.v_user_type == "ADMIN")
            // {
            // this.getFromLocal(this.userDetails);
            this.pno = btoa(this.userDetails['v_mobile_no']);
            this.mail = btoa(this.userDetails['v_mail_id']);
            var pwd = this.userDetails['v_user_password']
            if (pwd != null) {
                this.btn3 = true;
                if (pwd == value.password) {
                    this.log_info = '1'
                    this.save_loc()
                    // this.service.request_send_log(this.pno,this.mail).subscribe(
                    //     res => { 
                    //         if (res['data'] == "Invalid Mobile No") {
                    //             this.coloredToast(res['data'],'warning')
                    //             this.log_info = '2';
                    //             this.btn3 = false;
                    //         }
                    //         else {
                    //             this.v_opt = res['data'].substring(17)
                    //             this.v_opt = Number(this.v_opt) - 7410258;
                    //             this.coloredToast('OTP sent to your register mobile number','success')
                    //             this.log_info = '1';
                    //         }
                    //     },
                    //     error => {
                    //         console.log(error)
                    //         this.coloredToast('OTP sent to your register mobile number','success')
                    //         this.log_info = '1';
                    //     }
                    // )
                }
                else {
                    this.coloredToast('Invaild username or password', 'danger')
                    this.btn3 = false;
                }
            }
            else {
                this.coloredToast("Username Cannot exist", "Warning");
                this.btn3 = false;
            }
        // }
        // else
        // {
        //     this.toastr.errorToastr('Username and Password Invalid!')
        // }
        });

    }

    verifyForm($ev:any, value: any) {
        // $ev.preventDefault();
        for (let c in this.verify.controls) {
            this.verify.controls[c].markAsTouched();
        }
        if (this.verify.valid) {
            this.btn4 = true;
            if (value.otp == this.v_opt) {
                this.save_loc()
            }
            else {
                this.coloredToast('OTP Invalid','danger')
                this.btn4 = false;
            }
        }
    }

    save_loc() {
        this.service.getLogin(this.valForm.value.email).subscribe(res => {
            var dec = atob(res['data']);
            var f_Json = JSON.parse(dec)
            this.userDetails = f_Json[0]
            this.userDetails['v_user_password'] = '**************'
            this.btn3 = false;
            this.coloredToast('Login Successs.', 'Success');
            this.ser.update_status(this.userDetails.v_user_id,"1").subscribe(res=>{})
            // if (res['data'][0].v_point_type_id == 1 && this.urlPath == 0) {
            //     this.router.navigate(['invoice/preview']);
            // }
            // else if (res['data'][0].v_point_type_id == 3 && this.urlPath == 0) {
            //     this.router.navigate(['invoice/preview']);
            // }
            // else if(this.urlPath == 0) {
            //     this.router.navigate(['invoice/preview']);
            // }
            // else{
                this.router.navigate(['customer/newBookings']);
            // }
            this.getFromLocal(this.userDetails);
            localStorage.setItem("user_details", this.userDetails);
            // this.storage.set("user_details", res['data'][0]);
        });
    }

    coloredToast(msg: any,color: string) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
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
