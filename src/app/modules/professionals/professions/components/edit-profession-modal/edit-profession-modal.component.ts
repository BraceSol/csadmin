import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Profession } from '../../../_models/profession.model';
import { ProfessionService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_PROF: Profession = {
  id: undefined,
  industryId: '',
  adminId: '', 
  professionName: '',
  description: '', 
  sortOrder: 1, 
  isDefault: 1, 
  createdBy: '', 
  createdOn: '',
  specialtyIds: []
};

@Component({
  selector: 'app-edit-profession-modal',
  templateUrl: './edit-profession-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditProfessionModalComponent implements OnInit, OnDestroy {
  @Input() id: any;
  isLoading$;
  prof: Profession;
  endpoint:any;
  formGroup: FormGroup;
  industoriesList: any = [];
  SpecialtiesList: any = [];
  specialtyModel: any = [];
  specialty = new Array();
  userId;
  private subscriptions: Subscription[] = [];
  constructor(
    private entityService: ProfessionService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.userId = localStorage.getItem('userId');
     }

  ngOnInit(): void {
    this.isLoading$ = this.entityService.isLoading$;
    this.loadCategory();
    this.getIndustory();
    this.getSpecialties();
    console.log(this.id)

  }
  getIndustory(){
    const getIndustory  = `industry?adminId=${this.userId}`;
    this.entityService.fetchData(getIndustory).subscribe((res: any)=> {
      this.industoriesList = res.items;
      console.log(res);
    })
  }
  getSpecialties(){
    const getIndustory  = `specialty?adminId=${this.userId}`;
    this.entityService.fetchData(getIndustory).subscribe((res: any)=> {
      this.SpecialtiesList = res.items;
      console.log(res);
    })
  }

  loadCategory() {
    if (!this.id) {
      this.prof = EMPTY_PROF;
      this.loadForm();
    } else {
      const endPoint = `professionById?adminId=${this.userId}&professionId=${this.id}`
      const sb = this.entityService.getItemById(endPoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_PROF);
        })
      ).subscribe((Profession: any) => {
        this.prof = Profession.profession;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      professionName: [this.prof.professionName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      description: [this.prof.description, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])],
      industryId: [this.prof.industryId, Validators.compose([Validators.required])],
      isDefault: [this.prof.isDefault, Validators.compose([Validators.required])],
    });
  }

  save() {
    this.prepareRole();
    if (this.prof.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
     ;
    this.prof.adminId = this.userId;
    const endPoint = `updateProfession`;
    this.prof.specialtyIds = this.specialty;
    const sbUpdate = this.entityService.update(endPoint, this.prof).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.prof);
      }),
    ).subscribe(res =>{
      this.prof = res;
    } );
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.prof.adminId = this.userId;
    const endPoint = `profession`;
    this.prof.specialtyIds = this.specialty;
    const sbCreate = this.entityService.post(endPoint, this.prof).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.prof);
      }),
    ).subscribe((res: Profession) => {
     // this.prof = res;
      console.log(res);

    })
    this.subscriptions.push(sbCreate);
  }

  private prepareRole() {
    const formData = this.formGroup.value;
    this.prof.professionName = formData.professionName;
    this.prof.description = formData.description;
    this.prof.industryId = formData.industryId;
    this.prof.isDefault = formData.isDefault;
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
    this.specialty.push(event.target.value);

  //  console.log(event.target.value);
     /* Selected */
  if(event.target.checked){
    // Add a new control in the arrayForm
   // formArray.push(new FormControl(event.target.value));
  }
  /* unselected */
  else{
    // find the unselected element
    let i: number = 0;

  //  formArray.controls.forEach((ctrl: FormControl) => {
  //    if(ctrl.value == event.target.value) {
  //      formArray.removeAt(i);
   //     return;
   //   }

    //  i++;
   // });
  }
  }
}
