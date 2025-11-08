import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service'; // Your custom service
import { NgxImageCompressService } from 'ngx-image-compress';
import Swal from 'sweetalert2';
import { AwbService } from '../../cfServices/awb.service';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.css']
})
export class AddNotesComponent implements OnInit {
  @ViewChild('scrollable') scrollable!: NgScrollbar;
  userDetails: any;
  isShowUserChat = true; // Default chat container visibility
  textMessage: string = '';
  isDragging = false;
  loginUser = {
    id: 1,
    name: 'Alon Smith',
    path: 'profile-34.jpeg',
    designation: 'Software Developer',
  };

  selectedUser: any = { userId: '' };  // Default user ID (AB0514)
  messages: any[] = [];  // Store messages

  constructor(private serviceNew: NewApiCloudService, public service: AwbService, public server: NewApiCloudService, private http: HttpClient, private imageCompress: NgxImageCompressService,) {
    // Retrieve logged-in user's details from session storage
    this.userDetails = JSON.parse(localStorage.getItem('log_data') || '{}');
    this.loginUser.name = this.userDetails['v_employee_name']
    this.loginUser.id = this.userDetails['v_user_id']
  }
  selectedData: any = {
    invoice_no: ''
  };
  ngOnInit(): void {
    this.serviceNew.chat$
      .pipe(
      // distinctUntilChanged((prev, curr) => prev.invoice_no === curr.invoice_no)
    )
      .subscribe(d => {
        if (d) {
          this.selectedData = d;
          this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no']);
        }
      });
    // Fetch chat messages for default user ID 'ab0514'
    // this.fetchMessages(this.selectedUser.userId);
    this.selectedUser.userId = this.userDetails['v_user_id']
    this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no']);
this.v1_sp_ds_pickup_order_note_reason_get()
  }
  NotesReceivedForInvoice = [];
  reasonForImageData=[]
v1_sp_ds_pickup_order_note_reason_get(){
  this.serviceNew.v1_sp_ds_pickup_order_note_reason_get().subscribe(r=>{
this.reasonForImageData = r['data']
  })
}
  // Handle message hover state
  onMessageHover(isHovered: boolean, message: any) {
    message.hover = isHovered;
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }
  async onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      await this.handleFiles(files, event);
    }
  }
  // private async handleFiles(files: FileList, event) {
  //   const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  //   for (const file of Array.from(files)) {
  //     if (!validTypes.includes(file.type)) {
  //       this.showMessage(`Unsupported file type: ${file.type}`, 'error');

  //       // this.toastr.errorToastr(`Unsupported file type: ${file.type}`);
  //       continue;
  //     }

  //     try {
  //       await this.onImageUploadAadhar(file);
  //     } catch (error) {
  //       console.error('Upload failed:', error);
  //       this.showMessage(`Failed to upload ${file.name}`, 'error');

  //       // this.toastr.errorToastr(`Failed to upload ${file.name}`);
  //     }
  //   }
  // }
  // async onImageUploadAadhar(file: File) {
  //   let compressedFile: File;
  //   try {
  //     if (file && file.type.startsWith('image/')) {
  //       compressedFile = await this.compressImageTo2MB(file); // Only compress if it's an image
  //     } else {
  //       compressedFile = file;
  //     }

  //     const formData = new FormData();
  //     formData.append('avatar', compressedFile);

  //     this.server.imgUploadnew(formData).subscribe(data => {
  //       if (data['status'] === 'success' && data['url']) {
  //         const fileUrl = "$a-z/" + data['url'];
  //         this.saveNotes(fileUrl);
  //       }
  //     });

  //   } catch (error) {
  //     console.error('Image upload failed:', error);
  //   }
  // }


  private async handleFiles(files: FileList, event) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  for (const file of Array.from(files)) {
    if (!validTypes.includes(file.type)) {
      this.showMessage(`Unsupported file type: ${file.type}`, 'error');
      continue;
    }

    try {
      await this.previewAndUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
      this.showMessage(`Failed to upload ${file.name}`, 'error');
    }
  }
}
private async previewAndUpload(file: File) {
  const isPdf = file.type === 'application/pdf';
  const fileUrl = await this.getFileUrl(file); // Get file URL

  // ✅ Manually generate dropdown options from reasonForImageData
  const optionsHtml = this.reasonForImageData
    .map((a: any) => `<option value="${a.reason_id}">${a.reason}</option>`)
    .join('');

  // Show Swal preview with dropdown
  const { value: selectedOption } = await Swal.fire({
    title: 'Select Option',
    html: `
      <div style="text-align:center; margin-bottom:1rem;">
        ${
          isPdf
            ? `<iframe src="${fileUrl}" width="100%" height="150px" style="border:none;"></iframe>`
            : `<img src="${fileUrl}" style="max-width:100%; max-height:150px;"/>`
        }
      </div>
      <select id="myDropdown" class="w-full form-select">
        <option value="">Select reason</option>
        ${optionsHtml}
      </select>
    `,
    showCloseButton: true,
    showCancelButton: false,
    showConfirmButton: true,
    allowOutsideClick: false,
    padding: '1.5rem',
    didOpen: () => {
      const htmlContainer = Swal.getHtmlContainer();
      if (htmlContainer) htmlContainer.classList.remove('swal2-html-container');
    },
    preConfirm: () => {
      const dropdown = document.getElementById('myDropdown') as HTMLSelectElement;
      if (!dropdown.value) {
        Swal.showValidationMessage('Please select a reason');
      }
      return dropdown.value;
    }
  });

  if (selectedOption) {
    // Upload after selecting dropdown
    await this.onImageUploadAadhar(file, selectedOption);
  }
}


