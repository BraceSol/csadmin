import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { RoleService } from '../../../_services';

@Component({
  selector: 'app-delete-roles-modal',
  templateUrl: './delete-roles-modal.component.html',
  styleUrls: ['./delete-roles-modal.component.scss']
})
export class DeleteRolesModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private rolesService: RoleService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteRoles() {
    this.isLoading = true;
    const sb = this.rolesService.deleteItems(this.ids).pipe(
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
