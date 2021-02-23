// tslint:disable:no-string-literal

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../_services';
import {
  IDeleteAction,
  IEditAction,
} from '../../../_metronic/shared/crud-table';
import { EditDocumentCategoryModalComponent } from './components/edit-category-modal/edit-category-modal.component';
import { DeleteCategoryModalComponent } from './components/delete-category-modal/delete-category-modal.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent
  implements
  OnInit,
  OnDestroy,
  IDeleteAction,
  IEditAction, 
  AfterViewInit 
  {
  endpoint:any;
  isLoading: boolean;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  userId = null;
  docCategoryList: any = [];
  public docCategorySubject = new BehaviorSubject([]);
  searchText: string;
  p=1;
  itemsPerPage= 10;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public docCategoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = localStorage.getItem('userId');
    this.getDocCategory();
  }
  ngAfterViewInit() {
    //console.log('after view called called')

  }
  // angular life circle hooks
  ngOnInit(): void {
    // const sb = this.docCategoryService.isLoading$.subscribe(res => this.isLoading = res);
    // this.subscriptions.push(sb);  
    // this.getDocCategory();
    // this.docCategoryService.fetch();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getDocCategory(){
    const getCategory = `getAllDocumentCategories?adminId=${this.userId}`;
    this.docCategoryService.fetchData(getCategory).subscribe((res: any)=> {
      console.log(res.message);
      if(!res.hasError){
        this.docCategoryList = res.items;
        this.docCategorySubject.next(res.items);
        console.log(this.docCategoryList);
      } else {
        this.docCategoryList = [];
      }
    }, error => {
      console.log('server error')
    })
  }

  edit(id: any) {
    const modalRef = this.modalService.open(EditDocumentCategoryModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
    this.getDocCategory(),
      // this.docCategoryService.fetch(),
      () => { }
    );
  }

  // actions
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteCategoryModalComponent);
    modalRef.componentInstance.id = id;
     modalRef.result.then(() =>
     this.getDocCategory(),
      //this.docCategoryService.fetch(), 
      () => { });
  }

  create(): void {
    this.edit(undefined);
  }
}
