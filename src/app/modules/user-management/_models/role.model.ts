import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface UserRole extends BaseModel {
  id: string;
  profileTypeId: string;
  role: any;
  profileTypeIdName: string;
  roleName: string;
  description: string;
  createdOn: string;
  createdBy: string;
  adminId:string;
  isEnabled: boolean;
}