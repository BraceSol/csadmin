import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { DocumentTypeAttribute } from '../../_models/documentTypeAttributes.model';

@Injectable({
  providedIn: 'root'
})
export class DoctypeAttributesService extends TableService<DocumentTypeAttribute> implements OnDestroy {
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  // find(tableState: ITableState): Observable<TableResponseModel<DocumentTypeAttribute>> {
  //   return this.http.get<DocumentTypeAttribute[]>(this.API_URL).pipe(
  //     map((response: DocumentTypeAttribute[]) => {
  //       const filteredResult = baseFilter(response.filter(el => el.documentTypesId === tableState.entityId), tableState);
  //       const result: TableResponseModel<DocumentTypeAttribute> = {
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

