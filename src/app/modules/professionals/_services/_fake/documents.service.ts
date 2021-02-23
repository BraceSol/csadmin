import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { ProfessionalDocs } from '../../_models/documents.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalDocsService extends TableService<ProfessionalDocs> implements OnDestroy {
  API_URL = `${environment.apiUrl}`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<ProfessionalDocs>> {
    return this.http.get<ProfessionalDocs[]>(this.API_URL).pipe(
      map((response: ProfessionalDocs[]) => {
        const filteredResult = baseFilter(response.filter(el => el.userId === tableState.entityId), tableState);
        const result: TableResponseModel<ProfessionalDocs> = {
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

