import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { ProfessionService } from '../../../_services';

@Component({
  selector: 'app-delete-profession-modal',
  templateUrl: './delete-profession-modal.component.html'
})
export class DeleteProfessionModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading = false;
  subscriptions: Subscription[] = [];
  userId
  constructor(private professionService: ProfessionService, public modal: NgbActiveModal) {
    this.userId = localStorage.getItem('userId');
   }

  ngOnInit(): void {
  }

  deleteProfession() {
     ;
    console.log(this.id);
    const deleteProfessionEndPoint = `deleteProfession?adminId=${this.userId}&professionId=${this.id}`;
    this.isLoading = true;
    const sb = this.professionService.delete(deleteProfessionEndPoint).pipe(
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
