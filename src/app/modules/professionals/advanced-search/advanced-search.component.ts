import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { QueryBuilderConfig, QueryBuilderClassNames } from 'angular2-query-builder';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html'
})
export class AdvancedSearchComponent implements OnInit {

  query = {
    condition: 'and',
    rules: [
      {field: 'firstName', operator: '=', value: ''},
      // {field: 'gender', operator: '>=', value: 'm'}
    ]
  };
  
  config: QueryBuilderConfig = {
    fields: {
      firstName: {name: 'First Name', type: 'string'},
      lastName: {name: 'Last Name', type: 'string'},
      professionId: {
        name: 'Profession',
        type: 'category',
        options: [
          {name: 'RN', value: 'rn'},
          {name: 'LVN', value: 'lvn'}
        ]
      }, 
      specialtyId: {
        name: 'Specialty',
        type: 'category',
        options: [
          {name: 'Specialty1', value: 'rn'},
          {name: 'Specialty2', value: 'lvn'}
        ]
      }
    }
  }

  classNames: QueryBuilderClassNames = {
    removeIcon: 'fa fa-minus',
    addIcon: 'fa fa-plus',
    arrowIcon: 'fa fa-chevron-right px-2',
    button: 'btn',
    buttonGroup: 'btn-group',
    rightAlign: 'order-12 ml-auto',
    switchRow: 'd-flex px-2',
    switchGroup: 'd-flex align-items-center',
    switchRadio: 'custom-control-input',
    switchLabel: 'custom-control-label',
    switchControl: 'custom-control custom-radio custom-control-inline',
    row: 'row p-2 m-1',
    rule: 'border',
    ruleSet: 'border',
    invalidRuleSet: 'alert alert-danger',
    emptyWarning: 'text-danger mx-auto',
    operatorControl: 'form-control',
    operatorControlSize: 'col-auto pr-0',
    fieldControl: 'form-control',
    fieldControlSize: 'col-auto pr-0',
    entityControl: 'form-control',
    entityControlSize: 'col-auto pr-0',
    inputControl: 'form-control',
    inputControlSize: 'col-auto'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
