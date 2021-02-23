import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface DocumentTypeRule extends BaseModel {
  id: string;
  title: string;
  description: string;
  ruleQuery: string;
  ruleConfig: JSON;
  createdBy: string;
  updatedBy: string;
  isActive: number;
  statusCode: number;
  createdAt: string;
  updatedAt: string;
  documentTypeId: string;
  professionId: string;
  specialtyId: string;
  documentTypeRule: JSON;
  documentTypeRuleId: string;
  adminId: string;
}