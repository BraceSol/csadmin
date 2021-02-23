import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { UserRole } from '../../../_models/role.model';
import { RoleService } from '../../../_services/role.service';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

import{AuthHTTPService} from '../../../../auth/_services/auth-http'
const EMPTY_ROLE: UserRole = {
  id: undefined,
  role:{},
  profileTypeId: '',
  adminId:'',
  profileTypeIdName: '', 
  roleName: '', 
  description: '', 
  createdBy: '', 
  createdOn: '', 
  isEnabled: false
};

@Component({
  selector: 'app-edit-role-modal',
  templateUrl: './edit-role-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditRoleModalComponent implements OnInit, OnDestroy {
  @Input() id: any;
  isLoading$;
  endpoint:string;
  profileTypesResult:string;
  userrole: UserRole;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    
    private authHttpSerice : AuthHTTPService,
    private entityService: RoleService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.entityService.isLoading$;
    this.loadCustomer();
    this.authHttpSerice.getAllUserTypes().subscribe((x:any)=>{
			this.profileTypesResult =x.profileTypes
	
});
  }

  loadCustomer() {
    if (!this.id) {
      console.log("id not found")
      this.userrole = EMPTY_ROLE;
      this.loadForm();
    } else {
      const userId =localStorage.getItem('userId')
      this.endpoint=`roleById?roleId=${this.id}&adminId=${userId}`
      console.log(this.id,"=...........")
      const sb = this.entityService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((userrole: UserRole) => {
       
        this.userrole = userrole.role;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      roleName: [this.userrole.roleName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      profileTypeId: [this.userrole.profileTypeId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      description: [this.userrole.description, Validators.compose([Validators.maxLength(200)])]
    });
  }

  save() {
    this.prepareRole();
    if (this.userrole.id) {
      console.log("=======edit=====")
      this.edit();
    } else {
      console.log("=======create=====")
      this.create();
    }
  }

  edit() {
    
    this.userrole.adminId =localStorage.getItem('userId')
    this.endpoint=`updateRole`
    console.log(this.userrole)
    const sbUpdate = this.entityService.update(this.endpoint,this.userrole).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.userrole);
      }),
    ).subscribe(res => this.userrole = res);
    this.subscriptions.push(sbUpdate);
  }

  // create() {
  //   this.endpoint=`postRole`
  //   const sbCreate = this.entityService.create(this.userrole).pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.userrole);
  //     }),
  //   ).subscribe((res: UserRole) => this.userrole = res);
  //   this.subscriptions.push(sbCreate);
  // }


  create() {
    
    this.userrole.isEnabled=true;
    this.userrole.adminId =localStorage.getItem('userId')
    this.endpoint=`postRole`
    console.log(' this.endpoint=`postRole`', this.endpoint);
    this.entityService.postData(this.endpoint, this.userrole).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
  }
  private prepareRole() {
    const formData = this.formGroup.value;
    this.userrole.roleName = formData.roleName;
    this.userrole.profileTypeId = formData.profileTypeId;
    this.userrole.description = formData.description;
  }

  ngOnDestroy(): void {
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

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
