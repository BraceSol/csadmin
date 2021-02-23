import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';

import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { ToastrModule } from 'ngx-toastr';
import { PasswordComponent } from './password/password.component';
import { CodeInputModule } from 'angular-code-input';
import { AuthComponent } from './auth.component';
import {TranslationModule} from '../i18n/translation.module';
import { PinComponent } from './pin/pin.component';
import { ProfileComponent } from './profile/profile.component';
@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    PasswordComponent,
    PinComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
     BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    }),
    ToastrModule.forRoot(),
    CodeInputModule.forRoot({
			codeLength: 6,
			isCharsCode: false,
		  }),
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class AuthModule {}
