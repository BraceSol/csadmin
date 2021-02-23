import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { CertificationService } from '../../../../_services/certification.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { Certification } from '../../../../_models/certification.model';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_REC: Certification = {
  id: '',
  certificationName: '',
  issuingBody: '',
  issueDate: '',
  expirationDate: '',
  isActive: true,
  createdAt: '',
  updatedAt: '',
  userId: '',
  updatedBy: '',
  createdBy: '',
  certification: null,
  licenseId: '',
  adminId: ''
};

@Component({
  selector: 'app-edit-cert',
  templateUrl: './edit-cert.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditCertComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() professionalProfileId: string;
  isLoading$;
  endpoint:any;
  entityRec: Certification;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private certService: CertificationService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.certService.isLoading$;
    this.loadRemarks();
  }

  loadRemarks() {
    if (!this.id) {
      this.entityRec = EMPTY_REC;
      this.entityRec.userId = this.professionalProfileId;
      this.loadForm();
    } else {

      let userId =localStorage.getItem('userId');

      this.endpoint=`getCertificationById?adminId=${userId}&certificationId=${this.id}&userId=${this.professionalProfileId}`
      const sb = this.certService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.userId = this.professionalProfileId;
          return of(empty);
        })
      ).subscribe((certification: Certification) => {
        var d = new Date( certification.certification.issueDate);
        var n = d.getFullYear();
        var m = d.getMonth()+1;
        var da = d.getDate();
        certification.certification.issueDate=`${m}/${da}/${n}`
        d = new Date( certification.certification.expirationDate);
        n = d.getFullYear();
        m = d.getMonth()+1;
        da = d.getDate();
        certification.certification.expirationDate=`${m}/${da}/${n}`
        this.entityRec = certification.certification;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      certificationName: [this.entityRec.certificationName, Validators.compose([Validators.required])],
      issuingBody: [this.entityRec.issuingBody, Validators.compose([Validators.required])],
      issueDate: [this.entityRec.issueDate, Validators.compose([Validators.required])],
      expirationDate: [this.entityRec.expirationDate, Validators.compose([Validators.required])],
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
    this.entityRec.licenseId=this.id;
    // this.entityRec.employerId=this.employerId;
    this.endpoint=`updateCertification`;
    const sbUpdate = this.certService.update(this.endpoint,this.entityRec).pipe(
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
    var str = this.entityRec.issueDate;
    var splitted = str.split("/");
    this.entityRec.issueDate=`${splitted[2]}-${splitted[0]}-${splitted[1]}`
    str = this.entityRec.expirationDate;
    splitted = str.split("/");
    this.entityRec.expirationDate=`${splitted[2]}-${splitted[0]}-${splitted[1]}`
    this.endpoint=`createCertification`
    this.certService.postData(this.endpoint, this.entityRec).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
  }

  private prepareRemark() {
    const formData = this.formGroup.value;
    this.entityRec.userId = this.professionalProfileId;
    this.entityRec.certificationName = formData.certificationName;
    this.entityRec.issuingBody = formData.issuingBody;
    this.entityRec.issueDate = formData.issueDate;
    this.entityRec.expirationDate = formData.expirationDate;
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
