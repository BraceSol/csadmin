import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface UserDevice extends BaseModel {
  id: string;
  userId: string;
  title: string;
  description: string;
}