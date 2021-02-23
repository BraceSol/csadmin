import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableFakeService, TableResponseModel, ITableState, BaseModel } from '../../../../_metronic/shared/crud-table';
import { Employer } from '../../_models/employer.model';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployersService extends TableFakeService<Employer> implements OnDestroy {
  API_URL = `${environment.fakeapiUrl}/employers`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Employer>> {
    return this.http.get<Employer[]>(this.API_URL).pipe(
      map((response: Employer[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Employer> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  deleteItems(ids: string[] = []): Observable<any> {
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
