import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface DocumentTypeAttribute extends BaseModel {
  id: string;
  documentTypesId: string;
  attributeName: string;
  title: string;
  description: string;
  attributeType: string;
  helpText: string;
  defaultValue: string;
  maxLength: number;
  fieldOptions: JSON;
  minValue: number;
  maxValue: number;
  multipleSelect: number;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  statusCode: number;
}