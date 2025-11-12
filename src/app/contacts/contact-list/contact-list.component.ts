import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  subscription!: Subscription;
  term: string = '';

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.contactService.getContacts();
    this.contactService.contactChangedEvent.subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    });
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
  }
  onDrop(event: CdkDragDrop<Contact[]>) {
    moveItemInArray(this.contacts, event.previousIndex, event.currentIndex);
  }
  search(value: string) {
    this.term = value;
  }
}
