import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import KTWizard from '../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../assets/js/components/util';

import { ActivatedRoute, Router } from '@angular/router';
import { ProfessionalsService } from '../_services';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-add-professional',
  templateUrl: './add-professional.component.html',
  styleUrls: ['./add-professional.component.scss']
})
export class AddProfessionalComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('wizard', { static: true }) el: ElementRef;
endpoint:any;
proResults:any;
spResults:any;
  model: any = {
    firstName: '',
    lastName: '',
    phone: '',
    fullName:'',
    email: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
    professionId: '', 
    specialtyId: '', 
    licenseState: '', 
    issueDate:'',
    expirationDate:'',
    professionName:'',
    licenseNumber: '', 
    licenseExpiration: '', 
    licenseExpirationMonth: '',
    licenseExpirationYear: '',
    packaging: '',
    preferreddelivery: '',
    locaddress1: '',
    locaddress2: '',
    locpostcode: '',
    loccity: '',
    locstate: '',
    loccountry: '',
    ccname: '',
    ccnumber: '',
    ccmonth: '',
    ccyear: '',
    cccvv: '',
profileName :'Professional'
  };
  submitted = false;
  wizard: any;

  constructor(

    private router: Router,
    private route: ActivatedRoute,
    private profService: ProfessionalsService,
  ) {
  }

  ngOnInit() {
    this.getAllProfessions();
    // this.getAllSpecialties();
  }
  getAllProfessions(){
      let userId= localStorage.getItem('userId')
      this.endpoint = `profession?adminId=${userId}`;
      this.profService.fetchData(this.endpoint).subscribe((x:any) =>{
      this.proResults=x.items;
    })
  }
  getAllSpecialties(id){
    let userId= localStorage.getItem('userId')
    this.endpoint=`specialtiesByProfession?adminId=${userId}&professionId=${id}`
    this.profService.fetchData(this.endpoint).subscribe((x:any) =>{
      this.spResults=x.items;
    })
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
  stateList= [
		{value: 'Alabama', viewValue: 'Alabama'},
		{value: 'Alaska', viewValue: 'Alaska'},
		{value: 'Arizona', viewValue: 'Arizona'},
		{value: 'Arkansas', viewValue: 'Arkansas'},
		{value: 'California', viewValue: 'California'},
		{value: 'Colorado', viewValue: 'Colorado'},
		{value: 'Connecticut', viewValue: 'Connecticut'},
		{value: 'Delaware', viewValue: 'Delaware'},
		{value: 'District Of Columbia', viewValue: 'District Of Columbia'},
		{value: 'Florida', viewValue: 'Florida'},
		{value: 'Georgia', viewValue: 'Georgia'},
		{value: 'Hawaii', viewValue: 'Hawaii'},
		{value: 'Idaho', viewValue: 'Idaho'},
		{value: 'Illinois', viewValue: 'Illinois'},
		{value: 'Indiana', viewValue: 'Indiana'},
		{value: 'Iowa', viewValue: 'Iowa'},
		{value: 'Kansas', viewValue: 'Kansas'},
		{value: 'Kentucky', viewValue: 'Kentucky'},
		{value: 'Louisiana', viewValue: 'Louisiana'},
		{value: 'Maine', viewValue: 'Maine'},
		{value: 'Maryland', viewValue: 'Maryland'},
		{value: 'Massachusetts', viewValue: 'Massachusetts'},
		{value: 'Michigan', viewValue: 'Michigan'},
		{value: 'Minnesota', viewValue: 'Minnesota'},
		{value: 'Mississippi', viewValue: 'Mississippi'},
		{value: 'Missouri', viewValue: 'Missouri'},
		{value: 'Montana', viewValue: 'Montana'},
		{value: 'Nebraska', viewValue: 'Nebraska'},
		{value: 'Nevada', viewValue: 'Nevada'},
		{value: 'New Hampshire', viewValue: 'New Hampshire'},
		{value: 'New Jersey', viewValue: 'New Jersey'},
		{value: 'New Mexico', viewValue: 'New Mexico'},
		{value: 'New York', viewValue: 'New York'},
		{value: 'North Carolina', viewValue: 'North Carolina'},
		{value: 'North Dakota', viewValue: 'North Dakota'},
		{value: 'Ohio', viewValue: 'Ohio'},
		{value: 'Oklahoma', viewValue: 'Oklahoma'},
		{value: 'Oregon', viewValue: 'Oregon'},
		{value: 'Pennsylvania', viewValue: 'Pennsylvania'},
		{value: 'Rhode Island', viewValue: 'Rhode Island'},
		{value: 'South Carolina', viewValue: 'South Carolina'},
		{value: 'South Dakota', viewValue: 'South Dakota'},
		{value: 'Tennessee', viewValue: 'Tennessee'},
		{value: 'Texas', viewValue: 'Texas'},
		{value: 'Utah', viewValue: 'Utah'},
		{value: 'Vermont', viewValue: 'Vermont'},
		{value: 'Virginia', viewValue: 'Virginia'},
		{value: 'Washington', viewValue: 'Washington'},
		{value: 'Washington, D.C.', viewValue: 'Washington, D.C.'},
		{value: 'West Virginia', viewValue: 'West Virginia'},
		{value: 'Wisconsin', viewValue: 'Wisconsin'},
		{value: 'Wyoming', viewValue: 'Wyoming'}
		];
  onSubmit() {
    this.model.fullName=`${this.model.firstName} ${this.model.lastName}`
    this.model.issueDate=`${this.model.licenseExpirationYear}-${this.model.licenseExpirationMonth}`
    this.model.expirationDate=`${this.model.licenseExpirationYear}-${this.model.licenseExpirationMonth}`
this.endpoint=`createProfessional`
this.profService.postData(this.endpoint,this.model).subscribe((x:any)=>{
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
