import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { DocumentTypeRule } from '../../_models/documentTypeRules.model';

@Injectable({
  providedIn: 'root'
})
export class DoctypeRulesService extends TableService<DocumentTypeRule> implements OnDestroy {

  constructor(@Inject(HttpClient) http) {
    super(http);
  }



  ngOnDestroy() {

  }
}

