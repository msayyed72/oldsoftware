import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  private logSubject = new Subject<any>();

  private readonly URL = 'wss://api.cargoforce.com:8080'; // Use wss for secure WebSocket

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket(this.URL);
    this.socket.binaryType = 'blob';

    this.socket.onopen = () => {
      console.log('✅ WebSocket connected.');
    };

    this.socket.onmessage = (event) => {
            this.logSubject.next(event.data); // Emit the log message

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          console.log('📩 Message received:', json);
          this.messageSubject.next(json); // Push to observable stream
        } catch (e) {
          console.error('❌ Failed to parse message:', reader.result);
        }
      };

      if (event.data instanceof Blob) {
        reader.readAsText(event.data);
      } else {
        try {
          const json = JSON.parse(event.data);
          this.messageSubject.next(json);
        } catch (e) {
          console.error('❌ JSON parse error:', event.data);
        }
      }
    };

    this.socket.onclose = () => {
      console.warn('🔌 WebSocket closed. Trying again in 5s...');
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      console.error('⚠️ WebSocket error:', error);
    };
  }

  send(data: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('⚠️ Cannot send: WebSocket not open');
    }
  }

  // Get all messages as Observable
  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  // Get messages by specific source, but skip if source is 'notes'
onMessageBySource(source: string): Observable<any> {
  if (source === 'notes') {
    return of(); // returns an empty observable
  }

  return this.messageSubject.asObservable().pipe(
    filter((msg) => {
      // console.log('Filtering message:', msg);  // Debugging line
      return msg && msg.source === source;
    })
  );
}

}
