import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { SpecialtiesService } from '../../../_services';

@Component({
  selector: 'app-delete-specialties-modal',
  templateUrl: './delete-specialties-modal.component.html'
})
export class DeleteSpecialtiesModalComponent implements OnInit, OnDestroy {
  @Input() ids: string[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private specialtyService: SpecialtiesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteSpecialties() {
    this.isLoading = true;

    const sb = this.specialtyService.deleteItems(this.ids).pipe(
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
