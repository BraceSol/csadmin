import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployersService } from '../_services/employers.service';
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
// import { DeleteDoctypeModalComponent } from './components/delete-doctype-modal/delete-doctype-modal.component';
// import { DeleteDoctypesModalComponent } from './components/delete-doctypes-modal/delete-doctypes-modal.component';

@Component({
  selector: 'app-employer-listing',
  templateUrl: './listing.component.html'
})
export class EmployerListingComponent
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
  endpoint:any;
  p = 1;
  itemsPerPage= 10;
  searchTerm:string
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public empService: EmployersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {

  let userId =localStorage.getItem('userId');
    this.endpoint=`getEmployers?adminId=${userId}`
    this.filterForm();
    this.searchForm();
    const sb = this.empService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.empService.grouping;
    this.paginator = this.empService.paginator;
    this.sorting = this.empService.sorting;
    this.empService.fetch(this.endpoint);
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
    this.empService.patchState({ filter });
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
    this.empService.patchState({ searchTerm });
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
    this.empService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.empService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    // const modalRef = this.modalService.open(DeleteDoctypeModalComponent);
    // modalRef.componentInstance.id = id;
    // modalRef.result.then(
    //   () => this.empService.fetch(),
    //   () => { }
    // );
  }

  deleteSelected() {
    // const modalRef = this.modalService.open(DeleteDoctypesModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(
    //   () => this.empService.fetch(),
    //   () => { }
    // );
  }
}
