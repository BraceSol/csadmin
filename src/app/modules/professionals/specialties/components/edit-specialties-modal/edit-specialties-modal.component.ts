import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Specialty } from '../../../_models/specialty.model';
import { SpecialtiesService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_SPEC: Specialty = {
  id: undefined,
  industryId: '',
  specialtyName: '',
  description: '',
  professionIds: [],
  adminId: '',
  isDefault: true,
  createdBy: '',
  createdOn: ''
};

@Component({
  selector: 'app-edit-specialties-modal',
  templateUrl: './edit-specialties-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditSpecialtiesModalComponent implements OnInit, OnDestroy {
  @Input() id: any;
  isLoading$;
  specialty: Specialty;
  formGroup: FormGroup;
  userId;
  industoriesList: any= [];
  professionsList: any= [];
  profession = new Array();
  private subscriptions: Subscription[] = [];
  constructor(
    private entityService: SpecialtiesService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
     this.userId= localStorage.getItem('userId');
    }

  ngOnInit(): void {
    this.isLoading$ = this.entityService.isLoading$;
    this.loadCategory();
    this.getProfessions();
    this.getIndustory();
  }
  getIndustory(){
    const getIndustory  = `industry?adminId=${this.userId}`;
    this.entityService.fetchData(getIndustory).subscribe((res: any)=> {
      this.industoriesList = res.items;
    })
  }
  getProfessions(){
    const getIndustory  = `profession?adminId=${this.userId}`;
    this.entityService.fetchData(getIndustory).subscribe((res: any)=> {
      this.professionsList = res.items;
      console.log('professionsList', this.professionsList);
    })
  }

  loadCategory() {
    if (!this.id) {
      this.specialty = EMPTY_SPEC;
      this.loadForm();
    } else {
      const getSpecialtyById  = `specialtyById?adminId=${this.userId}&specialtyId=${this.id}`;
      const sb = this.entityService.getItemById(getSpecialtyById).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_SPEC);
        })
      ).subscribe((Specialty: any) => {
        this.specialty = Specialty.specialty;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      specialtyName: [this.specialty.specialtyName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      description: [this.specialty.description, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      industryId: [this.specialty.industryId, Validators.compose([Validators.required])],
      isDefault: [this.specialty.isDefault]
    });
  }

  save() {
    this.prepareRole();
    if (this.specialty.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
     ;
    const updateSpecialty= 'updateSpecialty';
    this.specialty.adminId = this.userId;
    this.specialty.professionIds = this.profession;
    const sbUpdate = this.entityService.update(updateSpecialty, this.specialty).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.specialty);
      }),
    ).subscribe(res =>{
      console.log('update res', res);
      this.specialty = res;
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.specialty.adminId = this.userId;
    const endPoint = `specialty`;
    this.specialty.professionIds = this.profession;
    const sbCreate = this.entityService.post(endPoint, this.specialty).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.specialty);
      }),
    ).subscribe((res: any) => {
      console.log(res)
      this.specialty = res.items;
    });
    this.subscriptions.push(sbCreate);
  }

  private prepareRole() {
    const formData = this.formGroup.value;
    this.specialty.specialtyName = formData.specialtyName;
    this.specialty.description = formData.description;
    this.specialty.industryId = formData.industryId;
    this.specialty.isDefault = formData.isDefault;
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
