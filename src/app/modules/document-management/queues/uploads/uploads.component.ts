import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Queue } from '../../_models/queue.model';
import { ActivatedRoute, Router } from '@angular/router';
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
import { UploadService } from '../../_services/uploads.service';
import { QueueService } from '../../_services/queues.service';
// import { DeleteRuleModalComponent } from './delete-rule-modal/delete-rule-modal.component';
// import { DeleteRulesModalComponent } from './delete-rules-modal/delete-rules-modal.component';
import { ProcessUploadComponent } from './process-upload/process-upload.component';

const EMPTY_REC: Queue = {
  id: undefined,
  isSystem: false,
  title: '',
  description: '',
  queueType: 1,
  stats: null,
  ownerId: '',
  statusCode: 1,
  createdBy: '',
  updatedBy: '',
  assignedTo: '',
  isActive: 1,
  createdAt: '',
  updatedAt: '',
  employerId: '',
  queueId: '',
  queue: null,
  adminId:''
};

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html'
})
export class UploadsComponent
  implements
    OnInit,
    OnDestroy,
    IDeleteAction,
    IDeleteSelectedAction,
    ISortView,
    IGroupingView,
    ISearchView {

  id: string;
  queueProfile: any;
  paginator: PaginatorState;
  sorting: SortState;
  endpoint:any;
  p = 1;
  itemsPerPage= 50;
  searchTerm:string
  isLoading: boolean;
  grouping: GroupingState;
  isLoading$: Observable<boolean>;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,

    private router: Router,
    private route: ActivatedRoute,
    public thisService: UploadService, 
    public queueService: QueueService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.thisService.isLoading$;
    this.loadQueue();
    console.log(this.queueProfile);

    let userId =localStorage.getItem('userId');
    this.endpoint=`uploads?adminId=${userId}&queueId=${this.id}`
    this.searchForm();
    const sb = this.thisService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    //this.thisService.patchState({ entityId: this.employerId });
    this.grouping = this.thisService.grouping;
    this.paginator = this.thisService.paginator;
    this.sorting = this.thisService.sorting;
    this.thisService.fetch(this.endpoint);
  }

  loadQueue() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = params.get('id');
        if (this.id || this.id != '') {
          let userId =localStorage.getItem('userId');
          this.endpoint=`getQueueById?adminId=${userId}&queueId=${this.id}`
          return this.queueService.getItemById(this.endpoint);
        }
        return of(EMPTY_REC);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: any) => {
      this.queueProfile = res.queue;
    });
    this.subscriptions.push(sb);
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
    this.endpoint=`deleteQueue?adminId=${userId}&queueId=${id}`//&employerId=${this.employerId}
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
    const modalRef = this.modalService.open(ProcessUploadComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.thisService.fetch(this.endpoint),
      () => {}
    );
  }

  create(): void {
    this.edit(undefined);
  }

}

