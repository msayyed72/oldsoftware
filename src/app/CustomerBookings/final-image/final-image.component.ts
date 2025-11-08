import { Component, OnInit } from '@angular/core';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-final-image',
  templateUrl: './final-image.component.html',
  styleUrls: ['./final-image.component.css']
})
export class FinalImageComponent implements OnInit {


invoiceFilter: any = ''
  receivedDate=[]
  userDetails:any;
  constructor(public serviceNew: NewApiCloudService, private imageCompress: NgxImageCompressService,) { 
        this.userDetails=JSON.parse(localStorage.getItem('log_data'));

  }

  ngOnInit() {
  }
  v1_sp_ds_hawb_final_invoice_image_get() {
    if (!this.invoiceFilter || this.invoiceFilter.trim() === '') return;

    const filterValue = String(this.invoiceFilter).trim();
    if (
      filterValue.length === 6
    ) {
      this.serviceNew.v1_sp_ds_hawb_final_invoice_image_get(this.invoiceFilter).subscribe(r => {
        if(r['data'].length >0){
 this.receivedDate= r['data'].map(r=>({
            ...r,
            hawb_img : r['hawb_img'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['hawb_img'] : '',
            ashawb_final_img1 : r['ashawb_final_img1'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['ashawb_final_img1'] : '',
            ashawb_final_img2 : r['ashawb_final_img2'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['ashawb_final_img2'] : ''
          }))
        }else{
          // this.toastr.warningToastr('Shipment No Found')
          this.showAlert('error', 'Shipment Not Found');
        }
         
      })  

    }else{
        this.receivedDate =[]
    }
  }
  onFileSelected(event: any, item: any, type: 'hawb_img' | 'ashawb_final_img1' | 'ashawb_final_img2') {
  const file = event.target.files[0];
  if (file) {
      if(type == 'hawb_img'){
      this.onImageUploadAadhar(file,1,item)

      }else if(type == 'ashawb_final_img1'){
      this.onImageUploadAadhar(file,2,item)

      }else if(type == 'ashawb_final_img2'){
      this.onImageUploadAadhar(file,3,item)

      }else{
          // this.toastr.warningToastr("Invalid Type")
        this.showAlert('warning', 'Invalid Type');
      }
  }
}
 async onImageUploadAadhar(file: File,flag:number,item:any) {
    let compressedFile: File;
    try {
      if (file && file.type.startsWith('image/')) {
        compressedFile = await this.compressImageTo2MB(file); // only compress if it's an image
      } else {
        compressedFile = file;
      }

      const formData = new FormData();
      formData.append('avatar', compressedFile);

      this.serviceNew.uploadFinalImg(formData).subscribe(data => {
        if (data['status'] === 'success' && data['url']) {
          const fileUrl =  data['url'];
          item.flag = flag;
          item.fileUrl = fileUrl
          this.v1_sp_ds_hawb_final_invoice_image_update(item)
          // this.saveNotes(fileUrl); // Save to your NotesReceivedForInvoice array
        }
      });

    } catch (error) {
      console.error('Image upload failed:', error);
    }
  }
    cancelimage(data,flag){
    console.log(data);
     const payload ={
      hawb_no:data.hawb_no,
      bag_hawb_no:String(data.hawb_no)+String(data.box_no || '').trim(),
      created_by:this.userDetails['v_user_id'],
      hawb_weight_image:null,
      flag:flag
    }
    console.log(payload)
     this.serviceNew.v1_sp_ds_hawb_final_invoice_image_update(payload).subscribe(r=>{
      if(r['code']=='200'){
        // this.toastr.successToastr('Updated Successfully');
                this.showAlert('success', 'Updated Successfully');

        this.v1_sp_ds_hawb_final_invoice_image_get()
      }else{
                this.v1_sp_ds_hawb_final_invoice_image_get()

                // this.toastr.errorToastr('Failed');
                this.showAlert('error', 'Failed');

      }
    },error=>{
        // this.toastr.errorToastr(error['error'])
            //  this.showAlert('error', error['error']);
            this.showAlert('error', `${error['error']}`);


    })
  }
  v1_sp_ds_hawb_final_invoice_image_update(data){
    
  
    const payload ={
      hawb_no:data.hawb_no,
      bag_hawb_no:String(data.hawb_no)+String(data.box_no || '').trim(),
      created_by:this.userDetails['v_user_id'],
      hawb_weight_image:data.fileUrl,
      flag:data.flag
    }
    this.serviceNew.v1_sp_ds_hawb_final_invoice_image_update(payload).subscribe(r=>{
      if(r['code']=='200'){
        // this.toastr.successToastr('Updated Successfully');
                        this.showAlert('success', 'Updated Successfully');

        this.v1_sp_ds_hawb_final_invoice_image_get()
      }else{
                this.v1_sp_ds_hawb_final_invoice_image_get()

                // this.toastr.errorToastr('Failed');
                this.showAlert('error', 'Failed');
      }
    },error=>{
        // this.toastr.errorToastr(error['error'])
        this.showAlert('error', error['error']);
    })

  }
handleDeleteClick(event: MouseEvent, item: any, type: string): void {
    event.preventDefault();  // Prevent default behavior
    event.stopPropagation(); // Stop the event from propagating

    // Show confirmation dialog before proceeding
    Swal.fire({
        title: 'Are you sure?',
        text: 'This action will permanently delete the image.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with deletion if confirmed
            this.v1_sp_ds_hawb_final_invoice_image_Delete(item, type);
        }
    });
}

    v1_sp_ds_hawb_final_invoice_image_Delete(data,type){

  let flag:any = ''
if (type) {
      if(type == 'hawb_img'){
      
        flag=1;
      }else if(type == 'ashawb_final_img1'){
                flag=2;


      }else if(type == 'ashawb_final_img2'){
                flag=3;

      }else{
          // this.toastr.warningToastr("Invalid Type")
        this.showAlert('warning', 'Invalid Type');
      }
  }
    const payload ={
      hawb_no:data.hawb_no,
      bag_hawb_no:String(data.hawb_no)+String(data.box_no || '').trim(),
      created_by:this.userDetails['v_user_id'],
      hawb_weight_image:'',
      flag:flag
    }
    this.serviceNew.v1_sp_ds_hawb_final_invoice_image_update(payload).subscribe(r=>{
      if(r['code']=='200'){
        // this.toastr.successToastr('Updated Successfully');
                        this.showAlert('success', 'Updated Successfully');

        this.v1_sp_ds_hawb_final_invoice_image_get()
      }else{
                this.v1_sp_ds_hawb_final_invoice_image_get()

                // this.toastr.errorToastr('Failed');
                this.showAlert('error', 'Failed');
      }
    },error=>{
        // this.toastr.errorToastr(error['error'])
        this.showAlert('error', error['error']);
    })

  }
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

// Method to show the alert with dynamic messages and icons
// Method to show the alert with dynamic messages and icons
// showAlert(icon: 'success' | 'error' | 'warning' | 'info' | 'question', message: string) {
//   const toast = Swal.mixin({
//     toast: true,
//     position: 'top-end', // Position of the toast
//     showConfirmButton: false,
//     timer: 3000, // Duration the toast will appear for
//     customClass: 'sweet-alerts',
//   });

//   toast.fire({
//     icon: icon, // Dynamically set the icon type (e.g., success, error)
//     title: message, // Dynamic message
//     customClass: 'sweet-alerts',
//   });
// }

async showAlert(icon: 'success' | 'error' | 'warning' | 'info' | 'question', message: string) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            padding: '1em',
            customClass: 'sweet-alerts'
        });
        toast.fire({
            icon: icon,
            title: message,
            padding: '1em',
            customClass: 'sweet-alerts'
        });
    }

}



