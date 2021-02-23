import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../../_metronic/shared/crud-table';
import { DocumentType } from '../../_models/documentTypes.model';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctypesService extends TableService<DocumentType> implements OnDestroy {
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // // READ
  // find(tableState: ITableState): Observable<TableResponseModel<DocumentType>> {
  //   return this.http.get<DocumentType[]>(this.API_URL).pipe(
  //     map((response: DocumentType[]) => {
  //       const filteredResult = baseFilter(response, tableState);
  //       const result: TableResponseModel<DocumentType> = {
  //         items: filteredResult.items,
  //         total: filteredResult.total
  //       };
  //       return result;
  //     })
  //   );
  // }

  // deleteItems(ids: string[] = []): Observable<any> {
  //   const tasks$ = [];
  //   ids.forEach(id => {
  //     tasks$.push(this.delete(id));
  //   });
  //   return forkJoin(tasks$);
  // }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
