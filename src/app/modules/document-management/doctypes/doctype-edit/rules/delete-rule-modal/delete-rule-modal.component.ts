import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { DoctypeRulesService } from '../../../../_services';

@Component({
  selector: 'app-rule-modal',
  templateUrl: './delete-rule-modal.component.html',
  styleUrls: ['./delete-rule-modal.component.scss']
})
export class DeleteRuleModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private doctypeService: DoctypeRulesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteRule() {
    this.isLoading = true;
    const userId = localStorage.getItem('userId');
    const deleteRules = `deleteDocumentTypeRule?adminId=${userId}&documentTypeRuleId=${this.id}`;

    const sb = this.doctypeService.delete(deleteRules).pipe(
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
