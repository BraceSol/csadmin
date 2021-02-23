import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagementComponent } from './user-management.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RolesComponent } from './roles/roles.component';
import { IndustriesComponent } from './industries/industries.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { SystemTablesComponent } from './system-tables/system-tables.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/create', 
        component: CreateUserComponent,
      },
      {
        path: 'user/edit',
        component: UserEditComponent
      },
      {
        path: 'user/edit/:id',
        component: UserEditComponent
      },
      {
        path: 'industries',
        component: IndustriesComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'permissions',
        component: PermissionsComponent,
      },
      {
        path: 'system/tables',
        component: SystemTablesComponent,
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: '**', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
