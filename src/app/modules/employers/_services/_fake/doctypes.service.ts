import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableFakeService, TableResponseModel, ITableState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { EmployerDocumentType } from '../../_models/';

@Injectable({
  providedIn: 'root'
})
export class EmployerDocumentTypeService extends TableFakeService<EmployerDocumentType> implements OnDestroy {
  API_URL = `${environment.fakeapiUrl}/employerDocTypes`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<EmployerDocumentType>> {
    return this.http.get<EmployerDocumentType[]>(this.API_URL).pipe(
      map((response: EmployerDocumentType[]) => {
        const filteredResult = baseFilter(response.filter(el => el.employerId === tableState.entityId), tableState);
        const result: TableResponseModel<EmployerDocumentType> = {
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

