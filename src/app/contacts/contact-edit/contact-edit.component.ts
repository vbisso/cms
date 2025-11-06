import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContactService } from '../contact.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact | null = null;
  contact: Contact = new Contact('', '', '', '', '', null);
  groupContacts: Contact[] = [];
  allContacts: Contact[] = [];
  editMode: boolean = false;
  id: string = '';
  dropError: string | null = null;
  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (!this.id) {
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(this.id);
      if (!this.originalContact) {
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      if (this.contact.group && this.contact.group.length > 0) {
        this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
      }
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      value.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact!, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['contacts']);
  }

  onCancel() {
    this.router.navigate(['contacts']);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  onDrop(event: CdkDragDrop<Contact[]>) {
    this.dropError = null;
    const selectedContact = event.previousContainer.data[event.previousIndex];

    if (this.isInvalidContact(selectedContact)) {
      this.dropError =
        'Contact cannot be added. It is already in group or is the current contact.';

      return;
    }

    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onRemoveItem(index: number) {
    this.groupContacts.splice(index, 1);
  }
}
