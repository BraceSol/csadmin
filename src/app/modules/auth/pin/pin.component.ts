import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import{AuthHTTPService} from '../_services/auth-http'

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {
routePath='';
isResendButtonDisabled = true;
 private sub: any;
  constructor(
    private router: Router,
    private authHttpSerice : AuthHTTPService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    setInterval(() => {
      this.resendButtonUnDisable();
  }, 59000);
    this.sub =  this.route.params
    .subscribe(params => {
    
    this.routePath = params['q'];     
});
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
// this called every time when user changed the code
onCodeChanged(pinCode: string) {
  // console.log("+====1===",pinCode)
}
resendButtonDisable() {
  this.isResendButtonDisabled = true;
 }
 resendButtonUnDisable() {
  this.isResendButtonDisabled = false;
 }
// this called only if user entered full code
onCodeCompleted( pinCode:string) {

  this.isResendButtonDisabled = true;
  console.log(this.routePath)
  let id =localStorage.getItem('userId');
  if(this.routePath=='f'){
    id =localStorage.getItem('id');
  }
  const deviceCode='12133244'
  this.authHttpSerice.verifypin(id, pinCode,deviceCode).subscribe((x:any) =>{
    if(!x.hasError){
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxx",x, this.routePath)
      if(this.routePath=='f'){
        this.router.navigateByUrl('/auth/rest-password');
      }else{
  // this.toastr.success(x.message);
  this.router.navigateByUrl('/');
      }
    }else{

      this.isResendButtonDisabled = false;
      console.log("======else========")
      // this.toastr.error(x.message);
      this.router.navigateByUrl('/auth/pin/');
    }

  })
}
reSend(){

  this.isResendButtonDisabled = true;
  const deviceCode='12133244'
  const userId =localStorage.getItem('id')
  // const browser=localStorage.getItem("browser");
  this.authHttpSerice.resend(userId,deviceCode).subscribe((x:any) =>{
    if(!x.hasError){
      setInterval(() => {
        this.isResendButtonDisabled = false;
      }, 59000);
      this.toastr.success(x.message);
    }else{
      this.toastr.error(x.message);
    }  })
}
}
