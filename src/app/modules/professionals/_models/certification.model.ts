import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Certification extends BaseModel {
  id: string;
  userId: string;
  certificationName: string;
  issuingBody: string;
  issueDate: string;
  expirationDate: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
  certification: any;
  adminId: string;
  licenseId: string;
}