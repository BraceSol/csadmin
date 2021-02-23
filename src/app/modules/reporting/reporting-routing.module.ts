import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportingComponent } from './reporting.component';
import { ComplianceReportsComponent } from './compliance-reports/compliance-reports.component';
import { ViewReportComponent } from './compliance-reports/view-report/view-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    children: [
      {
        path: 'compliance',
        component: ComplianceReportsComponent,
      },
      {
        path: 'compliance/:id',
        component: ViewReportComponent,
      },
      { path: '', redirectTo: 'compliance', pathMatch: 'full' },
      { path: '**', redirectTo: 'compliance', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
