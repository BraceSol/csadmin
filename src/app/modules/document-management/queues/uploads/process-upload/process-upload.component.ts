import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import KTWizard from '../../../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../../../assets/js/components/util';
import { of, Observable, Subscription } from 'rxjs';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { catchError, first, tap } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { UploadService } from '../../../_services/uploads.service';
import { UppyConfig } from "uppy-angular/uppy-angular";
const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-process-upload',
  templateUrl: './process-upload.component.html',
  styleUrls: ['./process-upload.component.scss']
})
export class ProcessUploadComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: any;
  @ViewChild('wizard', { static: true }) el: ElementRef;
  config: any = { options: {}};
  qeuesList:any=[];
  docList:any=[];
  fieldOptions:any=[]
  attributeList:any=[];
  settings: UppyConfig = {
    uploadAPI: {
      endpoint: 'files/Upload',
      headers: {
          Authorization: 'Bearer ' + localStorage.getItem('userToken')
      }
    },
    statusBarOptions: {}, 
    uploaderLook: {
      theme: 'light',
      width: 500, 
      height: 600, 
      thumbnailWidth: 200
    },
    plugins: {
        Webcam: true,
        GoogleDrive: true,
        Instagram: true,
        Facebook: true,
        Dropbox: true,
        ScreenCapture:true
    },
    restrictions: {
        maxFileSize: 1000000,
        maxNumberOfFiles: 10,
        minNumberOfFiles: 1
    }, 
    options: {
      id: 'tomstestuppy', //A site-wide unique ID for the instance.
      debug: true,
      browserBackButtonClose: false,
      autoProceed: false,
      allowMultipleUploads: true,
      meta: {} 
  }
}
  model: any = {
    userId: '', 
    queueId: '', 
    documentTypeId: '', 
    filename: '', 
    documentLocation: '', 
    attributes: [], 
    employerId: ''
  };
  submitted = false;
  wizard: any;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  constructor(
    config: NgbTypeaheadConfig,
    public thisService: UploadService, 
  ) {
  }

  ngOnInit() {

    this.getDocType();
  }

  ngAfterViewInit(): void {
    // Initialize form wizard
    this.wizard = new KTWizard(this.el.nativeElement, {
      startStep: 1
    });

    // Validation before going to next page
    this.wizard.on('beforeNext', (wizardObj) => {
      // https://angular.io/guide/forms
      // https://angular.io/guide/form-validation

      // validate the form and use below function to stop the wizard's step
      // wizardObj.stop();
    });

    // Change event
    this.wizard.on('change', () => {
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 500);
    });
  }
  getQueues(){
    let userId =localStorage.getItem('userId');

    const endpoint  = `getQueus?adminId=${userId}&isSystem=1`;
    this.thisService.fetchData(endpoint).subscribe((res: any)=> {
      this.qeuesList = res.items;
    })
  }
  getDocType(){
    let userId =localStorage.getItem('userId');
    const endpoint  = `allDocumentTypes?adminId=${userId}`;
    this.thisService.fetchData(endpoint).subscribe((res: any)=> {
      this.docList = res.items;
    })
  }
  getAttributes(id){
    let userId =localStorage.getItem('userId');
    const endpoint  = `allAttributesByDocumentTypeId?adminId=${userId}&documentTypeId=${id}`;
    this.thisService.fetchData(endpoint).subscribe((res: any)=> {
      this.attributeList = res.items;
    })
  }
  saveName(obj,selected){
// console.log(obj,selected)
obj["answer"] = selected
console.log(obj)
this.model.attributes.push(obj)
  }
  saveNumber(obj,selected){
    // console.log(obj,selected)
    obj["answer"] = selected
    console.log(obj)
    this.model.attributes.push(obj)
      }
  saveOptions(array,obj,selected){
    console.log(obj)
let index = array.findIndex(x=> x.caption === selected);
array[index].answer = selected;
let answerIndex = array.findIndex(x=> x.answer && x.answer !== selected);
if(answerIndex !== -1) {
  let tempObj = array[answerIndex];
  delete tempObj["answer"];
  array[answerIndex] = tempObj;
}
this.fieldOptions = array;
// array.answer=selected;

this.model.attributes.push(obj)
// this.model.attributes.push(obj)
// this.fieldOptions.push(array)
console.log(this.model.attributes)

  }
  onSubmit() {
    this.submitted = true;
  }
  onFileUpload(evt) {
    console.log(evt);
  }
  ngOnDestroy() {
    this.wizard = undefined;
  }
}
