import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent {
  documents: Document[] = [];

  subscription!: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    // this.documents = this.documentService.getDocuments();
    this.documentService.getDocuments();

    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (documentsList: Document[]) => {
        this.documents = documentsList;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
