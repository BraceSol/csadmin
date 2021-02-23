import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { Certification } from '../../../_models/certification.model'
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
import { CertificationService } from '../../../_services/certification.service';
import { EditCertComponent } from './edit-cert/edit-cert.component';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html'
})
export class CertificationsComponent implements OnInit,
OnDestroy,
IDeleteAction,
IDeleteSelectedAction,
ISortView,
IGroupingView,
ISearchView {
  @Input() professionalProfileId: string;
  certHistory: Observable <Certification[]>;
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
    public thisService: CertificationService
  ) { }
  ngOnInit(): void {
    let userId =localStorage.getItem('userId');
    this.endpoint=`getUserCertification?userId=${this.professionalProfileId}&adminId=${userId}`
    this.searchForm();
    const sb = this.thisService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.thisService.patchState({ entityId: this.professionalProfileId });
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
    let userId =localStorage.getItem('userId');
      this.endpoint=`deleteCertification?certificationId=${id}&adminId=${userId}`
      this.thisService.delete(this.endpoint).subscribe((x:any)=>{
        if(x.hasError===false){
          this.ngOnInit()
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

  edit(id) {
    const modalRef = this.modalService.open(EditCertComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.professionalProfileId = this.professionalProfileId;
    modalRef.result.then(() =>
      this.thisService.fetch(this.endpoint),
      () => {}
    );
  }

  create(): void {
    this.edit(undefined);
  }


}
