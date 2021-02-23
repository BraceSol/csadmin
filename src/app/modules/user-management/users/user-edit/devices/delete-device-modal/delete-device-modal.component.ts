import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { DevicesService } from '../../../../_services/device.service';

@Component({
  selector: 'app-delete-device-modal',
  templateUrl: './delete-device-modal.component.html',
  styleUrls: ['./delete-device-modal.component.scss']
})
export class DeleteDeviceModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading = false;
  endpoint:string;
  subscriptions: Subscription[] = [];

  constructor(private devicesService: DevicesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteDevice() {
    const userId =localStorage.getItem('userId')
    this.endpoint=`removeDevice?adminId=${userId}&deviceId=${this.id}`
    this.isLoading = true;
    const sb = this.devicesService.delete(this.endpoint).pipe(
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
