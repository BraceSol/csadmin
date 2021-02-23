import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Professional } from '../_models/professional.model';
import { ProfessionalsService } from '../_services';

const EMPTY_PROF: Professional = {
  id: undefined,
  professionId: '',
  specialtyId: '',
  prefix: '',
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  city: '',
  email:'',
  state: '',
  createdOn: '',
  createdBy: '',
  updatedOn: '',
  updatedBy: ''
}

@Component({
  selector: 'app-professionals-profile',
  templateUrl: './professionals-profile.component.html'
})
export class ProfessionalsProfileComponent implements OnInit, OnDestroy {
  id: string;
  professionalProfile: any={};
  previous: any;
  endpoint:any;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    DOCUMENTS_TAB: 1,
    COMPLIANCE_TAB: 2,
    RESUME_TAB: 3,
    JOBS_TAB: 4,
    SETTINGS_TAB: 5,
    BILLING_TAB: 6
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Attributes | 2 => Rules | 3 => Example Docs | 4 => References
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private profService: ProfessionalsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log("init porfessionals");
    this.isLoading$ = this.profService.isLoading$;
    this.loadUser();
  }

  loadForm() {
    if (!this.professionalProfile) {
      console.log("noprofile");
      return;
    }
    console.log("found profile");
    this.formGroup = this.fb.group({
      firstName: [this.professionalProfile.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      // middleName: [this.professionalProfile.middleName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: [this.professionalProfile.lastName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])],
      professionId: [this.professionalProfile.professionId],
      specialtyId: [this.professionalProfile.specialtyId],
      legalName: [this.professionalProfile.firstName + ' ' + this.professionalProfile.lastName],
      dob: [''],
      ssn: [''],
      phoneNumber: [''],
      email: [this.professionalProfile.email],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      postalCode: [''],
    });
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
          this.endpoint=`professionalProfile?adminId=${userId}&userId=${this.id}`
          return this.profService.getItemById(this.endpoint);
        }
        return of(EMPTY_PROF);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: any) => {
      if (!res) {
        this.router.navigate(['/professionals/listing'], { relativeTo: this.route });
      }

      console.log(".........................b",res.profile.user)
      this.professionalProfile = res.profile.user;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.loadForm();
    this.subscriptions.push(sb);
  }

  reset() {
    if (!this.previous) {
      return;
    }

    this.professionalProfile = Object.assign({}, this.previous);
    this.loadForm();
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.professionalProfile = Object.assign(this.professionalProfile, formValues);
    if (this.id) {
      console.log("edit====",this.id)
      this.edit();
    } else {
      console.log("create====",this.id)
      this.create();
    }
  }

  edit() {
    const adminId =localStorage.getItem('userId')
    this.professionalProfile=this.professionalProfile.adminId;
    this.professionalProfile=this.professionalProfile.this.id;
    this.professionalProfile=this.professionalProfile.firstName;
    this.professionalProfile=this.professionalProfile.lastName;
    this.professionalProfile=this.professionalProfile.professionId;
    this.endpoint=`updateProfessional`
    const sbUpdate = this.profService.update(this.endpoint,this.professionalProfile).pipe(
      tap(() => this.router.navigate(['/professionals/listing'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.professionalProfile);
      })
    ).subscribe(res => this.professionalProfile = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.profService.create(this.professionalProfile).pipe(
      tap(() => this.router.navigate(['/professionals/listing'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.professionalProfile);
      })
    ).subscribe(res => this.professionalProfile = res as DocumentType);
    this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
