import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface License extends BaseModel {
  id: string;
  licenseState: string;
  licenseCode: string;
  issueDate: string;
  expirationDate: string;
  verifiedOn: string;
  verifiedBy: string;
  verificationMessage: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  userId: string;
  updatedAt: string;
  updatedBy: string;
  license: any;
  adminId: string;
  licenseId: string;
}