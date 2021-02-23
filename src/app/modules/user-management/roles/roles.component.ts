// tslint:disable:no-string-literal

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '../_services/role.service';
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
import { EditRoleModalComponent } from './components/edit-role-modal/edit-role-modal.component';
import { DeleteRoleModalComponent } from './components/delete-role-modal/delete-role-modal.component';
import { DeleteRolesModalComponent } from './components/delete-roles-modal/delete-roles-modal.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent
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
  isLoading: boolean;
  endpoint:string;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  searchText: string;
  p=1;
  itemsPerPage= 10;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public rolesService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {

  let userId =localStorage.getItem('userId');
    this.endpoint=`roles?adminId=${userId}`
    this.filterForm();
    this.searchForm();
    const sb = this.rolesService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.rolesService.grouping;
    this.paginator = this.rolesService.paginator;
    this.sorting = this.rolesService.sorting;
    this.rolesService.fetch(this.endpoint);
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
    this.rolesService.patchState({ filter });
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
    console.log(searchTerm);
    this.rolesService.patchState({ searchTerm });
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
    this.rolesService.patchState({ sorting });
  }

  edit(id) {
// this.endpoint=``
    const modalRef = this.modalService.open(EditRoleModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.rolesService.fetch(this.endpoint),
      () => { }
    );
  }

  create() {
    this.edit(undefined);
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.rolesService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteRoleModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.rolesService.fetch(this.endpoint), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteRolesModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() => this.rolesService.fetch(this.endpoint), () => { });
  }
}
