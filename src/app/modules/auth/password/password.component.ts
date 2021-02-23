import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../_models/user.model';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import{AuthHTTPService} from '../_services/auth-http'
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit, OnDestroy {
  passwordForm: FormGroup;
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

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.passwordForm.controls;
  }

  initForm() {
    this.passwordForm = this.fb.group(
      {
   
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
       
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit() {
    const lat =localStorage.getItem('lat')

    const userId =localStorage.getItem('id')
		const lng =localStorage.getItem('lng')
		const browser=localStorage.getItem("browser");
    this.hasError = false;
    const result :any={};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });
    const newUser= new UserModel();

    newUser.setUser(result);

    console.log("---------------------",result)
    newUser.lastLocation=`${lat},${lng}`,
    newUser.deviceName=browser,
    newUser.userId=userId
    
    newUser.newPassword=result.password
    newUser.confirmPassword=result.cPassword
    console.log("---------------------",newUser)

    const passwordSubscr = this.authService
    this.authHttpSerice.restPassword( newUser.userId,newUser.newPassword, newUser.confirmPassword,newUser.deviceName,newUser.deviceCode,newUser.lastLocation)
      .pipe(first())
      .subscribe((user: any) => {
        console.log("---------------------",user)
        if (user.hasError==false) {
          
          this.toastr.success(user.message);
          this.router.navigate(['/auth/login']);
        } else {
          this.hasError = true;

          this.toastr.error(user.message);
        }
      });
  //  this.unsubscribe.push(passwordSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
