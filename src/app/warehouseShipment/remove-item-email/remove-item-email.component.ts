import { Component, OnInit } from '@angular/core';
import { AwbService } from '../../cfServices/awb.service';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-remove-item-email',
  templateUrl: './remove-item-email.component.html',
  styleUrls: ['./remove-item-email.component.css']
})
export class RemoveItemEmailComponent implements OnInit {
  invoiceFilter: any = ''
  userdetails: any;
  pointid: any;
  v_location_id: any;
  params!: FormGroup;

  constructor(public service: AwbService, public serviceNew: NewApiCloudService, private fb: FormBuilder, public imageCompress: NgxImageCompressService) {

  }

  ngOnInit(): void {
    this.userdetails = JSON.parse(localStorage.getItem("log_data"))
    this.pointid = this.userdetails.v_point_id
    this.v_location_id = this.userdetails.v_location_id
    this.initForm()
  }
  initForm() {
    this.params = this.fb.group({
      id: [null],
      name: [''],
      date: [new Date().toISOString().split('T')[0]],
      selected: false,
      paymentSts: '',
      customPaymentType: '',
      to: ['', Validators.required],
      cc: [''],
      file: [[]],
      description: [''],
      displayDescription: [''],
      sendType: ['false']
    });
    this._initialFormValue = this.params.getRawValue();

  }
  _initialFormValue: any;
  emailContent = ''
  loadData() {
    this.callApi(this.invoiceFilter)
  }
  invoiceData = []

  callApi(searchText: string) {
    if (String(searchText).trim().length >= 6) {
      this.serviceNew.get_invoice_list(this.pointid, this.v_location_id, searchText, -1).subscribe(data => {
        if (data['data'] && data['data'].length) {

          this.invoiceData = data['data'][0]
          this.params.get('to').setValue(data['data'][0]['sender_mail'])
          // ✅ **Filter to keep only unique `hawb_no` values**
          this.params.get('name').setValue(data['data'][0]['sender_name'])
         this.emailContent = `
<p>Dear ${data['data'][0]['sender_name']},</p>
<p>We hope this email finds you well.</p>

<p>We would like to inform you that a restricted or prohibited item has been identified 
in your shipment under HAWB No: ${data['data'][0]['hawb_no']}. The item is available for collection from our 
warehouse at the following address:

</p>
<p>
  <strong>Cargo Force Limited</strong><br>
  Unit K, 9 Osram Road<br>
  East Lane Business Park<br>
  Wembley, London<br>
  HA9 7NG
</p>
<p>
Please note that you must collect the item within 7 days. 
If you would prefer the item to be returned to your address, 
a return fee of £10 will apply to cover service booking and shipping costs.
</p>
<p>
  Kindly confirm your preferred option at your earliest convenience.
</p>
<p>Thank you for your understanding and cooperation.</p>
<p>
  Best regards,<br>
  <strong>Wembley Warehouse</strong><br>
  Cargo Force
</p>`;

          this.editedContent = this.emailContent;
          this.params.get('description').setValue(this.emailContent)
          this.params.get('displayDescription').setValue(this.emailContent)
        } else {
          this.showMessage('Shipment Not Received At Warehouse','error')
          console.log("No new invoices found.");
        }


      });
    }

  }
  quillEditorReady(event: any) {
    // Get the HTML content from the editor
    const htmlContent = event.html;

    // Now, set this HTML content to the form value
    this.params.patchValue({ displayDescription: htmlContent });
  }
  editorOptions = {
    toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
  };

  afterConformationPAyment(data) {

  }

  uploadedFiles: { file: File; preview: string; type: string; dataUrl?: string }[] = [];

