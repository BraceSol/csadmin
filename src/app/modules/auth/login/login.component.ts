import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  // defaultAuth = {
  //   email: '',
  //   password: '',
  // };
  defaultAuth: any = {
    email: 'awos1@mail.com',
    password: 'admin123321',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
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
    // get return url from route parameters or default to '/'
   

    this.route.queryParams.subscribe(params => {
			this.returnUrl =  '/';
		});
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    const lat=localStorage.getItem("lat");
		const lng=localStorage.getItem("lng");
    const deviceName=localStorage.getItem("browser");

    const lastLocation= `${lat},${lng}`;
    const deviceCode= "12123344";
    // const authData = {
		// 	email: this.f.email.value.toLowerCase()
		// 	,
		// 	password: this.f.password.value,
		// 	deviceCode: "12123344",
		// 	deviceName:browser,
		// 	lastLocation: `${lat},${lng}`,

    // };
    this.hasError = false;
    const loginSubscr = this.authService
   
      .login(this.f.email.value, this.f.password.value,deviceName,deviceCode,lastLocation)
      .pipe(first())
      .subscribe((user: any) => {
        if (!user.hasError) {
          console.log(user.message,"login function if===hasError=====",user.hasError)
          // alert(user.message);
          this.toastr.success(user.message);
         this.router.navigate([this.returnUrl]);
      //  this.router.navigate(['/auth/profile']);
//, { skipLocationChange: true }
        } else {
          console.log("login function else========",user)
          // alert(user.message);
          this.toastr.error(user.message);
          console.log("==hasError= true====",user.hasError)
       this.router.navigate(['/auth/login']);
        }
      });
    this.unsubscribe.push(loginSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
