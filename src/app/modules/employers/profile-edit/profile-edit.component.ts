import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Employer } from '../_models';
import { EmployersService } from '../_services/employers.service';

const EMPTY_EMP: Employer = {
  id: undefined,
  employerTypeId: '',
  adminId:'',
  employerId:'',
  employerName: '',
  cmsCertificationId: '',
  phoneNumber: '',
  website: '',
  facilityType: '',
  typeOfControl: '',
  traumaLevel: '',
  totalBeds: 0,
  totalEmployees: 0,
  travelEmployees: 0,
  perdiemEmployees: 0,
  teachingFacility: 0,
  joinCommissionStatus: '',
  jointCommissionDate: '',
  addressLine1: '',
  addressLine2: '',
  createdBy: '',
  updatedBy: '',
  isActive: 1,
  addressLine3: '',
  city: '',
  state: '',
  postalCode: ''
}

@Component({
  selector: 'app-employer-profile-edit',
  templateUrl: './profile-edit.component.html'
})
export class EmployerProfileEditComponent implements OnInit, OnDestroy {
  id: string;
  employerProfile: any;

  previous: any;
  endpoint:any;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    LOCATIONS_TAB: 1,
    DEPARTMENTS_TAB: 2, 
    COMPLIANCE_TAB: 3, 
    EMPLOYEE_TAB: 4, 
    CONTRACTS_TAB: 5, 
    JOBS_TAB: 6, 
    USERS_TAB: 7
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Attributes | 2 => Rules | 3 => Example Docs | 4 => References
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private empService: EmployersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.empService.isLoading$;
    this.loadUser();
  }

  loadUser() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = params.get('id');
        console.log(".........................",this.id)
        if (this.id || this.id != '') {


  let userId =localStorage.getItem('userId');
  this.endpoint=`getEmployerById?adminId=${userId}&employerId=${this.id}`
          console.log(".........................",this.id)
          return this.empService.getItemById(this.endpoint);
        }
        return of(EMPTY_EMP);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: any) => {
      if (!res) {
        this.router.navigate(['/employers/listing'], { relativeTo: this.route });
      }

      console.log(".........................res",res)
      this.employerProfile = res.employer;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.employerProfile) {
      return;
    }

    this.formGroup = this.fb.group({
      employerName: [this.employerProfile.employerName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      addressLine1: [this.employerProfile.addressLine1, Validators.compose([])],
      addressLine2: [this.employerProfile.addressLine2, Validators.compose([])],
      addressLine3: [this.employerProfile.addressLine3, Validators.compose([])],
      city: [this.employerProfile.city, Validators.compose([])],
      state: [this.employerProfile.state, Validators.compose([])],
      postalCode: [this.employerProfile.postalCode, Validators.compose([])], 
      cmsCertificationId: [this.employerProfile.cmsCertificationId, Validators.compose([])], 
      phoneNumber: [this.employerProfile.phoneNumber, Validators.compose([])], 
      website: [this.employerProfile.website, Validators.compose([])], 
      facilityType: [this.employerProfile.facilityType, Validators.compose([])], 
      typeOfControl: [this.employerProfile.typeOfControl, Validators.compose([])], 
      traumaLevel: [this.employerProfile.traumaLevel, Validators.compose([])], 
      totalBeds: [this.employerProfile.totalBeds, Validators.compose([])], 
      totalEmployees: [this.employerProfile.totalEmployees, Validators.compose([])], 
      travelEmployees: [this.employerProfile.travelEmployees, Validators.compose([])], 
      perdiemEmployees: [this.employerProfile.perdiemEmployees, Validators.compose([])], 
      teachingFacility: [this.employerProfile.teachingFacility, Validators.compose([])], 
      joinCommissionStatus: [this.employerProfile.joinCommissionStatus, Validators.compose([])], 
    });
  }

  reset() {
    if (!this.previous) {
      return;
    }

    this.employerProfile = Object.assign({}, this.previous);
    this.loadForm();
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.employerProfile = Object.assign(this.employerProfile, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {

  let userId =localStorage.getItem('userId');
  this.employerProfile.adminId=userId;
  this.employerProfile.employerId=this.id;
    this.endpoint=`updateEmployer`
    const sbUpdate = this.empService.update(this.endpoint,this.employerProfile).pipe(
      tap(() => this.router.navigate(['/employers/listing'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.employerProfile);
      })
    ).subscribe(res => this.employerProfile = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.empService.create(this.employerProfile).pipe(
      tap(() => this.router.navigate(['/employers/listing'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.employerProfile);
      })
    ).subscribe(res => this.employerProfile = res as DocumentType);
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

