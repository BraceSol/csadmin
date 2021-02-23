import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import KTWizard from '../../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../../assets/js/components/util';

import { ActivatedRoute, Router } from '@angular/router';
import { CsUserService } from '../../_services/csuser.service';
import{AuthHTTPService} from '../../../auth/_services/auth-http/auth-http.service'
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('wizard', { static: true }) el: ElementRef;
  profileTypesResult:any;
  endpoint:any;
  model: any = {
    firstName: '',
    lastName: '',
    twoFactorEnabled:'true',
    profileName: '', 
    phone: '',
    email: '',
    deviceCode: '11111111',
    deviceName: ' ',
    fullName:'',
    lastLocation:' ',
    licenseNumber: '123456789012',
    password: '', 
    passwordConfirm: '', 
    state:'',
    security:'',
    roleId: '',
  };

  submitted = false;
  wizard: any;

  constructor(

    private router: Router,
    private route: ActivatedRoute,
    private usersService: CsUserService,
    private authHttpSerice : AuthHTTPService,
  ) {
  }

  ngOnInit() {
    this.authHttpSerice.getAllUserTypes().subscribe((x:any)=>{
      this.profileTypesResult =x.profileTypes
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

    const lat =localStorage.getItem('lat')
		const lng =localStorage.getItem('lng')
    const browser=localStorage.getItem("browser");
    this.model.fullName=`${ this.model.firstName} ${ this.model.lastName}`
    this.model.lastLocation=`${lat},${lng}`;
    this.model.deviceName=browser;
    console.log(this.model)
    this.endpoint=`signup`
    this.usersService.postData(this.endpoint,this.model).subscribe((x:any)=>{
      console.log("value of x",x)
      if(x.hasError===false){
        console.log("log x",x)

        this.router.navigate(['/admin/users'])
      }else{
        console.log("else part is working now")
      }
    })
  }

  ngOnDestroy() {
    this.wizard = undefined;
  }
}
