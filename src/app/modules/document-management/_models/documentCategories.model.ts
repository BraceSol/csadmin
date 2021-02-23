import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface DocumentCategory extends BaseModel {
  id: string;
  docCategoryId: string,
  industryId: string;
  adminId: string;
  categoryName: string;
  description: string;
  createdOn: string;
  createdBy: string;
  isEnabled: number;
}