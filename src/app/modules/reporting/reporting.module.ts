import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { ReportingComponent } from './reporting.component';
import { ComplianceReportsComponent } from './compliance-reports/compliance-reports.component';
import { EditReportComponent } from './compliance-reports/edit-report/edit-report.component';

import { ReportingRoutingModule } from './reporting-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryBuilderModule } from 'angular2-query-builder';



import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewReportComponent } from './compliance-reports/view-report/view-report.component';

@NgModule({
  declarations: [
    ReportingComponent, 
    ComplianceReportsComponent, 
    EditReportComponent, 
    ViewReportComponent
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule, 
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
    QueryBuilderModule
  ],
  entryComponents: [
    
  ]
})
export class ReportingModule { }
