import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { DoctypeAttributesService } from '../../../../_services';

@Component({
  selector: 'app-delete-attributes-modal',
  templateUrl: './delete-attributes-modal.component.html'
})
export class DeleteAttributesModalComponent implements OnInit, OnDestroy {
  @Input() ids: string[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private doctypesService: DoctypeAttributesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteAttributes() {
    this.isLoading = true;
    const sb = this.doctypesService.deleteItems(this.ids).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
