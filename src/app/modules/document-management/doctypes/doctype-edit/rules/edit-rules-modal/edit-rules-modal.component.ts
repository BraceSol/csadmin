import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription, BehaviorSubject } from 'rxjs';
import { DoctypeRulesService } from '../../../../_services';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { DocumentTypeRule } from '../../../../_models/documentTypeRules.model';
import { catchError, first, tap } from 'rxjs/operators';
import { QueryBuilderConfig, QueryBuilderClassNames } from 'angular2-query-builder';

const EMPTY_RULE: DocumentTypeRule = {
  id: undefined,
  title: '',
  description: '',
  ruleQuery: '',
  ruleConfig: null,
  createdBy: '',
  updatedBy: '',
  isActive: 1,
  statusCode: 1, 
  createdAt: '',
  updatedAt: '',
  documentTypeId: '',
  professionId: '',
  specialtyId: '',
  documentTypeRule: null,
  documentTypeRuleId: '', 
  adminId: ''
};

@Component({
  selector: 'app-edit-rules-modal',
  templateUrl: './edit-rules-modal.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditRuleModalComponent implements OnInit, OnDestroy {
  docRuleModel: any = {};
  objectQuery : any = {};
  expertiseList: any = [];
  professionList: any = [];

  @Input() id: any;
  @Input() doctypeId: string;
  isLoading$;
  rule: DocumentTypeRule;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  userId;
   query = {
     condition: 'and',
     rules: [
     ]
   };
   configurationObject: any = [];
   config: QueryBuilderConfig = { fields: {}} ;
  // config: QueryBuilderConfig = {...this.configurationObject}


  classNames: QueryBuilderClassNames = {
    removeIcon: 'fa fa-minus',
    addIcon: 'fa fa-plus',
    arrowIcon: 'fa fa-chevron-right px-2',
    button: 'btn',
    buttonGroup: 'btn-group',
    rightAlign: 'order-12 ml-auto',
    switchRow: 'd-flex px-2',
    switchGroup: 'd-flex align-items-center',
    switchRadio: 'custom-control-input',
    switchLabel: 'custom-control-label',
    switchControl: 'custom-control custom-radio custom-control-inline',
    row: 'row p-2 m-1',
    rule: 'border',
    ruleSet: 'border',
    invalidRuleSet: 'alert alert-danger',
    emptyWarning: 'text-danger mx-auto',
    operatorControl: 'form-control',
    operatorControlSize: 'col-auto pr-0',
    fieldControl: 'form-control',
    fieldControlSize: 'col-auto pr-0',
    entityControl: 'form-control',
    entityControlSize: 'col-auto pr-0',
    inputControl: 'form-control',
    inputControlSize: 'col-auto'
  }
  constructor(
    private rulesService: DoctypeRulesService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.userId = localStorage.getItem('userId');
    }

  ngOnInit(): void {
    this.isLoading$ = this.rulesService.isLoading$;
    this.loadRemarks();
    this.getProfessions();
    this.getExpertise();
  }
  getProfessions() {
    const getProfessions = `profession?adminId=${this.userId}`;
    this.rulesService.fetchData(getProfessions).subscribe((res: any)=> {
      console.log(res.message);
      if(!res.hasError){
        this.professionList = res.items;
      } else {
      }
    }, error => {
      console.log('server error')
    })
  }
  getExpertise() {
    const getExpertise = `specialty?adminId=${this.userId}`;
    this.rulesService.fetchData(getExpertise).subscribe((res: any)=> {
      console.log(res.message);
      if(!res.hasError){
        this.expertiseList = res.items;
      } else {
      }
    }, error => {
      console.log('server error')
    })
  }
  getDocAttribute() {
    const getCategory = `allDocumentTypesAttribute?adminId=${this.userId}`;
    this.rulesService.fetchData(getCategory).subscribe((res: any)=> {
      if(!res.hasError){
        this.createQueryuilderObject(res.items);
        this.config =  { fields: {...this.configurationObject} } ;
      } else {
        // this.docAttributeSubject.next() = [];
      }
    }, error => {
      console.log('server error')
    })
  }
  createQueryuilderObject(attributeList){
    this.configurationObject= attributeList.map(
      x => (
        {
           name: x.title,
           type: (x.attributeType === 'radio' || x.attributeType === 'checkbox' || x.attributeType === 'dropdown' || x.attributeType === 'category') ? "category" : x.attributeType, 
           operators: ['=', '<=', '>', '!='],
           options: (x.attributeType === 'radio' || x.attributeType === 'checkbox' || x.attributeType === 'dropdown' || x.attributeType === 'category') ? x.fieldOptions.map( y =>
              (
                { name: y.caption, value: y.value }
              )
            ) : []
         }
      )
    )
  }


  loadRemarks() {
    if (!this.id) {
      this.rule = EMPTY_RULE; 
      this.rule.documentTypeId = this.doctypeId;
      this.getDocAttribute();
    } else {
      const getAttributeById = `documentTypeRuleById?adminId=${this.userId}&documentTypeRuleId=${this.id}`;
      const sb = this.rulesService.getItemById(getAttributeById).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_RULE;
          empty.documentTypeId = this.doctypeId;
          return of(empty);
        })
      ).subscribe((returnedrule: any) => {
        this.rule = returnedrule.documentTypeRule;
        this.getDocAttribute();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      title: [this.rule.title, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000)])],
      description: [this.rule.description, Validators.compose([Validators.maxLength(1000)])],
      professionId: [this.rule.professionId],
      specialtyId: [this.rule.specialtyId],
    });
    if (this.rule.ruleQuery) this.query = JSON.parse(this.rule.ruleQuery);
  }

  save() {
    // this.prepareRule();
    if (this.rule.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    this.docRuleModel.documentTypeRuleId  = this.id;
    this.docRuleModel.title = this.rule.title;
    this.docRuleModel.description = this.rule.description;
    this.docRuleModel.ruleQuery = JSON.stringify(this.query);
    this.docRuleModel.ruleConfig = JSON.stringify(this.config);
    this.docRuleModel.documentTypeId = this.doctypeId;
    this.docRuleModel.statusCode = 1;
    this.docRuleModel.professionId = this.rule.professionId;
    this.docRuleModel.specialtyId = this.rule.specialtyId;
    this.docRuleModel.adminId  = this.userId;
    console.log(this.docRuleModel);
    const updateDocRule = `updateDocumentTypeRule`;
    const sbUpdate = this.rulesService.update(updateDocRule, this.docRuleModel).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.rule);
      }),
    ).subscribe(res =>{
      this.rule = res;
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.docRuleModel.ruleQuery = JSON.stringify(this.query);
    this.docRuleModel.adminId = this.userId;
    this.docRuleModel.documentTypeId = this.doctypeId;
    this.docRuleModel.ruleConfig=JSON.stringify(this.config);
    this.docRuleModel.statusCode=1;
    this.docRuleModel.title = this.rule.title;
    this.docRuleModel.description = this.rule.description;
    this.docRuleModel.professionId = this.rule.professionId;
    this.docRuleModel.specialtyId = this.rule.specialtyId;
    const postDocType = `createDocumentTypeRule`;
    this.rulesService.post(postDocType, this.docRuleModel).subscribe((res: any)=> {
      console.log('response', res);
    this.modal.dismiss()
    })
  }


  ngOnDestroy(): void {
    // this.subscriptions.forEach(sb => sb.unsubscribe());
  }


}
