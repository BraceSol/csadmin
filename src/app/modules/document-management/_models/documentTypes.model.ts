import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface DocumentType extends BaseModel {
  id: string;
  docCategoryId: string;
  employerId: string;
  documentName: string;
  description: string;
  requirementLevel: number;
  prefix: string;
  exampleDocuments: JSON; 
  references: JSON;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  statusCode: number;
}