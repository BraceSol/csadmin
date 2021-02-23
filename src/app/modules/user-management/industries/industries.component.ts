import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IndustryService } from '../_services/industry.service';
import {
  IDeleteAction,
  IEditAction,
} from '../../../_metronic/shared/crud-table';
import { EditIndustryComponent } from './edit-industry/edit-industry.component';
// import { DeleteRoleModalComponent } from './components/delete-role-modal/delete-role-modal.component';
// import { DeleteRolesModalComponent } from './components/delete-roles-modal/delete-roles-modal.component';

@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html'
})
export class IndustriesComponent
  implements
  OnInit,
  OnDestroy,
  IDeleteAction
  {
  isLoading: boolean;
  endpoint:string;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  userId: string;
  searchText: string;
  p=1;
  itemsPerPage= 10;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public industryService: IndustryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    const sb = this.industryService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.getIndustoryList();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getIndustoryList() {
    this.endpoint=`industry?adminId=${this.userId}`
    this.industryService.fetch(this.endpoint);
  }

  edit(id) {
    const modalRef = this.modalService.open(EditIndustryComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
    this.getIndustoryList(),
      () => { }
    );
  }

  create() {
    this.edit(undefined);
  }

  // actions
  delete(id: number) {
    this.endpoint=`deleteIndustry?adminId=${this.userId}&industryId=${id}`
    this.industryService.delete(this.endpoint).subscribe((x:any)=>{
      if(x){
        this.getIndustoryList();
      }else{
        console.log("else part")
      }
    })

  }
}
