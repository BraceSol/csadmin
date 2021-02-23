import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Industry } from '../../_models/industry.model';
import { IndustryService } from '../../_services/industry.service';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_metronic/core';

import{AuthHTTPService} from '../../../auth/_services/auth-http'
const EMPTY_REC: Industry = {
  id: undefined,
  industryId: '',
  adminId: '',
  industryName: '',
  description: '',
  createdAt: '',
  updatedAt: '',
  isActive: 1,
  industry: {}
};

@Component({
  selector: 'app-edit-industry',
  templateUrl: './edit-industry.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditIndustryComponent implements OnInit, OnDestroy {
  @Input() id: any;
  isLoading$;
  endpoint:string;
  industry: Industry;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  userId: string;
  constructor(
    private authHttpSerice : AuthHTTPService,
    private entityService: IndustryService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.userId =localStorage.getItem('userId');
    this.isLoading$ = this.entityService.isLoading$;
    this.loadCustomer();

  }

  loadCustomer() {
    if (!this.id) {
      console.log("id not found")
      this.industry = EMPTY_REC;
      this.loadForm();
    } else {
      this.endpoint=`industryById?industryId=${this.id}&adminId=${this.userId}`
      const sb = this.entityService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_REC);
        })
      ).subscribe((industry: any) => {
        this.industry = industry.industry;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      industryName: [this.industry.industryName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      description: [this.industry.description, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])]
    });
  }

  save() {
    this.prepareIndustry();
    if (this.industry.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    this.industry.adminId =this.userId;
    this.endpoint=`updateIndustry`
    console.log(this.industry)
    this.industry.industryId = this.id;
    const sbUpdate = this.entityService.update(this.endpoint,this.industry).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.industry);
      }),
    ).subscribe(res => {
      this.industry = res;
    });
    this.subscriptions.push(sbUpdate);
  }

  // create() {
  //   this.endpoint=`postRole`
  //   const sbCreate = this.entityService.create(this.industry).pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.industry);
  //     }),
  //   ).subscribe((res: Industry) => this.industry = res);
  //   this.subscriptions.push(sbCreate);
  // }


  create() {
    this.industry.adminId =this.userId;
    this.endpoint=`industry`
    console.log(' this.endpoint=`industry`', this.endpoint);
    this.entityService.post(this.endpoint, this.industry).subscribe((res: any)=> {
      this.modal.close();
    })
  }
  private prepareIndustry() {
    const formData = this.formGroup.value;
    this.industry.industryName = formData.industryName;
    this.industry.description = formData.description;
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
