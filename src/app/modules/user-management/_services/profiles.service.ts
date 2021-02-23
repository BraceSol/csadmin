import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { UserProfile } from '../_models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService extends TableService<UserProfile> {
  API_URL = `${environment.apiUrl}`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
}
