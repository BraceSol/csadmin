import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  GroupingState,
  IDeleteAction,
  IDeleteSelectedAction,
  IGroupingView,
  ISearchView,
  ISortView,
  PaginatorState,
  SortState,
} from '../../../../../_metronic/shared/crud-table';
import { DoctypeAttributesService } from '../../../_services';
import { DeleteAttributeModalComponent } from './delete-attribute-modal/delete-attribute-modal.component';
import { DeleteAttributesModalComponent } from './delete-attributes-modal/delete-attributes-modal.component';
import { EditAttributeModalComponent } from './edit-attributes-modal/edit-attributes-modal.component';

@Component({
  selector: 'app-doctypeattributes',
  templateUrl: './attributes.component.html',
})
export class AttributesComponent
  implements
    OnInit,
    OnDestroy,
    IDeleteAction,
    IDeleteSelectedAction,
    ISortView,
    IGroupingView,
    ISearchView {
  @Input() doctypeId: string;
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  searchGroup: FormGroup;
  userId;
  public docAttributeSubject = new BehaviorSubject([]);

  private subscriptions: Subscription[] = [];
  searchText: string;
  p=1;
  itemsPerPage= 10;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public attributeService: DoctypeAttributesService
  ) {
    console.log(this.doctypeId);
    this.userId = localStorage.getItem('userId');

  }

  ngOnInit(): void {
    console.log(this.doctypeId);

    this.searchForm();
    const sb = this.attributeService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    // this.attributeService.patchState({ entityId: this.doctypeId });
    this.grouping = this.attributeService.grouping;
    this.paginator = this.attributeService.paginator;
    this.sorting = this.attributeService.sorting;
    // this.attributeService.fetch();
    this.getDocAttribute();
  }
  getDocAttribute() {
    const getCategory = `allAttributesByDocumentTypeId?adminId=${this.userId}&documentTypeId=${this.doctypeId}`;
    this.attributeService.fetchData(getCategory).subscribe((res: any)=> {
      if(!res.hasError){
        this.docAttributeSubject.next(res.items);
      } else {
        // this.docAttributeSubject.next() = [];
      }
    }, error => {
      console.log('server error')
    })

  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  //
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
    this.attributeService.patchState({ searchTerm });
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
    this.attributeService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.attributeService.patchState({ paginator });
  }

  // actions
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteAttributeModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () =>
       this.getDocAttribute(),
      () => {}
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteAttributesModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
     // () => this.attributeService.fetch(),
      () => {}
    );
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(EditAttributeModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.doctypeId = this.doctypeId;
    modalRef.result.then(() =>
    this.getDocAttribute(),
      () => {}
    );
  }

  create(): void {
    this.edit(undefined);
  }

}
