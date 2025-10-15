import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];

  //event emitter
  @Output() selectedContactEvent = new EventEmitter<Contact>();
  onSelected(contact: Contact) {
    this.selectedContactEvent.emit(contact);
  }

  constructor(private contactService: ContactService) {
    //modify the constructor() method to inject the ContactService into the ContactListComponent class.
  }

  ngOnInit() {
    this.contacts = this.contactService.getContacts();
  }
}
