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
import { DevicesService } from '../../../_services/device.service';
import { DeleteDeviceModalComponent } from './delete-device-modal/delete-device-modal.component';
import { DeleteDevicesModalComponent } from './delete-devices-modal/delete-devices-modal.component';

@Component({
  selector: 'app-userdevices',
  templateUrl: './devices.component.html',
})
export class DevicesComponent
  implements
    OnInit,
    OnDestroy,
    IDeleteAction,
    IDeleteSelectedAction,
    ISortView,
    IGroupingView,
    ISearchView {
  @Input() curruserId: string;
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
endpoint :string;
searchText: string;
p=1;
itemsPerPage= 10;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public devicesService: DevicesService
  ) {}

  ngOnInit(): void {
    const userId =localStorage.getItem('userId')
    this.endpoint=`getDevicesByUserId?adminId=${userId}&userId=${this.curruserId}`
    this.searchForm();
    const sb = this.devicesService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.devicesService.patchState({ entityId: this.curruserId });
    this.grouping = this.devicesService.grouping;
    this.paginator = this.devicesService.paginator;
    this.sorting = this.devicesService.sorting;
    this.devicesService.fetch(this.endpoint);
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
    this.devicesService.patchState({ searchTerm });
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
    this.devicesService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.devicesService.patchState({ paginator });
  }

  // actions
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteDeviceModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.devicesService.fetch(this.endpoint),
      () => {}
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteDevicesModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.devicesService.fetch(this.endpoint),
      () => {}
    );
  }

}
