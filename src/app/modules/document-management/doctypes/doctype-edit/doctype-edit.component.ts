import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DocumentType } from '../../_models/documentTypes.model';
import { DoctypesService } from '../../_services';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

const EMPTY_DOC: DocumentType = {
  id: undefined,
  docCategoryId: '',
  employerId: '',
  documentName: '',
  description: '',
  requirementLevel: 1,
  prefix: '',
  exampleDocuments: null,
  references: null,
  createdOn: '',
  createdBy: '',
  updatedOn: '',
  updatedBy: '',
  statusCode: 1
}


@Component({
  selector: 'app-doctype-edit',
  templateUrl: './doctype-edit.component.html'
})
export class DoctypeEditComponent implements OnInit, OnDestroy {
  signupForm:FormGroup;
  id: string;
  docTypeModel = {
   adminId: '',
   id: undefined,
   docCategoryId: '',
   employerId: '',
   documentName: '',
   description: '',
   requirementLevel: 1,
   prefix: '',
   exampleDocuments: null,
   references: null,
   createdOn: '',
   createdBy: '',
   updatedOn: '',
   updatedBy: '',
   statusCode: '1'
  };
  doctype: any;
  previous: any;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    ATTRIBUTES_TAB: 1,
    RULES_TAB: 2,
    EXAMPLES_TAB: 3,
    REFERENCES_TAB: 4
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Attributes | 2 => Rules | 3 => Example Docs | 4 => References
  private subscriptions: Subscription[] = [];
  userId;
  documentCategoryList: any = [];
  public docTypEditeSubject = new BehaviorSubject([]);

  constructor(
    private fb: FormBuilder,
    private doctypeService: DoctypesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = localStorage.getItem('userId');
    this.getDocumentCategory();
    this.route.params.subscribe((params: Params) => {
      // console.log(params.id);
      this.id = params.id;
    });
    this.loadDocType();
  }

  ngOnInit(): void {
    this.isLoading$ = this.doctypeService.isLoading$;
this.getDocumentCategory() 
this.signupForm = new FormGroup({
  'documentName': new FormControl(null,Validators.required),
  'prefix': new FormControl(null,Validators.required),
  'description' : new FormControl(null,Validators.required),
  'docCategoryId': new FormControl(null,Validators.required)
})

  }
  onSubmit(){
    console.log(this.signupForm);
  }
  getDocumentCategory() {
    const getDocCategory  = `getAllDocumentCategories?adminId=${this.userId}`;
    this.doctypeService.fetchData(getDocCategory).subscribe((res: any)=> {
      console.log(this.documentCategoryList);
      this.documentCategoryList = res.items;
  
    })
  }
  loadDocType() {
    if (!this.id) {
      this.doctype = EMPTY_DOC;
      //this.loadForm();
    } else {

      const getDocTypeById  = `documentTypeById?adminId=${this.userId}&documentTypeId=${this.id}`;
      this.doctypeService.fetchData(getDocTypeById).subscribe((res: any)=> {
        console.log(res);
         this.docTypeModel = res.documentType;
         //this.loadData(res.documentType)
         this.docTypEditeSubject.next(res.documentType);

      })
    }
  }
  loadData(data) {
    this.docTypeModel = data;
  }

 loadForm() {
    this.formGroup = this.fb.group({
      documentName: [this.doctype.documentName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      // description: [this.doctype.description, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])],
      // prefix: [this.doctype.prefix, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])],
      // docCategoryId: [this.doctype.docCategoryId],
      // employerId: [this.doctype.employerId],
    });
  }


  reset() {
   //this.loadForm();
  }

  save() {  
    // this.prepareCate()
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }
  private prepareCate() {
    console.log("pre")
    const formData = this.formGroup.value;
    
    console.log("this.formGroup.value",this.formGroup.value)
    this.docTypeModel.documentName = formData.documentName;
    // this.docTypeModel.description = formData.description;
    // this.docTypeModel.docCategoryId = formData.docCategoryId;
  }

  edit() {
    const updateDocType = `updateDocumentType`;
    console.log(this.docTypeModel);
    this.docTypeModel.adminId = this.userId;
        this.doctypeService.postData(updateDocType, this.docTypeModel).subscribe((res: any)=> {
          this.router.navigate(['/documents/doctypes'])
      console.log(res);
    })
  }

  create() {

    this.docTypeModel.adminId = this.userId;
    this.docTypeModel.requirementLevel = 1;
    this.docTypeModel.statusCode = '2';
    const postDocType = `createDocumentType `;
    console.log('document Category', this.docTypeModel);
    this.doctypeService.postData(postDocType, this.docTypeModel).subscribe((res: any)=> {
      this.router.navigate(['/documents/doctype/edit/' + res.items.id])
    })


  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View

}
