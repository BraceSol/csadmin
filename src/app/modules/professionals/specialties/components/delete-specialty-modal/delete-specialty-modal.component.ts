import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { SpecialtiesService } from '../../../_services';

@Component({
  selector: 'app-delete-specialty-modal',
  templateUrl: './delete-specialty-modal.component.html'
})
export class DeleteSpecialtyModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private specialtyService: SpecialtiesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteSpecialty() {
    this.isLoading = true;
    const userId= localStorage.getItem('userId');;
    const deleteSpecialty = `deleteSpecialty?adminId=${userId}&specialtyId=${this.id}`
    const sb = this.specialtyService.delete(deleteSpecialty).pipe(
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
