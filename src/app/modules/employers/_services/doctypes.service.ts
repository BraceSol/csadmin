import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { EmployerDocumentType } from '../_models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployerDocumentTypeService extends TableService<EmployerDocumentType> implements OnDestroy {
  API_URL = `${environment.apiUrl}`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}