import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CsUser } from '../../_models/csuser.model';
import { CsUserService } from '../../_services/csuser.service';

// import { CsUserService } from '../../_services/csuser.service';

const EMPTY_USER: CsUser = {
  id: undefined,
  email: '', 
  password: '', 
  fullName:'',
  prefix: '', 
  firstName: '', 
  middleName: '', 
  lastName: '', 
  suffix: '', 
  twoFactorEnabled: 0, 
  referralCode: '', 
  resetToken: '', 
  pinCode: 0,  
  statusCode: 1,  
  googleLoginId: '', 
  linkedinLoginId: '', 
  facebookLoginId: '', 
  isActive: '', 
  createdAt: '', 
  updatedAt: '', 
  professionId: '', 
  specialtyIds: null, 
  createdBy: '', 
  updatedBy: ''
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit, OnDestroy {
  id: string;
  curruser: any;
  previous: any;
  endpoint:string;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    PROFILES_TAB: 1,
    DEVICES_TAB: 2, 
    BILLING_TAB: 3, 
    ACTIVITY_TAB: 4
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Roles | 2 => Devices | 3 => Billing
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private usersService: CsUserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.loadUser();
  }

  loadUser() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = params.get('id');
        if (this.id || this.id != '') {
          
          console.log(".........................",this.id)
          this.endpoint=`getAdmin?adminId=${this.id}`
          console.log(".........................",this.id)
          return this.usersService.getItemById(this.endpoint);
        }
        return of(EMPTY_USER);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: any) => {
      if (!res) {
        this.router.navigate(['/admin/users'], { relativeTo: this.route });
      }

      console.log(".........................",res)
      this.curruser = res.user;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.curruser) {
      return;
    }

    this.formGroup = this.fb.group({
      firstName: [this.curruser.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: [this.curruser.lastName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    });
  }

  reset() {
    if (!this.previous) {
      return;
    }

    this.curruser = Object.assign({}, this.previous);
    this.loadForm();
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.curruser = Object.assign(this.curruser, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    
    this.curruser.adminId =localStorage.getItem('userId')
    this.curruser.userId=this.curruser.id
    this.curruser.fullName=`${this.curruser.firstName} ${this.curruser.lastName}`
    console.log(this.curruser)
    this.endpoint=`updateNonProfessionalUser`
    const sbUpdate = this.usersService.update( this.endpoint,this.curruser).pipe(
      tap(() => this.router.navigate(['/admin/users'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.curruser);
      })
    ).subscribe(res => this.curruser = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.usersService.create(this.curruser).pipe(
      tap(() => this.router.navigate(['/admin/users'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.curruser);
      })
    ).subscribe(res => this.curruser = res as CsUser);
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
