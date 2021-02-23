import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CsUserService } from '../../../_services';

@Component({
  selector: 'app-delete-users-modal',
  templateUrl: './delete-users-modal.component.html',
  styleUrls: ['./delete-users-modal.component.scss']
})
export class DeleteUsersModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private usersService: CsUserService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteUsers() {
    this.isLoading = true;
    const sb = this.usersService.deleteItems(this.ids).pipe(
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
