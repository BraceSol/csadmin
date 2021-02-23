import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { EmployeesService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { Employee } from '../../../_models';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_REC: Employee = {
  id: undefined,
  employerId: '',
  employer:'',
  adminId: '',
  employerName:'',
    employeeNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    professionId: '',
    startDate: '',
    endDate: '',
    jobTitle: '',
    departmentId: '',
    departmentName: '',
    locationId: '',
    supervisorId: '',
    jobType: '',
    agencyId: '',
    agencyRecruiterId: '',
    shift: '',
    jobId: '',
    statusCode: 1,
  createdBy: '',
  updatedBy: '',
  isActive: 1
};


@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditEmployeeComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() employerId: string;
  isLoading$;
  userId;
  entityRec: Employee;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  departmentList: any = [];
  professionList: any = [];

  employeeModel: any = {};
  constructor(
    private employeeService: EmployeesService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.userId =localStorage.getItem('userId');

    this.isLoading$ = this.employeeService.isLoading$;
    this.loadRemarks();
    this.getAllDepartmentOfEmployer();
    this.getAllProfession();
  }
  getAllDepartmentOfEmployer(){
    const userId =localStorage.getItem('userId');
    const getDept  = `getEmployerDepartments?adminId=${userId}&employerId=${this.employerId}`;
    this.employeeService.fetchData(getDept).subscribe((res: any)=> {
      this.departmentList = res.items;
    })
  }
  getAllProfession(){
    const getProfession  = `profession?adminId=${this.userId}`;
    this.employeeService.fetchData(getProfession).subscribe((res: any)=> {
      this.professionList = res.items;
      console.log('professions List', res);
    })
  }

  loadRemarks() {
    if (!this.id) {
      this.entityRec = EMPTY_REC;
      this.entityRec.employerId = this.employerId;
      this.loadForm();
    } else {
      const endpoint=`getEmployerEmployeeById?adminId=${this.userId}&employerId=${this.employerId}&employerEmployeeId=${this.id}`
      const sb = this.employeeService.getItemById(endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.employerId = this.employerId;
          return of(empty);
        })
      ).subscribe((res: any) => {
        this.entityRec = res.items;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      employeeNumber: [this.entityRec.employeeNumber, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
      firstName: [this.entityRec.firstName, Validators.compose([])],
      lastName: [this.entityRec.lastName, Validators.compose([])],
      email: [this.entityRec.email, Validators.compose([])],
      phone: [this.entityRec.phoneNumber, Validators.compose([])],
      professionId: [this.entityRec.professionId, Validators.compose([])],
      departmentId: [this.entityRec.departmentId, Validators.compose([])],
      jobType: [this.entityRec.jobType, Validators.compose([])],
      startDate: [this.entityRec.startDate, Validators.compose([])],
      endDate: [this.entityRec.endDate, Validators.compose([])],
    });
  }

  save() {
    console.log(this.formGroup.value)
    this.prepareRemark();
    if (this.entityRec.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    console.log(this.entityRec)
    const updateEmployee  = `updateEmployerEmployee`;
    const sbUpdate = this.employeeService.update(updateEmployee, this.entityRec).pipe(
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

  create() {
    const postEmployee  = `postEmployerEmployee`;
    const sbCreate = this.employeeService.post(postEmployee, this.entityRec).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.entityRec);
      }),
    ).subscribe((res: Employee) => this.entityRec = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareRemark() {
    const formData = this.formGroup.value;
    this.entityRec.employerId = this.employerId;
    this.entityRec.adminId = this.userId;
    this.entityRec.firstName = formData.firstName;
    this.entityRec.lastName = formData.lastName;
    this.entityRec.email = formData.email;
    this.entityRec.phoneNumber = formData.phone;
    this.entityRec.professionId = formData.professionId;
    this.entityRec.departmentId = formData.departmentId;
    this.entityRec.employeeNumber = formData.employeeNumber;
    this.entityRec.jobType = formData.jobType;
    this.entityRec.startDate = formData.startDate;
    this.entityRec.endDate = formData.endDate;
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
