import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DoctypesService } from '../_services';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

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
import { DeleteDoctypeModalComponent } from './components/delete-doctype-modal/delete-doctype-modal.component';
import { DeleteDoctypesModalComponent } from './components/delete-doctypes-modal/delete-doctypes-modal.component';

@Component({
  selector: 'app-doctypes',
  templateUrl: './doctypes.component.html',
})
export class DoctypesComponent
  implements
  OnInit,
  OnDestroy,
  IDeleteAction,
  IDeleteSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView ,
  AfterViewInit
  {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  userId;
  docTypeList: any = [];
  searchText: string;
  p=1;
  itemsPerPage= 10;
  public docTypeSubject = new BehaviorSubject([]);

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public doctypeService: DoctypesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = localStorage.getItem('userId');
    this.getDocTypes();
   }
   ngAfterViewInit(){
    this.getDocTypes();
   }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.grouping = this.doctypeService.grouping;
    this.paginator = this.doctypeService.paginator;
    this.sorting = this.doctypeService.sorting;
    this.getDocTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getDocTypes() {
      const getCategory = `allDocumentTypes?adminId=${this.userId}`;
      this.doctypeService.fetchData(getCategory).subscribe((res: any)=> {
        console.log(res.message);
        if(!res.hasError){
          this.docTypeList = res.items;
          this.docTypeSubject.next(this.docTypeList);
          console.log(this.docTypeList);
        } else {
          this.docTypeList = [];
        }
      }, error => {
        console.log('server error')
      })
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
    this.doctypeService.patchState({ filter });
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
    this.doctypeService.patchState({ searchTerm });
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
    this.doctypeService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.doctypeService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteDoctypeModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
       () =>
       this.getDocTypes(),
      () => { }
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteDoctypesModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      // () => this.doctypeService.fetch(),
      () => { }
    );
  }
}
