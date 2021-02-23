import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Observable, Subscription } from 'rxjs';
import { EmployerQueueService } from '../../../../_services/queues.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { EmployerQueue } from '../../../../_models/employerQueue.model';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_REC: EmployerQueue = {
  id: undefined,
  isSystem: false,
  title: '',
  description: '',
  queueType: 1,
  stats: null,
  ownerId: '',
  statusCode: 1,
  createdBy: '',
  updatedBy: '',
  assignedTo: '',
  isActive: 1,
  createdAt: '',
  updatedAt: '',
  employerId: '',
  queueId: '',
  queue: null,
  adminId:''
};

@Component({
  selector: 'app-edit-queue',
  templateUrl: './edit-queue.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditQueueComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() employerId: string;
  isLoading$;
  endpoint:any;
  userId;
  entityRec: EmployerQueue;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  professionsList: any= [];
  profession = new Array();

  constructor(
    private dataService: EmployerQueueService,
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
      this.endpoint=`getQueueById?adminId=${userId}&queueId=${this.id}`
      console.log(this.endpoint);
      const sb = this.dataService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.employerId = this.employerId;
          return of(empty);
        })
      ).subscribe((queue: EmployerQueue) => {
        this.entityRec = queue.queue;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      title: [this.entityRec.title, Validators.compose([Validators.required])],
      description: [this.entityRec.description, Validators.compose([Validators.required])],
      queueType: [this.entityRec.queueType, Validators.compose([Validators.required])],
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
    this.entityRec.queueId=this.id
    this.endpoint=`updateQueue`
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
    this.endpoint=`postQueue`
    console.log(' this.endpoint=`postQueue`', this.endpoint);
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
  //   ).subscribe((res: EmployerQueue) => this.entityRec = res);
  //   this.subscriptions.push(sbCreate);
  // }

  private prepareRemark() {
    const formData = this.formGroup.value;
    this.entityRec.employerId = this.employerId;
    this.entityRec.title = formData.title;
    this.entityRec.description = formData.description;
    this.entityRec.queueType = formData.queueType;
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
