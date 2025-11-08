import { Component, OnInit } from '@angular/core';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import Swal from 'sweetalert2';
import { AwbService } from '../../cfServices/awb.service';
@Component({
  selector: 'app-add-package-image',
  templateUrl: './add-package-image.component.html',
  styleUrls: ['./add-package-image.component.css']
})
export class AddPackageImageComponent implements OnInit {


invoiceFilter: any = ''
  receivedDate=[]
  userDetails:any;
  constructor(public serviceNew: NewApiCloudService, private imageCompress: NgxImageCompressService,public service:AwbService) { 
        this.userDetails=JSON.parse(localStorage.getItem('log_data'));

  }

  ngOnInit() {
  }
    loadData() {
      if (!this.invoiceFilter || this.invoiceFilter.trim() === '') return;

    const filterValue = String(this.invoiceFilter).trim();
    if (
      filterValue.length === 6
    ) {
      this.serviceNew.v1_SP_Ds_Carton_get_based_on_hawb_no(this.invoiceFilter).subscribe(r => {
          this.receivedDate= r['data'].map(r=>({
            ...r,
            img : r['img'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['img'] : '',
            // ashawb_final_img1 : r['ashawb_final_img1'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['ashawb_final_img1'] : '',
            // ashawb_final_img2 : r['ashawb_final_img2'] ? "https://api.cargoforce.com/origin_v2/api_php_booking/finalImg/" + r['ashawb_final_img2'] : ''
          }))
      })  

    }else{
        this.receivedDate =[]
    }
  }
   onFileSelected(event: any, item: any, type: 'img' ) {
  const file = event.target.files[0];
  if (file) {
      if(type == 'img'){
                              this.service.sp_v1_ds_history_log_events_insert(item.hawb_no,this.userDetails['v_user_id'],'Packing Img Collected After Receiving').toPromise()

      this.onImageUploadAadhar(file,4,item)

      }else{
          this.showAlert('warning',"Invalid Type")

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
  v1_sp_ds_hawb_final_invoice_image_update(data){

  
    const payload ={
      hawb_no:data.hawb_no,
      bag_hawb_no:data.carton_id,
      created_by:this.userDetails['v_user_id'],
      hawb_weight_image:data.fileUrl,
      flag:data.flag
    }
    this.serviceNew.v1_sp_ds_hawb_final_invoice_image_update(payload).subscribe(r=>{
      if(r['code']=='200'){
        // this.toastr.successToastr('Updated Successfully');
                this.showAlert('success','Updated Successfully')

        this.loadData()
      }else{
                this.loadData()

                this.showAlert('error','Failed');

      }
    },error=>{
        this.showAlert('error',error['error'])
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



