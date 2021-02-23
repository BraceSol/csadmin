import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html'
})
export class ResumeComponent implements OnInit {
  @Input() professionalProfileId: string;

  id: string;
  professionalProfile: any;
  previous: any;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    WORKHISTORY_TAB: 1,
    EDUCATION_TAB: 2, 
    LICENSES_TAB: 3, 
    CERTS_TAB: 4, 
    REFERENCES_TAB: 5
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Attributes | 2 => Rules | 3 => Example Docs | 4 => References

  constructor() { }

  ngOnInit(): void {
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

}
