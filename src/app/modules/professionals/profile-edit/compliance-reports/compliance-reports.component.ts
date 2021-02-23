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
} from '../../../../_metronic/shared/crud-table';
import { ProfessionalReportsService } from '../../_services/reports.service';
// import { DeleteRuleModalComponent } from './delete-rule-modal/delete-rule-modal.component';
// import { DeleteRulesModalComponent } from './delete-rules-modal/delete-rules-modal.component';
import { EditReportComponent } from './edit-report/edit-report.component';

@Component({
  selector: 'app-compliance-reports',
  templateUrl: './compliance-reports.component.html'
})
export class ComplianceReportsComponent
  implements
    OnInit,
    OnDestroy,
    IDeleteAction,
    IDeleteSelectedAction,
    ISortView,
    IGroupingView,
    ISearchView {
  @Input() professionalProfileId: string;
  complianceReports: any;
  paginator: PaginatorState;
  sorting: SortState;
  endpoint:any;
  grouping: GroupingState;

  isLoading: boolean;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  p = 1;
  itemsPerPage= 10;
  searchText: string;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public reportsService: ProfessionalReportsService
  ) {}

  ngOnInit(): void {
    let userId =localStorage.getItem('userId');
    this.endpoint=`reportsByUserId?adminId=${userId}&userId=${this.professionalProfileId}`
    this.searchForm();
    const sb = this.reportsService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.reportsService.patchState({ entityId: this.professionalProfileId });
    this.grouping = this.reportsService.grouping;
    this.paginator = this.reportsService.paginator;
    this.sorting = this.reportsService.sorting;
    this.reportsService.fetch(this.endpoint);
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
    this.reportsService.patchState({ searchTerm });
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
    this.reportsService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.reportsService.patchState({ paginator });
  }

  // actions
  delete(id) {
    console.log("a gia idr",id)

    let userId =localStorage.getItem('userId');
      this.endpoint=`deleteComplianceReport?adminId=${userId}&complianceReportId=${id}`//&employerId=${this.employerId}
      this.reportsService.delete(this.endpoint).subscribe((x:any)=>{
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
    //   () => this.reportsService.fetch(),
    //   () => {}
    // );
  }

  deleteSelected() {
    // const modalRef = this.modalService.open(DeleteRulesModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(
    //   () => this.reportsService.fetch(),
    //   () => {}
    // );
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(EditReportComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.professionalProfileId = this.professionalProfileId;
    modalRef.result.then(() =>
      this.reportsService.fetch(this.endpoint),
      () => {}
    );
  }

  create(): void {
    this.edit(undefined);
  }

}
