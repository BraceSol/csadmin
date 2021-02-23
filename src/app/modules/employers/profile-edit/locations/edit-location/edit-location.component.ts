import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { EmployerLocationService } from '../../../_services/locations.service';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { EmployerLocation } from '../../../_models';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_REC: EmployerLocation = {
  id: undefined,
  employerId: '',
  location:{},
  employerLocationId:'',
  adminId:'',
  locationName: '',
  idNumber: '',
  description: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  city: '',
  state: '',
  postalCode: '',
  county: '',
  country: '',
  phone: '',
  website: '',
  bedCount: 0, 
  totalFTE: 0, 
  createdBy: '',
  updatedBy: '',
  isActive: 1
};

@Component({
  selector: 'app-locations-edit',
  templateUrl: './edit-location.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditLocationModalComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() employerId: string;
  isLoading$;
  endpoint:any;
  entityRec: EmployerLocation;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private locationService: EmployerLocationService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.locationService.isLoading$;
    this.loadRemarks();
  }

  loadRemarks() {
    if (!this.id) {
      this.entityRec = EMPTY_REC;
      this.entityRec.employerId = this.employerId;
      this.loadForm();
    } else {

  let userId =localStorage.getItem('userId');
  this.endpoint=`getEmployerLocationById?adminId=${userId}&employerLocationId=${this.id}&employerId=${this.employerId}`
      const sb = this.locationService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REC;
          empty.employerId = this.employerId;
          return of(empty);
        })
      ).subscribe((location: EmployerLocation) => {
        this.entityRec = location.location;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      locationName: [this.entityRec.locationName, Validators.compose([])],
      idNumber: [this.entityRec.idNumber, Validators.compose([])],
      description: [this.entityRec.description, Validators.compose([])],
      addressLine1: [this.entityRec.addressLine1, Validators.compose([])],
      addressLine2: [this.entityRec.addressLine2, Validators.compose([])],
      addressLine3: [this.entityRec.addressLine3, Validators.compose([])],
      city: [this.entityRec.city, Validators.compose([])],
      state: [this.entityRec.state, Validators.compose([])],
      postalCode: [this.entityRec.postalCode, Validators.compose([])],
      phone: [this.entityRec.phone, Validators.compose([])],
      website: [this.entityRec.website, Validators.compose([])],
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
  this.entityRec.employerLocationId=this.id;
  this.entityRec.employerId=this.employerId;
  console.log("locationnnnnnnnnnnnnnnnn",this.entityRec)
  this.endpoint=`updateEmployerLocation`
    const sbUpdate = this.locationService.update(this.endpoint,this.entityRec).pipe(
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
  //   const sbCreate = this.locationService.create(this.entityRec).pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.entityRec);
  //     }),
  //   ).subscribe((res: EmployerLocation) => this.entityRec = res);
  //   this.subscriptions.push(sbCreate);
  // }

  create() {
    this.entityRec.adminId =localStorage.getItem('userId')
    this.entityRec.employerId=this.employerId;
    console.log("locationnnnnnnnnnnnnnnnn",this.entityRec)
    this.endpoint=`postEmployerLocation`
    console.log(' this.endpoint=`postEmployerLocation`', this.endpoint);
    this.locationService.postData(this.endpoint, this.entityRec).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
  }
  private prepareRemark() {
    const formData = this.formGroup.value;
    this.entityRec.employerId = this.employerId;
    this.entityRec.locationName = formData.locationName;
    this.entityRec.state=formData.state;
    this.entityRec.addressLine1=formData.addressLine1;
    this.entityRec.addressLine2=formData.addressLine2;
    this.entityRec.addressLine3=formData.addressLine3;
    this.entityRec.city=formData.city;
    this.entityRec.postalCode=formData.postalCode;
    this.entityRec.phone=formData.phone;
    this.entityRec.website=formData.website;
    this.entityRec.idNumber=formData.idNumber;
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
