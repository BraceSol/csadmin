import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface ProfessionalDocs extends BaseModel {
  id: string;
  userId: string;
  uploadId: string;
  documentTypesId: string;
  storePath: string;
  filename: string;
  statusCode: number;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}