import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Permission extends BaseModel {
  id: string;
  adminId:string;
category:string;
permissionName:string;
permissionCode:string;
  permission: any;
  description: string;
}