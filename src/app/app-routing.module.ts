import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents/documents.component';
import { MessagesComponent } from './messages/messages.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';
import { DocumentDetailComponent } from './documents/document-detail/document-detail.component';

const appRoutes: Routes = [
  { path: ' ', redirectTo: '/documents', pathMatch: 'full' },
  {
    path: 'documents',
    component: DocumentsComponent,
    children: [
      { path: 'new', component: DocumentEditComponent },
      { path: ':id', component: DocumentDetailComponent },
      { path: ':id/edit', component: DocumentEditComponent },
    ],
  },
  { path: 'messages', component: MessagesComponent },
  { path: 'contacts', component: ContactsComponent },
];
// Use the @NgModule annotation to create a new module. Import the RouterModule module and define the root route in the imports property. Set the value of the exports property to export the RouterModule.
// Define the AppRoutingModule class and export it.
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
