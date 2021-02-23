import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { EducationHistoryService } from '../../../../_services/education.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { EducationHistory } from '../../../../_models/education.model';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_REC: EducationHistory = {
  id: '',
  userId: '',
  schoolId: '',
  educationId:'',
  schoolName: '',
  city: '',
  state: '',
  postalCode: '',
  degree: '',
  graduationDate: '',
  startDate: '',
  attending: 1,
  createdBy: '',
  updatedBy: '',
  createdAt: '',
  updatedAt: '',
  isActive: true,
  education: '',
  adminId: '',
};

@Component({
  selector: 'app-edit-education',
  templateUrl: './edit-education.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditEducationComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() professionalProfileId: string;
  isLoading$;
  endpoint:any;
  entityRec: EducationHistory;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private eduService: EducationHistoryService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.eduService.isLoading$;
    this.loadRemarks();
  }

  loadRemarks() {
    if (!this.id) {
      this.entityRec = EMPTY_REC;
      this.entityRec.userId = this.professionalProfileId;
      this.loadForm();
    } else {

    let userId =localStorage.getItem('userId');

      this.endpoint=`getEducationById?adminId=${userId}&educationId=${this.id}&userId=${this.professionalProfileId}`
      const sb = this.eduService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.userId = this.professionalProfileId;
          return of(empty);
        })
      ).subscribe((education: EducationHistory) => {
        var d = new Date(  education.education.graduationDate);
        var n = d.getFullYear();
        var m = d.getMonth()+1;
        var da = d.getDate();
        education.education.graduationDate=`${m}/${da}/${n}`
        this.entityRec = education.education;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      schoolName: [this.entityRec.schoolName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
      city: [this.entityRec.city, Validators.compose([Validators.required])],
      state: [this.entityRec.state, Validators.compose([Validators.required])],
      postalCode: [this.entityRec.postalCode, Validators.compose([Validators.required])],
      degree: [this.entityRec.degree, Validators.compose([Validators.required])],
      graduationDate: [this.entityRec.graduationDate, Validators.compose([])],
    });
  }
	stateList= [
		{value: 'Alabama', viewValue: 'Alabama'},
		{value: 'Alaska', viewValue: 'Alaska'},
		{value: 'Arizona', viewValue: 'Arizona'},
		{value: 'Arkansas', viewValue: 'Arkansas'},
		{value: 'California', viewValue: 'California'},
		{value: 'Colorado', viewValue: 'Colorado'},
		{value: 'Connecticut', viewValue: 'Connecticut'},
		{value: 'Delaware', viewValue: 'Delaware'},
		{value: 'District Of Columbia', viewValue: 'District Of Columbia'},
		{value: 'Florida', viewValue: 'Florida'},
		{value: 'Georgia', viewValue: 'Georgia'},
		{value: 'Hawaii', viewValue: 'Hawaii'},
		{value: 'Idaho', viewValue: 'Idaho'},
		{value: 'Illinois', viewValue: 'Illinois'},
		{value: 'Indiana', viewValue: 'Indiana'},
		{value: 'Iowa', viewValue: 'Iowa'},
		{value: 'Kansas', viewValue: 'Kansas'},
		{value: 'Kentucky', viewValue: 'Kentucky'},
		{value: 'Louisiana', viewValue: 'Louisiana'},
		{value: 'Maine', viewValue: 'Maine'},
		{value: 'Maryland', viewValue: 'Maryland'},
		{value: 'Massachusetts', viewValue: 'Massachusetts'},
		{value: 'Michigan', viewValue: 'Michigan'},
		{value: 'Minnesota', viewValue: 'Minnesota'},
		{value: 'Mississippi', viewValue: 'Mississippi'},
		{value: 'Missouri', viewValue: 'Missouri'},
		{value: 'Montana', viewValue: 'Montana'},
		{value: 'Nebraska', viewValue: 'Nebraska'},
		{value: 'Nevada', viewValue: 'Nevada'},
		{value: 'New Hampshire', viewValue: 'New Hampshire'},
		{value: 'New Jersey', viewValue: 'New Jersey'},
		{value: 'New Mexico', viewValue: 'New Mexico'},
		{value: 'New York', viewValue: 'New York'},
		{value: 'North Carolina', viewValue: 'North Carolina'},
		{value: 'North Dakota', viewValue: 'North Dakota'},
		{value: 'Ohio', viewValue: 'Ohio'},
		{value: 'Oklahoma', viewValue: 'Oklahoma'},
		{value: 'Oregon', viewValue: 'Oregon'},
		{value: 'Pennsylvania', viewValue: 'Pennsylvania'},
		{value: 'Rhode Island', viewValue: 'Rhode Island'},
		{value: 'South Carolina', viewValue: 'South Carolina'},
		{value: 'South Dakota', viewValue: 'South Dakota'},
		{value: 'Tennessee', viewValue: 'Tennessee'},
		{value: 'Texas', viewValue: 'Texas'},
		{value: 'Utah', viewValue: 'Utah'},
		{value: 'Vermont', viewValue: 'Vermont'},
		{value: 'Virginia', viewValue: 'Virginia'},
		{value: 'Washington', viewValue: 'Washington'},
		{value: 'Washington, D.C.', viewValue: 'Washington, D.C.'},
		{value: 'West Virginia', viewValue: 'West Virginia'},
		{value: 'Wisconsin', viewValue: 'Wisconsin'},
		{value: 'Wyoming', viewValue: 'Wyoming'}
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
  this.entityRec.educationId=this.id;
  // this.entityRec.employerId=this.employerId;
  this.endpoint=`updateEducation`
    const sbUpdate = this.eduService.update(this.endpoint,this.entityRec).pipe(
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
  //   const sbCreate = this.eduService.create(this.entityRec).pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.entityRec);
  //     }),
  //   ).subscribe((res: EducationHistory) => this.entityRec = res);
  //   this.subscriptions.push(sbCreate);
  // }
  create() {
    this.entityRec.adminId =localStorage.getItem('userId')
    // this.entityRec.adminId=this.employerId;
    // this.entityRec.costCenterCode='required'
    var str = this.entityRec.graduationDate;
    var splitted = str.split("/");
    this.entityRec.graduationDate=`${splitted[2]}-${splitted[0]}-${splitted[1]}`
    this.endpoint=`createEducation`
    console.log(' this.endpoint=`postEducationHistory`', this.endpoint);
    this.eduService.postData(this.endpoint, this.entityRec).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
  }
  private prepareRemark() {
    const formData = this.formGroup.value;
    this.entityRec.userId = this.professionalProfileId;
    this.entityRec.schoolName = formData.schoolName;
    this.entityRec.city = formData.city;
    this.entityRec.state = formData.state;
    this.entityRec.postalCode = formData.postalCode;
    this.entityRec.degree=formData.degree;
    this.entityRec.graduationDate=formData.graduationDate
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
