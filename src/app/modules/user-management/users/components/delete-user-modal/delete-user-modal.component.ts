import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CsUserService } from '../../../_services';

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.scss']
})
export class DeleteUserModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading = false;
  endpoint:string;
  subscriptions: Subscription[] = [];

  constructor(private userService: CsUserService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteUser() {
    const userId =localStorage.getItem('userId')
    this.endpoint=`removeAdmin?adminId=${userId}&userId=${this.id}`
    this.isLoading = true;
    const sb = this.userService.delete(this.endpoint).pipe(
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
