import { Component } from '@angular/core';
import { Contact } from './contact.model';

@Component({
  selector: 'app-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent {
  selectedContact: Contact | null = null; //holds the clicked contact to later pass it down to contact-detail component
}
