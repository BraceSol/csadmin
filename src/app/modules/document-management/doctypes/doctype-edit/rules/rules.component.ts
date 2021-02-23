import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
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
import { DoctypeRulesService } from '../../../_services';
import { DeleteRuleModalComponent } from './delete-rule-modal/delete-rule-modal.component';
import { DeleteRulesModalComponent } from './delete-rules-modal/delete-rules-modal.component';
import { EditRuleModalComponent } from './edit-rules-modal/edit-rules-modal.component';

@Component({
  selector: 'app-doctype-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent
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
  private subscriptions: Subscription[] = [];
  userId: string;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public ruleService: DoctypeRulesService
  ) {
    this.userId = localStorage.getItem('userId');
    this.getDocRule();
  }

  ngOnInit(): void {
    this.searchForm();
    const sb = this.ruleService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    // this.ruleService.patchState({ entityId: this.doctypeId });
    this.grouping = this.ruleService.grouping;
    this.paginator = this.ruleService.paginator;
    this.sorting = this.ruleService.sorting;
    this.getDocRule();
    this.getDocRules();
    this.ruleService.items$.subscribe((x: any )=>{
      console.log('subscribe ruled', x)
    })
  }
  getDocRule() {
     ;
   const endPoint =  `rulesByDocumentType?adminId=${this.userId}&documentTypeId=${this.doctypeId}`
   this.ruleService.fetch(endPoint);
  }
  getDocRules(){
     ;
    const endPoint =  `rulesByDocumentType?adminId=${this.userId}&documentTypeId=${this.doctypeId}`
   this.ruleService.fetch(endPoint);
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
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.ruleService.patchState({ searchTerm });
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
    this.ruleService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    // this.ruleService.patchState({ paginator });
  }

  // actions
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteRuleModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () =>
    //  this.ruleService.fetch(),,
     this.getDocRule(),
      () => {}
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteRulesModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () =>
    this.getDocRule(),
      () => {}
    );
  }

  edit(id: number): void {
     ;
    const modalRef = this.modalService.open(EditRuleModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.doctypeId = this.doctypeId;
    modalRef.result.then(() =>
    this.getDocRules(),
    // this.getDocRule(),
      () => {}
    );
  }

  create(): void {
    this.edit(undefined);
  }

}
