import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { EmployersComponent } from './employers.component';
import { EmployersSearchComponent } from './search/search.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { AddEmployerComponent } from './add-employer/add-employer.component';
import { EmployerListingComponent } from './listing/listing.component';
import { EmployerProfileEditComponent } from './profile-edit/profile-edit.component';

import { EmployersRoutingModule } from './employers-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryBuilderModule } from 'angular2-query-builder';

import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditLocationModalComponent } from './profile-edit/locations/edit-location/edit-location.component';
import { LocationsComponent } from './profile-edit/locations/locations.component';
import { DepartmentsComponent } from './profile-edit/departments/departments.component';
import { EmployerComplianceComponent } from './profile-edit/compliance/compliance.component';
import { EmployeesComponent } from './profile-edit/employees/employees.component';
import { ContractsComponent } from './profile-edit/contracts/contracts.component';
import { JobsComponent } from './profile-edit/jobs/jobs.component';
import { UsersComponent } from './profile-edit/users/users.component';
import { EmployerDoctypesComponent } from './profile-edit/compliance/doctypes/doctypes.component';
import { EmployerRulesComponent } from './profile-edit/compliance/rules/rules.component';
import { EmployerQueuesComponent } from './profile-edit/compliance/queues/queues.component';
import { EmployerAuditsComponent } from './profile-edit/compliance/audits/audits.component';
import { EditDepartmentComponent } from './profile-edit/departments/edit-department/edit-department.component';
import { EditContractComponent } from './profile-edit/contracts/edit-contract/edit-contract.component';
import { EditEmployeeComponent } from './profile-edit/employees/edit-employee/edit-employee.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { EditQueueComponent } from './profile-edit/compliance/queues/edit-queue/edit-queue.component';
import { EditAuditComponent } from './profile-edit/compliance/audits/edit-audit/edit-audit.component';
import { AddDoctypesComponent } from './profile-edit/compliance/doctypes/add-doctypes/add-doctypes.component'; // 
@NgModule({
  declarations: [
    EmployersComponent, 
    EmployersSearchComponent, 
    AdvancedSearchComponent, 
    AddEmployerComponent, 
    EmployerListingComponent, 
    EmployerProfileEditComponent, 
    LocationsComponent, 
    DepartmentsComponent, 
    EmployerComplianceComponent, 
    EmployeesComponent, 
    ContractsComponent, 
    JobsComponent, 
    UsersComponent, 
    EmployerDoctypesComponent, 
    EmployerRulesComponent, 
    EmployerQueuesComponent, 
    EmployerAuditsComponent, 
    EditLocationModalComponent, EditDepartmentComponent, EditContractComponent, EditEmployeeComponent, EditQueueComponent, EditAuditComponent, AddDoctypesComponent
  ],
  imports: [
    CommonModule,
    EmployersRoutingModule, 
    HttpClientModule, 
    InlineSVGModule, 
    FormsModule, 
    Ng2SearchPipeModule,
    NgxPaginationModule,
    ReactiveFormsModule, 
    CRUDTableModule,
    NgbDatepickerModule, 
    NgbModalModule, 
    NgbModule, 
    QueryBuilderModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
  ],
  entryComponents: [

  ]
})
export class EmployersModule { }
