import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  IDeleteAction,
  ISearchView,
} from '../../../../../_metronic/shared/crud-table';
import { ProfilesService } from '../../../_services/profiles.service';
//import { DeleteDeviceModalComponent } from './delete-device-modal/delete-device-modal.component';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html'
})
export class ProfilesComponent
  implements
    OnInit,
    OnDestroy,
    IDeleteAction,
    ISearchView {
  @Input() curruserId: string;
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
    public entityService: ProfilesService
  ) {}

  ngOnInit(): void {
    const userId =localStorage.getItem('userId')
    this.endpoint=`profiles?userId=${this.curruserId}&=adminId${userId}`
    this.searchForm();
    const sb = this.entityService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.entityService.patchState({ entityId: this.curruserId });
    this.entityService.fetch(this.endpoint);
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
    this.entityService.patchState({ searchTerm });
  }

  // actions
  delete(id: any) {
    // const modalRef = this.modalService.open(DeleteDeviceModalComponent);
    // modalRef.componentInstance.id = id;
    // modalRef.result.then(
    //   () => this.entityService.fetch(this.endpoint),
    //   () => {}
    // );
  }

}
