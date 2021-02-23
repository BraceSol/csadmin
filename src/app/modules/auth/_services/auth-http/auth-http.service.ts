import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string,deviceName:string,deviceCode:string,lastLocation:string): Observable<any> {
    return this.http.post<AuthModel>(API_USERS_URL+'login',   { email, password,deviceName,deviceCode,lastLocation });
  }
	resend(userId:string,deviceCode:string): Observable<any> {
    return this.http.post<any>(API_USERS_URL+`resendPin`, { userId,deviceCode});
  }
  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL+'signup', user);
  }
  getUserProfiles(id): Observable<any> {
    const url = API_USERS_URL+`profiles?userId=${id}`;
    return this.http.get<any[]>(url);
  }
	verifypin(userId: string, pinCode: string,deviceCode:string): Observable<any> {
    return this.http.post<any>(API_USERS_URL+`verifyPin`, { userId, pinCode,deviceCode});
  }
  restPassword(userId:string ,newPassword: string, confirmPassword: string,deviceCode:string,deviceName:string,lastLocation:string): Observable<any> {
    return this.http.post<any>(API_USERS_URL+`resetPassword`, { userId, newPassword,confirmPassword,deviceCode,deviceName,lastLocation });
  }
  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email): Observable<any> {
    const url = API_USERS_URL+`searchEmail?email=${email}`;
    return this.http.get<any>(url);
  }
	getAllUserTypes(): Observable<any[]> {
		const url = API_USERS_URL+`profileTypes`;
		return this.http.get<any[]>(url);
	}
    getUserByToken(token): Observable<any>
    {
      console.log(token,"===token====")
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(API_USERS_URL+`getAdmin?adminId=${token}`, {
      headers: httpHeaders,
    });
  }
}
