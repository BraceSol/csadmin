import { Component, Input, OnDestroy, OnInit,  ViewChild, ElementRef  } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription, BehaviorSubject } from 'rxjs';
import { DoctypeAttributesService } from '../../../../_services';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { DocumentTypeAttribute } from '../../../../_models/documentTypeAttributes.model';
import { catchError, first, tap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { find, get, pull } from 'lodash';

const EMPTY_ATTRIB: DocumentTypeAttribute = {
  id: undefined,
  documentTypesId: '',
  attributeName: '',
  title: '', 
  description: '',
  attributeType: '',
  helpText: '',
  defaultValue: '',
  maxLength: 100,
  fieldOptions: null,
  minValue: 0,
  maxValue: 0,
  multipleSelect: 0, 
  createdOn: '',
  createdBy: '',
  updatedOn: '',
  updatedBy: '',
  statusCode: 1
};

@Component({
  selector: 'app-edit-attributes-modal',
  templateUrl: './edit-attributes-modal.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditAttributeModalComponent implements OnInit, OnDestroy {
  @ViewChild('f')attributeForm:FormGroup;
  @Input() id: any;
  @Input() doctypeId: string;
  @ViewChild('tagInput') tagInputRef: ElementRef;
  tags: string[] = [];
  form: FormGroup;
  isLoading$;
  attribFieldOptions: string;
  attrib: DocumentTypeAttribute;
  formGroup: FormGroup;
  attributeModel: any = {};
  userId;
  public docAttributeSubject = new BehaviorSubject([]);
  hideSelect= true;
  private subscriptions: Subscription[] = [];
  constructor(
    private attributesService: DoctypeAttributesService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    private route: ActivatedRoute,

    ) {
      this.userId = localStorage.getItem('userId');

     }

  ngOnInit(): void {
    this.loadRemarks();
    console.log(this.doctypeId);
    this.form = this.fb.group({
      tag: [undefined],
    });
     this.getDocAttribute();
  }
  onSubmit(){
    console.log(this.attributeForm);
  }
  focusTagInput(): void {
    this.tagInputRef.nativeElement.focus();
  }

  onKeyUp(event: KeyboardEvent): void {
    const inputValue: string = this.form.controls.tag.value;
    if (event.code === 'Backspace' && !inputValue) {
      this.removeTag();
      return;
    } else {
      if (event.code === 'Comma' || event.code === 'Space') {
        this.addTag(inputValue);
        this.form.controls.tag.setValue('');
      }
    }
  }

  addTag(tag: string): void {
    if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
      tag = tag.slice(0, -1);
    }
    if (tag.length > 0 && !find(this.tags, tag)) {
      this.tags.push(tag);
    }
        console.log('tags', this.tags)

  }

  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.tags, tag);
    } else {
      this.tags.splice(-1);
    }
  }
  getDocAttribute() {
    const getCategory = `allDocumentTypesAttribute?adminId=${this.userId}`;
    this.attributesService.fetchData(getCategory).subscribe((res: any)=> {
      console.log(res.message);
      if(!res.hasError){
        this.docAttributeSubject.next(res.items);
        console.log(res.items);
      } else {
        // this.docAttributeSubject.next() = [];
      }
    }, error => {
      console.log('server error')
    })
  
  }
  loadForm() {
    this.formGroup = this.fb.group({
      title: [this.attrib.title],
      attributeName: [this.attrib.attributeName],
    });
  }
  loadRemarks() {
    if (!this.id) {
      this.attrib = EMPTY_ATTRIB;
      this.attrib.documentTypesId = this.doctypeId;
      this.loadForm();
    } else {
      const getAttributeById = `documentTypeAttributeById?adminId=${this.userId}&documentTypeAttributeId=${this.id}`;
      const sb = this.attributesService.getItemById(getAttributeById).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_ATTRIB;
          empty.documentTypesId = this.doctypeId;
          return of(empty);
        })
      ).subscribe((attribute: any) => {
        this.attrib = attribute.documentTypeAttribute;
        this.attributeModel = attribute.documentTypeAttribute;
        if (this.attributeModel.attributeType == "checkbox" || this.attributeModel.attributeType == "dropdown" || this.attributeModel.attributeType == "radio") {
          this.hideSelect = false;
          let fOptions: string[] = [];
          this.attributeModel.fieldOptions.forEach(function (value) {
            fOptions.push(value.value + " : " + value.caption);
          });
          this.attribFieldOptions = fOptions.join("\n");
        }
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  private prepareRole() {
    const formData = this.formGroup.value;
    this.attrib.title = formData.title;
    this.attrib.attributeName = formData.attributeName;

  }

  save() {
    this.prepareRole();
    // console.log(this.attribFieldOptions.split("\n"));
    if (!this.hideSelect) {
      let newJSON = (this.attribFieldOptions.split("\n")).map(x => ({ value: x.split(" : ")[0], caption: x.split(" : ")[1]}));
      this.attributeModel.fieldOptions = newJSON;
    }
    if (this.attrib.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    this.attributeModel.adminId  = this.userId ;
    this.attributeModel.documentTypeId  = this.doctypeId;
    this.attributeModel.documentTypeAttributeId  = this.id;
    this.attributeModel.statusCode = 1;
    const updateDocAtt = `updateDocumentTypeAttribute`;
    const sbUpdate = this.attributesService.update(updateDocAtt, this.attributeModel).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.attrib);
      }),
    ).subscribe(res =>{
      this.attrib = res;
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.attributeModel.adminId  = this.userId ;
    this.attributeModel.documentTypeId  = this.doctypeId;
    this.attributeModel.statusCode = 1;
    this.attributeModel.fieldOptions = this.tags;
    const postDocAtt = `createDocumentTypeAttribute `;
    this.attributesService.postData(postDocAtt, this.attributeModel).subscribe((res: any)=> {
       console.log(res);
      this.modal.close();
    })

  }
  onChangeSelect(value){
    console.log('change in select', value)
    if(value === 'dropdown' || value === 'radio' || value === 'checkbox') {
      this.hideSelect = false
    } else {
      this.hideSelect = true
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


}
