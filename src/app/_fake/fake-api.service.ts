import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { UsersTable } from './fake-db/users.table';
import { CsUsersTable } from './fake-db/csusers.table';
import { CarsTable } from './fake-db/cars.table';
import { RolesTable } from './fake-db/roles.table';
import { PermissionsTable } from './fake-db/permissions.table';
import { DocumentTypesTable } from './fake-db/document-types.table';
import { ProfessionsTable } from './fake-db/professionals.table';
import { EmployersTable } from './fake-db/employers.table';
// ECommerce
import { ECommerceDataContext } from '../modules/e-commerce/_fake/fake-server/_e-commerce.data-context';
import { ProfessionalsSearchComponent } from '../modules/professionals/search/professionals-search.component';

@Injectable({
  providedIn: 'root',
})
export class FakeAPIService implements InMemoryDbService {
  constructor() { }

  /**
   * Create Fake DB and API
   */
  createDb(): {} | Observable<{}> {
    // tslint:disable-next-line:class-name
    const db = {
      // auth module
      users: UsersTable.users,
      csusers: CsUsersTable.users,
      
      //admin
      roles: RolesTable.roles,
      permissions: PermissionsTable.permissions,
      userDevices: CsUsersTable.devices, 

      //professionals
      professionals: ProfessionsTable.professionals, 
      professions: ProfessionsTable.professions,
      specialties: ProfessionsTable.specialties,
      professionalDocs: ProfessionsTable.documents,
      professionalReports: ProfessionsTable.reports,

      //employers
      employers: EmployersTable.employers,
      employerLocations: EmployersTable.locations,
      employerDepartments: EmployersTable.departments,
      employerContracts: EmployersTable.contracts,
      employerJobs: EmployersTable.jobs,
      employerDocTypes: EmployersTable.doctypes,
      employerDocRules: EmployersTable.docrules,
      employerAudits: EmployersTable.audits,
      employerUsers: EmployersTable.users,

      //document management
      documentCategories: DocumentTypesTable.categories,
      docTypes: DocumentTypesTable.documentTypes, 
      docTypesAttributes: DocumentTypesTable.attributes,
      docTypesRules: DocumentTypesTable.rules, 

      // data-table
      cars: CarsTable.cars,

      customers: ECommerceDataContext.customers,
      // products
      products: ECommerceDataContext.cars,
      productRemarks: ECommerceDataContext.remarks,
      productSpecs: ECommerceDataContext.carSpecs,

    };
    return db;
  }
}
