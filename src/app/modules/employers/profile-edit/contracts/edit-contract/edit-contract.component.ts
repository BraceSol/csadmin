import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { of, Observable, Subscription } from 'rxjs';
import { EmployerContractsService } from '../../../_services/contracts.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { EmployerContract } from '../../../_models';
import { catchError, first, tap } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

const EMPTY_REC: EmployerContract = {
  id: undefined,
  employerId: '',
  employerContractId:'',
  adminId:'',
  agencyId: '',
  startDate: '',
  endDate: '',
  professionIds: null,
  employerContact: '',
  agencyContact: '',
  firstName: '', 
  lastName: '', 
  phone: '', 
  email: '', 
  createdBy: '',
  updatedBy: '',
  isActive: 1
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
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}, 
    NgbTypeaheadConfig
  ]
})
export class EditContractComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() employerId: string;
  isLoading$;
  endpoint:any;
  userId;
  entityRec: EmployerContract;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  professionsList: any= [];
  profession = new Array();

  search = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term.length < 2 ? []
          : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      );

  constructor(
    private contractsService: EmployerContractsService,
    config: NgbTypeaheadConfig, 
    private fb: FormBuilder, 
    public modal: NgbActiveModal
    ) { 
      this.userId= 'ed5db5b0-0a68-43ba-b1d2-96079ee884f8';
    }

  ngOnInit(): void {
    this.isLoading$ = this.contractsService.isLoading$;
    this.loadRemarks();
    this.getProfessions();
    
  }

  loadRemarks() {
    if (!this.id) {
      this.entityRec = EMPTY_REC;
      this.entityRec.employerId = this.employerId;
      this.loadForm();
    } else {

  let userId =localStorage.getItem('userId');
      this.endpoint=`getEmployerContractById?adminId${userId}&employerContractId${this.id}`
      const sb = this.contractsService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.employerId = this.employerId;
          return of(empty);
        })
      ).subscribe((department: EmployerContract) => {
        this.entityRec = department;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }
  getProfessions(){
    const getIndustory  = `profession?adminId=${this.userId}`;
    this.contractsService.fetchData(getIndustory).subscribe((res: any)=> {
      this.professionsList = res.items;
      console.log('professionsList', this.professionsList);
    })
  }

  loadForm() {
    this.formGroup = this.fb.group({
      agencyId: [this.entityRec.agencyId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
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
  this.entityRec.employerContractId=this.id
    this.endpoint=`updateEmployerContract`
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
    const sbCreate = this.contractsService.create(this.entityRec).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.entityRec);
      }),
    ).subscribe((res: EmployerContract) => this.entityRec = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareRemark() {
    const formData = this.formGroup.value;
    this.entityRec.employerId = this.employerId;
    this.entityRec.agencyId = formData.agencyId;
    this.entityRec.firstName = formData.firstName;
    this.entityRec.lastName = formData.lastName;
    this.entityRec.email = formData.email;
    this.entityRec.phone = formData.phone;
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
  onCheckChange(event) {
     
    this.profession.push(event.target.value);
    console.log('professions Id', this.profession);
   // console.log(event.target.value);
    /* Selected */
 if(event.target.checked){
   // Add a new control in the arrayForm
  // this.specialty.professionIds.push(event.target.value);
 }
 /* unselected */
 else{
   // find the unselected element
   let i: number = 0;

 //  formArray.controls.forEach((ctrl: FormControl) => {
 //    if(ctrl.value == event.target.value) {
       // Remove the unselected element from the arrayForm
 //      formArray.removeAt(i);
  //     return;
  //   }

   //  i++;
  // });
 }

  }
}
