import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { UppyAngularModule } from 'uppy-angular';
//Main Components
import { DocumentManagementComponent } from './document-management.component';
import { DoctypesComponent } from './doctypes/doctypes.component';
import { CategoriesComponent } from './categories/categories.component';

import { DocumentManagementRoutingModule } from './document-management-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryBuilderModule } from 'angular2-query-builder';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { EditDocumentCategoryModalComponent } from './categories/components/edit-category-modal/edit-category-modal.component';
import { DoctypeEditComponent } from './doctypes/doctype-edit/doctype-edit.component';
import { AttributesComponent } from './doctypes/doctype-edit/attributes/attributes.component';
import { RulesComponent } from './doctypes/doctype-edit/rules/rules.component';
import { DeleteDoctypeModalComponent } from './doctypes/components/delete-doctype-modal/delete-doctype-modal.component';
import { DeleteDoctypesModalComponent } from './doctypes/components/delete-doctypes-modal/delete-doctypes-modal.component';
import { DeleteCategoryModalComponent } from './categories/components/delete-category-modal/delete-category-modal.component';
import { DeleteCategoriesModalComponent } from './categories/components/delete-categories-modal/delete-categories-modal.component';
import { EditAttributeModalComponent } from './doctypes/doctype-edit/attributes/edit-attributes-modal/edit-attributes-modal.component';
import { EditRuleModalComponent } from './doctypes/doctype-edit/rules/edit-rules-modal/edit-rules-modal.component';
import { QueuesComponent } from './queues/queues.component';
import { EditQueueComponent } from './queues/edit-queue/edit-queue.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { DocumentSearchComponent } from './document-search/document-search.component';
import { AuditsComponent } from './audits/audits.component';
import { DocumentImportsComponent } from './imports/imports.component';
import { SlasComponent } from './slas/slas.component';
import { UploadsComponent } from './queues/uploads/uploads.component';
import { ProcessUploadComponent } from './queues/uploads/process-upload/process-upload.component'; // 
@NgModule({
  declarations: [
    DocumentManagementComponent, 
    DoctypesComponent, 
    CategoriesComponent, 
    EditDocumentCategoryModalComponent, 
    DeleteDoctypeModalComponent, 
    DeleteDoctypesModalComponent, 
    DeleteCategoryModalComponent, 
    DeleteCategoriesModalComponent, 
    DoctypeEditComponent, 
    AttributesComponent, 
    RulesComponent, 
    EditAttributeModalComponent, 
    EditRuleModalComponent, 
    QueuesComponent, 
    EditQueueComponent, 
    DocumentSearchComponent, 
    AuditsComponent, 
    DocumentImportsComponent, SlasComponent, UploadsComponent, ProcessUploadComponent
  ],
  imports: [
    CommonModule, 
    HttpClientModule,
    DocumentManagementRoutingModule, 
    FormsModule,
    ReactiveFormsModule, 
    InlineSVGModule,
    CRUDTableModule,
    NgbDatepickerModule, 
    NgbModalModule, 
    QueryBuilderModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    Ng2SearchPipeModule,
    NgxPaginationModule, 
    NgbModule, 
    UppyAngularModule
  ],
  entryComponents: [
    EditDocumentCategoryModalComponent, 
    DeleteDoctypeModalComponent, 
    DeleteDoctypesModalComponent, 
    DeleteCategoryModalComponent, 
    DeleteCategoriesModalComponent
  ]
})
export class DocumentManagementModule { }
