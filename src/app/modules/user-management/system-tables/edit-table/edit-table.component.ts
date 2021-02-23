import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { SystemTable } from '../../_models/systemtable.model';
import { SystemTablesService } from '../../_services/systemtables.service';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_metronic/core';

import{AuthHTTPService} from '../../../auth/_services/auth-http'
const EMPTY_REC: SystemTable = {
  id: undefined,
  systemTableId: '',
  adminId: '',
  tableGroup: '',
  tableName: '',
  optionText: '',
  optionValue: '',
  optionSequence: 1,
  createdAt: '',
  updatedAt: '',
  isActive: 1,
  systemtable: {}
};

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditTableComponent implements OnInit, OnDestroy {
  @Input() id: any;
  isLoading$;
  endpoint:string;
  systemTable: SystemTable;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  tableGroup = [
    {id: 1, value:"TableGroup_value_1" },
    {id: 2, value:"TableGroup_value_2" },
    {id: 3, value:"TableGroup_value_3" },
    {id: 4, value:"TableGroup_value_4" },
    {id: 5, value:"TableGroup_value_5" },
    {id: 6, value:"System" },

  ];
  userId: string;
  constructor(
    private authHttpSerice : AuthHTTPService,
    private entityService: SystemTablesService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.entityService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      console.log("id not found")
      this.systemTable = EMPTY_REC;
      this.loadForm();
    } else {
      const userId =localStorage.getItem('userId')
      this.endpoint=`systemTable?systemTableId=${this.id}&adminId=${userId}`
      const sb = this.entityService.getItemById(this.endpoint).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_REC);
        })
      ).subscribe((systemTable: any) => {
        this.systemTable = systemTable.systemTable;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      tableGroup: [this.systemTable.tableGroup, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      tableName: [this.systemTable.tableName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])], 
      optionText: [this.systemTable.optionText, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])], 
      optionValue: [this.systemTable.optionValue, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])], 
      optionSequence: [this.systemTable.optionSequence, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])], 
    });
  }

  save() {
    this.prepareSystemTable();
    if (this.systemTable.id) {
      console.log("=======edit=====")
      this.edit();
    } else {
      console.log("=======create=====")
      this.create();
    }
  }

  edit() {
    this.systemTable.adminId =this.userId
    this.systemTable.systemTableId = this.id;
    this.endpoint=`updateSystemTable`
    console.log(this.systemTable)
    const sbUpdate = this.entityService.update(this.endpoint,this.systemTable).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.systemTable);
      }),
    ).subscribe(res => this.systemTable = res);
    this.subscriptions.push(sbUpdate);
  }

  // create() {
  //   this.endpoint=`postRole`
  //   const sbCreate = this.entityService.create(this.systemTable).pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.systemTable);
  //     }),
  //   ).subscribe((res: SystemTable) => this.systemTable = res);
  //   this.subscriptions.push(sbCreate);
  // }


  create() {
    this.systemTable.adminId = this.userId;
    this.endpoint=`systemTable`
    this.entityService.post(this.endpoint, this.systemTable).subscribe((res: any)=> {
      console.log(res.message)
      if(!res.hasError){
        this.modal.close();
      } else {
      }
      console.log(res);
    },
    error => {
      console.log('server Error');
    })
  }
  private prepareSystemTable() {
    const formData = this.formGroup.value;
    this.systemTable.tableGroup = formData.tableGroup;
    this.systemTable.tableName = formData.tableName;
    this.systemTable.optionText = formData.optionText;
    this.systemTable.optionValue = formData.optionValue;
    this.systemTable.optionSequence = formData.optionSequence;
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
