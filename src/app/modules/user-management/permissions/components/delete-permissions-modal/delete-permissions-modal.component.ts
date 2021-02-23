import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { PermissionService } from '../../../_services/permission.service';

@Component({
  selector: 'app-delete-permissions-modal',
  templateUrl: './delete-permissions-modal.component.html',
  styleUrls: ['./delete-permissions-modal.component.scss']
})
export class DeletePermissionsModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private permissionsService: PermissionService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deletePermissions() {
    this.isLoading = true;
    const sb = this.permissionsService.deleteItems(this.ids).pipe(
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
