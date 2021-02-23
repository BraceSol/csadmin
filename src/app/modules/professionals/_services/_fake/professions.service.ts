import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../../_metronic/shared/crud-table';
import { Profession } from '../../_models/profession.model';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService extends TableService<Profession> implements OnDestroy {
  //API_URL = `${environment.fakeapiUrl}/professions`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ




  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
