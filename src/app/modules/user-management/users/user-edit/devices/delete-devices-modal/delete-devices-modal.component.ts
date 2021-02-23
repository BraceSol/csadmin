import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { DevicesService } from '../../../../_services';

@Component({
  selector: 'app-delete-devices-modal',
  templateUrl: './delete-devices-modal.component.html',
  styleUrls: ['./delete-devices-modal.component.scss']
})
export class DeleteDevicesModalComponent implements OnInit, OnDestroy {
  @Input() ids: string[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private devicesService: DevicesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteDevices() {
    this.isLoading = true;
    const sb = this.devicesService.deleteItems(this.ids).pipe(
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
