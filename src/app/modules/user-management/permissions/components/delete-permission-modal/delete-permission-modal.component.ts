import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { PermissionService } from '../../../_services/permission.service';

@Component({
  selector: 'app-delete-permission-modal',
  templateUrl: './delete-permission-modal.component.html',
  styleUrls: ['./delete-permission-modal.component.scss']
})
export class DeletePermissionModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  endpoint:string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private permissionService: PermissionService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deletePermission() {
    const userId =localStorage.getItem('userId')
    this.endpoint=`deletePermission?adminId=${userId}&permissionId=${this.id}`
    this.isLoading = true;
    const sb = this.permissionService.delete(this.endpoint).pipe(
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
