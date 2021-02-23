import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 

import { ProfessionalsComponent } from './professionals.component';
import { ProfessionalsSearchComponent } from './search/professionals-search.component';
import { ProfessionalsProfileComponent } from './profile-edit/professionals-profile.component';
import { ProfessionsComponent } from './professions/professions.component';
import { SpecialtiesComponent } from './specialties/specialties.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { ProfessionalsImportComponent } from './import/import.component';
import { AddProfessionalComponent } from './add-professional/add-professional.component';
import { ProfessionalsListingComponent } from './listing/listing.component';

const routes: Routes = [
  {
    path: '',
    component: ProfessionalsComponent,
    children: [
      {
        path: 'listing',
        component: ProfessionalsListingComponent,
      },
      {
        path: 'listing/:view',
        component: ProfessionalsListingComponent
      },
      {
        path: 'search',
        component: ProfessionalsSearchComponent,
      },
      {
        path: 'advanced-search',
        component: AdvancedSearchComponent,
      },
      {
        path: 'professions', 
        component: ProfessionsComponent, 
      }, 
      {
        path: 'specialties', 
        component: SpecialtiesComponent, 
      }, 
      {
        path: 'import', 
        component: ProfessionalsImportComponent,
      }, 
      {
        path: 'create', 
        component: AddProfessionalComponent, 
      }, 
      {
        path: 'profile', 
        component: AddProfessionalComponent, 
      }, 
      {
        path: 'profile/:id',
        component: ProfessionalsProfileComponent,
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
export class ProfessionalsRoutingModule {}
