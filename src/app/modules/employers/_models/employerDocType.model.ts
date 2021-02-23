import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface EmployerDocumentType extends BaseModel {
  id: string;
  documentTypesId: string;
  employerId: string;
  documentName: string;
  description: string;
  requirementLevel: number;
  exampleDocuments: JSON; 
  references: JSON;
  createdBy: string;
  updatedBy: string;
  statusCode: number;
  isActive: number;
}