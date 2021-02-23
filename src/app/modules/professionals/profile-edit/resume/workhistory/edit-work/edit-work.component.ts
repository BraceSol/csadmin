import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { WorkHistoryService } from '../../../../_services/workhistory.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { WorkHistory } from '../../../../_models/workhistory.model';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_REC: WorkHistory = {
  id: '',
  startDate: '',
  endDate: '',
  employerDepartmentId:'',
  currentlyWorking: 1,
  employerName: '',
  employerCity: '',
  employerState: '',
  bedsInFacility: 1,
  bedCount: 1,
  teachingFacility: 1,
  traumaFacility: 1,
  magnetFacility: 1,
  jobTypeCode: '',
  nurseToPatientRatio: '',
  chargeExp: 1,
  shift: '',
  referenceName: '',
  referenceTitle: '',
  referenceEmail: '',
  referencePhone: '',
  referenceContact: 1,
  reasonForLeaving: '',
  workHistoryId:'',
  createdBy: '',
  updatedBy: '',
  reference: null,
  isActive: true,
  workHistory: null,
  adminId: '',
  userId: '',
  employerId: '',
  professionId: '',
  specialtyId: '',
};

@Component({
  selector: 'app-edit-work',
  templateUrl: './edit-work.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditWorkComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() professionalProfileId: string;
  isLoading$;
  endpoint:any;
  entityRec: WorkHistory;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private workhistoryService: WorkHistoryService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.workhistoryService.isLoading$;
    this.loadRemarks();
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
    jobTypeList= [
      {value: 'partTime', viewValue: 'partTime'},
      {value: 'fullTime', viewValue: 'fullTime'},

      ];
  loadRemarks() {
    if (!this.id) {
      this.entityRec = EMPTY_REC;
      this.entityRec.userId = this.professionalProfileId;
      this.loadForm();
    } else {


    let userId =localStorage.getItem('userId');

      this.endpoint=`getWorkHistoryById?workHistoryId=${this.id}&adminId=${userId}`
      const sb = this.workhistoryService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.userId = this.professionalProfileId;
          return of(empty);
        })
      ).subscribe((workhistory: WorkHistory) => {
        var d = new Date(  workhistory.workHistory.startDate);
        var n = d.getFullYear();
        var m = d.getMonth()+1;
        var da = d.getDate();
        workhistory.workHistory.startDate=`${m}/${da}/${n}`
        console.log(workhistory.workHistory.startDate)
        var d = new Date(  workhistory.workHistory.endDate);
        var n = d.getFullYear();
        var m = d.getMonth()+1;
        var da = d.getDate();
        workhistory.workHistory.endDate=`${m}/${da}/${n}`
        this.entityRec = workhistory.workHistory;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      employerName: [this.entityRec.employerName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
      employerCity: [this.entityRec.employerCity, Validators.compose([Validators.required])],
      employerState: [this.entityRec.employerState, Validators.compose([Validators.required])],
      jobTypeCode: [this.entityRec.jobTypeCode, Validators.compose([Validators.required])],
      startDate: [this.entityRec.startDate, Validators.compose([])],
      endDate: [this.entityRec.endDate, Validators.compose([])],
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
  this.entityRec.workHistoryId=this.id;
  // this.entityRec.employerId=this.employerId;
  this.endpoint=`updateWorkHistory`
    const sbUpdate = this.workhistoryService.update(this.endpoint,this.entityRec).pipe(
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
  //   const sbCreate = this.workhistoryService.create(this.entityRec).pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.entityRec);
  //     }),
  //   ).subscribe((res: WorkHistory) => this.entityRec = res);
  //   this.subscriptions.push(sbCreate);
  // }

  create() {
    var str = this.entityRec.startDate;
    var splitted = str.split("/");
    console.log(splitted)

    this.entityRec.startDate=`${splitted[2]}-${splitted[0]}-${splitted[1]}`
    var str = this.entityRec.endDate;
    var splitted = str.split("/");
    this.entityRec.endDate=`${splitted[2]}-${splitted[0]}-${splitted[1]}`
    this.entityRec.adminId =localStorage.getItem('userId')
    // this.entityRec.employerId=this.employerId;
    // this.entityRec.costCenterCode='required'
    this.endpoint=`createWorkHistory`
    console.log(' this.endpoint=`createWorkHistory`', this.endpoint);
    this.workhistoryService.postData(this.endpoint, this.entityRec).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
  }
  private prepareRemark() {
    const formData = this.formGroup.value;
    this.entityRec.userId = this.professionalProfileId;
    this.entityRec.employerName = formData.employerName;
    this.entityRec.employerCity = formData.employerCity;
    this.entityRec.employerState = formData.employerState;
    this.entityRec.jobTypeCode = formData.jobTypeCode;
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
