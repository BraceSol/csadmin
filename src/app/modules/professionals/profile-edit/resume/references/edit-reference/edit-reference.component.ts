import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { ReferenceService } from '../../../../_services/reference.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { Reference } from '../../../../_models/reference.model';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_REC: Reference = {
  id: '',
  referenceName: '',
  referenceEmail: '',
  referenceEmployer: '',
  referencePhone: '',
  referenceTitle: '',
  contactMethod: '',
  createdAt: '',
  updatedAt: '',
  userId: '',
  updatedBy: '',
  createdBy: '',
  isActive: true,
  reference: null,
  referenceId: '',
  adminId: ''
};

@Component({
  selector: 'app-edit-reference',
  templateUrl: './edit-reference.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditReferenceComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() professionalProfileId: string;
  isLoading$;
  endpoint:any;
  entityRec: Reference;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private referenceService: ReferenceService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.referenceService.isLoading$;
    this.loadRemarks();
  }

  loadRemarks() {
    if (!this.id) {
      this.entityRec = EMPTY_REC;
      this.entityRec.userId = this.professionalProfileId;
      this.loadForm();
    } else {

      let userId =localStorage.getItem('userId');

      this.endpoint=`getReferenceById?adminId=${userId}&referenceId=${this.id}&userId=${this.professionalProfileId}`
      const sb = this.referenceService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.userId = this.professionalProfileId;
          return of(empty);
        })
      ).subscribe((reference: Reference) => {
        this.entityRec = reference.reference;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      referenceName: [this.entityRec.referenceName, Validators.compose([Validators.required])],
      referenceEmail: [this.entityRec.referenceEmail, Validators.compose([])],
      referenceEmployer: [this.entityRec.referenceEmployer, Validators.compose([Validators.required])],
      referencePhone: [this.entityRec.referencePhone, Validators.compose([])],
      referenceTitle: [this.entityRec.referenceTitle, Validators.compose([])],
      contactMethod: [this.entityRec.contactMethod, Validators.compose([])],
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
    this.entityRec.referenceId=this.id;
    // this.entityRec.employerId=this.employerId;
    this.endpoint=`updateReference`;
    const sbUpdate = this.referenceService.update(this.endpoint,this.entityRec).pipe(
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
    // this.entityRec.adminId=this.employerId;
    // this.entityRec.costCenterCode='required'
    this.endpoint=`createReference`
    this.referenceService.postData(this.endpoint, this.entityRec).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
  }

  private prepareRemark() {
    const formData = this.formGroup.value;
    this.entityRec.userId = this.professionalProfileId;
    this.entityRec.referenceName = formData.referenceName;
    this.entityRec.referenceEmail = formData.referenceEmail;
    this.entityRec.referenceEmployer = formData.referenceEmployer;
    this.entityRec.referencePhone = formData.referencePhone;
    this.entityRec.referenceTitle = formData.referenceTitle;
    this.entityRec.contactMethod = formData.contactMethod;
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
