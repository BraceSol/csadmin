import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-employer-compliance',
  templateUrl: './compliance.component.html'
})
export class EmployerComplianceComponent implements OnInit {
  @Input() employerProfileId: string;

  id: string;
  employerProfile: any;
  previous: any;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    DOCTYPES_TAB: 1,
    RULES_TAB: 2, 
    QUEUES_TAB: 3, 
    AUDITS_TAB: 4
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Attributes | 2 => Rules | 3 => Example Docs | 4 => References

  constructor() { }

  ngOnInit(): void {
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

}
