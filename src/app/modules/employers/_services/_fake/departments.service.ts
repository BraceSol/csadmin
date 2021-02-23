import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableFakeService, TableResponseModel, ITableState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { EmployerDepartment } from '../../_models/';

@Injectable({
  providedIn: 'root'
})
export class EmployerDepartmentService extends TableFakeService<EmployerDepartment> implements OnDestroy {
  API_URL = `${environment.fakeapiUrl}/employerDepartments`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<EmployerDepartment>> {
    return this.http.get<EmployerDepartment[]>(this.API_URL).pipe(
      map((response: EmployerDepartment[]) => {
        const filteredResult = baseFilter(response.filter(el => el.employerId === tableState.entityId), tableState);
        const result: TableResponseModel<EmployerDepartment> = {
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

