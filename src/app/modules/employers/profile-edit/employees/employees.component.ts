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
import { EmployeesService } from '../../_services/employees.service';
// import { DeleteRuleModalComponent } from './delete-rule-modal/delete-rule-modal.component';
// import { DeleteRulesModalComponent } from './delete-rules-modal/delete-rules-modal.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html'
})
export class EmployeesComponent
  implements
    OnInit,
    OnDestroy,
    IDeleteAction,
    IDeleteSelectedAction,
    ISortView,
    IGroupingView,
    ISearchView {
  @Input() employerProfileId: string;
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  endpoint:any;
  isLoading: boolean;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  p = 1;
  itemsPerPage= 10;
  searchText: string;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public thisService: EmployeesService
  ) {}

  ngOnInit(): void {
    this.searchForm();
    const sb = this.thisService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.thisService.patchState({ entityId: this.employerProfileId });
    this.grouping = this.thisService.grouping;
    this.paginator = this.thisService.paginator;
    this.sorting = this.thisService.sorting;
    this.getAllEmployeeListOfEmployer();
  }
  getAllEmployeeListOfEmployer() {
    let userId =localStorage.getItem('userId');
    this.endpoint=`getEmployerEmployees?adminId=${userId}&employerId=${this.employerProfileId}`
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

    let userId =localStorage.getItem('userId');
    this.endpoint=`deleteEmployerEmployee?adminId=${userId}&employerEmployeeId=${id}`
    this.thisService.delete(this.endpoint).subscribe((x:any)=>{
      if(x){
        this.getAllEmployeeListOfEmployer();
      }else{
        console.log("else part")
      }
    })
  }

  deleteSelected() {
    // const modalRef = this.modalService.open(DeleteRulesModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(
    //   () => this.thisService.fetch(),
    //   () => {}
    // );
  }

  edit(id): void {
    const modalRef = this.modalService.open(EditEmployeeComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.employerId = this.employerProfileId;
    modalRef.result.then(() =>
    this.getAllEmployeeListOfEmployer(),
      () => {}
    );
  }

  create(): void {
    this.edit(undefined);
  }

}
