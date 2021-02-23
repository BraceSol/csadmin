import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemTablesService } from '../_services/systemtables.service';
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
import { EditTableComponent } from './edit-table/edit-table.component';
// import { DeleteRoleModalComponent } from './components/delete-role-modal/delete-role-modal.component';
// import { DeleteRolesModalComponent } from './components/delete-roles-modal/delete-roles-modal.component';

@Component({
  selector: 'app-system-tables',
  templateUrl: './system-tables.component.html'
})
export class SystemTablesComponent
  implements
  OnInit,
  OnDestroy,
  IDeleteAction,
  IDeleteSelectedAction,
  ISortView,
  IEditAction, 
  IFilterView,
  IGroupingView
  {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  endpoint:string;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  userId: string;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  searchText;
  page = 1;
  pageSize = 2;
  systemTableList: any = [];
  collectionSize = 0;
  p = 1;
  itemsPerPage= 10;
  //systemTableListSubject = new Subject([]);
  public systemTableListSubject = new BehaviorSubject([]);

  term;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public stService: SystemTablesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.filterForm();
    this.searchForm();
    const sb = this.stService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.stService.grouping;
    this.paginator = this.stService.paginator;
    this.sorting = this.stService.sorting;
    this.getAllSystemTable();
  }
  getAllSystemTable() {
    this.endpoint = `systemTables?adminId=${this.userId}`;
    this.stService.fetch(this.endpoint);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      tableName: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.tableName.valueChanges.subscribe(() =>
        this.filter()
      )
    );
  }

  filter() {
    const userId =localStorage.getItem('userId')
    console.log("------------------")
    this.endpoint=`systemtables?adminId=${userId}`;
    const filter = {};
    const status = this.filterGroup.get('tableName').value;
    if (status) {
      filter['tableName'] = status;
      this.endpoint += "&" + "tableName=" + status;
    }
    console.log(filter);
    this.stService.patchState({ filter }, this.endpoint);
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.stService.patchStateWithoutFetch({ searchTerm });
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
    this.stService.patchState({ sorting }, this.endpoint);
  }

  edit(id) {
// this.endpoint=``
    const modalRef = this.modalService.open(EditTableComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
    this.getAllSystemTable(),
      () => { }
    );
  }

  create() {
    this.edit(undefined);
  }

  // pagination
  paginate(paginator: PaginatorState) {
    console.log(paginator)
    this.stService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    this.endpoint=`deleteSystemTable?adminId=${this.userId}&systemTableId=${id}`
    this.stService.delete(this.endpoint).subscribe((x:any)=>{
      console.log('deleted Response', x)
      if(!x.hasError){
        this.getAllSystemTable();
      }else{
        console.log("else part")
      }
    })

    // const modalRef = this.modalService.open(DeleteRoleModalComponent);
    // modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.stService.fetch(this.endpoint), () => { });
  }

  deleteSelected() {
    // const modalRef = this.modalService.open(DeleteRolesModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(() => this.stService.fetch(this.endpoint), () => { });
  }

}
