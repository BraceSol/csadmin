import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import KTWizard from '../../../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../../../assets/js/components/util';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessionalDocsService } from '../../../_services';

import { UppyConfig } from "uppy-angular/uppy-angular";

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class UploadDocumentComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('wizard', { static: true }) el: ElementRef;

  config: any = { options: {}};

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
    string:'',
    defaultValue:'',
    attributes: [],
    employerId: ''
  };
  
  submitted = false;
  wizard: any;
  qeuesList:any=[];
  docList:any=[];
  fieldOptions:any=[]
  attributeList:any=[];
  endpoint:any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public docsService: ProfessionalDocsService
  ) {
  }

  onFileUpload(evt) {
    console.log(evt);
  }

  ngOnInit() {
    this.getQueues();
    this.getDocType();
    // this.getAttributes();
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
    this.docsService.fetchData(endpoint).subscribe((res: any)=> {
      this.qeuesList = res.items;
    })
  }
  getDocType(){
    let userId =localStorage.getItem('userId');
    const endpoint  = `allDocumentTypes?adminId=${userId}`;
    this.docsService.fetchData(endpoint).subscribe((res: any)=> {
      this.docList = res.items;
    })
  }
  getAttributes(id){
    let userId =localStorage.getItem('userId');
    const endpoint  = `allAttributesByDocumentTypeId?adminId=${userId}&documentTypeId=${id}`;
    this.docsService.fetchData(endpoint).subscribe((res: any)=> {
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
    console.log("value of x",this.model)
    // this.model.attributes.push(this.model.fieldOptions)

    
    this.endpoint=`upload`
    this.docsService.postData(this.endpoint,this.model).subscribe((x:any)=>{
      console.log("value of x",x)
      if(x.hasError===false){
        console.log("log x",x)
        this.router.navigate(['/professionals/listing'])
      }else{
        console.log("else part is working now")
      }
    })
  }

  ngOnDestroy() {
    this.wizard = undefined;
  }
}
