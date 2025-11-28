import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId!: number;

  documentListChangedEvent = new Subject<Document[]>();

  documentSelectedEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();

  constructor(private http: HttpClient) {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocument(id: string): Document | null {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }

    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      let currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    newDocument.id = '';

    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .post<{ message: string; document: Document }>(
        'http://localhost:3000/documents',
        newDocument,
        { headers: header }
      )
      .subscribe((responseData) => {
        this.documents.push(responseData.document);
        this.sortAndSend();
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    // find index of original document
    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }

    // keep the same IDs
    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update on the database
    this.http
      .put(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe({
        next: () => {
          // update the local list
          this.documents[pos] = newDocument;
          this.sortAndSend();
        },
        error: (error) => {
          console.error('Error updating document:', error);
        },
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === document.id);
    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe({
        next: () => {
          // remove from local array
          this.documents.splice(pos, 1);
          this.sortAndSend();
        },
        error: (err) => {
          console.error('Error deleting document:', err);
        },
      });
  }

  getDocuments() {
    this.http.get<Document[]>('http://localhost:3000/documents').subscribe(
      //called when HTTP Get request is successful
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();

        this.documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  private sortAndSend() {
    this.documents.sort((a, b) =>
      a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    );
    this.documentListChangedEvent.next(this.documents.slice());
  }

  //   storeDocuments() {
  //     const documentJSON = JSON.stringify(this.documents);
  //     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //     this.http
  //       .put(
  //         'https://vbcms-31961-default-rtdb.firebaseio.com/documents.json',
  //         documentJSON,
  //         {
  //           headers,
  //         }
  //       )
  //       .subscribe(() => {
  //         this.documentListChangedEvent.next(this.documents.slice()); //cloned array
  //       });
  //   }
}
