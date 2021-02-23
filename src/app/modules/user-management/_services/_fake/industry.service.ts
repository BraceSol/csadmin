import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../../_metronic/shared/crud-table';
import { Industry } from '../../_models/industry.model';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndustryService extends TableService<Industry> implements OnDestroy {
  API_URL = `${environment.apiUrl}`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Industry>> {
    return this.http.get<Industry[]>(this.API_URL).pipe(
      map((response: Industry[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Industry> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  deleteItems(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    ids.forEach(id => {
      tasks$.push(this.delete(id));
    });
    return forkJoin(tasks$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
