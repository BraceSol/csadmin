import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  getTestBed,
} from '@angular/core/testing';
import { PasswordComponent } from './password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { LogoutComponent } from '../logout/logout.component';
import { Routes, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserModel } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const fakeAuth = {
  email: 'admin@demo.com',
  password: 'demo',
  roles: [2], // Manager
  accessToken: 'access-token-' + Math.random(),
  refreshToken: 'access-token-' + Math.random(),
  expiresIn: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
  pic: './assets/media/users/default.jpg',
};

const fakeRoutes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/logout', component: LogoutComponent },
  { path: 'auth/password', component: PasswordComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
];

class FakeAuthService {
  password(user: UserModel): Observable<UserModel> {
    return of(user);
  }
}

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;
  let injector;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot(fakeRoutes),
      ],
      providers: [
        {
          provide: AuthService,
          useClass: FakeAuthService,
        },
      ],
      declarations: [PasswordComponent],
    }).compileComponents();
    injector = getTestBed();
    authService = injector.get(AuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
