import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { RoleService } from '../../../_services/role.service';

@Component({
  selector: 'app-delete-role-modal',
  templateUrl: './delete-role-modal.component.html',
  styleUrls: ['./delete-role-modal.component.scss']
})
export class DeleteRoleModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  endpoint:string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private rolesService: RoleService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteRole() {
    const userId =localStorage.getItem('userId')
    this.isLoading = true;
    this.endpoint=`removeRole?roleId=${this.id}&adminId=${userId}`
    const sb = this.rolesService.delete(this.endpoint).pipe(
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
