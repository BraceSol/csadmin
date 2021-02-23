import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface UserProfile extends BaseModel {
  id: string;
  userId: string;
  profileTypeId: string;
  isActive: number;
}