import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface EmployerDocRule extends BaseModel {
  id: string;
  employerDocTypesId: string;
  professionId: string;
  specialtyId: string;
  departmentId: string;
  locationId: string;
  title: string;
  description: string;
  ruleQuery: string;
  ruleConfig: JSON;
  createdBy: string;
  updatedBy: string;
  statusCode: number;
  isActive: number;
  isSystem: number;
}