import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableFakeService, TableResponseModel, ITableState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { EmployerJob } from '../../_models/';

@Injectable({
  providedIn: 'root'
})
export class EmployerJobsService extends TableFakeService<EmployerJob> implements OnDestroy {
  API_URL = `${environment.fakeapiUrl}/employerJobs`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<EmployerJob>> {
    return this.http.get<EmployerJob[]>(this.API_URL).pipe(
      map((response: EmployerJob[]) => {
        const filteredResult = baseFilter(response.filter(el => el.employerId === tableState.entityId), tableState);
        const result: TableResponseModel<EmployerJob> = {
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

