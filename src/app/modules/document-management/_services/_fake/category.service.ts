import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableFakeService, TableResponseModel, ITableState, BaseModel, TableService } from '../../../../_metronic/shared/crud-table';
import { DocumentCategory } from '../../_models/documentCategories.model';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends TableService<DocumentCategory> implements OnDestroy {
  // API_URL = `${environment.fakeapiUrl}/documentCategories`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }



  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
