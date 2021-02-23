import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Profession extends BaseModel {
  id: string;
  industryId: string;
  professionName: string;
  description: string;
  adminId: string;
  specialtyIds: string[];
  isDefault: number;
  sortOrder: number;
  createdOn: string;
  createdBy: string;
}