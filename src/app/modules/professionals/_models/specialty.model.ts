import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Specialty extends BaseModel {
  id: string;
  industryId: string;
  adminId: string;
  specialtyName: string;
  professionIds: string[];
  description: string;
  isDefault: boolean;
  createdOn: string;
  createdBy: string;
}