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

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.contacts = this.contactService.getContacts();
    this.contactService.contactChangedEvent.subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    });
  }
}
