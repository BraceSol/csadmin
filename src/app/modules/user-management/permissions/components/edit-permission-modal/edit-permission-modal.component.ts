import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Permission } from '../../../_models/permission.model';
import { PermissionService } from '../../../_services/permission.service';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_PERMISSION: Permission = {
  id: undefined,
  permission:{},
  category:'',
  adminId:'',
  permissionCode:'',
  permissionName: '',
  description: ''
};

@Component({
  selector: 'app-edit-permission-modal',
  templateUrl: './edit-permission-modal.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditPermissionModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading$;
  permission: Permission;
  endpoint:string;
  categoryTypesResult:any;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private entityService: PermissionService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.entityService.isLoading$;
    this.loadCustomer();
    this.getCategory();
  }
getCategory(){

  const adminId =localStorage.getItem('userId')
  this.endpoint=`systemTables?adminId=${adminId}`
  this.entityService.fetchData( this.endpoint).subscribe((x:any)=>{
    this.categoryTypesResult =x.items
  })
}
  loadCustomer() {
    if (!this.id) {
      console.log("id not found")
      this.permission = EMPTY_PERMISSION;
      this.loadForm();
    } else {
      const userId =localStorage.getItem('userId')
      console.log(this.id)
      this.endpoint=`getPermissionById?adminId=${userId}&permissionId=${this.id}`
      const sb = this.entityService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_PERMISSION);
        })
      ).subscribe((permission: Permission) => {
        this.permission = permission.permission;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      permissionName: [this.permission.permissionName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      description: [this.permission.description, Validators.compose([Validators.maxLength(200)])],
      category: [this.permission.category, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      permissionCode: [this.permission.permissionCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])]
    });
  }

  save() {
    this.preparePermission();
    if (this.permission.id) {
      console.log("=======edit=====")
      this.edit();
    } else {
      this.modal.close();
      console.log("=======create=====")
      this.create();
    }
  }

  edit() {
this.endpoint=`updatePermission`
    const sbUpdate = this.entityService.update(this.endpoint,this.permission).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.permission);
      }),
    ).subscribe(res => this.permission = res);
    this.subscriptions.push(sbUpdate);
  }

  // create() {
  //   const sbCreate = this.entityService.create(this.permission).pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.permission);
  //     }),
  //   ).subscribe((res: Permission) => this.permission = res);
  //   this.subscriptions.push(sbCreate);
  // }
  create() {
    
    // this.userrole.isEnabled=true;
    this.permission.adminId =localStorage.getItem('userId')
    this.endpoint=`createPermission`
    console.log(' this.endpoint=`createPermission`', this.endpoint);
    this.entityService.postData(this.endpoint, this.permission).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
  }
  private preparePermission() {
    const formData = this.formGroup.value;

    console.log("this.formGroup.value",this.formGroup.value)
    this.permission.permissionName = formData.permissionName;
    
    this.permission.permissionCode = formData.permissionCode;
    
    this.permission.category = formData.category;
    this.permission.description = formData.description;
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
