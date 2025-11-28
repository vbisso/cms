import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];

  maxContactId!: number;

  contactListChangedEvent = new Subject<Contact[]>();

  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();

  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      let currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  // getContacts(): Contact[] {
  //   return this.contacts.slice();
  // }

  getContact(id: string): Contact | null {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  // deleteContact(contact: Contact) {
  //   if (!contact) return;

  //   const pos = this.contacts.indexOf(contact);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.contacts.splice(pos, 1);
  //   this.contactChangedEvent.emit(this.contacts.slice());
  // }
  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    newContact.id = '';
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .post<{ message: string; contact: Contact }>(
        'http://localhost:3000/contacts',
        newContact,
        { headers: header }
      )
      .subscribe((responseData) => {
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    // find index of original contact
    const pos = this.contacts.findIndex((d) => d.id === originalContact.id);
    if (pos < 0) {
      return;
    }

    // keep the same ID
    newContact.id = originalContact.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update on the database
    this.http
      .put('http://localhost:3000/contacts/' + originalContact.id, newContact, {
        headers: headers,
      })
      .subscribe({
        next: () => {
          // update the local list
          this.contacts[pos] = newContact;
          this.sortAndSend();
        },
      });
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.findIndex((d) => d.id === contact.id);
    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id).subscribe({
      next: () => {
        // remove from local array
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      },
    });
  }

  getContacts() {
    this.http
      .get<{ message: string; contacts: Contact[] }>(
        'http://localhost:3000/contacts'
      )
      .subscribe(
        (responseData) => {
          this.contacts = responseData.contacts;
          this.maxContactId = this.getMaxId();

          this.contacts.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });

          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.error('Error', error);
        }
      );
  }

  storeContacts() {
    const contactJSON = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(
        'https://vbcms-31961-default-rtdb.firebaseio.com/contacts.json',
        contactJSON,
        { headers }
      )
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }
  private sortAndSend() {
    this.contacts.sort((a, b) =>
      a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    );
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
