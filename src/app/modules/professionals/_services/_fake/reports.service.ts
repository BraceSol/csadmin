import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableFakeService, TableResponseModel, ITableState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { ProfessionalReports } from '../../_models/reports.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalReportsService extends TableFakeService<ProfessionalReports> implements OnDestroy {
  API_URL = `${environment.fakeapiUrl}/professionalReports`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<ProfessionalReports>> {
    return this.http.get<ProfessionalReports[]>(this.API_URL).pipe(
      map((response: ProfessionalReports[]) => {
        const filteredResult = baseFilter(response.filter(el => el.userId === tableState.entityId), tableState);
        const result: TableResponseModel<ProfessionalReports> = {
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

