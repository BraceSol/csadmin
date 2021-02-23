import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { DoctypeAttributesService } from '../../../../_services';

@Component({
  selector: 'app-attribute-device-modal',
  templateUrl: './delete-attribute-modal.component.html'
})
export class DeleteAttributeModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private doctypeService: DoctypeAttributesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteAttribute() {
    this.isLoading = true;
    const userId = localStorage.getItem('userId');

    const deleteAttributes = `deleteDocumentTypeAttribute?adminId=${userId}&documentTypeAttributeId=${this.id}`;
    const sb = this.doctypeService.delete(deleteAttributes).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
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
