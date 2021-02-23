import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentManagementComponent } from './document-management.component';
import { DoctypesComponent } from './doctypes/doctypes.component';
import { CategoriesComponent } from './categories/categories.component';
import { QueuesComponent } from './queues/queues.component';
import { UploadsComponent } from './queues/uploads/uploads.component';
import { DocumentSearchComponent } from './document-search/document-search.component';
import { AuditsComponent } from './audits/audits.component';
import { DocumentImportsComponent } from './imports/imports.component';
import { SlasComponent } from './slas/slas.component';
import { DoctypeEditComponent } from './doctypes/doctype-edit/doctype-edit.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentManagementComponent,
    children: [
      {
        path: 'doctypes',
        component: DoctypesComponent,
      },
      {
        path: 'search',
        component: DocumentSearchComponent,
      },
      {
        path: 'audits',
        component: AuditsComponent,
      },
      {
        path: 'slas',
        component: SlasComponent,
      },
      {
        path: 'imports',
        component: DocumentImportsComponent,
      },
      {
        path: 'queues',
        component: QueuesComponent,
      },
      {
        path: 'queues/:view',
        component: QueuesComponent,
      },
      {
        path: 'uploads/listing/:id',
        component: UploadsComponent,
      },
      {
        path: 'doctype/add',
        component: DoctypeEditComponent
      },
      {
        path: 'doctype/edit',
        component: DoctypeEditComponent
      },
      {
        path: 'doctype/edit/:id',
        component: DoctypeEditComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      { path: '', redirectTo: 'doctypes', pathMatch: 'full' },
      { path: '**', redirectTo: 'doctypes', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentManagementRoutingModule {}
