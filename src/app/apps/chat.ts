import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { NgScrollbar } from 'ngx-scrollbar';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { NewApiCloudService } from '../cfServices/new-api-cloud.service'; // Your custom service

@Component({
  moduleId: module.id,
  templateUrl: './chat.html',
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ])
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollable') scrollable!: NgScrollbar;
  private socket: any;
  private serverUrl: string = 'https://api.cargoforce.com:8081';  // Node.js Socket.io server URL
  userDetails: any;

  isShowUserChat = false;
  isShowChatMenu = false;
  selectedUser: any = null;
  textMessage: string = '';
  contactList: any[] = [];
  loginUser = {
    id: 1,
    name: 'Alon Smith',
    path: 'profile-34.jpeg',
    designation: 'Software Developer',
  };

  constructor(public server: NewApiCloudService, private http: HttpClient) {
    // Retrieve logged-in user's details from session storage
    this.userDetails = JSON.parse(localStorage.getItem('log_data') || '{}');
    this.loginUser.name = this.userDetails['v_employee_name']
    this.loginUser.id = this.userDetails['v_user_id']
    
  }

  ngOnInit(): void {
    // Establish connection with Socket.io server
    this.socket = io(this.serverUrl);

    // Listen for incoming messages in real-time
    this.socket.on('new-message', (data: any) => {
      console.log('New message received:', data);
      console.log('New message received:', data);
      if(String(data.toUserId).includes(',') && String(data.toUserId).includes(this.userDetails['v_user_id'])){
        data.toUserId == this.userDetails['v_user_id'];
      this.handleNewMessage1(data);  // Handle the received message

      }else{
      this.handleNewMessage(data);  // Handle the received message

      }
    });

    // Fetch contacts when the component initializes
    this.getContacts();
  }

  ngOnDestroy(): void {
    // Disconnect from Socket.io when the component is destroyed
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Fetch contacts from API
  getContacts() {
    const employeeId = this.userDetails['v_user_id'];  // Using dynamic user ID
    const apiUrl = `https://api.cargoforce.com:8081/contacts?p_chat_employee_id=${employeeId}`;

    this.http.get(apiUrl).subscribe((data: any) => {
      this.contactList = data || [];  // Assuming the API returns an array of contacts in the 'contacts' field
    }, error => {
      console.error('Error fetching contacts:', error);
    });
  }

  // Handle user selection to chat with
selectUser(user: any) {
  this.selectedUser = user;
  this.isShowUserChat = true;
  this.scrollToBottom();  // Scroll to the bottom when a user is selected
  this.isShowChatMenu = false;

  // Fetch chat history when user is selected
  this.fetchMessages(user.userId);
}
fetchMessages(userId: number) {
  const apiUrl = `https://api.cargoforce.com:8081/messages?p_message_room_id=${userId}&p_user_id=${this.userDetails['v_user_id']}`;

  this.http.get(apiUrl).subscribe((data: any[]) => {
    if (data && data.length) {
      // Push each message from the API response into the selectedUser's message array
      this.selectedUser.messages = data.map(message => ({
        fromUserId:Number(message.fromUserId) ,
        toUserId: Number(message.toUserId),
        text: message.TEXT,
        time: new Date(message.TIME).toLocaleTimeString(),  // Format the time if needed
      }));

      // Scroll to the bottom after loading the messages
      this.scrollToBottom();
    }
  }, error => {
    console.error('Error fetching messages:', error);
  });
}


  // Send a message to the selected user
  sendMessage() {
    if (this.textMessage.trim()) {
      const user: any = this.contactList.find((d: { userId: any }) => d.userId === this.selectedUser.userId);

      // Prepare the message object
      const message = {
        fromUserId: this.userDetails['v_user_id'],
        toUserId: this.selectedUser.other_employee_id ,  // Assuming 0 is the logged-in user
        text: this.textMessage,
        time: 'Just now',
        type: user.type_chat,
      };

      user.messages.push(message);  // Add message to the local contact list

      // Emit the message to the server using Socket.io
      this.socket.emit('send-message', {
        p_chat_room_id: user.userId,  // Example chat room ID, replace with dynamic value
        fromUserId: this.userDetails['v_user_id'],  // Dynamic user ID
        toUserId: user.other_employee_id,  // Other employee's ID (dynamic)
        text: this.textMessage,
                type: user.type_chat,

      });

      // Clear the input field after sending the message
      this.textMessage = '';
      this.scrollToBottom();  // Scroll to the bottom after sending a message
    }
  }

  // Handle new incoming messages from other clients
handleNewMessage(data: any) {
  // Find the user by 'userId' (receiver's ID)
  const user = this.contactList.find((d: any) => (d.other_employee_id == data.fromUserId && d.userId == data.p_chat_room_id ));

  // If user is found, push the message
  if (user) {
    user.messages.push({
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      text: data.text,
      time: new Date().toLocaleTimeString(),
    });
    this.scrollToBottom()
  } else {
    console.error('User not found for received message:', data);
  }
}

  handleNewMessage1(data: any) {
  // Find the user by 'userId' (receiver's ID)
  const user = this.contactList.find((d: any) => (d.other_employee_id == data.fromUserId && d.userId == data.p_chat_room_id ));

  // If user is found, push the message
  if (user) {
    user.messages.push({
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      text: data.text,
      time: new Date().toLocaleTimeString(),
    });
    this.scrollToBottom()
  } else {
    console.error('User not found for received message:', data);
  }
}

  // Scroll to the bottom of the chat box (for new messages)
  scrollToBottom() {
    setTimeout(() => {
      this.scrollable.scrollTo({ bottom: 0 });
    });
  }

  // Searching through contacts
  searchUser = '';
  searchUsers() {
    return this.contactList.filter((d: { name: string }) => {
      return d.name.toLowerCase().includes(this.searchUser.toLowerCase());
    });
  }
}
