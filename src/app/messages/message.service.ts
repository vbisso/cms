import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId!: number;

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      let currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  // getMessages() {
  //   return this.messages.slice();
  // }

  getMessage(id: string): Message | null {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }

  getMessages() {
    this.http
      .get<Message[]>(
        'https://vbcms-31961-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe(
        //called when HTTP Get request is successful
        (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();

          this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
  }

  storeMessages() {
    const messageJSON = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(
        'https://vbcms-31961-default-rtdb.firebaseio.com/messages.json',
        messageJSON,
        {
          headers,
        }
      )
      .subscribe(() => {
        this.messageChangedEvent.next(this.messages.slice()); //cloned array
      });
  }
}
