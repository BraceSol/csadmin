import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { UserManagementComponent } from './user-management.component';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditRoleModalComponent } from './roles/components/edit-role-modal/edit-role-modal.component';
import { EditPermissionModalComponent } from './permissions/components/edit-permission-modal/edit-permission-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';

import { UserEditComponent } from './users/user-edit/user-edit.component';
import { DevicesComponent } from './users/user-edit/devices/devices.component';
import { DeleteRoleModalComponent } from './roles/components/delete-role-modal/delete-role-modal.component';
import { DeleteRolesModalComponent } from './roles/components/delete-roles-modal/delete-roles-modal.component';
import { DeletePermissionModalComponent } from './permissions/components/delete-permission-modal/delete-permission-modal.component';
import { DeletePermissionsModalComponent } from './permissions/components/delete-permissions-modal/delete-permissions-modal.component';
import { DeleteUserModalComponent } from './users/components/delete-user-modal/delete-user-modal.component';
import { DeleteUsersModalComponent } from './users/components/delete-users-modal/delete-users-modal.component';
import { DeleteDeviceModalComponent } from './users/user-edit/devices/delete-device-modal/delete-device-modal.component';
import { DeleteDevicesModalComponent } from './users/user-edit/devices/delete-devices-modal/delete-devices-modal.component';
import { IndustriesComponent } from './industries/industries.component';
import { EditIndustryComponent } from './industries/edit-industry/edit-industry.component';
import { SystemTablesComponent } from './system-tables/system-tables.component';
import { EditTableComponent } from './system-tables/edit-table/edit-table.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { ProfilesComponent } from './users/user-edit/profiles/profiles.component';
import { ActivityLogComponent } from './users/user-edit/activity-log/activity-log.component'; // <-- import the module

@NgModule({
  declarations: [
    UsersComponent, 
    RolesComponent, 
    PermissionsComponent, 
    UserEditComponent, 
    DevicesComponent, 
    UserManagementComponent, 
    EditRoleModalComponent, 
    DeleteRoleModalComponent, 
    DeleteRolesModalComponent,
    EditPermissionModalComponent,
    DeletePermissionModalComponent,
    DeletePermissionsModalComponent,
    DeleteUserModalComponent,
    DeleteUsersModalComponent,
    DeleteDeviceModalComponent,
    DeleteDevicesModalComponent, IndustriesComponent, EditIndustryComponent, SystemTablesComponent, EditTableComponent, CreateUserComponent, ProfilesComponent, ActivityLogComponent
  ],
  imports: [
    CommonModule, 
    HttpClientModule,
    UserManagementRoutingModule, 
    FormsModule,
    ReactiveFormsModule, 
    InlineSVGModule,
    CRUDTableModule,
    NgbDatepickerModule, 
    NgbModalModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgxPaginationModule
  ],
  entryComponents: [
    DeleteUsersModalComponent, 
    DeleteUserModalComponent, 
    DeletePermissionsModalComponent, 
    DeletePermissionModalComponent, 
    DeleteRolesModalComponent, 
    DeleteRoleModalComponent, 
    EditRoleModalComponent, 
    EditPermissionModalComponent, 
    DeleteDeviceModalComponent, 
    DeleteDevicesModalComponent
  ]
})
export class UserManagementModule {}
