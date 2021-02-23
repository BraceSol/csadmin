// tslint:disable:no-string-literal

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfessionService } from '../_services';
import {
  GroupingState,
  PaginatorState,
  SortState,
  IDeleteAction,
  IDeleteSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IEditAction,
} from '../../../_metronic/shared/crud-table';
import { EditProfessionModalComponent } from './components/edit-profession-modal/edit-profession-modal.component';
import { DeleteProfessionModalComponent } from './components/delete-profession-modal/delete-profession-modal.component';
import { DeleteProfessionsModalComponent } from './components/delete-professions-modal/delete-professions-modal.component';

@Component({
  selector: 'app-professions',
  templateUrl: './professions.component.html'
})
export class ProfessionsComponent
  implements
  OnInit,
  OnDestroy,
  IDeleteAction,
  IDeleteSelectedAction,
  ISortView,
  IEditAction, 
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView 
  {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  endpoint:any;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  userId;
  p = 1;
  itemsPerPage= 10;
  searchText: string;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public professionService: ProfessionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = localStorage.getItem('userId');

  }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.endpoint=`profession`
    this.filterForm();
    this.searchForm();
    const sb = this.professionService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.professionService.grouping;
    this.paginator = this.professionService.paginator;
    this.sorting = this.professionService.sorting;
    this.getAllProfessions();
  }
  getAllProfessions(){
    const endPoint = `profession?adminId=${this.userId}`;
    this.professionService.fetch(endPoint);
  }


  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      status: [''],
      condition: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.condition.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const condition = this.filterGroup.get('condition').value;
    if (condition) {
      filter['condition'] = condition;
    }
    this.professionService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
  The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
  we are limiting the amount of server requests emitted to a maximum of one every 150ms
  */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.professionService.patchState({ searchTerm });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.professionService.patchState({ sorting });
  }

  edit(id) {
    const modalRef = this.modalService.open(EditProfessionModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>

    this.getAllProfessions(),
      () => { }
    );
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.professionService.patchState({ paginator });
  }
  // actions
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteProfessionModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.getAllProfessions(), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteProfessionsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() =>
    //  this.professionService.fetch( this.endpoint),
     () => { });
  }

  create(): void {
    this.edit(undefined);
  }
}
