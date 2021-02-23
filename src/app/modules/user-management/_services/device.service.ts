import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { UserDevice } from '../_models/user-device.model';

@Injectable({
  providedIn: 'root'
})
export class DevicesService extends TableService<UserDevice> {
  API_URL = `${environment.apiUrl}`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
}
