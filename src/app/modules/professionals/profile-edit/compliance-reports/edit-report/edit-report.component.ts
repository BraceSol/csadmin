import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { of, Observable, Subscription } from 'rxjs';
import { ProfessionalReportsService } from '../../../_services/reports.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { ProfessionalReports } from '../../../_models/reports.model';
import { catchError, first, tap } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

const EMPTY_REC: ProfessionalReports = {
  id: undefined,
  userId: '',
  adminId:'',
  report:'',
  complianceReportId:'',
  employerId: '',
  professionId: '',
  specialtyId: '',
  departmentId: '',
  locationId: '',
  initialScore: 0,
  currentScore: 0,
  missingDocs: 0,
  totalDocs: 0,
  expiringDocs: 0,
  statusCode: 0,
  startDate: '',
  endDate: '',
  createdBy: '',
  updatedBy: '',
  isActive: true
};

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-edit-report',
  templateUrl: './edit-report.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    NgbTypeaheadConfig
  ]
})
export class EditReportComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() professionalProfileId: string;
  isLoading$;
  endpoint:any;
  userId;
  entityRec: ProfessionalReports;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  professionsList: any= [];
  departmentsList:any=[];
  specialtiesList:any=[];
  locationsList:any=[];
  employersList:any=[];
  profession = new Array();

  search = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term.length < 2 ? []
          : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      );

  constructor(
    private contractsService: ProfessionalReportsService,
    config: NgbTypeaheadConfig,
    private fb: FormBuilder,
    public modal: NgbActiveModal
    ) {
      this.userId= 'ed5db5b0-0a68-43ba-b1d2-96079ee884f8';
    }

  ngOnInit(): void {
    this.isLoading$ = this.contractsService.isLoading$;
    this.loadRemarks();
    this. getEmployers();
    this.getProfessions();
this.getDepartments();
this.getDepartments();
this. getLocations();
  }

  loadRemarks() {
    if (!this.id) {
      this.entityRec = EMPTY_REC;
      this.entityRec.userId = this.userId;
      this.loadForm();
    } else {

      let userId =localStorage.getItem('userId');
      this.endpoint=`complianceReportById?adminId=${userId}&complianceReportId=${this.id}`
      const sb = this.contractsService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.userId = this.userId;
          return of(empty);
        })
      ).subscribe((department: ProfessionalReports) => {
        this.entityRec = department.report;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }
  getProfessions(){
    const getIndustory  = `profession?adminId=${this.userId}`;
    this.contractsService.fetchData(getIndustory).subscribe((res: any)=> {
      this.professionsList = res.items;
    })
  }
  getEmployers(){
    const getIndustory  = `getEmployers?adminId=${this.userId}`;
    this.contractsService.fetchData(getIndustory).subscribe((res: any)=> {
      this.employersList = res.items;
    })
  }
  getSpecialties(){
    const getIndustory  = `specialty?adminId=${this.userId}`;
    this.contractsService.fetchData(getIndustory).subscribe((res: any)=> {
      this.specialtiesList = res.items;
    })
  }
  getDepartments(){
    const getIndustory  = `getEmployerDepartments?adminId=${this.userId}&employerId=${this.professionalProfileId}`;
    this.contractsService.fetchData(getIndustory).subscribe((res: any)=> {
      this.departmentsList = res.items;
    })
  }
  getLocations(){
    const getIndustory  = `getEmployerDepartments?adminId=${this.userId}&employerId=${this.professionalProfileId}`;
    this.contractsService.fetchData(getIndustory).subscribe((res: any)=> {
      this.locationsList = res.items;
    })
  }
  loadForm() {
    this.formGroup = this.fb.group({
      userId: [this.entityRec.userId, Validators.compose([])],
      employerId: [this.entityRec.employerId, Validators.compose([])],
      professionId: [this.entityRec.professionId, Validators.compose([])],
      specialtyId: [this.entityRec.specialtyId, Validators.compose([])],
      departmentId: [this.entityRec.departmentId, Validators.compose([])],
      locationId: [this.entityRec.locationId, Validators.compose([])],
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
  this.entityRec.complianceReportId=this.id
    this.endpoint=`updateComplianceReport`
    const sbUpdate = this.contractsService.update(this.endpoint,this.entityRec).pipe(
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
    // this.entityRec.employerId=this.employerId;

    console.log("-----------------------------------",this.entityRec)
    var str = this.entityRec.startDate;
    var splitted = str.split("/");
    this.entityRec.startDate=`${splitted[2]}-${splitted[0]}-${splitted[1]}`
    var str = this.entityRec.endDate;
    var splitted = str.split("/");
    this.entityRec.endDate=`${splitted[2]}-${splitted[0]}-${splitted[1]}`
    this.endpoint=`createComplianceReport`
    this.contractsService.postData(this.endpoint, this.entityRec).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
  }
  // create() {
  //   const sbCreate = this.contractsService.create(this.entityRec).pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.entityRec);
  //     }),
  //   ).subscribe((res: ProfessionalReports) => this.entityRec = res);
  //   this.subscriptions.push(sbCreate);
  // }

  private prepareRemark() {
    console.log("-----------------------------------")
    const formData = this.formGroup.value;
    this.entityRec.userId = this.userId;
    this.entityRec.employerId = formData.employerId;
    this.entityRec.startDate = formData.startDate;
    this.entityRec.endDate = formData.endDate;
    this.entityRec.locationId = formData.locationId;
    this.entityRec.departmentId = formData.departmentId;
    this.entityRec.specialtyId = formData.specialtyId;
    this.entityRec.professionId = formData.professionId;
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
