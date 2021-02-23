import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { EmployerDepartmentService } from '../../../_services/departments.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { EmployerDepartment } from '../../../_models';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_REC: EmployerDepartment = {
  id: undefined,
  employerId: '',
  department:{},
  employerDepartmentId:'',
  adminId:'',
  departmentName: '',
  description: '',
  costCenterCode: '',
  createdBy: '',
  updatedBy: '',
  isActive: 1
};

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditDepartmentComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() employerId: string;
  isLoading$;
  endpoint:any;
  entityRec: EmployerDepartment;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private departmentService: EmployerDepartmentService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.departmentService.isLoading$;
    this.loadRemarks();
  }

  loadRemarks() {
    if (!this.id) {
      this.entityRec = EMPTY_REC;
      this.entityRec.employerId = this.employerId;
      this.loadForm();
    } else {

    let userId =localStorage.getItem('userId');

      this.endpoint=`getEmployerDepartmentById?adminId=${userId}&employerDepartmentId=${this.id}&employerId=${this.employerId}`
      const sb = this.departmentService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.employerId = this.employerId;
          return of(empty);
        })
      ).subscribe((department: EmployerDepartment) => {
        this.entityRec = department.department;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }
  
  loadForm() {
    this.formGroup = this.fb.group({
      departmentName: [this.entityRec.departmentName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
      costCenterCode: [this.entityRec.costCenterCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
      description: [this.entityRec.description, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
    });
  }

  save() {
    this.prepareRemark();
    if (this.entityRec.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {


  let userId =localStorage.getItem('userId');
  this.entityRec.adminId=userId;
  this.entityRec.employerDepartmentId=this.id;
  this.entityRec.employerId=this.employerId;
  this.endpoint=`updateEmployerDepartment`
    const sbUpdate = this.departmentService.update(this.endpoint,this.entityRec).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.entityRec);
      }),
    ).subscribe(res => this.entityRec = res);
    this.subscriptions.push(sbUpdate);
  }

  // create() {
  //   const sbCreate = this.departmentService.create(this.entityRec).pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.entityRec);
  //     }),
  //   ).subscribe((res: EmployerDepartment) => this.entityRec = res);
  //   this.subscriptions.push(sbCreate);
  // }
  create() {
    this.entityRec.adminId =localStorage.getItem('userId')
    this.entityRec.employerId=this.employerId;
    // this.entityRec.costCenterCode='required'
    this.endpoint=`postEmployerDepartment`
    console.log(' this.endpoint=`postEmployerDepartment`', this.endpoint);
    this.departmentService.postData(this.endpoint, this.entityRec).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
  }
  private prepareRemark() {
    const formData = this.formGroup.value;
    this.entityRec.employerId = this.employerId;
    this.entityRec.departmentName = formData.departmentName;
    this.entityRec.description=formData.description;
    this.entityRec.costCenterCode=formData.costCenterCode;
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
