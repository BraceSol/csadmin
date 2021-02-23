import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Professional extends BaseModel {
  id: string;
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email:string;
  professionId: string;
  specialtyId: string;
  city: string;
  state: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}