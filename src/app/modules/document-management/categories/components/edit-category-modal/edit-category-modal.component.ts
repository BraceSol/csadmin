import { Component, Input, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { DocumentCategory } from '../../../_models/documentCategories.model';
import { CategoryService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';



@Component({
  selector: 'app-edit-category-modal',
  templateUrl: './edit-category-modal.component.html',
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditDocumentCategoryModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() id: any;
  isLoading$;
  endpoint:any;
  docCat: DocumentCategory;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  userId;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  selectedValue: any;

  industoryApiData : any;
  industriesList: any = [];
  docCategoryData: any = {};
  
 EMPTY_CAT = {
  id: undefined,
  docCategoryId: undefined,
  industryId: '', 
  categoryName: '',
  adminId: '',
  description: '', 
  createdBy: '', 
  createdOn: '', 
  isEnabled: 1
};
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private categoryService: CategoryService
    ) {
      this.userId = localStorage.getItem('userId');
      console.log(this.userId)
      this.getIndustory();
    }
    ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.isLoading$ = this.categoryService.isLoading$;
    this.loadCategory();
  }
  getIndustory(){
    const getIndustory  = `industry?adminId=${this.userId}`;
    this.categoryService.fetchData(getIndustory).subscribe((res: any)=> {
      this.industriesList = res.items;
      console.log(res);
    })
  }



  loadCategory() {

    if (!this.id) {
      this.docCat = this.EMPTY_CAT;
      this.loadForm();
    } else {

      const getIndustory  = `getDocumentCategoryById?adminId=${this.userId}&documentCategoryId=${this.id}`;
      this.categoryService.fetchData(getIndustory).subscribe((res: any)=> {
        console.log(res);
        this.docCat = res.documentCategory;
        this.loadForm();
      })
    }
      // const sb = this.categoryService.getItemById(this.id).pipe(
      //   first(),
      //   catchError((errorMessage) => {
      //     this.modal.dismiss(errorMessage);
      //     return of(EMPTY_CAT);
      //   })
      // ).subscribe((DocumentCategory: DocumentCategory) => {
      //   this.docCat = DocumentCategory;
      //   this.loadForm();
      // });
      // this.subscriptions.push(sb);

  }

  loadForm() {
    this.formGroup = this.fb.group({
      industryId: [this.docCat.industryId, Validators.compose([Validators.required])],
      categoryName: [this.docCat.categoryName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      description: [this.docCat.description, Validators.compose([Validators.maxLength(200)])],
      isEnabled: [this.docCat.isEnabled, Validators.compose([Validators.required])]

    });
  }

  save() {
    console.log('category for save', this.formGroup.value);
    this.prepareRole();
    if (this.docCat.id) {
      this.edit();
    } else {
      this.create();
    }
  }

 
   



    // const sbUpdate = this.categoryService.update(this.docCat).pipe(
    //   tap(() => {
    //     this.modal.close();
    //   }),
    //   catchError((errorMessage) => {
    //     this.modal.dismiss(errorMessage);
    //     return of(this.docCat);
    //   }),
    // ).subscribe(res => this.docCat = res);
    // this.subscriptions.push(sbUpdate);
  


  edit() {

    const updateDocCategory = `updateDocumentCategory`;
   this.docCat.adminId= 'ed5db5b0-0a68-43ba-b1d2-96079ee884f8';
    this.categoryService.postData(updateDocCategory, this.docCat).subscribe((res: any)=> {
      this.docCat= res.documentCategory;
      this.modal.close();
    
      console.log(res);
    })
  }
  closeModel(){
    this.modal.close();
  }

  create() {
    this.docCategoryData = this.docCat;
    this.docCategoryData.adminId = 'ed5db5b0-0a68-43ba-b1d2-96079ee884f8';
    const postDocCategory = `createDocumentCategory`;
    console.log('document Category', this.docCategoryData);
    this.categoryService.postData(postDocCategory, this.docCat).subscribe((res: any)=> {
      this.modal.close();
      console.log(res);
    })
    // const sbCreate = this.entityService.create(this.docCat).pipe(
    //   tap(() => {
    //     this.modal.close();
    //   }),
    //   catchError((errorMessage) => {
    //     this.modal.dismiss(errorMessage);
    //     return of(this.docCat);
    //   }),
    // ).subscribe((res: DocumentCategory) => this.docCat = res);
    // this.subscriptions.push(sbCreate);
  }

  private prepareRole() {
    const formData = this.formGroup.value;
    this.docCat.docCategoryId = this.id;
    this.docCat.industryId = formData.industryId;
    this.docCat.isEnabled = formData.isEnabled;
    this.docCat.categoryName = formData.categoryName;
    this.docCat.description = formData.description;
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
