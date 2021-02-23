import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../_models/user.model';
import { first } from 'rxjs/operators';
import{AuthHTTPService} from '../_services/auth-http'

import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  profileTypesResult:any;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private authHttpSerice : AuthHTTPService,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.authHttpSerice.getAllUserTypes().subscribe((x:any)=>{
			this.profileTypesResult =x.profileTypes
});
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        firstName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        profileType: ['', Validators.compose([
          // Validators.required
          
        ])
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        licenseNumber: ['', Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12)
        ])
        ],
        state: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])
        ],
        agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
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
  submit() {
    const lat =localStorage.getItem('lat')
		const lng =localStorage.getItem('lng')
		const browser=localStorage.getItem("browser");
    this.hasError = false;
    const result :any={};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });
    const newUser = new UserModel();
    newUser.setUser(result);
    newUser.lastLocation=`${lat},${lng}`,
    newUser.deviceName=browser
    newUser.profileName=result.profileType
    newUser.fullName=result.firstName+' '+result.lastName
    const registrationSubscr = this.authService
      .registration(newUser)
      .pipe(first())
      .subscribe((user: any) => {
        console.log("---------------------",user)
        if (user.hasError==false) {
          this.toastr.success(user.message);
          this.router.navigate(['/auth/pin/']);
        } else {
          this.toastr.error(user.message);
          this.hasError = true;
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
