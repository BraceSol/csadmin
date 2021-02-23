import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { DoctypeRulesService } from '../../../../_services';

@Component({
  selector: 'app-delete-rules-modal',
  templateUrl: './delete-rules-modal.component.html',
  styleUrls: ['./delete-rules-modal.component.scss']
})
export class DeleteRulesModalComponent implements OnInit, OnDestroy {
  @Input() ids: string[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private doctypesService: DoctypeRulesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteRules() {
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
