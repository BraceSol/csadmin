import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { ActivityLog } from '../_models/activity-log.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService extends TableService<ActivityLog> {
  API_URL = `${environment.apiUrl}`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
}
