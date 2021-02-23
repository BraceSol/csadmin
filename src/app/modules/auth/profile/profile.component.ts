import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import{AuthHTTPService} from '../_services/auth-http'
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loginModel: any = {};
  profileForm: FormGroup;
  profileResult:any=[];
  isLoaded:boolean = false;
  constructor(
    private router: Router,
    private authHttpSerice : AuthHTTPService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
 
   this.profiles() 
  }
// this called every time when user changed the code


// this called only if user entered full code
profiles() {
  const userId =localStorage.getItem('userId')

 this.authHttpSerice.getUserProfiles(userId).subscribe((x:any) =>{
  this.profileResult=x.profiles
   console.log("=============",this.profileResult)
  
    if(!x.hasError){
      this.isLoaded = true;
      this.toastr.success(x.message);
    
      // this.router.navigateByUrl('/');
    }else{
      this.toastr.error(x.message);
      this.router.navigateByUrl('/auth/profile');
    }

  })
}

gotoInfo(id) {

  this.router.navigateByUrl('/' + id );

  }
}
