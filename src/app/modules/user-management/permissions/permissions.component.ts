// tslint:disable:no-string-literal

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from '../_services/permission.service';
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
import { EditPermissionModalComponent } from './components/edit-permission-modal/edit-permission-modal.component';
import { DeletePermissionModalComponent } from './components/delete-permission-modal/delete-permission-modal.component';
import { DeletePermissionsModalComponent } from './components/delete-permissions-modal/delete-permissions-modal.component';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
})
export class PermissionsComponent
  implements
  OnInit,
  OnDestroy,
  IDeleteAction,
  IDeleteSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView 
  {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  endpoint :string;

  filterGroup: FormGroup;
  searchGroup: FormGroup;
  searchText:string;
  p=1;
  itemsPerPage= 10;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public permissionsService: PermissionService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.endpoint='getPermissions'
    this.filterForm();
    this.searchForm();
    const sb = this.permissionsService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.permissionsService.grouping;
    this.paginator = this.permissionsService.paginator;
    this.sorting = this.permissionsService.sorting;
    this.permissionsService.fetch(this.endpoint);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      category: ['']
    });
    this.subscriptions.push(
      this.filterGroup.controls.category.valueChanges.subscribe(() =>
        this.filter()
      )
    );
  }

  filter() {
    const filter = {};
    const category = this.filterGroup.get('category').value;
    if (category) {
      filter['category'] = category;
    }
    this.permissionsService.patchState({ filter });
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
    this.permissionsService.patchState({ searchTerm });
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
    this.permissionsService.patchState({ sorting });
  }

  edit(id: string) {
    const modalRef = this.modalService.open(EditPermissionModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.permissionsService.fetch(this.endpoint),
      () => { }
    );
  }

  create(): void {
    this.edit(undefined);
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.permissionsService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeletePermissionModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.permissionsService.fetch(this.endpoint),
      () => { }
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeletePermissionsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.permissionsService.fetch(this.endpoint),
      () => { }
    );
  }
}
