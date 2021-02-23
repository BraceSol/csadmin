import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { UppyAngularModule } from 'uppy-angular';

import { ProfessionalsSearchComponent } from './search/professionals-search.component';
import { ProfessionalsComponent } from './professionals.component';
import { ProfessionalsProfileComponent } from './profile-edit/professionals-profile.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { ProfessionsComponent } from './professions/professions.component';
import { SpecialtiesComponent } from './specialties/specialties.component';
import { ComplianceReportsComponent } from './profile-edit/compliance-reports/compliance-reports.component';
import { DocumentationComponent } from './profile-edit/documentation/documentation.component';
import { ResumeComponent } from './profile-edit/resume/resume.component';
import { JobsComponent } from './profile-edit/jobs/jobs.component';
import { SettingsComponent } from './profile-edit/settings/settings.component';
import { PlansBillingComponent } from './profile-edit/plans-billing/plans-billing.component';
import { UploadDocumentComponent } from './profile-edit/documentation/upload-document/upload-document.component';

import { ProfessionalsRoutingModule } from './professionals-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryBuilderModule } from 'angular2-query-builder';

import { EditProfessionModalComponent } from './professions/components/edit-profession-modal/edit-profession-modal.component';
import { EditSpecialtiesModalComponent } from './specialties/components/edit-specialties-modal/edit-specialties-modal.component';

import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfessionalsImportComponent } from './import/import.component';
import { AddProfessionalComponent } from './add-professional/add-professional.component';
import { DeleteProfessionModalComponent } from './professions/components/delete-profession-modal/delete-profession-modal.component';
import { DeleteProfessionsModalComponent } from './professions/components/delete-professions-modal/delete-professions-modal.component';
import { DeleteSpecialtyModalComponent } from './specialties/components/delete-specialty-modal/delete-specialty-modal.component';
import { DeleteSpecialtiesModalComponent } from './specialties/components/delete-specialties-modal/delete-specialties-modal.component';
import { ProfessionalsListingComponent } from './listing/listing.component';
import { WorkhistoryComponent } from './profile-edit/resume/workhistory/workhistory.component';
import { EducationComponent } from './profile-edit/resume/education/education.component';
import { LicensesComponent } from './profile-edit/resume/licenses/licenses.component';
import { CertificationsComponent } from './profile-edit/resume/certifications/certifications.component';
import { ReferencesComponent } from './profile-edit/resume/references/references.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditWorkComponent } from './profile-edit/resume/workhistory/edit-work/edit-work.component';
import { EditReferenceComponent } from './profile-edit/resume/references/edit-reference/edit-reference.component';
import { EditLicenseComponent } from './profile-edit/resume/licenses/edit-license/edit-license.component';
import { EditEducationComponent } from './profile-edit/resume/education/edit-education/edit-education.component';
import { EditCertComponent } from './profile-edit/resume/certifications/edit-cert/edit-cert.component';
import { EditReportComponent } from './profile-edit/compliance-reports/edit-report/edit-report.component'; 

@NgModule({
  declarations: [
    ProfessionalsComponent, 
    ProfessionalsSearchComponent, 
    ProfessionalsProfileComponent, 
    AdvancedSearchComponent, 
    ProfessionsComponent, 
    SpecialtiesComponent, 
    ComplianceReportsComponent, 
    DocumentationComponent, 
    ResumeComponent, 
    JobsComponent, 
    SettingsComponent, 
    PlansBillingComponent, 
    ProfessionalsImportComponent, 
    AddProfessionalComponent, 
    EditProfessionModalComponent, 
    DeleteProfessionModalComponent, 
    DeleteProfessionsModalComponent, 
    DeleteSpecialtyModalComponent, 
    DeleteSpecialtiesModalComponent, 
    EditSpecialtiesModalComponent, 
    ProfessionalsListingComponent, 
    WorkhistoryComponent, 
    EducationComponent, 
    LicensesComponent, 
    CertificationsComponent, 
    ReferencesComponent, UploadDocumentComponent, EditReportComponent, EditWorkComponent, EditReferenceComponent, EditLicenseComponent, EditEducationComponent, EditCertComponent
  ],
  imports: [
    CommonModule,
    ProfessionalsRoutingModule, 
    HttpClientModule, 
    InlineSVGModule, 
    Ng2SearchPipeModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxPaginationModule, 
    CRUDTableModule,
    NgbDatepickerModule, 
    NgbModalModule, 
    NgbModule,
    QueryBuilderModule, 
    UppyAngularModule
  ],
  entryComponents: [
    EditProfessionModalComponent, 
    DeleteProfessionModalComponent, 
    DeleteProfessionsModalComponent, 
    EditSpecialtiesModalComponent, 
    DeleteSpecialtyModalComponent, 
    DeleteSpecialtiesModalComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ProfessionalsModule { } 
