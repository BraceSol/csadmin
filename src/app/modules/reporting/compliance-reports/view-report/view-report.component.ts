import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ComplianceReport } from '../../_models/reporting.model';
import { ComplianceReportsService } from '../../_services/compliance-reports.service';

const EMPTY_PROF: ComplianceReport = {
    id: undefined,
    professionId: '', 
    expertiseId: '', 
    departmentId: '', 
    locationId: '', 
    startDate: '', 
    endDate: '', 
    initialScore: 0,
    currentScore: 0,
    missingDocs: 0,
    totalDocs: 0,
    expiringDocs: 0,
    statusCode: 0,
    createdBy: '', 
    updatedBy: '', 
    createdAt: '', 
    updatedAt: '', 
    isActive: 0,
    employerId: '', 
    userId: '', 
    complianceReportId: '', 
    complianceReport: null,
    adminId: ''
}

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html'
})
export class ViewReportComponent implements OnInit, OnDestroy {
  id: string;
  complianceReportProfile: any={};
  previous: any;
  endpoint:any;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    APPROVED_DOCS: 0,
    MISSING_TAB: 1,
    EXPIRING_TAB: 2,
    ACTIVITY_TAB: 3
  };
  activeTabId = this.tabs.APPROVED_DOCS;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private crService: ComplianceReportsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log(this.id);
    this.isLoading$ = this.crService.isLoading$;
    this.loadUser();
    this.loadDocs();
  }

  loadDocs() {
    // const sb = this.route.paramMap.pipe(
    //   switchMap(params => {
    //     // get id from URL
    //     this.id = params.get('id');
    //     // console.log(".........................",this.id)
    //     if (this.id || this.id != '') {
    //       const userId =localStorage.getItem('userId')
    //       console.log(".........................a",this.id)
    //       this.endpoint=`complianceReportById?adminId=${userId}&complianceReportId=${this.id}`
    //       console.log(this.endpoint);
    //       return this.crService.getItemById(this.endpoint);
    //     }
    //     return of(EMPTY_PROF);
    //   }),
    //   catchError((errorMessage) => {
    //     this.errorMessage = errorMessage;
    //     return of(undefined);
    //   }),
    // ).subscribe((res: any) => {
    //   if (!res) {
    //     this.router.navigate(['/reporting/compliance'], { relativeTo: this.route });
    //   }
    //   this.complianceReportProfile = res.report;
    //   console.log(this.complianceReportProfile);
    //   this.previous = Object.assign({}, res);
    // });
    // this.subscriptions.push(sb);
  }

  loadUser() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = params.get('id');
        // console.log(".........................",this.id)
        if (this.id || this.id != '') {
          const userId =localStorage.getItem('userId')
          console.log(".........................a",this.id)
          this.endpoint=`complianceReportById?adminId=${userId}&complianceReportId=${this.id}`
          console.log(this.endpoint);
          return this.crService.getItemById(this.endpoint);
        }
        return of(EMPTY_PROF);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: any) => {
      if (!res) {
        this.router.navigate(['/reporting/compliance'], { relativeTo: this.route });
      }
      this.complianceReportProfile = res.report;
      console.log(this.complianceReportProfile);
      this.previous = Object.assign({}, res);
    });
    this.subscriptions.push(sb);
  }

  reset() {
    if (!this.previous) {
      return;
    }
    this.complianceReportProfile = Object.assign({}, this.previous);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
