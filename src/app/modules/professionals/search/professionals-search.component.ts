import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessionalsService } from '../_services';
@Component({
  selector: 'app-professionals-search',
  templateUrl: './professionals-search.component.html'
})
export class ProfessionalsSearchComponent implements OnInit {
  endpoint:any;

  proResults:any;
  spResults:any;
  formGroup: FormGroup;
  model: any = {
    adminId:'',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    state:'',
    specialtyId:'',
    professionId:''
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private profService: ProfessionalsService,
  ) { }

  ngOnInit() {

this.getAllProfessions();
this.getAllSpecialties();
  }
  getAllProfessions(){
    let userId= localStorage.getItem('userId')
    this.endpoint = `profession?adminId=${userId}`;
    this.profService.fetchData(this.endpoint).subscribe((x:any) =>{
      this.proResults=x.items;
      console.log("////////////////////////",x)
      console.log( this.proResults)

    })
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
  getAllSpecialties(){

    // console.log("////////////////////////",professionId)
    let userId= localStorage.getItem('userId')
    this.endpoint=`specialty?adminId=${userId}`
    // const endPoint = `specialtiesByProfession?adminId=${userId}&professionId=${professionId}`;
    this.profService.fetchData(this.endpoint).subscribe((x:any) =>{
      this.spResults=x.items;
      console.log("////////////////////////",x)
      console.log( this.spResults)
    })
  }
  onSubmit() {
    // console.log(this.formGroup)
    // this.model.firstName = this.formGroup;
    let adminId=localStorage.getItem('userId')
    this.model.adminId=adminId
    this.endpoint=`professionalSearch`
    this.profService.postData(this.endpoint,this.model).subscribe((x:any)=>{
      console.log("value of x",x)
      if(x.hasError===false){
        console.log("log x",x)
        this.router.navigate(['/professionals/listing'])
      }else{
        console.log("else part is working now")
      }
    })
      }
}