  // Use blob URLs for both images and PDFs
  handleFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach(file => {
      const fileType = file.type || '';

      // Allow only image and PDF files
      if (fileType.startsWith('image/') || fileType === 'application/pdf' || fileType.endsWith('/pdf')) {
        const blobURL = URL.createObjectURL(file);

        if (fileType.startsWith('image/')) {
          // If the file is an image, read as Data URL for preview
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            this.uploadedFiles.push({ file, preview: blobURL, type: fileType, dataUrl });
          };
          reader.readAsDataURL(file);
        } else if (fileType === 'application/pdf' || fileType.endsWith('/pdf')) {
          // If the file is a PDF
          this.uploadedFiles.push({ file, preview: blobURL, type: fileType });
        }
      } else {
        // Reject files that are not image or PDF
        this.showMessage('Only images and PDFs are allowed.', 'error');
      }
    });

    input.value = ''; // Reset the input field to allow the same file to be selected again
  }


  private mimeOf(item: { file: File; type: string }): string {
    return item.type || item.file?.type || '';
  }

  isImage(item: { file: File; type: string }): boolean {
    return this.mimeOf(item).startsWith('image/');
  }

  isPdf(item: { file: File; type: string }): boolean {
    const t = this.mimeOf(item);
    return t === 'application/pdf' || t.endsWith('/pdf');
  }

  getName(item: { file: File }): string {
    return item.file?.name || 'Unnamed file';
  }

  getSize(item: { file: File }): string {
    const bytes = item.file?.size ?? 0;
    if (bytes === 0) return '0 B';
    const k = 1024, units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  }

  // Robust image preview: write an HTML page with <img> so it never renders blank
  openImagePreview(url: string, title = 'Preview Image') {
    const w = window.open('', '_blank');
    if (!w) return; // popup blocked
    const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          html,body{margin:0;height:100%}
          body{display:flex;align-items:center;justify-content:center;background:#111}
          img{max-width:100%;max-height:100%;display:block}
        </style>
      </head>
      <body>
        <img src="${url}" alt="preview"/>
      </body>
    </html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  // PDFs can still open directly
  openBlobPDF(url: string) {
    window.open(url, '_blank');
  }

  downloadFile(item: { file: File; preview: string; type: string; dataUrl?: string }) {
    const a = document.createElement('a');
    a.href = item.preview;            // blob URL
    a.download = item.file?.name || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  removeFile(fileToRemove: { file: File; preview: string; type: string; dataUrl?: string }): void {
    // Revoke blob URL to prevent memory leaks
    try { if (fileToRemove.preview?.startsWith('blob:')) URL.revokeObjectURL(fileToRemove.preview); } catch { }

    // Remove from preview list
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== fileToRemove);

    // If you inserted the image into an editor using dataUrl, remove it from there
    if (fileToRemove.type.startsWith('image/')) {
      const editor = document.querySelector('.email-content-display') as HTMLElement | null;
      if (editor) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(editor.innerHTML, 'text/html');
        doc.querySelectorAll('img').forEach(img => {
          if (img.src === (fileToRemove.dataUrl || fileToRemove.preview)) img.remove();
        });
        editor.innerHTML = doc.body.innerHTML;
        // @ts-ignore – if you maintain emailContent somewhere
        this.emailContent = editor.innerHTML;
      }
    }
  }
  htmlcode = ''
  editedContent = ''
  // Optional: cleanup on component destroy
  ngOnDestroy(): void {
    this.uploadedFiles.forEach(f => {
      try { if (f.preview?.startsWith('blob:')) URL.revokeObjectURL(f.preview); } catch { }
    });
  }
  async sendEmail11() {
    console.log(this.editedContent)
    const payload: any = {
      mail: this.params.value.to,
      // mail: 'chowlysaravanan@gmail.com',
      content: this.params.value.displayDescription,
      inv_no: this.invoiceData['hawb_no']
    };

    if (this.uploadedFiles.length > 0) {
      const allFiles = this.uploadedFiles.map(file => file.file);

      try {
        const uploadUrls: any[] = await Promise.all(
          allFiles.map(file => this.onImageUploadAadhar1(file))
        );
        payload.imgurl = uploadUrls;
        this.serviceNew.removeItemMail(payload).subscribe({
          next: () => this.handleEmailSuccess(),
          error: (error) => this.handleEmailError(error)
        });
      } catch (err) {

      }

    } else {
      this.serviceNew.removeItemMail(payload).subscribe({
        next: () => this.handleEmailSuccess(),
        error: (error) => this.handleEmailError(error)
      });
    }
  }

  async onImageUploadAadhar1(file: File): Promise<string> {
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
              this.saveNotes('Return Img Sended'); // Save to your NotesReceivedForInvoice array

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
  EnteredNotes = ''
  saveNotes(EnteredNotes) {
    const Notes = {
      invoice_no: this.invoiceData['hawb_no'],
      notes: EnteredNotes,
      created_by: this.userdetails.v_user_id,
    };

    this.serviceNew.v1_sp_ds_pickup_order_note_insert(Notes).subscribe(
      (data) => {
        // this.NotesForInvoices.hide()

        if (data['code'] == 200) {
          // this.toastr.successToastr('Notes inserted successfully.');
          this.EnteredNotes = ''; // Clear input after success
          // this.getHawbListAssigned();
          if (this.invoiceData['hawb_no']) {
            // const msg = {
            //   sender: this.userdetails['v_user_name'],
            //   content: this.EnteredNotes,
            //   timestamp: new Date().toISOString()
            // };
            const msg = { from: 'Dharun', message: 'Hello Server!' };

            // this._chat.send({
            //   source: 'notes',
            //   event: 'notes',
            //   payload: { message: this.userdetails['v_employee_name'] + " Sended message:- " + this.EnteredNotes }
            // });
            // this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no'])

          }

        } else {
          this.showMessage('Failed to insert notes. Please try again.', 'error');
        }
      },
      (error) => {
        // this.NotesForInvoices.hide()
        this.showMessage('An error occurred. Please check your connection.');
        console.error('Error inserting notes:', error);
      }
    );
  }
  handleEmailError(error: any) {
    this.showMessage('Failed to send email.', 'error');
    console.error('Email send error:', error);
  }
  handleEmailSuccess() {
    // this.sendEmail1.close()
    this._initialFormValue = { ...this._initialFormValue, date: new Date().toISOString().split('T')[0] };
    this.params.reset(this._initialFormValue);
    this.uploadedFiles = []
    this.updateMailsts();
  }

  updateMailsts() {
    const d = {
      hawb_no: this.invoiceData['hawb_no'],
      status: 1,
      created_by: this.userdetails.v_user_id,
      type: 'RemoveMail'
    };

    this.service.sp_v1_ds_history_log_events_insert(this.invoiceData['invoice_no'], this.userdetails['v_user_id'], 'Remove Item Mail Sended').toPromise()
    this.serviceNew.v1_SP_ds_Pickup_order_status_update(d).subscribe({
      next: () => {
        this.showMessage('Email sent successfully!');
        this.params.get('sendType').setValue('false');
      },
      error: (error) => {
        this.showMessage('Failed to update status.', 'error');
        console.error('Status update error:', error);
      }
    });
  }
  async compressImageTo2MB(image: File): Promise<File> {
    console.log("Compressing image to ≤2MB...");

    if (!image || !(image instanceof File)) {
      return Promise.reject('Invalid image file provided');
    }

    return new Promise<File>((resolve, reject) => { // Add <File> here
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
