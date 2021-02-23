import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Observable, Subscription } from 'rxjs';
import { EmployerAuditsService } from '../../../../_services/audits.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { EmployerAudit } from '../../../../_models/audit.model';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_REC: EmployerAudit = {
  id: undefined,
  employerId: '',
  title: '',
  purpose: '',
  description: 'must',
  isRandom: 1,
  employeeCount: 0,
  employeeFilter: null,
  startDate: '',
  completeDate: '',
  initialScore: 0,
  createdBy: '',
  updatedBy: '',
  isActive: 1,
  createdAt: '',
  updatedAt: '',
  employerAuditId: '',
  audit: '',
  adminId:''
};

@Component({
  selector: 'app-edit-audit',
  templateUrl: './edit-audit.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditAuditComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() employerId: string;
  isLoading$;
  endpoint:any;
  userId;
  entityRec: EmployerAudit;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private dataService: EmployerAuditsService,
    private fb: FormBuilder,
    public modal: NgbActiveModal
    ) {
      this.userId =localStorage.getItem('userId');
    }

  ngOnInit(): void {
    this.isLoading$ = this.dataService.isLoading$;
    this.loadRemarks();
  }

  loadRemarks() {
    if (!this.id) {
      this.entityRec = EMPTY_REC;
      this.entityRec.employerId = this.employerId;
      this.loadForm();
    } else {

      let userId =localStorage.getItem('userId');
      this.endpoint=`getAuditById?adminId=${userId}&auditId=${this.id}`
      const sb = this.dataService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.employerId = this.employerId;
          return of(empty);
        })
      ).subscribe((audit: EmployerAudit) => {
        var d = new Date( audit.audit.startDate);
        var n = d.getFullYear();
        var m = d.getMonth()+1;
        var da = d.getDate();
        console.log(`${m}/${da}/${n}`)
        audit.audit.startDate=`${m}/${da}/${n}`
        var d = new Date( audit.audit.completeDate);
        var n = d.getFullYear();
        var m = d.getMonth()+1;
        var da = d.getDate();
        audit.audit.completeDate=`${m}/${da}/${n}`
        this.entityRec = audit.audit;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      title: [this.entityRec.title, Validators.compose([Validators.required])],
      purpose: [this.entityRec.purpose, Validators.compose([Validators.required])],
      startDate: [this.entityRec.startDate, Validators.compose([Validators.required])],
      completeDate: [this.entityRec.completeDate, Validators.compose([Validators.required])],
      employeeCount: [this.entityRec.employeeCount, Validators.compose([Validators.required])],
    });
  }
	queryList= [
		{value: 1, viewValue: 'Priority'},
		{value: 0, viewValue: 'Low'},
	];
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
    this.entityRec.employerId=this.employerId;
    this.entityRec.employerAuditId=this.id;
    var str = this.entityRec.startDate;
    var splitted = str.split("/");
    this.entityRec.startDate=`${splitted[2]}-${splitted[0]}-${splitted[1]}`
    var str = this.entityRec.completeDate;
    var splitted = str.split("/");
    this.entityRec.completeDate=`${splitted[2]}-${splitted[0]}-${splitted[1]}`
    this.endpoint=`updateAudit`
    const sbUpdate = this.dataService.update(this.endpoint,this.entityRec).pipe(
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
    this.entityRec.adminId =localStorage.getItem('userId')
    this.entityRec.employerId=this.employerId;
    var str = this.entityRec.startDate;
    var splitted = str.split("/");
    this.entityRec.startDate=`${splitted[2]}-${splitted[0]}-${splitted[1]}`
    this.endpoint=`postAudit`
    this.dataService.postData(this.endpoint, this.entityRec).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
  }
  // create() {
  //   const sbCreate = this.dataService.create(this.entityRec).pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.entityRec);
  //     }),
  //   ).subscribe((res: EmployerAudit) => this.entityRec = res);
  //   this.subscriptions.push(sbCreate);
  // }

  private prepareRemark() {
    const formData = this.formGroup.value;
    this.entityRec.employerId = this.employerId;
    this.entityRec.title = formData.title;
    this.entityRec.purpose = formData.purpose;
    this.entityRec.startDate = formData.startDate;
    this.entityRec.completeDate = formData.completeDate;
    this.entityRec.employeeCount = formData.employeeCount;
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
