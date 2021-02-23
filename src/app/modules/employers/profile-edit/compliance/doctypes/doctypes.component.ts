import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';

import { DoctypeEditComponent } from '../../../../document-management/doctypes/doctype-edit/doctype-edit.component';
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
import { EmployerDocumentTypeService } from '../../../_services/doctypes.service';
// import { DeleteRuleModalComponent } from './delete-rule-modal/delete-rule-modal.component';
// import { DeleteRulesModalComponent } from './delete-rules-modal/delete-rules-modal.component';
import { AddDoctypesComponent } from './add-doctypes/add-doctypes.component';

@Component({
  selector: 'app-employerdoctypes',
  templateUrl: './doctypes.component.html'
})
export class EmployerDoctypesComponent
  implements
    OnInit,
    OnDestroy,
    IDeleteAction,
    IDeleteSelectedAction,
    ISortView,
    IGroupingView,
    ISearchView {
  @Input() employerId: string;
  paginator: PaginatorState;
  sorting: SortState;
  endpoint:any;
  p = 1;
  itemsPerPage= 10;
  searchTerm:string
  grouping: GroupingState;
  isLoading: boolean;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,

    private router: Router,
    public thisService: EmployerDocumentTypeService
  ) {}

  ngOnInit(): void {

    let userId =localStorage.getItem('userId');
    this.endpoint=`getEmployerDocTypes?adminId=${userId}&employerId=${this.employerId}`
    this.searchForm();
    const sb = this.thisService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.thisService.patchState({ entityId: this.employerId });
    this.grouping = this.thisService.grouping;
    this.paginator = this.thisService.paginator;
    this.sorting = this.thisService.sorting;
    this.thisService.fetch(this.endpoint);
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
    this.thisService.patchState({ searchTerm });
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
    this.thisService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.thisService.patchState({ paginator });
  }

  // actions
  delete(id) {
    console.log("a gia idr",id)

  let userId =localStorage.getItem('userId');
    this.endpoint=`deleteEmployerDocType?adminId=${userId}&employerId=${this.employerId}&employerDocTypeId=${id}`
    this.thisService.delete(this.endpoint).subscribe((x:any)=>{
      if(x.hasError===false){
        console.log(x,"xxxxxxxxxx")
        this.ngOnInit()
        // this.router.navigate(['/employers/listing'])
      }else{
        console.log("else part")
      }
    })
    // const modalRef = this.modalService.open(DeleteRuleModalComponent);
    // modalRef.componentInstance.id = id;
    // modalRef.result.then(
    //   () => this.thisService.fetch(),
    //   () => {}
    // );
  }

  deleteSelected() {
    // const modalRef = this.modalService.open(DeleteRulesModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(
    //   () => this.thisService.fetch(),
    //   () => {}
    // );
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(AddDoctypesComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.employerId = this.employerId;
    modalRef.result.then(() =>
      this.thisService.fetch(this.endpoint),
      () => {}
    );
  }

  create(): void {
    this.edit(undefined);
  }

}
