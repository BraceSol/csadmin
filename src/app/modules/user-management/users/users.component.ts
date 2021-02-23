import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CsUserService } from '../_services/csuser.service';
// import { CsUserService } from '../_services/csuser.service';

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
} from '../../../_metronic/shared/crud-table';
import { DeleteUserModalComponent } from './components/delete-user-modal/delete-user-modal.component';
import { DeleteUsersModalComponent } from './components/delete-users-modal/delete-users-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent
  implements
  OnInit,
  OnDestroy,
  IDeleteAction,
  IDeleteSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView 
  {
    userResult:any;
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  endpoint:string;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  searchText: string;
  p=1;
  itemsPerPage= 10;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public csuserService: CsUserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    const userId =localStorage.getItem('userId')
    console.log("------------------")
    this.endpoint=`getAdmins?adminId=${userId}`
    this.filterForm();
    this.searchForm();
    const sb = this.csuserService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.csuserService.grouping;
    this.paginator = this.csuserService.paginator;
    this.sorting = this.csuserService.sorting;
    this.csuserService.fetch(this.endpoint);
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
    const userId =localStorage.getItem('userId')
    console.log("------------------")
    this.endpoint=`getAdmins?adminId=${userId}`
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const condition = this.filterGroup.get('condition').value;
    if (condition) {
      filter['condition'] = condition;
    }
    this.csuserService.patchState({ filter });
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
    this.csuserService.patchState({ searchTerm });
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
    this.csuserService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.csuserService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteUserModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.csuserService.fetch(this.endpoint),
      () => { }
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteUsersModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.csuserService.fetch(this.endpoint),
      () => { }
    );
  }
}