private async onImageUploadAadhar(file: File, reasonForImg: string) {
  let compressedFile: File;
  try {
    if (file && file.type.startsWith('image/')) {
      compressedFile = await this.compressImageTo2MB(file); // Only compress if it's an image
    } else {
      compressedFile = file;
    }

    const formData = new FormData();
    formData.append('avatar', compressedFile);

    this.server.imgUploadnew(formData).subscribe(data => {
      if (data['status'] === 'success' && data['url']) {
        const fileUrl = "$a-z/" + data['url'];
        this.saveNotes1(fileUrl, reasonForImg); // Pass selected reason here
      }
    });

  } catch (error) {
    console.error('Image upload failed:', error);
  }
}

// Modified saveNotes to accept reasonForImg
saveNotes1(fileUrl: string, reasonForImg: string, EnteredNotes: string = this.EnteredNotes) {
  const Notes = {
    invoice_no: this.selectedData['invoice_no'],
    notes: fileUrl,
    created_by: this.userDetails['v_user_id'],
    reasonForImg: reasonForImg,
    fileUrl: fileUrl
  };

  this.service.sp_v1_ds_history_log_events_insert(
    this.selectedData['invoice_no'], 
    this.userDetails['v_user_id'], 
    'Shipment Notes Added'
  ).toPromise();

  this.server.v1_sp_ds_pickup_order_note_insert(Notes).subscribe(
    (data) => {
      if (data['code'] == 200) {
        this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no']);
        this.scrollToBottom();
        this.EnteredNotes = ''; // Clear input
      } else {
        this.showMessage('Failed to insert notes. Please try again.', 'error');
      }
    },
    (error) => {
      this.showMessage('An error occurred. Please check your connection.', 'error');
      console.error('Error inserting notes:', error);
    }
  );
}

