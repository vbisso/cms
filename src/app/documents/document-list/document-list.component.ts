import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent {
  documents: Document[] = [
    new Document(
      '1',
      'Document 1',
      'Description 1',
      'http://www.google.com',
      null
    ),
    new Document(
      '2',
      'Document 2',
      'Description 2',
      'http://www.google.com',
      null
    ),
    new Document(
      '3',
      'Document 3',
      'Description 3',
      'http://www.google.com',
      null
    ),
    new Document(
      '4',
      'Document 4',
      'Description 4',
      'http://www.google.com',
      null
    ),
  ];
  //event emitter
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  onSelected(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
