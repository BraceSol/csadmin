import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    //this.chechLocation()
  }
chechLocation(){
console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")
  const userId=localStorage.getItem("userId");
  console.log(";;;;;;;;;;;;;;;;;;userId;;;;;;;;;;;;",userId)
  const lat=localStorage.getItem("lat");
  const lng=localStorage.getItem("lng");
  if(userId===null ||userId===undefined ||userId==='undefined'){

console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;------if")
    this.router.navigate(['/auth/login']);
    // alert('Please Allow Location Manually');
  }else{

console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;------else")
    this.router.navigate(['/']);
  }
}
}