// Utility to get object URL for preview
private getFileUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}


  openImages(img) {
    window.open('https://api.cargoforce.com/Origin_v2/api_php_booking/chatImages/' + img)
  }

  // Compress image to 2MB
  async compressImageTo2MB(image: File): Promise<File> {
    if (!image || !(image instanceof File)) {
      return Promise.reject('Invalid image file provided');
    }

    // Compress image logic if it's not a PDF
    return new Promise<File>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);

      reader.onload = async () => {
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
      };

      reader.onerror = () => reject('Error reading the image file');
    });
  }
  // Fetch notes for the invoice
  v1_sp_ds_pickup_order_note_get(data: any): void {
    this.server.v1_sp_ds_pickup_order_note_get(data).subscribe((response: any) => {
      if (response && response.data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // 🔼 Sort by created_time ASCENDING
        const sortedData = response.data.sort((a: any, b: any) => {
          return new Date(a.created_time).getTime() - new Date(b.created_time).getTime();
        });

        this.NotesReceivedForInvoice = sortedData.map((d: any) => {
          const created = new Date(d.created_time);
          const createdMidnight = new Date(created);
          createdMidnight.setHours(0, 0, 0, 0);

          const timeDiff = today.getTime() - createdMidnight.getTime();
          const diffInDays = timeDiff / (1000 * 60 * 60 * 24);

          let displayDate = '';
          if (createdMidnight.getTime() === today.getTime()) {
            displayDate = 'Today';
          } else if (createdMidnight.getTime() === yesterday.getTime()) {
            displayDate = 'Yesterday';
          } else if (diffInDays < 6) {
            displayDate = created.toLocaleDateString('en-US', { weekday: 'long' });
          } else {
            displayDate = created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          }

          return {
            ...d,
            updated_time: d.created_time
              ? new Date(d.created_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : '',
            display_date: displayDate
          };
        });

        this.scrollToBottom();
      }
    });
  }
  ngOnDestroy(): void {
    // No socket connection anymore, so nothing to disconnect
  }

  // Fetch chat messages for a specific user ID (default: 'ab0514')
  fetchMessages(userId: string) {
    const apiUrl = `https://api.cargoforce.com:8081/messages?p_message_room_id=${userId}&p_user_id=${this.userDetails['v_user_id']}`;

    this.http.get(apiUrl).subscribe((data: any[]) => {
      if (data && data.length) {
        // Map the API response to our messages array
        this.messages = data.map(message => ({
          fromUserId: Number(message.fromUserId),
          toUserId: Number(message.toUserId),
          text: message.TEXT,
          time: new Date(message.TIME).toLocaleTimeString(), // Format the time
        }));

        // Scroll to the bottom after loading messages
        this.scrollToBottom();
      }
    }, error => {
      console.error('Error fetching messages:', error);
    });
  }

  // Send a message to the selected user
  sendMessage() {
    if (this.textMessage.trim()) {
      const message = {
        fromUserId: this.userDetails['v_user_id'],
        toUserId: this.selectedUser.userId,  // Use the default user ID for this chat
        text: this.textMessage,
        time: 'Just now',
      };
      this.saveNotes(this.textMessage)
      // Add the message to the messages array
      // this.messages.push(message);

      // Normally you would send the message to the backend here, but we will skip it

      // Clear the input field after sending the message
      this.textMessage = '';
      this.scrollToBottom(); // Scroll to the bottom after sending a message
    } else {
      this.showMessage('Please Enter Notes To continue', 'error');

    }
  }
  EnteredNotes = ''
  saveNotes(EnteredNotes) {
    const Notes = {
      invoice_no: this.selectedData['invoice_no'],
      notes: EnteredNotes,
      created_by: this.userDetails['v_user_id'],
    };
    this.service.sp_v1_ds_history_log_events_insert(this.selectedData['invoice_no'], this.userDetails['v_user_id'], 'Shipment Notes Added').toPromise()

    this.server.v1_sp_ds_pickup_order_note_insert(Notes).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no']);
          this.scrollToBottom(); // Scroll to the bottom after sending a message

          this.EnteredNotes = ''; // Clear input after success
        } else {
          this.showMessage('Failed to insert notes. Please try again.', 'error');
        }
      },
      (error) => {
        this.showMessage('An error occurred. Please check your connection.', 'error');

        // this.toastr.errorToastr('An error occurred. Please check your connection.');
        console.error('Error inserting notes:', error);
      }
    );
  }
  async handleFileInput(event) {
    await this.handleFiles(event.target.files, event);
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
  // Scroll to the bottom of the chat box
  scrollToBottom() {
    setTimeout(() => {
      this.scrollable.scrollTo({ bottom: 0 });
    });
  }
  isFirstMessageOfDay(index: number): boolean {
    if (index === 0) return true;
    const current = new Date(this.NotesReceivedForInvoice[index].created_time).toDateString();
    const prev = new Date(this.NotesReceivedForInvoice[index - 1].created_time).toDateString();
    return current !== prev;
  }
  markImportant(message: any, flag: any) {
    const newflag = flag == '1' ? '0' : '1';
    const textToCopy = message.notes || '';
    console.log(message)

    const payload = {
      notes_id: message.notes_id,
      sts: newflag,
      created_by: this.userDetails['v_user_id']
    }
    this.server.v1_sp_ds_pickup_order_note_update_label(payload).subscribe(r => {
      this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no'])

    })
    // Close the context menu if necessary
    // this.showContextMenu = false;

  }

  mentionPattern = /@\w+/g;
  mentions: { name: string, start: number, end: number }[] = [];
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      const cursorPos = (event.target as HTMLInputElement).selectionStart!;
      const mentionToDelete = this.mentions.find(m => cursorPos > m.start && cursorPos <= m.end);

      if (mentionToDelete) {
        // Prevent default backspace
        event.preventDefault();
        this.EnteredNotes =
          this.EnteredNotes.slice(0, mentionToDelete.start) +
          this.EnteredNotes.slice(mentionToDelete.end);

        // Move cursor
        setTimeout(() => {
          const input = event.target as HTMLInputElement;
          input.setSelectionRange(mentionToDelete.start, mentionToDelete.start);
        });

        // Remove from mentions list
        this.mentions = this.mentions.filter(m => m !== mentionToDelete);
      }
    }
  }
  allUsers: any[] = [];

  filteredUsers: any[] = [];
  showMentionList: boolean = false;

  onKeyUp(event: KeyboardEvent): void {
    const cursorPosition = (event.target as HTMLInputElement).selectionStart || 0;
    const value = this.EnteredNotes.slice(0, cursorPosition);
    const mentionMatch = value.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      this.filteredUsers = this.allUsers.filter(user =>
        user.employee_name.toLowerCase().startsWith(query)
      );
      this.showMentionList = this.filteredUsers.length > 0;
    } else {
      this.showMentionList = false;
    }
  }

  pastedImageFile: File | null = null;

  // Handle paste event for images
  handlePaste(event: ClipboardEvent) {
  const items = event.clipboardData?.items;
  if (!items) return;

  const files: File[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.indexOf('image') === 0) {
      const file = item.getAsFile();
      if (file) {
        files.push(file);
      }
    }
  }

  if (files.length > 0) {
    // ✅ Convert File[] to FileList using DataTransfer
    const dataTransfer = new DataTransfer();
    files.forEach(f => dataTransfer.items.add(f));
    const fileList = dataTransfer.files;

    this.pastedImageFile = fileList[0]; // optional: store first file
    this.handleFiles(fileList, ''); // ✅ now passing FileList
  }
}

  selectedIndex: number = 0;

  InsertNotes(EnteredNotes) {
    if (!this.EnteredNotes.trim()) {
      this.showMessage('Please Enter Notes To continue', 'error');
      return;
    }
    this.saveNotes(EnteredNotes)

  }
  selectUser(user: string) {
    const mentionText = `@${user}`;
    const cursorPos = this.EnteredNotes.lastIndexOf('@');

    this.EnteredNotes =
      this.EnteredNotes.substring(0, cursorPos) +
      mentionText + ' ' +
      this.EnteredNotes.substring(cursorPos + 1);

    this.showMentionList = false;
  }
 async changeReason(data){
    // ✅ Manually generate dropdown options from reasonForImageData
  const optionsHtml = this.reasonForImageData
    .map((a: any) => `<option value="${a.reason_id}">${a.reason}</option>`)
    .join('');
let isPdf =true;
let fileUrl = 'https://api.cargoforce.com/Origin_v2/api_php_booking/chatImages/' + data.notes.substring(5);
this.filteredUsers
  // Show Swal preview with dropdown
  const { value: selectedOption } = await Swal.fire({
    title: 'Select Option',
    html: `
      <div style="text-align:center; margin-bottom:1rem;">
        ${
          isPdf
            ? `<iframe src="${fileUrl}" width="100%" height="150px" style="border:none;"></iframe>`
            : `<img src="${fileUrl}" style="max-width:100%; max-height:150px;"/>`
        }
      </div>
      <select id="myDropdown" class="w-full form-select">
        <option value="">Select reason</option>
        ${optionsHtml}
      </select>
    `,
    showCloseButton: true,
    showCancelButton: false,
    showConfirmButton: true,
    allowOutsideClick: false,
    padding: '1.5rem',
    didOpen: () => {
      const htmlContainer = Swal.getHtmlContainer();
      if (htmlContainer) htmlContainer.classList.remove('swal2-html-container');
    },
    preConfirm: () => {
      const dropdown = document.getElementById('myDropdown') as HTMLSelectElement;
      if (!dropdown.value) {
        Swal.showValidationMessage('Please select a reason');
      }
      return dropdown.value;
    }
  });

  if (selectedOption) {
    const payload = {
      notes_id: data.notes_id,
      sts: data.label_status,
      created_by: this.userDetails['v_user_id'],
      reasonForMail:selectedOption
    }
    this.server.v1_sp_ds_pickup_order_note_update_label(payload).subscribe(r => {
      this.v1_sp_ds_pickup_order_note_get(this.selectedData['invoice_no'])

    })
    // Upload after selecting dropdown
  }
  }
}
