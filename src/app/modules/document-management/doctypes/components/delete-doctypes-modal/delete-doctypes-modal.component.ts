import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { DoctypesService } from '../../../_services';

@Component({
  selector: 'app-delete-doctypes-modal',
  templateUrl: './delete-doctypes-modal.component.html',
  styleUrls: ['./delete-doctypes-modal.component.scss']
})
export class DeleteDoctypesModalComponent implements OnInit, OnDestroy {
  @Input() ids: string[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private doctypesService: DoctypesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteDoctypes() {
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
