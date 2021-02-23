import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpecialtiesService } from '../_services';
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
import { EditSpecialtiesModalComponent } from './components/edit-specialties-modal/edit-specialties-modal.component';
import { DeleteSpecialtyModalComponent } from './components/delete-specialty-modal/delete-specialty-modal.component';
import { DeleteSpecialtiesModalComponent } from './components/delete-specialties-modal/delete-specialties-modal.component';

@Component({
  selector: 'app-specialties',
  templateUrl: './specialties.component.html'
})
export class SpecialtiesComponent
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
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  p = 1;
  itemsPerPage= 10;
  searchText: string;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public specialtyService: SpecialtiesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    const sb = this.specialtyService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.specialtyService.grouping;
    this.paginator = this.specialtyService.paginator;
    this.sorting = this.specialtyService.sorting;
    const userId= localStorage.getItem('userId');

    const endPoint= `specialty?adminId=${userId}`;
    this.specialtyService.fetch(endPoint);
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
    this.specialtyService.patchState({ filter });
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
    this.specialtyService.patchState({ searchTerm });
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
    this.specialtyService.patchState({ sorting });
  }

  edit(id: any) {
    const modalRef = this.modalService.open(EditSpecialtiesModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
     // this.specialtyService.fetch('data'),
      () => { }
    );
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.specialtyService.patchState({ paginator });
  }
  // actions
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteSpecialtyModalComponent);
    modalRef.componentInstance.id = id;
    //modalRef.result.then(() => this.specialtyService.fetch('data'), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteSpecialtiesModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  //  modalRef.result.then(() => this.specialtyService.fetch('data'), () => { });
  }

  create(): void {
    this.edit(undefined);
  }
}
