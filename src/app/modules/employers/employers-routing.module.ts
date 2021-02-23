import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 

import { EmployersComponent } from './employers.component';
import { EmployersSearchComponent } from './search/search.component';
import { EmployerProfileEditComponent } from './profile-edit/profile-edit.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
// import { ProfessionalsImportComponent } from './import/import.component';
import { AddEmployerComponent } from './add-employer/add-employer.component';
import { EmployerListingComponent } from './listing/listing.component';

const routes: Routes = [
  {
    path: '',
    component: EmployersComponent,
    children: [
      {
        path: 'listing',
        component: EmployerListingComponent,
      },
      {
        path: 'listing/:view',
        component: EmployerListingComponent
      },
      {
        path: 'search',
        component: EmployersSearchComponent,
      },
      {
        path: 'advanced-search',
        component: AdvancedSearchComponent,
      },
      // {
      //   path: 'import', 
      //   component: ProfessionalsImportComponent,
      // }, 
      {
        path: 'create', 
        component: AddEmployerComponent, 
      }, 
      {
        path: 'profile', 
        component: AddEmployerComponent, 
      }, 
      {
        path: 'profile/:id',
        component: EmployerProfileEditComponent,
      },
      { path: '', redirectTo: 'search', pathMatch: 'full' },
      { path: '**', redirectTo: 'search', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployersRoutingModule {}
