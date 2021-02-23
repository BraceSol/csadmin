import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Reference extends BaseModel {
  id: string;
  userId: string;
  referenceName: string;
  referenceEmail: string;
  referencePhone: string;
  referenceTitle: string;
  referenceEmployer: string;
  contactMethod: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  adminId: string;
  reference: any;
  referenceId: string;
}