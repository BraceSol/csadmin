import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { DoctypesService } from '../../../_services';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-doctype-modal',
  templateUrl: './delete-doctype-modal.component.html',
  styleUrls: ['./delete-doctype-modal.component.scss']
})
export class DeleteDoctypeModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading = false;
  subscriptions: Subscription[] = [];
  userId;
  private _items$ = new BehaviorSubject([]);

  constructor(private doctypeService: DoctypesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteDoctype() {
    this.userId= localStorage.getItem('userId');
    this.isLoading = true;
    const deletedocType = `deleteDocumentType?adminId=${this.userId}&documentTypeId=${this.id}`;
      this.doctypeService.fetchData(deletedocType).subscribe((res: any)=> {
        console.log(res.message);
        this.isLoading = false;
        if(!res.hasError){
          this.modal.close()
        } else {
        }
      }, error => {
        console.log('server error')
      })




    // const sb = this.doctypeService.delete(this.id).pipe(
    //   delay(1000), // Remove it from your code (just for showing loading)
    //   tap(() => this.modal.close()),
    //   catchError((err) => {
    //     this.modal.dismiss(err);
    //     return of(undefined);
    //   }),
    //   finalize(() => {
    //     this.isLoading = false;
    //   })
    // ).subscribe();
    // this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
